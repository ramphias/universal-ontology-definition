#!/usr/bin/env python3
r"""
check_docs_sync.py — Detect drift between docs-site Markdown and ontology JSON.

Phase 2 / v1 scope:

1. **Count claims**: For each bound (doc_file, ontology_file) pair, scan the
   Markdown for statements like `All 24 classes`, `13 standard relations`,
   `18 axioms`, `5 sample instances`, and verify the number against the
   counted entries in the bound ontology. Qualifiers `abstract`, `concrete`,
   `leaf`, `core`, `universal`, `standard`, `sample` are recognized.

2. **Reference existence**: For each bound pair, extract IDs from Markdown
   table rows of the form `| **ID** | \`Foo\` |` and confirm each ID exists
   in *some* collection (classes / relations / axioms / sample_instances) of
   the bound ontology — glossary pages legitimately mix kinds in the same
   file, so a class- or relation- or axiom-id is all acceptable.

Both checks output `file:line` failures to stderr. Exit code is 0 when no
drift is found, 1 otherwise.
"""

import io
import json
import re
import sys
from pathlib import Path

if sys.stdout.encoding != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
if sys.stderr.encoding != "utf-8":
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent

# kind ∈ {"classes", "relations", "axioms", "instances"} — the canonical ID
# bucket the doc page describes. The script only verifies counts for the
# doc's primary kind, plus IDs whose category we can detect from table
# context. Multi-target pages (e.g. glossary/index.md) are not bound here;
# add narrower bindings as drift surfaces.
BINDINGS = [
    # L1 reference pages
    ("docs-site/l1-core/classes.md",       "l1-core/universal_ontology_v1.json", "classes"),
    ("docs-site/l1-core/relations.md",     "l1-core/universal_ontology_v1.json", "relations"),
    ("docs-site/l1-core/axioms.md",        "l1-core/universal_ontology_v1.json", "axioms"),
    ("docs-site/l1-core/instances.md",     "l1-core/universal_ontology_v1.json", "instances"),
    ("docs-site/l1-core/index.md",         "l1-core/universal_ontology_v1.json", "classes"),
    # L1 glossary pages
    ("docs-site/glossary/l1-classes.md",   "l1-core/universal_ontology_v1.json", "classes"),
    ("docs-site/glossary/l1-relations.md", "l1-core/universal_ontology_v1.json", "relations"),
    ("docs-site/glossary/l1-axioms.md",    "l1-core/universal_ontology_v1.json", "axioms"),
    # L2 per-extension pages (per-ontology)
    ("docs-site/l2-extensions/consulting.md",        "l2-extensions/consulting/consulting_extension_v1.json", "classes"),
    ("docs-site/l2-extensions/financial-services.md","l2-extensions/financial-services/financial_services_extension_v1.json", "classes"),
    ("docs-site/l2-extensions/fnb.md",               "l2-extensions/fnb/fnb_industry_extension_v1.json", "classes"),
    ("docs-site/l2-extensions/healthcare.md",        "l2-extensions/healthcare/healthcare_extension_v1.json", "classes"),
    ("docs-site/l2-extensions/luxury-goods.md",      "l2-extensions/luxury-goods/luxury_goods_extension_v1.json", "classes"),
    ("docs-site/l2-extensions/manufacturing.md",     "l2-extensions/manufacturing/manufacturing_extension_v1.json", "classes"),
    ("docs-site/l2-extensions/technology.md",        "l2-extensions/technology/technology_extension_v1.json", "classes"),
    # L2 glossary pages
    ("docs-site/glossary/l2-consulting.md",         "l2-extensions/consulting/consulting_extension_v1.json", "classes"),
    ("docs-site/glossary/l2-financial-services.md", "l2-extensions/financial-services/financial_services_extension_v1.json", "classes"),
    ("docs-site/glossary/l2-fnb.md",                "l2-extensions/fnb/fnb_industry_extension_v1.json", "classes"),
    ("docs-site/glossary/l2-healthcare.md",         "l2-extensions/healthcare/healthcare_extension_v1.json", "classes"),
    ("docs-site/glossary/l2-luxury-goods.md",       "l2-extensions/luxury-goods/luxury_goods_extension_v1.json", "classes"),
    ("docs-site/glossary/l2-manufacturing.md",      "l2-extensions/manufacturing/manufacturing_extension_v1.json", "classes"),
    ("docs-site/glossary/l2-technology.md",         "l2-extensions/technology/technology_extension_v1.json", "classes"),
]


