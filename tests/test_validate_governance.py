"""Tests for scripts/validate_governance.py"""

import sys
import copy
import pytest
from pathlib import Path

# Add scripts to path
sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))

from validate_governance import (
    GovernanceReport,
    get_inheritance_depth,
    validate_g01_class_count,
    validate_g02_root_classes,
    validate_g03_inheritance_depth,
    validate_g05_relation_density,
    validate_g08_industry_neutral,
    validate_naming_conventions,
    validate_referential_integrity,
    validate_abstract_classes,
    validate_required_fields,
    validate_axioms,
    MAX_CLASSES,
    MAX_ROOT_CLASSES,
    MAX_INHERITANCE_DEPTH,
)


# ─── GovernanceReport ────────────────────────────────────────────────────────


class TestGovernanceReport:
    def test_empty_report_passes(self):
        r = GovernanceReport()
        assert r.print_report() is True

    def test_report_with_failure(self):
        r = GovernanceReport()
        r.fail("G-01", "Too many classes")
        assert r.print_report() is False

    def test_report_with_only_warnings_passes(self):
        r = GovernanceReport()
        r.ok("G-01", "ok")
        r.warn("G-02", "warning")
        assert r.print_report() is True

    def test_report_counts(self):
        r = GovernanceReport()
        r.ok("A", "a")
        r.ok("B", "b")
        r.warn("C", "c")
        r.fail("D", "d")
        assert len(r.passed) == 2
        assert len(r.warnings) == 1
        assert len(r.failed) == 1


# ─── G-01: Class Count ──────────────────────────────────────────────────────


class TestG01ClassCount:
    def test_pass_under_limit(self, minimal_ontology):
        r = GovernanceReport()
        validate_g01_class_count(minimal_ontology, r)
        assert len(r.failed) == 0
        assert len(r.passed) == 1

    def test_pass_at_limit(self):
        classes = [{"id": f"Class{i}", "label_zh": "x", "definition": "x"} for i in range(MAX_CLASSES)]
        r = GovernanceReport()
        validate_g01_class_count({"classes": classes}, r)
        assert len(r.failed) == 0

    def test_fail_over_limit(self):
        classes = [{"id": f"Class{i}", "label_zh": "x", "definition": "x"} for i in range(MAX_CLASSES + 1)]
        r = GovernanceReport()
        validate_g01_class_count({"classes": classes}, r)
        assert len(r.failed) == 1
        assert "G-01" in r.failed[0][0]

    def test_empty_classes(self):
        r = GovernanceReport()
        validate_g01_class_count({"classes": []}, r)
        assert len(r.failed) == 0

    def test_real_core_passes(self, core_ontology):
        r = GovernanceReport()
        validate_g01_class_count(core_ontology, r)
        assert len(r.failed) == 0


# ─── G-02: Root Classes ─────────────────────────────────────────────────────


class TestG02RootClasses:
    def test_pass_under_limit(self, minimal_ontology):
        r = GovernanceReport()
        validate_g02_root_classes(minimal_ontology, r)
        assert len(r.failed) == 0

    def test_pass_at_limit(self):
        classes = [{"id": f"Root{i}", "parent": None} for i in range(MAX_ROOT_CLASSES)]
        r = GovernanceReport()
        validate_g02_root_classes({"classes": classes}, r)
        assert len(r.failed) == 0

    def test_fail_over_limit(self):
        classes = [{"id": f"Root{i}", "parent": None} for i in range(MAX_ROOT_CLASSES + 1)]
        r = GovernanceReport()
        validate_g02_root_classes({"classes": classes}, r)
        assert len(r.failed) == 1
        assert "G-02" in r.failed[0][0]

    def test_non_root_classes_not_counted(self):
        classes = [
            {"id": "Root", "parent": None},
            {"id": "Child1", "parent": "Root"},
            {"id": "Child2", "parent": "Root"},
        ]
        r = GovernanceReport()
        validate_g02_root_classes({"classes": classes}, r)
        assert len(r.failed) == 0

    def test_real_core_passes(self, core_ontology):
        r = GovernanceReport()
        validate_g02_root_classes(core_ontology, r)
        assert len(r.failed) == 0


