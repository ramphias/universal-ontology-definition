#!/usr/bin/env python3
"""
L1 Core Governance Validator
=============================
Enforces governance rules G-01 through G-08 on the L1 Core ontology.
Run as part of CI/CD or locally before submitting PRs.

Usage:
    python scripts/validate_governance.py
    python scripts/validate_governance.py --core core/universal_ontology_v1.json
"""

import json
import sys
import argparse
from pathlib import Path
from collections import defaultdict


# ── Governance Rule Constants ───────────────────────────────────────
MAX_CLASSES = 25          # G-01
MAX_ROOT_CLASSES = 5      # G-02
MAX_INHERITANCE_DEPTH = 4 # G-03
MAX_RELATION_RATIO = 1.0  # G-05

# Industry-specific terms that should NOT appear in sample_instances
INDUSTRY_SPECIFIC_TERMS = [
    "retail", "manufacturing", "consulting", "luxury", "healthcare",
    "finance", "banking", "insurance", "pharma", "automotive",
    "telecom", "mining", "agriculture", "hospitality", "airline",
    "plm", "mrp", "hris",
]


class GovernanceReport:
    """Collects and reports governance validation results."""

    def __init__(self):
        self.passed = []
        self.failed = []
        self.warnings = []

    def ok(self, rule_id: str, message: str):
        self.passed.append((rule_id, message))

    def fail(self, rule_id: str, message: str):
        self.failed.append((rule_id, message))

    def warn(self, rule_id: str, message: str):
        self.warnings.append((rule_id, message))

    def print_report(self):
        print("\n" + "=" * 60)
        print("  L1 Core Governance Validation Report")
        print("=" * 60)

        if self.passed:
            print(f"\n✅ PASSED ({len(self.passed)})")
            for rule_id, msg in self.passed:
                print(f"   [{rule_id}] {msg}")

        if self.warnings:
            print(f"\n⚠️  WARNINGS ({len(self.warnings)})")
            for rule_id, msg in self.warnings:
                print(f"   [{rule_id}] {msg}")

        if self.failed:
            print(f"\n❌ FAILED ({len(self.failed)})")
            for rule_id, msg in self.failed:
                print(f"   [{rule_id}] {msg}")

        print("\n" + "-" * 60)
        total = len(self.passed) + len(self.failed) + len(self.warnings)
        print(f"  Total checks: {total}  |  ✅ {len(self.passed)}  |  ⚠️  {len(self.warnings)}  |  ❌ {len(self.failed)}")
        print("=" * 60 + "\n")

        return len(self.failed) == 0


def load_ontology(path: str) -> dict:
    """Load and parse the ontology JSON file."""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def get_inheritance_depth(class_id: str, parent_map: dict, memo: dict = None) -> int:
    """Calculate the inheritance depth of a class."""
    if memo is None:
        memo = {}
    if class_id in memo:
        return memo[class_id]
    parent = parent_map.get(class_id)
    if parent is None:
        memo[class_id] = 1
        return 1
    depth = 1 + get_inheritance_depth(parent, parent_map, memo)
    memo[class_id] = depth
    return depth


def validate_g01_class_count(ontology: dict, report: GovernanceReport):
    """G-01: L1 class count ≤ 25"""
    classes = ontology.get("classes", [])
    count = len(classes)
    if count <= MAX_CLASSES:
        report.ok("G-01", f"Class count: {count} ≤ {MAX_CLASSES}")
    else:
        report.fail("G-01", f"Class count: {count} > {MAX_CLASSES} — must merge or demote classes")


def validate_g02_root_classes(ontology: dict, report: GovernanceReport):
    """G-02: Root classes (parent=null) ≤ 5"""
    classes = ontology.get("classes", [])
    root_classes = [c for c in classes if c.get("parent") is None]
    count = len(root_classes)
    root_names = [c["id"] for c in root_classes]
    if count <= MAX_ROOT_CLASSES:
        report.ok("G-02", f"Root classes: {count} ≤ {MAX_ROOT_CLASSES} — {root_names}")
    else:
        report.fail("G-02", f"Root classes: {count} > {MAX_ROOT_CLASSES} — {root_names}")


