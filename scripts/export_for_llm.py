#!/usr/bin/env python3
"""
export_for_llm.py — Export Ontology for LLM Consumption
=========================================================
Converts merged_ontology.json into formats optimized for LLM usage:
  1. Compressed system prompt (< 8K tokens)
  2. Function-calling tool definitions
  3. RAG-ready chunked documents

Usage:
    python scripts/export_for_llm.py private_enterprise/deloitte-china-consulting/output/merged_ontology.json
    python scripts/export_for_llm.py merged.json -o output/
"""

import json
import sys
import io
import argparse
from pathlib import Path
from datetime import datetime

if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')


def load_merged(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


# ── 1. Compressed System Prompt ──────────────────────────────────────────────

def generate_system_prompt(data):
    """Generate a concise system prompt describing the ontology (< 8K tokens)."""
    meta = data.get("metadata", {})
    classes = data.get("classes", [])
    relations = data.get("relations", [])
    attributes = data.get("attributes", [])
    instances = data.get("sample_instances", [])
    axioms = data.get("axioms", [])

    # Build class hierarchy
    by_parent = {}
    for c in classes:
        p = c.get("parent") or "__root__"
        by_parent.setdefault(p, []).append(c)

    abstract_ids = {c["id"] for c in classes if c.get("abstract")}

    lines = []
    lines.append(f"# {meta.get('name', 'Enterprise Ontology')}")
    lines.append(f"Generated: {meta.get('generated_at', 'N/A')}")
    lines.append(f"Layers: {', '.join(meta.get('layers_merged', []))}")
    lines.append(f"Stats: {len(classes)} classes, {len(relations)} relations, {len(attributes)} attributes, {len(instances)} instances")
    lines.append("")

    # Domain roots
    lines.append("## Class Hierarchy")
    lines.append("")

    def render_tree(parent_id, indent=0):
        children = by_parent.get(parent_id, [])
        for c in sorted(children, key=lambda x: x["id"]):
            prefix = "  " * indent
            abstract_mark = " (abstract)" if c.get("abstract") else ""
            alias_mark = f" [= {c['alias_of']}]" if c.get("alias_of") else ""
            zh = c.get("label_zh", "")
            lines.append(f"{prefix}- **{c['id']}** {zh}{abstract_mark}{alias_mark}")
            render_tree(c["id"], indent + 1)

    for root_id in ["__root__", None]:
        render_tree(root_id)

    # Relations (compact table)
    lines.append("")
    lines.append("## Relations")
    lines.append("")
    lines.append("| Relation | Domain | Range | Description |")
    lines.append("|:--|:--|:--|:--|")
    for r in relations:
        desc = (r.get("definition_en") or r.get("definition", ""))[:60]
        lines.append(f"| {r['id']} | {r.get('domain','')} | {r.get('range','')} | {desc} |")

    # Attributes (compact)
    if attributes:
        lines.append("")
        lines.append("## Attributes")
        lines.append("")
        lines.append("| Attribute | Owner | Type | Required |")
        lines.append("|:--|:--|:--|:--|")
        for a in attributes:
            req = "Yes" if a.get("required") else ""
            lines.append(f"| {a['id']} | {a.get('owner_class','')} | {a.get('datatype','')} | {req} |")

    # Key axioms
    if axioms:
        lines.append("")
        lines.append("## Semantic Constraints")
        lines.append("")
        for ax in axioms[:10]:
            desc = ax.get("definition_en") or ax.get("label_en", "")
            lines.append(f"- **{ax['id']}**: {desc}")

    return "\n".join(lines)


# ── 2. Function-Calling Tool Definitions ─────────────────────────────────────

def generate_tool_definitions(data):
    """Generate OpenAI-compatible function-calling tool definitions."""
    classes = data.get("classes", [])
    relations = data.get("relations", [])
    class_ids = sorted(c["id"] for c in classes)
    rel_ids = sorted(r["id"] for r in relations)

    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_class",
                "description": "Get detailed information about an ontology class, including its parent, children, attributes, and relations.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "class_id": {
                            "type": "string",
                            "description": f"The class ID. Available: {', '.join(class_ids[:30])}{'...' if len(class_ids)>30 else ''}",
                        }
                    },
                    "required": ["class_id"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "find_path",
                "description": "Find the shortest relationship path between two classes in the ontology.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "from_class": {"type": "string", "description": "Source class ID"},
                        "to_class": {"type": "string", "description": "Target class ID"},
                        "max_hops": {"type": "integer", "description": "Maximum path length (default: 4)", "default": 4}
                    },
                    "required": ["from_class", "to_class"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "list_instances",
                "description": "List all instances of a given class, including instances of its subclasses.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "class_id": {"type": "string", "description": "The class ID to query instances for"}
                    },
                    "required": ["class_id"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "query_relations",
                "description": "Get all outgoing or incoming relations for a class.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "class_id": {"type": "string", "description": "The class ID"},
                        "direction": {"type": "string", "enum": ["outgoing", "incoming", "both"], "default": "both"}
                    },
                    "required": ["class_id"]
                }
            }
        },
    ]
    return tools


