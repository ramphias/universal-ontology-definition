#!/usr/bin/env python3
"""
diff_ontology.py — Ontology Structural Diff
=============================================
Compares two ontology JSON files (or two git revisions of the same file)
and produces a structured change report.

Usage:
    python scripts/diff_ontology.py old.json new.json
    python scripts/diff_ontology.py HEAD~1 HEAD -- path/to/ontology.json
    python scripts/diff_ontology.py --git HEAD~3 -- private_enterprise/deloitte-china-consulting/deloitte_china_consulting_ontology_v1.json
"""

import json
import sys
import io
import subprocess
import argparse
from pathlib import Path

if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')


def load_json(path_or_ref, git_file=None):
    """Load JSON from file path or git ref."""
    if git_file:
        try:
            content = subprocess.check_output(
                ["git", "show", f"{path_or_ref}:{git_file}"],
                stderr=subprocess.PIPE
            ).decode("utf-8")
            return json.loads(content)
        except subprocess.CalledProcessError:
            print(f"  [ERROR] Cannot read {git_file} at git ref '{path_or_ref}'")
            sys.exit(1)
    else:
        with open(path_or_ref, "r", encoding="utf-8") as f:
            return json.load(f)


def diff_list(old_items, new_items, key="id"):
    """Diff two lists of dicts by a key field. Returns (added, removed, modified, unchanged)."""
    old_map = {item[key]: item for item in old_items}
    new_map = {item[key]: item for item in new_items}
    old_keys = set(old_map.keys())
    new_keys = set(new_map.keys())

    added = sorted(new_keys - old_keys)
    removed = sorted(old_keys - new_keys)
    common = old_keys & new_keys

    modified = []
    unchanged = []
    for k in sorted(common):
        if json.dumps(old_map[k], sort_keys=True) != json.dumps(new_map[k], sort_keys=True):
            # Find which fields changed
            changes = []
            all_fields = set(old_map[k].keys()) | set(new_map[k].keys())
            for field in sorted(all_fields):
                ov = old_map[k].get(field)
                nv = new_map[k].get(field)
                if ov != nv:
                    changes.append((field, ov, nv))
            modified.append((k, changes))
        else:
            unchanged.append(k)

    return added, removed, modified, unchanged, old_map, new_map


def format_value(v, max_len=50):
    """Format a value for display, truncating if needed."""
    s = json.dumps(v, ensure_ascii=False) if not isinstance(v, str) else v
    return s[:max_len] + "..." if len(s) > max_len else s


def diff_ontology(old_data, new_data):
    """Compare two ontology dicts and print a structured report."""
    sections = [
        ("Classes",          "classes",          "id"),
        ("Relations",        "relations",        "id"),
        ("Attributes",       "attributes",       "id"),
        ("Axioms",           "axioms",           "id"),
        ("Sample Instances", "sample_instances", "id"),
    ]

    total_added = total_removed = total_modified = 0

    print(f"\n{'='*60}")
    print(f"  Ontology Diff Report")
    print(f"{'='*60}")

    # Metadata diff
    old_ver = old_data.get("version", "?")
    new_ver = new_data.get("version", "?")
    if old_ver != new_ver:
        print(f"\n  Version: {old_ver} -> {new_ver}")

    for section_name, key, id_field in sections:
        old_items = old_data.get(key, [])
        new_items = new_data.get(key, [])

        if not old_items and not new_items:
            continue

        added, removed, modified, unchanged, old_map, new_map = diff_list(old_items, new_items, id_field)

        if not added and not removed and not modified:
            continue

        total_added += len(added)
        total_removed += len(removed)
        total_modified += len(modified)

        print(f"\n  {section_name} ({len(old_items)} -> {len(new_items)})")
        print(f"  {'-'*40}")

        if added:
            for a in added:
                label = new_map[a].get("label_en") or new_map[a].get("label_zh") or new_map[a].get("label", "")
                print(f"    + {a}" + (f"  ({label})" if label else ""))

        if removed:
            for r in removed:
                label = old_map[r].get("label_en") or old_map[r].get("label_zh") or old_map[r].get("label", "")
                print(f"    - {r}" + (f"  ({label})" if label else ""))

        if modified:
            for mid, changes in modified:
                print(f"    ~ {mid}")
                for field, ov, nv in changes:
                    if field in ("_note", "source_layer"):
                        continue
                    print(f"        {field}: {format_value(ov)} -> {format_value(nv)}")

    print(f"\n  {'='*40}")
    print(f"  Summary: +{total_added} added, -{total_removed} removed, ~{total_modified} modified")
    print(f"{'='*60}\n")

    return total_added + total_removed + total_modified  # 0 = no changes


def main():
    parser = argparse.ArgumentParser(description="Compare two ontology JSON files or git revisions")
    parser.add_argument("old", help="Old file path or git ref (e.g., HEAD~1)")
    parser.add_argument("new", nargs="?", help="New file path or git ref (e.g., HEAD)")
    parser.add_argument("--git", action="store_true", help="Interpret old/new as git refs")
    parser.add_argument("file", nargs="?", help="File path (when using git refs, after --)")
    args, remaining = parser.parse_known_args()

    # Handle "-- filepath" syntax
    git_file = None
    if "--" in sys.argv:
        idx = sys.argv.index("--")
        if idx + 1 < len(sys.argv):
            git_file = sys.argv[idx + 1]

    if args.git or git_file:
        if not git_file:
            print("Usage: diff_ontology.py --git REF1 REF2 -- path/to/file.json")
            sys.exit(1)
        old_ref = args.old
        new_ref = args.new or "HEAD"
        old_data = load_json(old_ref, git_file)
        new_data = load_json(new_ref, git_file)
        print(f"  Comparing {git_file}")
        print(f"  {old_ref} vs {new_ref}")
    else:
        old_data = load_json(args.old)
        new_data = load_json(args.new)
        print(f"  Comparing:")
        print(f"    OLD: {args.old}")
        print(f"    NEW: {args.new}")

    changes = diff_ontology(old_data, new_data)
    sys.exit(0 if changes else 0)


if __name__ == "__main__":
    main()
