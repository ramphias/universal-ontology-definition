"""Tests for scripts/json_to_owl.py"""

import sys
import json
import os
import tempfile
import pytest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))

from json_to_owl import (
    detect_layer,
    get_namespace_for_layer,
    get_extends_namespaces,
    escape_turtle,
    resolve_class_ref,
    generate_turtle,
    convert_file,
    find_project_root,
    find_all_ontology_jsons,
    BASE_URI,
    LAYER_NS,
    L1_CLASSES,
    L1_RELATIONS,
)


# ─── Layer Detection ─────────────────────────────────────────────────────────


class TestDetectLayer:
    def test_top_level_layer_field(self):
        data = {"layer": "L2_consulting_industry_addon"}
        assert detect_layer(data) == "L2_consulting_industry_addon"

    def test_metadata_layer_field(self):
        data = {"metadata": {"layer": "L1_universal_organization_ontology"}}
        assert detect_layer(data) == "L1_universal_organization_ontology"

    def test_top_level_takes_priority(self):
        data = {"layer": "L2_foo", "metadata": {"layer": "L1_bar"}}
        assert detect_layer(data) == "L2_foo"

    def test_missing_layer_returns_empty(self):
        assert detect_layer({}) == ""
        assert detect_layer({"metadata": {}}) == ""


# ─── Namespace Resolution ────────────────────────────────────────────────────


class TestGetNamespaceForLayer:
    def test_known_l1_layer(self):
        prefix, uri = get_namespace_for_layer("L1_universal_organization_ontology")
        assert prefix == "uod"
        assert "core" in uri

    def test_known_l2_layer(self):
        prefix, uri = get_namespace_for_layer("L2_consulting_industry_addon")
        assert prefix == "uod-con"

    def test_l3_enterprise(self):
        data = {"enterprise": {"id": "acme_corp"}}
        prefix, uri = get_namespace_for_layer("L3_enterprise_customization", data)
        assert "enterprise" in uri
        assert "acme-corp" in uri

    def test_unknown_layer_defaults_to_core(self):
        prefix, uri = get_namespace_for_layer("unknown_layer")
        assert prefix == "uod"
        assert "core" in uri


class TestGetExtendsNamespaces:
    def test_exact_match(self):
        data = {"extends": ["L1_universal_organization_ontology"]}
        result = get_extends_namespaces(data)
        assert len(result) == 1
        assert result[0][0] == "uod"

    def test_string_extends(self):
        data = {"extends": "L1_universal_organization_ontology"}
        result = get_extends_namespaces(data)
        assert len(result) == 1

    def test_versioned_extends(self):
        data = {"extends": ["L1_universal_organization_ontology_v2"]}
        result = get_extends_namespaces(data)
        assert len(result) == 1
        assert result[0][0] == "uod"

    def test_multiple_extends(self):
        data = {"extends": [
            "L1_universal_organization_ontology",
            "L2_consulting_industry_addon",
        ]}
        result = get_extends_namespaces(data)
        assert len(result) == 2

    def test_empty_extends(self):
        assert get_extends_namespaces({"extends": []}) == []
        assert get_extends_namespaces({}) == []


# ─── Turtle Escaping ────────────────────────────────────────────────────────


class TestEscapeTurtle:
    def test_empty_string(self):
        assert escape_turtle("") == ""

    def test_none(self):
        assert escape_turtle(None) == ""

    def test_backslash(self):
        assert escape_turtle("a\\b") == "a\\\\b"

    def test_double_quote(self):
        assert escape_turtle('say "hello"') == 'say \\"hello\\"'

    def test_newline(self):
        assert escape_turtle("line1\nline2") == "line1\\nline2"

    def test_combined(self):
        assert escape_turtle('a\\b"c\nd') == 'a\\\\b\\"c\\nd'

    def test_plain_text(self):
        assert escape_turtle("Hello World") == "Hello World"


# ─── Class Reference Resolution ──────────────────────────────────────────────


class TestResolveClassRef:
    def test_local_class(self):
        local_classes = {"MyClass"}
        local_ns = ("ext", "http://example.org/ext/")
        registry = {}
        assert resolve_class_ref("MyClass", local_classes, local_ns, registry) == "ext:MyClass"

    def test_registry_class(self):
        local_classes = set()
        local_ns = ("ext", "http://example.org/ext/")
        registry = {"Entity": ("uod", f"{BASE_URI}/core/")}
        assert resolve_class_ref("Entity", local_classes, local_ns, registry) == "uod:Entity"

    def test_fallback_to_core(self):
        result = resolve_class_ref("Unknown", set(), ("ext", ""), {})
        assert result == "uod:Unknown"


# ─── Turtle Generation ──────────────────────────────────────────────────────