# ── 3. RAG-Ready Chunks ─────────────────────────────────────────────────────

def generate_rag_chunks(data):
    """Generate chunked documents optimized for RAG vector embedding."""
    classes = data.get("classes", [])
    relations = data.get("relations", [])
    instances = data.get("sample_instances", [])
    attributes = data.get("attributes", [])

    # Build lookup maps
    by_parent = {}
    for c in classes:
        p = c.get("parent") or "__root__"
        by_parent.setdefault(p, []).append(c["id"])

    rel_by_domain = {}
    rel_by_range = {}
    for r in relations:
        rel_by_domain.setdefault(r.get("domain", ""), []).append(r)
        rel_by_range.setdefault(r.get("range", ""), []).append(r)

    inst_by_type = {}
    for i in instances:
        inst_by_type.setdefault(i.get("type", ""), []).append(i)

    attr_by_owner = {}
    for a in attributes:
        attr_by_owner.setdefault(a.get("owner_class", ""), []).append(a)

    chunks = []
    for c in classes:
        cid = c["id"]
        children = by_parent.get(cid, [])
        out_rels = rel_by_domain.get(cid, [])
        in_rels = rel_by_range.get(cid, [])
        insts = inst_by_type.get(cid, [])
        attrs = attr_by_owner.get(cid, [])

        text_parts = [
            f"Class: {cid}",
            f"Chinese: {c.get('label_zh', '')}",
            f"English: {c.get('label_en', cid)}",
            f"Layer: {c.get('source_layer', '')}",
            f"Parent: {c.get('parent', 'none')}",
        ]

        if c.get("alias_of"):
            text_parts.append(f"Alias of: {c['alias_of']} (equivalent class)")

        if c.get("definition_en"):
            text_parts.append(f"Definition: {c['definition_en']}")
        if c.get("definition"):
            text_parts.append(f"Definition (ZH): {c['definition']}")

        if children:
            text_parts.append(f"Children: {', '.join(children)}")
        if out_rels:
            rels_str = '; '.join(r['id'] + ' -> ' + r.get('range', '') for r in out_rels)
            text_parts.append(f"Outgoing relations: {rels_str}")
        if in_rels:
            rels_str = '; '.join(r.get('domain', '') + ' -> ' + r['id'] for r in in_rels)
            text_parts.append(f"Incoming relations: {rels_str}")
        if attrs:
            attrs_str = '; '.join(a['id'] + ' (' + a.get('datatype', '') + ')' for a in attrs)
            text_parts.append(f"Attributes: {attrs_str}")
        if insts:
            text_parts.append(f"Instances: {'; '.join(i.get('label', i['id']) for i in insts)}")

        chunks.append({
            "id": f"class_{cid}",
            "type": "class",
            "text": "\n".join(text_parts),
            "metadata": {
                "class_id": cid,
                "layer": c.get("source_layer", ""),
                "domain": c.get("domain", ""),
                "parent": c.get("parent"),
            }
        })

    return chunks


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Export ontology for LLM consumption")
    parser.add_argument("input", help="Path to merged_ontology.json")
    parser.add_argument("-o", "--output", help="Output directory (default: same as input)")
    args = parser.parse_args()

    input_path = Path(args.input).resolve()
    output_dir = Path(args.output).resolve() if args.output else input_path.parent
    output_dir.mkdir(parents=True, exist_ok=True)

    data = load_merged(str(input_path))

    print(f"\n  Exporting ontology for LLM...")
    print(f"  Source: {input_path.name}")

    # 1. System prompt
    prompt = generate_system_prompt(data)
    prompt_path = output_dir / "llm_system_prompt.md"
    with open(prompt_path, "w", encoding="utf-8") as f:
        f.write(prompt)
    token_est = len(prompt) // 4
    print(f"  [OK] {prompt_path.name} (~{token_est} tokens)")

    # 2. Tool definitions
    tools = generate_tool_definitions(data)
    tools_path = output_dir / "llm_tools.json"
    with open(tools_path, "w", encoding="utf-8") as f:
        json.dump(tools, f, indent=2, ensure_ascii=False)
    print(f"  [OK] {tools_path.name} ({len(tools)} tools)")

    # 3. RAG chunks
    chunks = generate_rag_chunks(data)
    chunks_path = output_dir / "llm_rag_chunks.json"
    with open(chunks_path, "w", encoding="utf-8") as f:
        json.dump(chunks, f, indent=2, ensure_ascii=False)
    print(f"  [OK] {chunks_path.name} ({len(chunks)} chunks)")

    print(f"\n  Done. 3 files generated in {output_dir}/\n")


if __name__ == "__main__":
    main()
