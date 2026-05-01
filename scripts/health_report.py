#!/usr/bin/env python3
"""
health_report.py — JSON health snapshot of every ontology file.

v0 metrics, per file (and aggregated at top):
  - class_count, abstract_count, concrete_count
  - relation_count, axiom_count, instance_count
  - orphans      — class.parent that doesn't resolve in this file's
                   transitive `extends` chain (L1 + extended L2s + self)
  - unused_relations — relations declared by this file that no other
                   relation references via `inverse_of`/`parent_relation`
                   and no axiom references via `relation`/`subject`
  - max_inheritance_depth — longest chain from a leaf class up to a class
                   with no/missing parent, counted within the union of
                   classes available to this file
  - depth_chain  — example chain that achieves the maximum depth

The script is purely informational — it always exits 0. CI consumers can
parse the JSON; the Studio reads the same shape via `studio/lib/health.ts`.

Usage:
  python scripts/health_report.py                 # JSON to stdout
  python scripts/health_report.py --out path.json # JSON to file (and stdout)
"""

import argparse
import io
import json
import os
import sys
from pathlib import Path

if sys.stdout.encoding != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent


def discover_files(root: Path):
    files = []
    for pat in ["l1-core/*.json", "l2-extensions/*/*.json", "l3-enterprise/*/*.json", "private_enterprise/*/*.json"]:
        for f in sorted(root.glob(pat)):
            if any(part.startswith("_") for part in f.relative_to(root).parts):
                continue
            if "schema" in f.name or "template" in f.name.lower():
                continue
            files.append(f)
    return files


def load(p: Path):
    with p.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def is_ontology(data) -> bool:
    if not isinstance(data, dict):
        return False
    layer = data.get("layer") or data.get("metadata", {}).get("layer", "")
    return isinstance(layer, str) and (layer.startswith("L1_") or layer.startswith("L2_") or layer.startswith("L3_"))


def match_layer_ref(ref, keys):
    if ref in keys:
        return ref
    for key in keys:
        ref_base = ref.rsplit("_v", 1)[0] if "_v" in ref else ref
        key_base = key.rsplit("_v", 1)[0] if "_v" in key else key
        if ref_base == key_base or ref.startswith(key[:15]) or key.startswith(ref[:15]):
            return key
    return None


def build_index(files):
    """Return {layer_id: data} for every ontology file we found."""
    index = {}
    for f in files:
        try:
            d = load(f)
            if not is_ontology(d):
                continue
            layer = d.get("layer") or d.get("metadata", {}).get("layer", "")
            if layer:
                index[layer] = d
        except Exception:
            continue
    return index


def visible_classes(target, index):
    """Return {class_id: class} reachable from target through its `extends` chain."""
    extends = target.get("extends", [])
    if isinstance(extends, str):
        extends = [extends]

    classes = {}
    visited = set()
    queue = list(extends)
    while queue:
        ref = queue.pop(0)
        if ref in visited:
            continue
        visited.add(ref)
        matched = match_layer_ref(ref, index.keys())
        if not matched:
            continue
        dep = index[matched]
        for c in dep.get("classes", []):
            cid = c.get("id")
            if cid and cid not in classes:
                classes[cid] = c
        sub = dep.get("extends", [])
        if isinstance(sub, str):
            sub = [sub]
        queue.extend(sub)

    for c in target.get("classes", []):
        cid = c.get("id")
        if cid:
            classes[cid] = c
    return classes


def compute_orphans(target, all_classes):
    """Classes in target whose parent doesn't resolve in the visible class set."""
    orphans = []
    for c in target.get("classes", []):
        parent = c.get("parent")
        if parent and parent not in all_classes:
            orphans.append({"class": c.get("id"), "missing_parent": parent})
    return orphans


def compute_unused_relations(target):
    """Relations declared in target that are referenced by nothing else in target."""
    relations = target.get("relations", [])
    rel_ids = {r.get("id") for r in relations if r.get("id")}
    referenced = set()
    for r in relations:
        for k in ("inverse_of", "parent_relation"):
            v = r.get(k)
            if isinstance(v, str) and v in rel_ids:
                referenced.add(v)
    for ax in target.get("axioms", []):
        for k in ("relation", "parent_relation"):
            v = ax.get(k)
            if isinstance(v, str) and v in rel_ids:
                referenced.add(v)
    return sorted(rel_ids - referenced)


def compute_max_depth(target, all_classes):
    """Longest chain from a target class walking parent pointers."""
    target_ids = [c.get("id") for c in target.get("classes", []) if c.get("id")]
    best_len = 0
    best_chain = []
    for cid in target_ids:
        chain = [cid]
        cur = all_classes.get(cid, {}).get("parent")
        seen = {cid}
        while cur and cur in all_classes and cur not in seen:
            chain.append(cur)
            seen.add(cur)
            cur = all_classes[cur].get("parent")
        if len(chain) > best_len:
            best_len = len(chain)
            best_chain = chain
    return best_len, best_chain


def report_one(file_path: Path, index):
    rel = file_path.relative_to(ROOT).as_posix()
    data = load(file_path)
    if not is_ontology(data):
        return None

    classes = data.get("classes", [])
    layer = data.get("layer") or data.get("metadata", {}).get("layer", "")
    abstract = sum(1 for c in classes if c.get("abstract"))
    concrete = len(classes) - abstract

    visible = visible_classes(data, index)
    orphans = compute_orphans(data, visible)
    unused = compute_unused_relations(data)
    depth, chain = compute_max_depth(data, visible)

    return {
        "file": rel,
        "layer": layer,
        "class_count": len(classes),
        "abstract_count": abstract,
        "concrete_count": concrete,
        "relation_count": len(data.get("relations", [])),
        "axiom_count": len(data.get("axioms", [])),
        "instance_count": len(data.get("sample_instances", [])),
        "orphans": orphans,
        "unused_relations": unused,
        "max_inheritance_depth": depth,
        "depth_chain": chain,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Emit a JSON health snapshot for the ontology repo")
    parser.add_argument("--out", help="Write the JSON to this path (in addition to stdout)")
    args = parser.parse_args()

    files = discover_files(ROOT)
    index = build_index(files)

    file_reports = []
    for f in files:
        report = report_one(f, index)
        if report is not None:
            file_reports.append(report)

    aggregate = {
        "files": len(file_reports),
        "total_classes":    sum(r["class_count"] for r in file_reports),
        "total_abstract":   sum(r["abstract_count"] for r in file_reports),
        "total_concrete":   sum(r["concrete_count"] for r in file_reports),
        "total_relations":  sum(r["relation_count"] for r in file_reports),
        "total_axioms":     sum(r["axiom_count"] for r in file_reports),
        "total_instances":  sum(r["instance_count"] for r in file_reports),
        "total_orphans":    sum(len(r["orphans"]) for r in file_reports),
        "total_unused_relations": sum(len(r["unused_relations"]) for r in file_reports),
        "max_inheritance_depth":  max((r["max_inheritance_depth"] for r in file_reports), default=0),
    }

    payload = {
        "schema_version": 1,
        "aggregate": aggregate,
        "files": file_reports,
    }

    out_text = json.dumps(payload, indent=2, ensure_ascii=False)
    print(out_text)

    if args.out:
        out_path = Path(args.out)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(out_text + "\n", encoding="utf-8")

    return 0


if __name__ == "__main__":
    sys.exit(main())