# ─── G-03: Inheritance Depth ────────────────────────────────────────────────


class TestG03InheritanceDepth:
    def test_depth_calculation_root(self):
        parent_map = {"A": None}
        assert get_inheritance_depth("A", parent_map) == 1

    def test_depth_calculation_chain(self):
        parent_map = {"A": None, "B": "A", "C": "B", "D": "C"}
        assert get_inheritance_depth("D", parent_map) == 4
        assert get_inheritance_depth("C", parent_map) == 3
        assert get_inheritance_depth("B", parent_map) == 2

    def test_depth_uses_memo(self):
        parent_map = {"A": None, "B": "A", "C": "B"}
        memo = {}
        get_inheritance_depth("C", parent_map, memo)
        assert memo == {"A": 1, "B": 2, "C": 3}

    def test_pass_at_max_depth(self):
        # Build chain of exactly MAX_INHERITANCE_DEPTH
        classes = [{"id": "L0", "parent": None}]
        for i in range(1, MAX_INHERITANCE_DEPTH):
            classes.append({"id": f"L{i}", "parent": f"L{i-1}"})
        r = GovernanceReport()
        validate_g03_inheritance_depth({"classes": classes}, r)
        assert len(r.failed) == 0

    def test_fail_over_max_depth(self):
        classes = [{"id": "L0", "parent": None}]
        for i in range(1, MAX_INHERITANCE_DEPTH + 1):
            classes.append({"id": f"L{i}", "parent": f"L{i-1}"})
        r = GovernanceReport()
        validate_g03_inheritance_depth({"classes": classes}, r)
        assert len(r.failed) == 1
        assert "G-03" in r.failed[0][0]

    def test_real_core_passes(self, core_ontology):
        r = GovernanceReport()
        validate_g03_inheritance_depth(core_ontology, r)
        assert len(r.failed) == 0


# ─── G-05: Relation Density ─────────────────────────────────────────────────


class TestG05RelationDensity:
    def test_pass_low_density(self, minimal_ontology):
        r = GovernanceReport()
        validate_g05_relation_density(minimal_ontology, r)
        assert len(r.failed) == 0

    def test_pass_at_ratio_limit(self):
        classes = [{"id": f"C{i}"} for i in range(10)]
        relations = [{"id": f"r{i}"} for i in range(10)]
        r = GovernanceReport()
        validate_g05_relation_density({"classes": classes, "relations": relations}, r)
        assert len(r.failed) == 0

    def test_fail_over_ratio(self):
        classes = [{"id": f"C{i}"} for i in range(5)]
        relations = [{"id": f"r{i}"} for i in range(6)]
        r = GovernanceReport()
        validate_g05_relation_density({"classes": classes, "relations": relations}, r)
        assert len(r.failed) == 1

    def test_real_core_passes(self, core_ontology):
        r = GovernanceReport()
        validate_g05_relation_density(core_ontology, r)
        assert len(r.failed) == 0


# ─── G-08: Industry Neutral ─────────────────────────────────────────────────


class TestG08IndustryNeutral:
    def test_pass_neutral_instances(self, minimal_ontology):
        r = GovernanceReport()
        validate_g08_industry_neutral(minimal_ontology, r)
        assert len(r.failed) == 0

    def test_fail_industry_term_in_id(self):
        ontology = {
            "sample_instances": [
                {"id": "retail_store", "type": "Party", "label": "Store", "label_zh": ""},
            ]
        }
        r = GovernanceReport()
        validate_g08_industry_neutral(ontology, r)
        assert len(r.failed) == 1
        assert "retail" in r.failed[0][1]

    def test_fail_industry_term_in_label(self):
        ontology = {
            "sample_instances": [
                {"id": "sample_1", "type": "Party", "label": "Banking Corp", "label_zh": ""},
            ]
        }
        r = GovernanceReport()
        validate_g08_industry_neutral(ontology, r)
        assert len(r.failed) == 1

    def test_pass_no_instances(self):
        r = GovernanceReport()
        validate_g08_industry_neutral({"sample_instances": []}, r)
        assert len(r.failed) == 0

    def test_real_core_passes(self, core_ontology):
        r = GovernanceReport()
        validate_g08_industry_neutral(core_ontology, r)
        assert len(r.failed) == 0


