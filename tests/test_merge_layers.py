"""Tests for scripts/merge_layers.py"""

import sys
import json
import os
import tempfile
import pytest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))

from merge_layers import (
    detect_project_root,
    build_layer_index,
    normalize_layer_ref,
    merge_layers,
    validate_merged,
    _to_snake,
    generate_merged_json,
    generate_merged_jsonld,
    generate_merged_graphql,
    generate_merged_sql,
)


# ─── PascalCase to snake_case ────────────────────────────────────────────────


class TestToSnake:
    def test_simple(self):
        assert _to_snake("Party") == "party"

    def test_two_words(self):
        assert _to_snake("OrgUnit") == "org_unit"

    def test_multi_word(self):
        assert _to_snake("ProductService") == "product_service"

    def test_all_caps_start(self):
        assert _to_snake("KPI") == "k_p_i"

    def test_single_char(self):
        assert _to_snake("A") == "a"

    def test_already_lowercase(self):
        assert _to_snake("entity") == "entity"

    def test_system_application(self):
        assert _to_snake("SystemApplication") == "system_application"


# ─── Layer Index ─────────────────────────────────────────────────────────────


class TestBuildLayerIndex:
    def test_finds_core(self, project_root):
        index = build_layer_index(project_root)
        assert any("L1" in k for k in index)

    def test_index_values_are_file_paths(self, project_root):
        index = build_layer_index(project_root)
        for layer_id, fpath in index.items():
            assert os.path.isfile(fpath), f"{fpath} does not exist for {layer_id}"


class TestNormalizeLayerRef:
    def test_exact_match(self):
        index = {"L1_universal_organization_ontology": "/path"}
        assert normalize_layer_ref("L1_universal_organization_ontology", index) == "L1_universal_organization_ontology"

    def test_versioned_match(self):
        index = {"L1_universal_organization_ontology": "/path"}
        result = normalize_layer_ref("L1_universal_organization_ontology_v2", index)
        assert result == "L1_universal_organization_ontology"

    def test_no_match_returns_none(self):
        index = {"L1_universal_organization_ontology": "/path"}
        result = normalize_layer_ref("completely_different", index)
        assert result is None


# ─── Merge Logic ─────────────────────────────────────────────────────────────


def _make_layer(layer_id, classes, relations=None, axioms=None, instances=None, attributes=None):
    """Helper to create a layer tuple for merge_layers()."""
    data = {
        "metadata": {"name": f"Test {layer_id}"},
        "classes": classes,
        "attributes": attributes or [],
        "relations": relations or [],
        "axioms": axioms or [],
        "migration_registry": [],
        "sample_instances": instances or [],
    }
    return (layer_id, f"/fake/{layer_id}.json", data)


class TestMergeLayers:
    def test_single_layer(self):
        layers = [_make_layer("L1", [
            {"id": "Entity", "parent": None, "abstract": True},
        ])]
        merged = merge_layers(layers)
        assert len(merged["classes"]) == 1
        assert merged["classes"][0]["source_layer"] == "L1"
        assert "L1" in merged["metadata"]["layers_merged"]

    def test_two_layers_merge(self):
        l1 = _make_layer("L1", [
            {"id": "Entity", "parent": None, "abstract": True},
        ])
        l2 = _make_layer("L2", [
            {"id": "Widget", "parent": "Entity", "abstract": False},
        ])
        merged = merge_layers([l1, l2])
        assert len(merged["classes"]) == 2
        ids = {c["id"] for c in merged["classes"]}
        assert ids == {"Entity", "Widget"}

    def test_duplicate_class_id_exits(self):
        l1 = _make_layer("L1", [{"id": "Entity", "parent": None}])
        l2 = _make_layer("L2", [{"id": "Entity", "parent": None}])
        with pytest.raises(SystemExit):
            merge_layers([l1, l2])

    def test_duplicate_relation_skipped(self, capsys):
        l1 = _make_layer("L1", [], relations=[
            {"id": "part_of", "domain": None, "range": None, "definition": "d"},
        ])
        l2 = _make_layer("L2", [], relations=[
            {"id": "part_of", "domain": None, "range": None, "definition": "d"},
        ])
        merged = merge_layers([l1, l2])
        assert len(merged["relations"]) == 1
        captured = capsys.readouterr()
        assert "Duplicate" in captured.out or "WARN" in captured.out

    def test_source_layer_annotation(self):
        l1 = _make_layer("L1_core", [{"id": "A", "parent": None}])
        merged = merge_layers([l1])
        assert merged["classes"][0]["source_layer"] == "L1_core"

    def test_axioms_merged(self):
        l1 = _make_layer("L1", [], axioms=[
            {"id": "ax_test", "type": "disjoint", "classes": ["A", "B"]},
        ])
        merged = merge_layers([l1])
        assert len(merged["axioms"]) == 1
        assert merged["axioms"][0]["source_layer"] == "L1"

    def test_instances_merged(self):
        l1 = _make_layer("L1", [], instances=[
            {"id": "inst1", "type": "A", "label": "Instance 1"},
        ])
        l2 = _make_layer("L2", [], instances=[
            {"id": "inst2", "type": "B", "label": "Instance 2"},
        ])
        merged = merge_layers([l1, l2])
        assert len(merged["sample_instances"]) == 2

    def test_enterprise_name_takes_priority(self):
        l1_data = {
            "metadata": {"name": "Core"},
            "enterprise": {},
            "classes": [],
            "attributes": [],
            "relations": [],
            "axioms": [],
            "migration_registry": [],
            "sample_instances": [],
        }
        l3_data = {
            "metadata": {"name": "L3"},
            "enterprise": {"name": "Acme Corp"},
            "classes": [],
            "attributes": [],
            "relations": [],
            "axioms": [],
            "migration_registry": [],
            "sample_instances": [],
        }
        merged = merge_layers([
            ("L1", "/fake/l1.json", l1_data),
            ("L3", "/fake/l3.json", l3_data),
        ])
        assert "Acme Corp" in merged["metadata"]["name"]


