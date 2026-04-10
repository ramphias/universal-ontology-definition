#!/usr/bin/env python3
"""
merge_layers.py — Multi-Layer Ontology Merger
==============================================
Merges L1 Core + L2 Addons + L3 Enterprise into a single, flattened ontology
and generates output in all 5 platform formats (JSON, OWL/RDF, JSON-LD, GraphQL, SQL).

Usage:
    python scripts/merge_layers.py enterprise/acme-tech-solutions/acme_tech_solutions_ontology_v1.json
    python scripts/merge_layers.py enterprise/acme-tech-solutions/acme_tech_solutions_ontology_v1.json -o output/
    python scripts/merge_layers.py extensions/consulting/consulting_extension_v1.json  # merge L2+L1 only
"""

import json
import sys
import os
import io
import glob
import argparse
from pathlib import Path
from datetime import datetime
from collections import OrderedDict

# Fix Windows console encoding
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Add scripts dir to path so we can import json_to_owl
SCRIPT_DIR = Path(__file__).parent
sys.path.insert(0, str(SCRIPT_DIR))
from json_to_owl import generate_turtle, find_project_root


# ─── Project Root Detection ─────────────────────────────────────────────────

def detect_project_root(start_path):
    """Find project root by looking for core/ and extensions/ directories."""
    p = Path(start_path).resolve()
    for _ in range(10):
        if (p / "core").is_dir() and (p / "extensions").is_dir():
            return p
        p = p.parent
    return Path(start_path).resolve()


# ─── Layer Index ─────────────────────────────────────────────────────────────

def build_layer_index(project_root):
    """Scan all JSON ontology files and build a layer_id → file_path index."""
    index = {}
    patterns = [
        project_root / "core" / "*.json",
        project_root / "extensions" / "*" / "*.json",
        project_root / "enterprise" / "*" / "*.json",
    ]
    for pattern in patterns:
        for fpath in glob.glob(str(pattern)):
            basename = os.path.basename(fpath)
            if basename.startswith("_") or "schema" in basename or "template" in basename.lower():
                continue
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    data = json.load(f)
                layer = data.get("layer") or data.get("metadata", {}).get("layer", "")
                if layer:
                    index[layer] = fpath
            except Exception:
                pass
    return index


def normalize_layer_ref(ref, index):
    """Match an extends reference (which may include version suffix) to an index key."""
    if ref in index:
        return ref
    # Strip version suffixes like _v1, _v2
    for key in index:
        # Try prefix matching
        ref_base = ref.rsplit("_v", 1)[0] if "_v" in ref else ref
        key_base = key.rsplit("_v", 1)[0] if "_v" in key else key
        if ref_base == key_base:
            return key
        # Try matching by first two segments
        if ref.startswith(key[:15]) or key.startswith(ref[:15]):
            return key
    return None


# ─── Dependency Resolution ───────────────────────────────────────────────────