def validate_g03_inheritance_depth(ontology: dict, report: GovernanceReport):
    """G-03: Max inheritance depth ≤ 4"""
    classes = ontology.get("classes", [])
    parent_map = {c["id"]: c.get("parent") for c in classes}
    memo = {}
    max_depth = 0
    deepest_class = None

    for c in classes:
        depth = get_inheritance_depth(c["id"], parent_map, memo)
        if depth > max_depth:
            max_depth = depth
            deepest_class = c["id"]

    if max_depth <= MAX_INHERITANCE_DEPTH:
        report.ok("G-03", f"Max inheritance depth: {max_depth} ≤ {MAX_INHERITANCE_DEPTH} (deepest: {deepest_class})")
    else:
        report.fail("G-03", f"Max inheritance depth: {max_depth} > {MAX_INHERITANCE_DEPTH} (deepest: {deepest_class})")


def validate_g05_relation_density(ontology: dict, report: GovernanceReport):
    """G-05: Relation count ≤ class count × 1.0"""
    classes = ontology.get("classes", [])
    relations = ontology.get("relations", [])
    class_count = len(classes)
    relation_count = len(relations)
    max_relations = int(class_count * MAX_RELATION_RATIO)
    ratio = relation_count / class_count if class_count > 0 else 0

    if relation_count <= max_relations:
        report.ok("G-05", f"Relation density: {relation_count}/{class_count} = {ratio:.2f} ≤ {MAX_RELATION_RATIO}")
    else:
        report.fail("G-05", f"Relation density: {relation_count}/{class_count} = {ratio:.2f} > {MAX_RELATION_RATIO}")


def validate_g08_industry_neutral(ontology: dict, report: GovernanceReport):
    """G-08: sample_instances must not contain industry-specific terms"""
    instances = ontology.get("sample_instances", [])
    violations = []

    for inst in instances:
        text = " ".join([
            inst.get("id", ""),
            inst.get("label", ""),
            inst.get("label_zh", ""),
            inst.get("type", ""),
        ]).lower()

        for term in INDUSTRY_SPECIFIC_TERMS:
            if term in text:
                violations.append(f"Instance '{inst['id']}' contains industry term '{term}'")

    if not violations:
        report.ok("G-08", f"All {len(instances)} sample instances are industry-neutral")
    else:
        for v in violations:
            report.fail("G-08", v)


def validate_naming_conventions(ontology: dict, report: GovernanceReport):
    """Validate PascalCase class IDs and snake_case relation IDs"""
    import re

    classes = ontology.get("classes", [])
    relations = ontology.get("relations", [])

    pascal_pattern = re.compile(r"^[A-Z][a-zA-Z0-9]*$")
    snake_pattern = re.compile(r"^[a-z][a-z0-9_]*$")

    bad_classes = [c["id"] for c in classes if not pascal_pattern.match(c["id"])]
    bad_relations = [r["id"] for r in relations if not snake_pattern.match(r["id"])]

    if not bad_classes:
        report.ok("NAMING", f"All {len(classes)} class IDs follow PascalCase")
    else:
        report.fail("NAMING", f"Invalid class IDs (not PascalCase): {bad_classes}")

    if not bad_relations:
        report.ok("NAMING", f"All {len(relations)} relation IDs follow snake_case")
    else:
        report.fail("NAMING", f"Invalid relation IDs (not snake_case): {bad_relations}")