# ─── Merge Validation ────────────────────────────────────────────────────────


class TestValidateMerged:
    def test_valid_merged(self):
        merged = {
            "classes": [
                {"id": "Entity", "parent": None, "abstract": True},
                {"id": "Party", "parent": "Entity", "abstract": False},
            ],
            "relations": [
                {"id": "part_of", "domain": None, "range": None},
            ],
            "sample_instances": [
                {"id": "inst1", "type": "Party"},
            ],
        }
        errors = validate_merged(merged)
        assert errors == []

    def test_broken_parent(self):
        merged = {
            "classes": [{"id": "Child", "parent": "NonExistent"}],
            "relations": [],
            "sample_instances": [],
        }
        errors = validate_merged(merged)
        assert len(errors) == 1
        assert "parent" in errors[0]

    def test_broken_relation_domain(self):
        merged = {
            "classes": [{"id": "A", "parent": None}],
            "relations": [{"id": "r1", "domain": "Missing", "range": "A"}],
            "sample_instances": [],
        }
        errors = validate_merged(merged)
        assert any("domain" in e for e in errors)

    def test_broken_relation_range(self):
        merged = {
            "classes": [{"id": "A", "parent": None}],
            "relations": [{"id": "r1", "domain": "A", "range": "Missing"}],
            "sample_instances": [],
        }
        errors = validate_merged(merged)
        assert any("range" in e for e in errors)

    def test_broken_instance_type(self):
        merged = {
            "classes": [{"id": "A", "parent": None}],
            "relations": [],
            "sample_instances": [{"id": "inst1", "type": "Missing"}],
        }
        errors = validate_merged(merged)
        assert len(errors) == 1


# ─── Output Generators ──────────────────────────────────────────────────────


@pytest.fixture
def sample_merged():
    return {
        "metadata": {
            "name": "Test Merged",
            "description": "test",
            "generated_at": "2026-01-01",
            "layers_merged": ["L1", "L2"],
            "version": "merged",
        },
        "classes": [
            {"id": "Entity", "parent": None, "abstract": True, "label_zh": "实体",
             "label_en": "Entity", "source_layer": "L1", "definition": "d", "definition_en": "d"},
            {"id": "Party", "parent": "Entity", "abstract": False, "label_zh": "主体",
             "label_en": "Party", "source_layer": "L1", "definition": "d", "definition_en": "d"},
        ],
        "relations": [
            {"id": "part_of", "domain": None, "range": None, "label_zh": "属于",
             "label_en": "part of", "source_layer": "L1", "definition": "d", "definition_en": "d"},
        ],
        "attributes": [],
        "axioms": [
            {"id": "ax_test", "type": "disjoint", "classes": ["Entity", "Party"],
             "definition": "d", "definition_en": "d", "source_layer": "L1",
             "label_zh": "互斥", "label_en": "disjoint"},
        ],
        "migration_registry": [],
        "sample_instances": [],
    }


class TestOutputGenerators:
    def test_generate_merged_json(self, sample_merged, tmp_path):
        generate_merged_json(sample_merged, str(tmp_path))
        path = tmp_path / "merged_ontology.json"
        assert path.exists()
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        assert len(data["classes"]) == 2
        assert len(data["relations"]) == 1

    def test_generate_merged_jsonld(self, sample_merged, tmp_path):
        generate_merged_jsonld(sample_merged, str(tmp_path))
        path = tmp_path / "merged_ontology.jsonld"
        assert path.exists()
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        assert "@context" in data
        assert "Entity" in data["@context"]
        assert "Party" in data["@context"]
        assert "part_of" in data["@context"]

    def test_generate_merged_graphql(self, sample_merged, tmp_path):
        generate_merged_graphql(sample_merged, str(tmp_path))
        path = tmp_path / "merged_ontology.graphql"
        assert path.exists()
        content = path.read_text(encoding="utf-8")
        assert "type Query" in content
        assert "type Party" in content
        assert "interface Entity" in content
        assert "enum AxiomType" in content

    def test_generate_merged_sql(self, sample_merged, tmp_path):
        generate_merged_sql(sample_merged, str(tmp_path))
        path = tmp_path / "merged_ontology.sql"
        assert path.exists()
        content = path.read_text(encoding="utf-8")
        assert "CREATE TABLE party" in content
        # Abstract class Entity should NOT have a table
        assert "CREATE TABLE entity" not in content
        assert "uuid" in content.lower()


# ─── Project Root Detection ──────────────────────────────────────────────────


class TestDetectProjectRoot:
    def test_finds_root_from_scripts(self, project_root):
        result = detect_project_root(project_root / "scripts")
        assert (result / "l1-core").is_dir()
        assert (result / "l2-extensions").is_dir()

    def test_finds_root_from_core(self, project_root):
        result = detect_project_root(project_root / "l1-core")
        assert (result / "l1-core").is_dir()
        assert (result / "l2-extensions").is_dir()