# ─── Naming Conventions ─────────────────────────────────────────────────────


class TestNamingConventions:
    def test_pass_correct_naming(self, minimal_ontology):
        r = GovernanceReport()
        validate_naming_conventions(minimal_ontology, r)
        assert len(r.failed) == 0

    def test_fail_class_not_pascal(self):
        ontology = {
            "classes": [{"id": "bad_name"}],
            "relations": [],
        }
        r = GovernanceReport()
        validate_naming_conventions(ontology, r)
        assert len(r.failed) == 1
        assert "NAMING" in r.failed[0][0]

    def test_fail_relation_not_snake(self):
        ontology = {
            "classes": [],
            "relations": [{"id": "BadRelation"}],
        }
        r = GovernanceReport()
        validate_naming_conventions(ontology, r)
        assert len(r.failed) == 1

    def test_real_core_passes(self, core_ontology):
        r = GovernanceReport()
        validate_naming_conventions(core_ontology, r)
        assert len(r.failed) == 0


# ─── Referential Integrity ──────────────────────────────────────────────────


class TestReferentialIntegrity:
    def test_pass_valid_refs(self, minimal_ontology):
        r = GovernanceReport()
        validate_referential_integrity(minimal_ontology, r)
        assert len(r.failed) == 0

    def test_fail_broken_parent(self):
        ontology = {
            "classes": [
                {"id": "Child", "parent": "NonExistent"},
            ],
            "relations": [],
            "sample_instances": [],
        }
        r = GovernanceReport()
        validate_referential_integrity(ontology, r)
        assert len(r.failed) >= 1
        assert any("parent" in f[1].lower() for f in r.failed)

    def test_fail_broken_relation_domain(self):
        ontology = {
            "classes": [{"id": "A", "parent": None}],
            "relations": [{"id": "r1", "domain": "Missing", "range": "A"}],
            "sample_instances": [],
        }
        r = GovernanceReport()
        validate_referential_integrity(ontology, r)
        assert len(r.failed) >= 1
        assert any("domain" in f[1].lower() for f in r.failed)

    def test_fail_broken_relation_range(self):
        ontology = {
            "classes": [{"id": "A", "parent": None}],
            "relations": [{"id": "r1", "domain": "A", "range": "Missing"}],
            "sample_instances": [],
        }
        r = GovernanceReport()
        validate_referential_integrity(ontology, r)
        assert len(r.failed) >= 1
        assert any("range" in f[1].lower() for f in r.failed)

    def test_fail_instance_type_abstract(self):
        ontology = {
            "classes": [
                {"id": "Abstract", "parent": None, "abstract": True},
                {"id": "Concrete", "parent": "Abstract", "abstract": False},
            ],
            "relations": [],
            "sample_instances": [
                {"id": "inst1", "type": "Abstract"},
            ],
        }
        r = GovernanceReport()
        validate_referential_integrity(ontology, r)
        assert len(r.failed) >= 1
        assert any("abstract" in f[1].lower() for f in r.failed)

    def test_fail_instance_type_missing(self):
        ontology = {
            "classes": [{"id": "A", "parent": None}],
            "relations": [],
            "sample_instances": [{"id": "inst1", "type": "NonExistent"}],
        }
        r = GovernanceReport()
        validate_referential_integrity(ontology, r)
        assert len(r.failed) >= 1

    def test_real_core_passes(self, core_ontology):
        r = GovernanceReport()
        validate_referential_integrity(core_ontology, r)
        assert len(r.failed) == 0


# ─── Abstract Classes ────────────────────────────────────────────────────────