def resolve_dependencies(target_path, project_root):
    """
    Resolve the full dependency chain for a target ontology file.
    Returns list of (layer_id, file_path, data) in merge order (L1 first, target last).
    """
    index = build_layer_index(project_root)

    with open(target_path, "r", encoding="utf-8") as f:
        target_data = json.load(f)

    target_layer = target_data.get("layer") or target_data.get("metadata", {}).get("layer", "")

    # Get extends
    extends = target_data.get("extends", [])
    if isinstance(extends, str):
        extends = [extends]

    # Resolve all dependencies (breadth-first)
    resolved = OrderedDict()  # layer_id → (path, data)
    queue = list(extends)
    visited = set()

    while queue:
        ref = queue.pop(0)
        if ref in visited:
            continue
        visited.add(ref)

        matched_key = normalize_layer_ref(ref, index)
        if not matched_key:
            print(f"  [WARN] Cannot resolve dependency: {ref}")
            continue

        fpath = index[matched_key]
        with open(fpath, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Check if this dependency has its own extends
        sub_extends = data.get("extends", [])
        if isinstance(sub_extends, str):
            sub_extends = [sub_extends]
        for sub in sub_extends:
            if sub not in visited:
                queue.append(sub)

        resolved[matched_key] = (fpath, data)

    # Build final ordered list: L1 first, then L2s, then target
    layers = []
    # Sort: L1 before L2 before L3
    for layer_id in sorted(resolved.keys(), key=lambda x: x[:2]):
        fpath, data = resolved[layer_id]
        layers.append((layer_id, fpath, data))

    # Append target itself
    layers.append((target_layer, str(target_path), target_data))

    return layers


# ─── Merge Logic ─────────────────────────────────────────────────────────────

def merge_layers(layers):
    """
    Merge multiple layers into a single flattened ontology.
    Returns merged dict with source_layer annotations.
    """
    merged = {
        "metadata": {
            "name": "",
            "description": "Merged ontology generated by merge_layers.py",
            "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "layers_merged": [],
            "version": "merged",
        },
        "classes": [],
        "relations": [],
        "axioms": [],
        "deprecated_classes": [],
        "deprecated_relations": [],
        "sample_instances": [],
    }

    class_ids = set()
    relation_ids = set()

    for layer_id, fpath, data in layers:
        layer_short = layer_id or os.path.basename(fpath)
        merged["metadata"]["layers_merged"].append(layer_short)

        # Merge name from topmost layer
        meta = data.get("metadata", {})
        ent = data.get("enterprise", {})
        if ent.get("name"):
            merged["metadata"]["name"] = f"{ent['name']} — Merged Enterprise Ontology"
        elif meta.get("name") and not merged["metadata"]["name"]:
            merged["metadata"]["name"] = meta["name"]

        # Merge classes
        for cls in data.get("classes", []):
            if cls["id"] in class_ids:
                print(f"  [ERROR] Duplicate class ID '{cls['id']}' in layer {layer_short}")
                sys.exit(1)
            class_ids.add(cls["id"])
            cls_copy = dict(cls)
            cls_copy["source_layer"] = layer_short
            merged["classes"].append(cls_copy)

        # Merge relations
        for rel in data.get("relations", []):
            if rel["id"] in relation_ids:
                print(f"  [WARN] Duplicate relation ID '{rel['id']}' in {layer_short}, skipping")
                continue
            relation_ids.add(rel["id"])
            rel_copy = dict(rel)
            rel_copy["source_layer"] = layer_short
            merged["relations"].append(rel_copy)

        # Merge axioms (L1 only typically)
        for ax in data.get("axioms", []):
            ax_copy = dict(ax)
            ax_copy["source_layer"] = layer_short
            merged["axioms"].append(ax_copy)

        # Merge deprecated items
        for dep in data.get("deprecated_classes", []):
            dep_copy = dict(dep)
            dep_copy["source_layer"] = layer_short
            merged["deprecated_classes"].append(dep_copy)

        for dep in data.get("deprecated_relations", []):
            dep_copy = dict(dep)
            dep_copy["source_layer"] = layer_short
            merged["deprecated_relations"].append(dep_copy)

        # Merge instances
        for inst in data.get("sample_instances", []):
            inst_copy = dict(inst)
            inst_copy["source_layer"] = layer_short
            merged["sample_instances"].append(inst_copy)

    return merged


# ─── Validation ──────────────────────────────────────────────────────────────

def validate_merged(merged):
    """Validate referential integrity of the merged ontology."""
    class_ids = {c["id"] for c in merged["classes"]}
    errors = []

    # Check parent references
    for cls in merged["classes"]:
        parent = cls.get("parent")
        if parent is not None and parent not in class_ids:
            errors.append(f"Class '{cls['id']}' parent '{parent}' not found")

    # Check relation domain/range
    for rel in merged["relations"]:
        domain = rel.get("domain")
        rng = rel.get("range")
        if domain and domain not in class_ids:
            errors.append(f"Relation '{rel['id']}' domain '{domain}' not found")
        if rng and rng not in class_ids:
            errors.append(f"Relation '{rel['id']}' range '{rng}' not found")

    # Check instance types
    non_abstract = {c["id"] for c in merged["classes"] if not c.get("abstract", False)}
    for inst in merged["sample_instances"]:
        itype = inst.get("type")
        if itype and itype not in class_ids:
            errors.append(f"Instance '{inst['id']}' type '{itype}' not found")

    return errors


# ─── Output Generators ──────────────────────────────────────────────────────

def generate_merged_json(merged, output_dir):
    """Write merged JSON file."""
    path = os.path.join(output_dir, "merged_ontology.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(merged, f, ensure_ascii=False, indent=2)
    print(f"  [OK] {path}")


def generate_merged_owl(merged, output_dir, project_root):
    """Generate merged OWL/RDF Turtle file."""
    # Prepare data in format expected by generate_turtle()
    # Set layer to merged and add metadata
    owl_data = dict(merged)
    owl_data["metadata"] = dict(merged["metadata"])
    owl_data["metadata"]["layer"] = "L1_universal_organization_ontology"

    turtle = generate_turtle(owl_data, str(project_root))

    path = os.path.join(output_dir, "merged_ontology.ttl")
    with open(path, "w", encoding="utf-8") as f:
        f.write(turtle)
    print(f"  [OK] {path}")


def generate_merged_jsonld(merged, output_dir):
    """Generate merged JSON-LD context."""
    context = {
        "@context": {
            "@version": 1.1,
            "uod": "https://w3id.org/uod/core/",
            "owl": "http://www.w3.org/2002/07/owl#",
            "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
            "xsd": "http://www.w3.org/2001/XMLSchema#",

            "id": "@id",
            "type": "@type",

            "label": "rdfs:label",
            "label_zh": {"@id": "rdfs:label", "@language": "zh"},
            "label_en": {"@id": "rdfs:label", "@language": "en"},
            "definition": {"@id": "rdfs:comment", "@language": "zh"},
            "definition_en": {"@id": "rdfs:comment", "@language": "en"},
            "parent": {"@id": "rdfs:subClassOf", "@type": "@id"},
            "source_layer": "uod:sourceLayer",
        }
    }

    # Add class mappings
    for cls in merged["classes"]:
        context["@context"][cls["id"]] = f"uod:{cls['id']}"

    # Add relation mappings
    for rel in merged["relations"]:
        context["@context"][rel["id"]] = {"@id": f"uod:{rel['id']}", "@type": "@id"}

    # Add OWL axiom terms
    context["@context"]["disjointWith"] = {"@id": "owl:disjointWith", "@type": "@id"}
    context["@context"]["someValuesFrom"] = {"@id": "owl:someValuesFrom", "@type": "@id"}
    context["@context"]["allValuesFrom"] = {"@id": "owl:allValuesFrom", "@type": "@id"}
    context["@context"]["onProperty"] = {"@id": "owl:onProperty", "@type": "@id"}
    context["@context"]["minCardinality"] = {"@id": "owl:minCardinality", "@type": "xsd:nonNegativeInteger"}
    context["@context"]["maxCardinality"] = {"@id": "owl:maxCardinality", "@type": "xsd:nonNegativeInteger"}
    context["@context"]["subPropertyOf"] = {"@id": "rdfs:subPropertyOf", "@type": "@id"}

    path = os.path.join(output_dir, "merged_ontology.jsonld")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(context, f, ensure_ascii=False, indent=2)
    print(f"  [OK] {path}")


def generate_merged_graphql(merged, output_dir):
    """Generate merged GraphQL schema."""
    lines = []
    lines.append("# Merged Enterprise Ontology — GraphQL Schema")
    lines.append(f"# Generated by merge_layers.py on {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    lines.append(f"# Layers: {', '.join(merged['metadata']['layers_merged'])}")
    lines.append("")

    # Build class hierarchy info
    abstract_ids = {c["id"] for c in merged["classes"] if c.get("abstract", False)}
    children_map = {}
    for cls in merged["classes"]:
        parent = cls.get("parent")
        if parent:
            children_map.setdefault(parent, []).append(cls["id"])

    # Build relation index by domain
    relations_by_domain = {}
    for rel in merged["relations"]:
        domain = rel.get("domain", "")
        relations_by_domain.setdefault(domain, []).append(rel)

    # Find all domains used for query root
    concrete_roots = []
    for cls in merged["classes"]:
        if not cls.get("abstract", False) and cls.get("parent") in abstract_ids:
            concrete_roots.append(cls)

    # Query type
    lines.append("type Query {")
    for cls in concrete_roots[:20]:  # Limit query root to top-level concrete classes
        cid = cls["id"]
        field = cid[0].lower() + cid[1:]
        lines.append(f"  {field}(id: ID!): {cid}")
    lines.append("  axioms(type: AxiomType): [Axiom!]!")
    lines.append("}")
    lines.append("")

    # Types for each class
    for cls in merged["classes"]:
        cid = cls["id"]
        label_zh = cls.get("label_zh", "")
        label_en = cls.get("label_en", cid)
        source = cls.get("source_layer", "")

        desc = f"{label_en} ({label_zh}) [{source}]"

        if cls.get("abstract") and children_map.get(cid):
            # Interface
            lines.append(f'"""{desc}"""')
            lines.append(f"interface {cid} {{")
        else:
            parent = cls.get("parent")
            implements = f" implements {parent}" if parent and parent in abstract_ids else ""
            lines.append(f'"""{desc}"""')
            lines.append(f"type {cid}{implements} {{")

        lines.append("  id: ID!")
        lines.append("  labelZh: String!")
        lines.append("  labelEn: String")
        lines.append("  definition: String")
        lines.append("  sourceLayer: String")

        # Add relation fields for this class
        for rel in relations_by_domain.get(cid, []):
            rng = rel.get("range", "String")
            field_name = "".join(
                word.capitalize() if i > 0 else word
                for i, word in enumerate(rel["id"].split("_"))
            )
            lines.append(f"  {field_name}: [{rng}!]!")

        lines.append("}")
        lines.append("")

    # Axiom type
    lines.append('"""Formal semantic axiom."""')
    lines.append("type Axiom {")
    lines.append("  id: ID!")
    lines.append("  type: AxiomType!")
    lines.append("  labelZh: String!")
    lines.append("  labelEn: String")
    lines.append("  definition: String")
    lines.append("  classes: [String!]")
    lines.append("  subjectClass: String")
    lines.append("  relation: String")
    lines.append("  objectClass: String")
    lines.append("  value: Int")
    lines.append("  sourceLayer: String")
    lines.append("}")
    lines.append("")

    lines.append("enum AxiomType {")
    for at in ["DISJOINT", "CARDINALITY_MIN", "CARDINALITY_MAX", "CARDINALITY_EXACT",
               "EXISTENTIAL", "UNIVERSAL", "FUNCTIONAL", "INVERSE_FUNCTIONAL",
               "SYMMETRIC", "ASYMMETRIC", "TRANSITIVE", "SUBPROPERTY"]:
        lines.append(f"  {at}")
    lines.append("}")

    path = os.path.join(output_dir, "merged_ontology.graphql")
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"  [OK] {path}")


def generate_merged_sql(merged, output_dir):
    """Generate merged PostgreSQL DDL."""
    lines = []
    lines.append("-- Merged Enterprise Ontology — PostgreSQL DDL")
    lines.append(f"-- Generated by merge_layers.py on {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    lines.append(f"-- Layers: {', '.join(merged['metadata']['layers_merged'])}")
    lines.append("")
    lines.append('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    lines.append("")

    # Build hierarchy
    abstract_ids = {c["id"] for c in merged["classes"] if c.get("abstract", False)}

    # Generate tables for concrete classes
    for cls in merged["classes"]:
        if cls.get("abstract", False):
            continue

        cid = cls["id"]
        table_name = _to_snake(cid)
        parent = cls.get("parent")
        source = cls.get("source_layer", "")

        lines.append(f"-- {cid} ({cls.get('label_en', cid)}) [{source}]")
        lines.append(f"CREATE TABLE {table_name} (")
        lines.append(f"    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),")
        lines.append(f"    label_zh    VARCHAR(255) NOT NULL,")
        lines.append(f"    label_en    VARCHAR(255),")
        lines.append(f"    definition  TEXT,")

        # Add FK to parent if parent is concrete
        if parent and parent not in abstract_ids:
            parent_table = _to_snake(parent)
            lines.append(f"    parent_id   UUID REFERENCES {parent_table}(id),")

        lines.append(f"    created_at  TIMESTAMPTZ DEFAULT NOW()")
        lines.append(f");")
        lines.append("")

    # Generate junction tables for N:M relations
    lines.append("-- Junction tables for relations")
    lines.append("")
    for rel in merged["relations"]:
        card = rel.get("cardinality", "N:M")
        if card in ("N:M", "M:N"):
            rid = rel["id"]
            domain = rel.get("domain", "")
            rng = rel.get("range", "")
            if domain in abstract_ids or rng in abstract_ids:
                # Use generic pattern for abstract domains
                lines.append(f"-- {rid}: {domain} -> {rng} (abstract, use application-level resolution)")
                continue
            d_table = _to_snake(domain)
            r_table = _to_snake(rng)
            jt = f"{d_table}_{rid}"
            lines.append(f"-- {rid}: {domain} <-> {rng}")
            lines.append(f"CREATE TABLE {jt} (")
            lines.append(f"    {d_table}_id UUID NOT NULL REFERENCES {d_table}(id) ON DELETE CASCADE,")
            lines.append(f"    {r_table}_id UUID NOT NULL REFERENCES {r_table}(id) ON DELETE CASCADE,")
            lines.append(f"    PRIMARY KEY ({d_table}_id, {r_table}_id)")
            lines.append(f");")
            lines.append("")

    # Axiom metadata table
    lines.append("-- Axiom metadata")
    lines.append("CREATE TABLE axiom (")
    lines.append("    id              VARCHAR(100) PRIMARY KEY,")
    lines.append("    axiom_type      VARCHAR(30) NOT NULL,")
    lines.append("    label_zh        VARCHAR(255),")
    lines.append("    label_en        VARCHAR(255),")
    lines.append("    definition      TEXT,")
    lines.append("    subject_class   VARCHAR(100),")
    lines.append("    relation        VARCHAR(100),")
    lines.append("    object_class    VARCHAR(100),")
    lines.append("    cardinality_val INTEGER,")
    lines.append("    source_layer    VARCHAR(100),")
    lines.append("    created_at      TIMESTAMPTZ DEFAULT NOW()")
    lines.append(");")

    path = os.path.join(output_dir, "merged_ontology.sql")
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"  [OK] {path}")


def _to_snake(pascal_str):
    """Convert PascalCase to snake_case."""
    result = []
    for i, ch in enumerate(pascal_str):
        if ch.isupper() and i > 0:
            result.append("_")
        result.append(ch.lower())
    return "".join(result)


# ─── Main ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Merge L1+L2+L3 ontology layers into a single enterprise ontology"
    )
    parser.add_argument(
        "target",
        help="Path to the target ontology JSON (L2 addon or L3 enterprise)",
    )
    parser.add_argument(
        "-o", "--output",
        default=None,
        help="Output directory (default: output/ next to target file)",
    )
    args = parser.parse_args()

    # Resolve paths
    target_path = Path(args.target)
    if not target_path.is_absolute():
        target_path = Path.cwd() / target_path
    target_path = target_path.resolve()

    if not target_path.exists():
        print(f"[ERROR] File not found: {target_path}")
        sys.exit(1)

    project_root = detect_project_root(target_path)

    if args.output:
        output_dir = Path(args.output)
    else:
        output_dir = target_path.parent / "output"

    if not output_dir.is_absolute():
        output_dir = Path.cwd() / output_dir
    output_dir = output_dir.resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    # Step 1: Resolve dependencies
    print(f"\n{'='*60}")
    print(f"  Ontology Layer Merger")
    print(f"{'='*60}")
    print(f"\nTarget: {target_path.relative_to(project_root)}")
    print(f"Project root: {project_root}")
    print(f"\nResolving dependencies...")

    layers = resolve_dependencies(str(target_path), project_root)
    for layer_id, fpath, data in layers:
        cls_count = len(data.get("classes", []))
        rel_count = len(data.get("relations", []))
        print(f"  [{layer_id[:2]}] {layer_id} — {cls_count} classes, {rel_count} relations")

    # Step 2: Merge
    print(f"\nMerging {len(layers)} layers...")
    merged = merge_layers(layers)

    total_cls = len(merged["classes"])
    total_rel = len(merged["relations"])
    total_ax = len(merged["axioms"])
    total_inst = len(merged["sample_instances"])
    print(f"  Total: {total_cls} classes, {total_rel} relations, {total_ax} axioms, {total_inst} instances")

    # Step 3: Validate
    print(f"\nValidating merged ontology...")
    errors = validate_merged(merged)
    if errors:
        print(f"\n  [ERROR] Validation failed:")
        for e in errors:
            print(f"    - {e}")
        sys.exit(1)
    else:
        print(f"  All references valid.")

    # Step 4: Generate outputs
    print(f"\nGenerating outputs in {output_dir}/")
    generate_merged_json(merged, str(output_dir))
    generate_merged_owl(merged, str(output_dir), project_root)
    generate_merged_jsonld(merged, str(output_dir))
    generate_merged_graphql(merged, str(output_dir))
    generate_merged_sql(merged, str(output_dir))

    # Generate interactive HTML visualization
    try:
        from visualize_ontology import generate_visualization
        merged_json_path = Path(output_dir) / "merged_ontology.json"
        generate_visualization(str(merged_json_path))
    except Exception as e:
        print(f"  [WARN] Visualization skipped: {e}")

    print(f"\n{'='*60}")
    print(f"  Merge complete! {total_cls} classes across {len(layers)} layers.")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
