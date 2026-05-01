#!/usr/bin/env python3
"""
validate_l3.py — L3 Enterprise Ontology Validator
===================================================
Validates L2/L3 ontology files against their dependency chain.
Checks referential integrity, naming conventions, alias consistency,
instance validity, and semantic constraints.

Usage:
    python scripts/validate_l3.py private_enterprise/deloitte-china-consulting/deloitte_china_consulting_ontology_v1.json
    python scripts/validate_l3.py --all          # validate all L2/L3 files
    python scripts/validate_l3.py --all --strict  # treat warnings as errors
"""

import json
import sys
import io
import re
import argparse
from pathlib import Path
from collections import Counter

if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

SCRIPT_DIR = Path(__file__).parent
sys.path.insert(0, str(SCRIPT_DIR))

try:
    import uod_core
    def find_root(p): return Path(uod_core.find_project_root(str(p)))
    def discover_files(root): return uod_core.discover_ontology_files(str(root))
except ImportError:
    def find_root(p):
        p = Path(p).resolve()
        for _ in range(10):
            if (p / "l1-core").is_dir() and (p / "l2-extensions").is_dir():
                return p
            p = p.parent
        return Path(p).resolve()
    def discover_files(root):
        import glob
        files = []
        for pattern in ["l1-core/*.json", "l2-extensions/*/*.json", "l3-enterprise/*/*.json", "private_enterprise/*/*.json"]:
            files.extend(glob.glob(str(root / pattern)))
        return [f for f in files if not Path(f).name.startswith("_") and "schema" not in f and "template" not in f.lower()]


# ── Rule checks ──────────────────────────────────────────────────────────────

class ValidationResult:
    def __init__(self):
        self.errors = []
        self.warnings = []
        self.info = []

    def error(self, rule, msg):
        self.errors.append((rule, msg))

    def warn(self, rule, msg):
        self.warnings.append((rule, msg))

    def ok(self):
        return len(self.errors) == 0

    def report(self, title):
        print(f"\n{'='*60}")
        print(f"  {title}")
        print(f"{'='*60}\n")
        if self.errors:
            print(f"  ERRORS ({len(self.errors)}):")
            for rule, msg in self.errors:
                print(f"    [{rule}] {msg}")
        if self.warnings:
            print(f"\n  WARNINGS ({len(self.warnings)}):")
            for rule, msg in self.warnings:
                print(f"    [{rule}] {msg}")
        if not self.errors and not self.warnings:
            print("  All checks passed.")
        print(f"\n  Result: {'FAIL' if self.errors else 'PASS'} ({len(self.errors)} errors, {len(self.warnings)} warnings)")
        print(f"{'='*60}\n")
        return self.ok()


def match_layer_ref(ref, layer_keys):
    """Resolve an `extends` reference (which may include version suffix) to a known layer id."""
    if ref in layer_keys:
        return ref
    for key in layer_keys:
        ref_base = ref.rsplit("_v", 1)[0] if "_v" in ref else ref
        key_base = key.rsplit("_v", 1)[0] if "_v" in key else key
        if ref_base == key_base or ref.startswith(key[:15]) or key.startswith(ref[:15]):
            return key
    return None


def resolve_all_classes(target_path, project_root):
    """Load target + dependencies, return (all_class_ids, all_abstract_ids, target_data, index)."""
    # Build layer index
    index = {}
    for fpath in discover_files(str(project_root)):
        try:
            with open(fpath, "r", encoding="utf-8") as f:
                data = json.load(f)
            layer = data.get("layer") or data.get("metadata", {}).get("layer", "")
            if layer:
                index[layer] = (fpath, data)
        except Exception:
            pass

    # Load target
    with open(target_path, "r", encoding="utf-8") as f:
        target_data = json.load(f)

    # Resolve extends
    extends = target_data.get("extends", [])
    if isinstance(extends, str):
        extends = [extends]

    all_classes = {}
    all_abstract = set()

    # Load dependencies
    for ref in extends:
        matched = match_layer_ref(ref, index.keys())
        if matched:
            _, dep_data = index[matched]
            for c in dep_data.get("classes", []):
                all_classes[c["id"]] = c
                if c.get("abstract"):
                    all_abstract.add(c["id"])

    # Add target classes
    for c in target_data.get("classes", []):
        all_classes[c["id"]] = c
        if c.get("abstract"):
            all_abstract.add(c["id"])

    return all_classes, all_abstract, target_data, index


def find_extends_cycle(start_layer, target_extends, index):
    """DFS the extends graph starting from start_layer. Returns the cycle path
    (list of layer ids ending where it started) if any, else None.

    The graph is built from `index` (each layer's `extends` field) plus a
    synthetic entry for `start_layer -> target_extends`, so we still detect
    cycles even when the target file isn't yet on disk under its own layer id.
    """
    graph = {}
    for layer_id, (_, dep_data) in index.items():
        ext = dep_data.get("extends", [])
        if isinstance(ext, str):
            ext = [ext]
        graph[layer_id] = ext
    graph[start_layer] = list(target_extends)

    # Iterative DFS tracking the current path
    stack = [(start_layer, [start_layer])]
    seen_complete = set()
    while stack:
        node, path = stack.pop()
        if node in seen_complete:
            continue
        for ref in graph.get(node, []):
            child = match_layer_ref(ref, graph.keys()) or ref
            if child in path:
                return path + [child]
            stack.append((child, path + [child]))
        seen_complete.add(node)
    return None


