#!/usr/bin/env python3
"""
validate_schema.py — JSON-Schema validation for ontology files

Validates:
  - l1-core/universal_ontology_v1.json   against schema/core_schema.json
  - l2-extensions/*/*.json               against schema/extension_schema.json
  - l3-enterprise/*/*.json               against schema/extension_schema.json
  - private_enterprise/*/*.json          against schema/extension_schema.json

Skips files under any directory or basename starting with '_' (templates).

Exits 0 on success, 1 if any file fails. Errors go to stderr.
"""

import glob
import io
import json
import sys
from pathlib import Path

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
CORE_SCHEMA = ROOT / "schema" / "core_schema.json"
EXT_SCHEMA = ROOT / "schema" / "extension_schema.json"


def load(p: Path):
    with p.open("r", encoding="utf-8") as f:
        return json.load(f)


def is_template(p: Path) -> bool:
    parts = p.parts
    if any(part.startswith("_") for part in parts):
        return True
    if "template" in p.name.lower():
        return True
    return False


def is_ontology_file(data, expected_prefix: str) -> bool:
    """An ontology file is a JSON object with a `layer` field (top-level for
    L2/L3, or `metadata.layer` for L1) starting with the expected prefix.
    Anything else (LLM RAG chunks, tool manifests, etc.) is skipped."""
    if not isinstance(data, dict):
        return False
    layer = data.get("layer") or data.get("metadata", {}).get("layer", "")
    return isinstance(layer, str) and layer.startswith(expected_prefix)


def validate_one(file_path: Path, schema, expected_layer_prefix: str) -> str:
    """Returns 'ok', 'skip', or 'fail'."""
    rel = file_path.relative_to(ROOT)
    try:
        data = load(file_path)
    except Exception as e:
        print(f"  FAIL {rel}: {type(e).__name__}: {e}", file=sys.stderr)
        return "fail"

    if not is_ontology_file(data, expected_layer_prefix):
        print(f"  SKIP {rel} (no `{expected_layer_prefix}*` layer field — not a canonical ontology file)")
        return "skip"

    try:
        jsonschema.validate(data, schema)
        print(f"  OK   {rel}")
        return "ok"
    except jsonschema.ValidationError as e:
        path = "/".join(str(p) for p in e.absolute_path) or "<root>"
        print(f"  FAIL {rel}: {path}: {e.message}", file=sys.stderr)
        return "fail"


def main() -> int:
    if not CORE_SCHEMA.exists() or not EXT_SCHEMA.exists():
        print(f"Schema files missing under {ROOT / 'schema'}", file=sys.stderr)
        return 2

    core_schema = load(CORE_SCHEMA)
    ext_schema = load(EXT_SCHEMA)

    targets = []
    for pattern, schema, prefix in [
        ("l1-core/*.json", core_schema, "L1_"),
        ("l2-extensions/*/*.json", ext_schema, "L2_"),
        ("l3-enterprise/*/*.json", ext_schema, "L3_"),
        ("private_enterprise/*/*.json", ext_schema, "L3_"),
    ]:
        for f in sorted(glob.glob(str(ROOT / pattern))):
            p = Path(f)
            if is_template(p.relative_to(ROOT)):
                continue
            targets.append((p, schema, prefix))

    if not targets:
        print("No ontology files found.", file=sys.stderr)
        return 1

    print(f"Validating up to {len(targets)} candidate files...")
    ok_count = 0
    skip_count = 0
    fail_count = 0
    for p, schema, prefix in targets:
        result = validate_one(p, schema, prefix)
        if result == "ok":
            ok_count += 1
        elif result == "skip":
            skip_count += 1
        else:
            fail_count += 1

    print()
    print(f"OK={ok_count} SKIP={skip_count} FAIL={fail_count}")
    print("PASS" if fail_count == 0 else "FAIL")
    return 0 if fail_count == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
