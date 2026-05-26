#!/usr/bin/env python3
"""
validate_instances.py — validation for instances/demo/**/*.json

Phase A.1 deliverable. The demo instances are the public, frozen subset of
the broader instance store (real harvested data lives in the uod-backend
Postgres database, not in Git).

Checks performed
  1. Each demo file matches schema/instance_schema.json.
  2. Every `instance.type` resolves to a class that:
       - exists in L1, the matching L2 extension, or the matching L3 file
       - is NOT abstract (instances of abstract classes are illegal)
  3. Every `instance.id` is unique across the entire instances/demo/ tree.
  4. `source_url`, when present, parses as an absolute URI (no network call).
  5. `layer` field of each demo file matches a real layer ID in L1/L2/L3.

Exits 0 on success, 1 if any check fails.
"""

from __future__ import annotations

import glob
import io
import json
import sys
from pathlib import Path
from urllib.parse import urlparse

if sys.stdout.encoding != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
if sys.stderr.encoding != "utf-8":
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

try:
    import jsonschema
except ImportError:
    print("jsonschema not installed. Run: pip install jsonschema", file=sys.stderr)
    sys.exit(2)


ROOT = Path(__file__).resolve().parent.parent
INSTANCE_SCHEMA = ROOT / "schema" / "instance_schema.json"
DEMO_GLOB = "instances/demo/**/*.json"


# ─── helpers ─────────────────────────────────────────────────────────────

def load(p: Path) -> dict:
    with p.open("r", encoding="utf-8") as f:
        return json.load(f)


def build_class_index() -> tuple[dict[str, dict], dict[str, str]]:
    """Walk L1/L2/L3 layer files and build:
       - id_to_class: class_id -> {abstract: bool, layer: str}
       - layer_id_to_path: layer string -> relative file path
    """
    id_to_class: dict[str, dict] = {}
    layer_id_to_path: dict[str, str] = {}

    patterns = [
        "l1-core/*.json",
        "l2-extensions/*/*.json",
        "l3-enterprise/*/*.json",
    ]
    for pattern in patterns:
        for f in sorted(glob.glob(str(ROOT / pattern))):
            p = Path(f)
            parts = p.relative_to(ROOT).parts
            if any(part.startswith("_") for part in parts):
                continue
            if "template" in p.name.lower():
                continue
            try:
                data = load(p)
            except Exception:
                continue
            if not isinstance(data, dict):
                continue
            layer = data.get("layer") or data.get("metadata", {}).get("layer", "")
            if not isinstance(layer, str) or not layer:
                continue
            layer_id_to_path[layer] = str(p.relative_to(ROOT)).replace("\\", "/")
            for c in data.get("classes", []):
                cid = c.get("id")
                if not cid:
                    continue
                id_to_class[cid] = {
                    "abstract": bool(c.get("abstract", False)),
                    "layer": layer,
                }
    return id_to_class, layer_id_to_path


def is_valid_uri(s: str) -> bool:
    try:
        u = urlparse(s)
        return bool(u.scheme and u.netloc)
    except Exception:
        return False


# ─── checks ──────────────────────────────────────────────────────────────

def validate_file(
    path: Path,
    schema: dict,
    id_to_class: dict[str, dict],
    layer_id_to_path: dict[str, str],
    seen_instance_ids: dict[str, str],
) -> tuple[int, int]:
    """Returns (errors_added, instances_seen)."""
    rel = str(path.relative_to(ROOT)).replace("\\", "/")
    errors = 0

    try:
        doc = load(path)
    except Exception as e:
        print(f"  FAIL {rel}: cannot parse: {type(e).__name__}: {e}", file=sys.stderr)
        return 1, 0

    # 1. JSON-Schema
    try:
        jsonschema.validate(doc, schema)
    except jsonschema.ValidationError as e:
        loc = "/".join(str(p) for p in e.absolute_path) or "<root>"
        print(f"  FAIL {rel}: schema: {loc}: {e.message}", file=sys.stderr)
        errors += 1
        # Stop further per-instance checks if doc shape is broken
        return errors, 0

    # 5. layer must exist
    layer = doc.get("layer", "")
    if layer not in layer_id_to_path:
        print(
            f"  FAIL {rel}: layer '{layer}' does not match any L1/L2/L3 file",
            file=sys.stderr,
        )
        errors += 1

    instances = doc.get("instances", [])
    for i, inst in enumerate(instances):
        iid = inst.get("id", f"<index {i}>")
        itype = inst.get("type", "")

        # 2. type must exist and be non-abstract
        cls = id_to_class.get(itype)
        if cls is None:
            print(
                f"  FAIL {rel}#{iid}: type '{itype}' not found in L1/L2/L3 class definitions",
                file=sys.stderr,
            )
            errors += 1
        elif cls["abstract"]:
            print(
                f"  FAIL {rel}#{iid}: type '{itype}' is abstract — instances must use a concrete class",
                file=sys.stderr,
            )
            errors += 1

        # 3. id unique across the whole demo tree
        prev = seen_instance_ids.get(iid)
        if prev is not None and prev != rel:
            print(
                f"  FAIL {rel}#{iid}: duplicate id (also defined in {prev})",
                file=sys.stderr,
            )
            errors += 1
        else:
            seen_instance_ids[iid] = rel

        # 4. source_url, if present, must be a valid URI
        url = inst.get("source_url")
        if url is not None and not is_valid_uri(url):
            print(f"  FAIL {rel}#{iid}: source_url '{url}' is not a valid URI", file=sys.stderr)
            errors += 1

    if errors == 0:
        print(f"  OK   {rel} ({len(instances)} instances)")

    return errors, len(instances)


# ─── main ────────────────────────────────────────────────────────────────

def main() -> int:
    if not INSTANCE_SCHEMA.exists():
        print(f"Missing {INSTANCE_SCHEMA}", file=sys.stderr)
        return 2

    schema = load(INSTANCE_SCHEMA)
    id_to_class, layer_id_to_path = build_class_index()

    if not id_to_class:
        print("No L1/L2/L3 class definitions discovered — cannot validate instance types.", file=sys.stderr)
        return 2

    files = sorted(glob.glob(str(ROOT / DEMO_GLOB), recursive=True))
    if not files:
        print("No instance files found under instances/demo/.", file=sys.stderr)
        # Not an error — an ontology project may legitimately have no demo data yet.
        print("PASS (0 files, 0 instances)")
        return 0

    print(f"Validating {len(files)} demo instance file(s)...")
    seen_instance_ids: dict[str, str] = {}
    total_errors = 0
    total_instances = 0
    for f in files:
        errs, count = validate_file(
            Path(f), schema, id_to_class, layer_id_to_path, seen_instance_ids
        )
        total_errors += errs
        total_instances += count

    print()
    print(f"Files={len(files)} Instances={total_instances} Errors={total_errors}")
    print("PASS" if total_errors == 0 else "FAIL")
    return 0 if total_errors == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