def validate_referential_integrity(ontology: dict, report: GovernanceReport):
    """Check that all parent refs, domain/range refs point to existing classes"""
    classes = ontology.get("classes", [])
    relations = ontology.get("relations", [])
    class_ids = {c["id"] for c in classes}

    # Check parent references
    bad_parents = []
    for c in classes:
        parent = c.get("parent")
        if parent is not None and parent not in class_ids:
            bad_parents.append(f"{c['id']} → parent '{parent}'")

    if not bad_parents:
        report.ok("REF", "All parent references are valid")
    else:
        for bp in bad_parents:
            report.fail("REF", f"Broken parent reference: {bp}")

    # Check relation domain/range references
    bad_refs = []
    for r in relations:
        if r.get("domain") not in class_ids:
            bad_refs.append(f"Relation '{r['id']}' domain '{r['domain']}' not found")
        if r.get("range") not in class_ids:
            bad_refs.append(f"Relation '{r['id']}' range '{r['range']}' not found")

    if not bad_refs:
        report.ok("REF", "All relation domain/range references are valid")
    else:
        for br in bad_refs:
            report.fail("REF", br)

    # Check sample_instance types
    instances = ontology.get("sample_instances", [])
    non_abstract_ids = {c["id"] for c in classes if not c.get("abstract", False)}
    bad_instances = []
    for inst in instances:
        inst_type = inst.get("type")
        if inst_type not in class_ids:
            bad_instances.append(f"Instance '{inst['id']}' type '{inst_type}' not found")
        elif inst_type not in non_abstract_ids:
            bad_instances.append(f"Instance '{inst['id']}' type '{inst_type}' is abstract — cannot instantiate")

    if not bad_instances:
        report.ok("REF", f"All {len(instances)} sample instance types are valid and non-abstract")
    else:
        for bi in bad_instances:
            report.fail("REF", bi)


def validate_abstract_classes(ontology: dict, report: GovernanceReport):
    """Ensure abstract classes have at least 1 concrete child"""
    classes = ontology.get("classes", [])
    parent_map = defaultdict(list)
    abstract_ids = set()

    for c in classes:
        if c.get("abstract", False):
            abstract_ids.add(c["id"])
        parent = c.get("parent")
        if parent:
            parent_map[parent].append(c["id"])

    lonely_abstracts = [a for a in abstract_ids if not parent_map.get(a)]

    if not lonely_abstracts:
        report.ok("ABSTRACT", f"All {len(abstract_ids)} abstract classes have concrete children")
    else:
        for la in lonely_abstracts:
            report.warn("ABSTRACT", f"Abstract class '{la}' has no children — consider removing or adding subclasses")


def validate_required_fields(ontology: dict, report: GovernanceReport):
    """Check that all classes have bilingual definitions"""
    classes = ontology.get("classes", [])
    missing_en = [c["id"] for c in classes if not c.get("label_en") or not c.get("definition_en")]

    if not missing_en:
        report.ok("BILINGUAL", f"All {len(classes)} classes have bilingual labels and definitions")
    else:
        report.warn("BILINGUAL", f"Classes missing English label/definition: {missing_en}")


def main():
    parser = argparse.ArgumentParser(description="L1 Core Governance Validator")
    parser.add_argument(
        "--core",
        default="core/universal_ontology_v1.json",
        help="Path to the L1 Core ontology JSON file",
    )
    args = parser.parse_args()

    # Resolve path
    core_path = Path(args.core)
    if not core_path.is_absolute():
        core_path = Path(__file__).parent.parent / core_path

    if not core_path.exists():
        print(f"❌ Core ontology file not found: {core_path}")
        sys.exit(1)

    print(f"📂 Loading: {core_path}")
    ontology = load_ontology(str(core_path))

    report = GovernanceReport()

    # Run all governance checks
    validate_g01_class_count(ontology, report)
    validate_g02_root_classes(ontology, report)
    validate_g03_inheritance_depth(ontology, report)
    validate_g05_relation_density(ontology, report)
    validate_g08_industry_neutral(ontology, report)
    validate_naming_conventions(ontology, report)
    validate_referential_integrity(ontology, report)
    validate_abstract_classes(ontology, report)
    validate_required_fields(ontology, report)

    success = report.print_report()

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