def validate(target_path, project_root):
    """Run all validation rules on a target ontology file."""
    r = ValidationResult()
    all_classes, all_abstract, data, index = resolve_all_classes(target_path, project_root)
    all_ids = set(all_classes.keys())
    target_classes = data.get("classes", [])
    target_relations = data.get("relations", [])
    target_instances = data.get("sample_instances", [])
    target_attributes = data.get("attributes", [])

    # ── R-01: Parent references ──
    for c in target_classes:
        parent = c.get("parent")
        if parent and parent not in all_ids:
            r.error("R-01", f"Class '{c['id']}' parent '{parent}' not found in L1/L2/L3")

    # ── R-02: Relation domain/range ──
    for rel in target_relations:
        domain = rel.get("domain")
        rng = rel.get("range")
        if domain and domain not in all_ids:
            r.error("R-02", f"Relation '{rel['id']}' domain '{domain}' not found")
        if rng and rng not in all_ids:
            r.error("R-02", f"Relation '{rel['id']}' range '{rng}' not found")

    # ── R-03: Alias references ──
    for c in target_classes:
        alias = c.get("alias_of")
        if alias:
            if alias not in all_ids:
                r.error("R-03", f"Class '{c['id']}' alias_of '{alias}' not found")
            if alias == c["id"]:
                r.error("R-03", f"Class '{c['id']}' alias_of references itself")

    # ── R-04: Instance type validity ──
    for inst in target_instances:
        itype = inst.get("type")
        if itype and itype not in all_ids:
            r.error("R-04", f"Instance '{inst['id']}' type '{itype}' not found")
        if itype and itype in all_abstract:
            r.warn("R-04", f"Instance '{inst['id']}' type '{itype}' is abstract")

    # ── R-05: Naming conventions ──
    for c in target_classes:
        if not re.match(r'^[A-Z][a-zA-Z0-9]*$', c["id"]):
            r.error("R-05", f"Class '{c['id']}' is not PascalCase")
    for rel in target_relations:
        if not re.match(r'^[a-z][a-z0-9_]*$', rel["id"]):
            r.error("R-05", f"Relation '{rel['id']}' is not snake_case")
    for inst in target_instances:
        if not re.match(r'^[a-z][a-z0-9_]*$', inst["id"]):
            r.warn("R-05", f"Instance '{inst['id']}' is not snake_case")

    # ── R-06: Duplicate IDs ──
    class_ids = [c["id"] for c in target_classes]
    for cid, count in Counter(class_ids).items():
        if count > 1:
            r.error("R-06", f"Duplicate class ID '{cid}' ({count} times)")
    rel_ids = [rel["id"] for rel in target_relations]
    for rid, count in Counter(rel_ids).items():
        if count > 1:
            r.error("R-06", f"Duplicate relation ID '{rid}' ({count} times)")

    # ── R-07: Definitions present ──
    for c in target_classes:
        if not c.get("definition") and not c.get("definition_en"):
            r.warn("R-07", f"Class '{c['id']}' has no definition")
    for rel in target_relations:
        if not rel.get("definition") and not rel.get("definition_en"):
            r.warn("R-07", f"Relation '{rel['id']}' has no definition")

    # ── R-08: Attribute owner_class validity ──
    for attr in target_attributes:
        owner = attr.get("owner_class")
        if owner and owner not in all_ids:
            r.error("R-08", f"Attribute '{attr['id']}' owner_class '{owner}' not found")

    # ── R-09: Circular inheritance ──
    parent_map = {c["id"]: c.get("parent") for c in target_classes}
    for cid in parent_map:
        visited = set()
        cur = cid
        while cur and cur in parent_map:
            if cur in visited:
                r.error("R-09", f"Circular inheritance detected at '{cid}'")
                break
            visited.add(cur)
            cur = parent_map.get(cur)

    # ── R-10: Cyclic extends across layers ──
    target_layer = data.get("layer") or data.get("metadata", {}).get("layer", "")
    target_extends = data.get("extends", [])
    if isinstance(target_extends, str):
        target_extends = [target_extends]
    if target_layer:
        cycle = find_extends_cycle(target_layer, target_extends, index)
        if cycle:
            r.error("R-10", f"Cyclic extends: {' -> '.join(cycle)}")

    return r


def main():
    parser = argparse.ArgumentParser(description="Validate L2/L3 ontology files")
    parser.add_argument("target", nargs="?", help="Path to ontology JSON file")
    parser.add_argument("--all", action="store_true", help="Validate all L2/L3 files")
    parser.add_argument("--strict", action="store_true", help="Treat warnings as errors")
    args = parser.parse_args()

    project_root = find_root(args.target or ".")

    if args.all or not args.target:
        files = discover_files(str(project_root))
        targets = []
        for f in files:
            try:
                with open(f, "r", encoding="utf-8") as fh:
                    d = json.load(fh)
                layer = d.get("layer", "")
                if layer.startswith("L2_") or layer.startswith("L3_"):
                    targets.append(f)
            except Exception:
                pass

        if not targets:
            print("No L2/L3 ontology files found.")
            sys.exit(1)

        all_ok = True
        for t in sorted(targets):
            rel = Path(t).relative_to(project_root)
            result = validate(t, project_root)
            ok = result.report(str(rel))
            if args.strict and result.warnings:
                ok = False
            if not ok:
                all_ok = False

        sys.exit(0 if all_ok else 1)
    else:
        target = Path(args.target).resolve()
        if not target.exists():
            print(f"File not found: {target}")
            sys.exit(1)
        result = validate(str(target), project_root)
        ok = result.report(str(target.relative_to(project_root)))
        if args.strict and result.warnings:
            ok = False
        sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