def count_buckets(ontology: dict) -> dict:
    """Return {kind: {qualifier: count}} buckets the count-claim regex maps to."""
    classes = ontology.get("classes", [])
    abstract = sum(1 for c in classes if c.get("abstract"))
    concrete = len(classes) - abstract
    return {
        "classes": {
            None: len(classes),
            "abstract": abstract,
            "concrete": concrete,
            "leaf": concrete,
            "core": len(classes),
            "universal": len(classes),
            "standard": len(classes),
        },
        "relations": {
            None: len(ontology.get("relations", [])),
            "core": len(ontology.get("relations", [])),
            "standard": len(ontology.get("relations", [])),
            "universal": len(ontology.get("relations", [])),
        },
        "axioms": {
            None: len(ontology.get("axioms", [])),
            "core": len(ontology.get("axioms", [])),
        },
        "instances": {
            None: len(ontology.get("sample_instances", [])),
            "sample": len(ontology.get("sample_instances", [])),
            "example": len(ontology.get("sample_instances", [])),
        },
    }


# Match e.g. "All 24 core classes", "18 abstract classes", "13 standard relations"
# Captures: (number, qualifier-or-empty, kind-singular-or-plural)
COUNT_RE = re.compile(
    r"\b(\d+)\s+(?:(abstract|concrete|leaf|core|universal|standard|sample|example)\s+)?"
    r"(classes|relations|axioms|instances)\b",
    re.IGNORECASE,
)


def extract_count_claims(md_text: str):
    """Yield (line_no, number, qualifier_lower_or_None, kind) for each match."""
    for line_no, line in enumerate(md_text.splitlines(), start=1):
        # Skip code fences/inline code so JSON examples don't trigger.
        for m in COUNT_RE.finditer(line):
            num = int(m.group(1))
            qual = m.group(2).lower() if m.group(2) else None
            kind = m.group(3).lower()
            kind = kind.rstrip("e") + "es" if kind in ("classe", "relation", "axiom", "instance") else kind
            # Normalize plural
            if kind == "instance":
                kind = "instances"
            elif kind == "axiom":
                kind = "axioms"
            elif kind == "relation":
                kind = "relations"
            elif kind == "class":
                kind = "classes"
            yield (line_no, num, qual, kind)


# Match e.g. `| **ID** | \`Foo\` |` — captures the backticked id.
ID_ROW_RE = re.compile(r"\|\s*\*\*ID\*\*\s*\|\s*`([^`]+)`\s*\|", re.IGNORECASE)


def extract_id_claims(md_text: str):
    r"""Yield (line_no, id_string) for each `| **ID** | \`X\` |` row."""
    for line_no, line in enumerate(md_text.splitlines(), start=1):
        m = ID_ROW_RE.search(line)
        if m:
            yield (line_no, m.group(1).strip())


def existing_ids(ontology: dict) -> dict:
    """Return {kind: set(ids)} for fast existence checks."""
    return {
        "classes": {c.get("id") for c in ontology.get("classes", []) if c.get("id")},
        "relations": {r.get("id") for r in ontology.get("relations", []) if r.get("id")},
        "axioms": {a.get("id") for a in ontology.get("axioms", []) if a.get("id")},
        "instances": {i.get("id") for i in ontology.get("sample_instances", []) if i.get("id")},
    }


def check_binding(doc_path: Path, ontology_path: Path, primary_kind: str) -> list:
    """Validate one (doc, ontology, kind) binding. Returns a list of failure strings."""
    failures = []
    if not doc_path.exists():
        return [f"{doc_path}: doc file missing"]
    if not ontology_path.exists():
        return [f"{ontology_path}: ontology file missing"]

    md = doc_path.read_text(encoding="utf-8")
    onto = json.loads(ontology_path.read_text(encoding="utf-8"))
    buckets = count_buckets(onto)
    ids = existing_ids(onto)

    # 1) Count claims
    for line_no, num, qual, kind in extract_count_claims(md):
        bucket = buckets.get(kind, {})
        expected = bucket.get(qual, bucket.get(None))
        if expected is None:
            continue  # unknown qualifier — skip
        if num != expected:
            qual_str = f"{qual} " if qual else ""
            failures.append(
                f"{doc_path}:{line_no}: count drift — claims {num} {qual_str}{kind}, "
                f"ontology has {expected} (in {ontology_path.name})"
            )

    # 2) ID references — accept the id if it exists in *any* collection of
    # the bound ontology. Glossary pages mix classes/relations/axioms in
    # `### Heading` blocks with the same `**ID**` row format, so we can't
    # tell from row context alone which kind is being claimed.
    all_ids = set().union(*ids.values()) if ids else set()
    for line_no, ref_id in extract_id_claims(md):
        if ref_id not in all_ids:
            failures.append(
                f"{doc_path}:{line_no}: unknown id `{ref_id}` "
                f"(not in any collection of {ontology_path.name})"
            )

    return failures


def main() -> int:
    all_failures = []
    checked = 0
    for doc_rel, onto_rel, kind in BINDINGS:
        doc = ROOT / doc_rel
        onto = ROOT / onto_rel
        fails = check_binding(doc, onto, kind)
        all_failures.extend(fails)
        checked += 1

    if all_failures:
        print(f"check_docs_sync: {len(all_failures)} drift(s) across {checked} bindings", file=sys.stderr)
        for line in all_failures:
            print(f"  {line}", file=sys.stderr)
        return 1

    print(f"check_docs_sync: PASS ({checked} bindings, no drift)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