class TestAbstractClasses:
    def test_pass_abstract_with_children(self, minimal_ontology):
        r = GovernanceReport()
        validate_abstract_classes(minimal_ontology, r)
        assert len(r.warnings) == 0

    def test_warn_abstract_without_children(self):
        ontology = {
            "classes": [
                {"id": "Lonely", "parent": None, "abstract": True},
            ]
        }
        r = GovernanceReport()
        validate_abstract_classes(ontology, r)
        assert len(r.warnings) == 1
        assert "Lonely" in r.warnings[0][1]

    def test_no_abstract_classes(self):
        ontology = {
            "classes": [
                {"id": "A", "parent": None, "abstract": False},
            ]
        }
        r = GovernanceReport()
        validate_abstract_classes(ontology, r)
        assert len(r.warnings) == 0

    def test_real_core_passes(self, core_ontology):
        r = GovernanceReport()
        validate_abstract_classes(core_ontology, r)
        assert len(r.warnings) == 0


# ─── Required Fields (Bilingual) ────────────────────────────────────────────


class TestRequiredFields:
    def test_pass_with_bilingual(self, minimal_ontology):
        r = GovernanceReport()
        validate_required_fields(minimal_ontology, r)
        assert len(r.warnings) == 0

    def test_warn_missing_english(self):
        ontology = {
            "classes": [
                {"id": "Test", "label_zh": "测试", "definition": "定义"},
            ]
        }
        r = GovernanceReport()
        validate_required_fields(ontology, r)
        assert len(r.warnings) == 1


# ─── Axiom Validation ───────────────────────────────────────────────────────


class TestAxiomValidation:
    def test_pass_no_axioms(self, minimal_ontology):
        r = GovernanceReport()
        validate_axioms(minimal_ontology, r)
        assert len(r.failed) == 0

    def test_pass_valid_disjoint_axiom(self):
        ontology = {
            "classes": [
                {"id": "A", "parent": None},
                {"id": "B", "parent": None},
            ],
            "relations": [],
            "deprecated_relations": [],
            "axioms": [
                {
                    "id": "ax_disjoint_ab",
                    "type": "disjoint",
                    "classes": ["A", "B"],
                    "definition": "互斥",
                    "definition_en": "A and B are disjoint",
                }
            ],
        }
        r = GovernanceReport()
        validate_axioms(ontology, r)
        assert len(r.failed) == 0

    def test_fail_bad_axiom_naming(self):
        ontology = {
            "classes": [{"id": "A"}],
            "relations": [],
            "deprecated_relations": [],
            "axioms": [
                {
                    "id": "BadName",
                    "type": "disjoint",
                    "classes": ["A"],
                    "definition": "d",
                    "definition_en": "d",
                }
            ],
        }
        r = GovernanceReport()
        validate_axioms(ontology, r)
        assert any("AXIOM" in f[0] for f in r.failed)

    def test_fail_axiom_references_unknown_class(self):
        ontology = {
            "classes": [{"id": "A"}],
            "relations": [],
            "deprecated_relations": [],
            "axioms": [
                {
                    "id": "ax_bad_ref",
                    "type": "disjoint",
                    "classes": ["A", "NonExistent"],
                    "definition": "d",
                    "definition_en": "d",
                }
            ],
        }
        r = GovernanceReport()
        validate_axioms(ontology, r)
        assert any("NonExistent" in f[1] for f in r.failed)

    def test_real_core_passes(self, core_ontology):
        r = GovernanceReport()
        validate_axioms(core_ontology, r)
        assert len(r.failed) == 0


# ─── Full Validation on Real Core ────────────────────────────────────────────


class TestFullCoreValidation:
    """Integration test: run all governance checks on the actual L1 Core."""

    def test_all_rules_pass(self, core_ontology):
        r = GovernanceReport()
        validate_g01_class_count(core_ontology, r)
        validate_g02_root_classes(core_ontology, r)
        validate_g03_inheritance_depth(core_ontology, r)
        validate_g05_relation_density(core_ontology, r)
        validate_g08_industry_neutral(core_ontology, r)
        validate_naming_conventions(core_ontology, r)
        validate_referential_integrity(core_ontology, r)
        validate_abstract_classes(core_ontology, r)
        validate_required_fields(core_ontology, r)
        validate_axioms(core_ontology, r)
        assert len(r.failed) == 0, f"Governance failures: {r.failed}"