class TestGenerateTurtle:
    def test_generates_prefixes(self, minimal_ontology, project_root):
        turtle = generate_turtle(minimal_ontology, str(project_root))
        assert "@prefix owl:" in turtle
        assert "@prefix rdfs:" in turtle
        assert "@prefix uod:" in turtle

    def test_generates_classes(self, minimal_ontology, project_root):
        turtle = generate_turtle(minimal_ontology, str(project_root))
        assert "a owl:Class" in turtle
        assert '"Entity"@en' in turtle
        assert '"实体"@zh' in turtle

    def test_generates_subclass(self, minimal_ontology, project_root):
        turtle = generate_turtle(minimal_ontology, str(project_root))
        assert "rdfs:subClassOf" in turtle

    def test_generates_relations(self, minimal_ontology, project_root):
        turtle = generate_turtle(minimal_ontology, str(project_root))
        assert "a owl:ObjectProperty" in turtle
        assert "rdfs:domain" in turtle
        assert "rdfs:range" in turtle

    def test_generates_instances(self, minimal_ontology, project_root):
        turtle = generate_turtle(minimal_ontology, str(project_root))
        assert "a owl:NamedIndividual" in turtle
        assert "sample_party" in turtle

    def test_abstract_flag(self, minimal_ontology, project_root):
        turtle = generate_turtle(minimal_ontology, str(project_root))
        assert 'uod:abstract "true"' in turtle

    def test_ontology_header(self, minimal_ontology, project_root):
        turtle = generate_turtle(minimal_ontology, str(project_root))
        assert "a owl:Ontology" in turtle
        assert "owl:versionInfo" in turtle

    def test_disjoint_axiom(self, project_root):
        data = {
            "metadata": {"layer": "L1_universal_organization_ontology", "version": "1.0.0"},
            "classes": [
                {"id": "A", "label_en": "A", "label_zh": "甲"},
                {"id": "B", "label_en": "B", "label_zh": "乙"},
            ],
            "relations": [],
            "axioms": [
                {
                    "id": "ax_disjoint",
                    "type": "disjoint",
                    "classes": ["A", "B"],
                    "definition_en": "A and B are disjoint",
                    "definition": "互斥",
                }
            ],
            "sample_instances": [],
        }
        turtle = generate_turtle(data, str(project_root))
        assert "owl:disjointWith" in turtle

    def test_transitive_axiom(self, project_root):
        data = {
            "metadata": {"layer": "L1_universal_organization_ontology", "version": "1.0.0"},
            "classes": [],
            "relations": [{"id": "part_of", "label_en": "part of", "label_zh": "属于",
                           "domain": "Entity", "range": "Entity", "definition": "d", "definition_en": "d"}],
            "axioms": [
                {"id": "ax_trans", "type": "transitive", "relation": "part_of",
                 "definition": "d", "definition_en": "d"}
            ],
            "sample_instances": [],
        }
        turtle = generate_turtle(data, str(project_root))
        assert "owl:TransitiveProperty" in turtle

    def test_existential_axiom(self, project_root):
        data = {
            "metadata": {"layer": "L1_universal_organization_ontology", "version": "1.0.0"},
            "classes": [
                {"id": "Person", "label_en": "Person", "label_zh": "人"},
                {"id": "Role", "label_en": "Role", "label_zh": "角色"},
            ],
            "relations": [{"id": "plays_role", "label_en": "plays role", "label_zh": "扮演",
                           "domain": "Person", "range": "Role", "definition": "d", "definition_en": "d"}],
            "axioms": [
                {"id": "ax_exist", "type": "existential",
                 "subject_class": "Person", "relation": "plays_role", "object_class": "Role",
                 "definition": "d", "definition_en": "d"}
            ],
            "sample_instances": [],
        }
        turtle = generate_turtle(data, str(project_root))
        assert "owl:someValuesFrom" in turtle

    def test_deprecated_classes(self, project_root):
        data = {
            "metadata": {"layer": "L1_universal_organization_ontology", "version": "1.0.0"},
            "classes": [{"id": "NewClass", "label_en": "New", "label_zh": "新"}],
            "relations": [],
            "axioms": [],
            "deprecated_classes": [
                {"id": "OldClass", "replaced_by": "NewClass", "note": "Use NewClass instead"}
            ],
            "sample_instances": [],
        }
        turtle = generate_turtle(data, str(project_root))
        assert "owl:deprecated true" in turtle
        assert "OldClass" in turtle


# ─── File Conversion ─────────────────────────────────────────────────────────


class TestConvertFile:
    def test_converts_core_json(self, core_ontology_path, project_root, tmp_path):
        # Copy core json to temp to avoid modifying the real file
        src = core_ontology_path
        dst = tmp_path / "test_ontology.json"
        with open(src, "r", encoding="utf-8") as f:
            data = json.load(f)
        with open(dst, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False)

        ttl_path = convert_file(str(dst), str(project_root))
        assert os.path.exists(ttl_path)
        assert ttl_path.endswith(".ttl")

        with open(ttl_path, "r", encoding="utf-8") as f:
            content = f.read()
        assert "@prefix owl:" in content
        assert "a owl:Class" in content


# ─── Constants ───────────────────────────────────────────────────────────────


class TestConstants:
    def test_l1_classes_not_empty(self):
        assert len(L1_CLASSES) > 20

    def test_l1_relations_not_empty(self):
        assert len(L1_RELATIONS) == 12

    def test_layer_ns_keys(self):
        assert "L1_universal_organization_ontology" in LAYER_NS
        assert "L2_consulting_industry_addon" in LAYER_NS
