"""Tests for scripts/json_to_owl.py"""

import sys
import json
import os
import tempfile
import pytest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))

from json_to_owl import (
    get_extends_namespaces,
    escape_turtle,
    resolve_class_ref,
    generate_turtle,
    convert_file,
)
import uod_core


# ─── Namespace Resolution ────────────────────────────────────────────────────


class TestGetNamespaceForLayer:
    def test_known_l1_layer(self):
        prefix, uri = uod_core.get_namespace_for_layer("L1_universal_organization_ontology")
        assert prefix == "uod"
        assert "core" in uri

    def test_known_l2_layer(self):
        prefix, uri = uod_core.get_namespace_for_layer("L2_consulting_industry_addon")
        assert prefix == "uod-con"

    def test_l3_enterprise(self):
        data = {"enterprise": {"id": "acme_corp"}}
        prefix, uri = uod_core.get_namespace_for_layer("L3_enterprise_customization", data)
        assert "enterprise" in uri
        assert "acme-corp" in uri

    def test_unknown_layer_defaults_to_core(self):
        prefix, uri = uod_core.get_namespace_for_layer("unknown_layer")
        assert prefix == "uod"
        assert "core" in uri


class TestGetExtendsNamespaces:
    def test_exact_match(self):
        data = {"extends": ["L1_universal_organization_ontology"]}
        global_registry = {"layers": {"L1_universal_organization_ontology": ("uod", f"{uod_core.BASE_URI}/core/")}}
        result = get_extends_namespaces(data, global_registry)
        assert len(result) == 1
        assert result[0][0] == "uod"

    def test_string_extends(self):
        data = {"extends": "L1_universal_organization_ontology"}
        global_registry = {"layers": {"L1_universal_organization_ontology": ("uod", f"{uod_core.BASE_URI}/core/")}}
        result = get_extends_namespaces(data, global_registry)
        assert len(result) == 1

    def test_versioned_extends(self):
        data = {"extends": ["L1_universal_organization_ontology_v2"]}
        global_registry = {"layers": {"L1_universal_organization_ontology": ("uod", f"{uod_core.BASE_URI}/core/")}}
        result = get_extends_namespaces(data, global_registry)
        assert len(result) == 1
        assert result[0][0] == "uod"

    def test_multiple_extends(self):
        data = {"extends": [
            "L1_universal_organization_ontology",
            "L2_consulting_industry_addon",
        ]}
        global_registry = {
            "layers": {
                "L1_universal_organization_ontology": ("uod", f"{uod_core.BASE_URI}/core/"),
                "L2_consulting_industry_addon": ("uod-con", f"{uod_core.BASE_URI}/addon/consulting/")
            }
        }
        result = get_extends_namespaces(data, global_registry)
        assert len(result) == 2

    def test_empty_extends(self):
        assert get_extends_namespaces({"extends": []}, {"layers":{}}) == []
        assert get_extends_namespaces({}, {"layers":{}}) == []


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
        registry = {"Entity": ("uod", f"{uod_core.BASE_URI}/core/")}
        assert resolve_class_ref("Entity", local_classes, local_ns, registry) == "uod:Entity"

    def test_fallback_to_core(self):
        result = resolve_class_ref("Unknown", set(), ("ext", ""), {})
        assert result == "uod:Unknown"


# ─── Turtle Generation ──────────────────────────────────────────────────────


class TestGenerateTurtle:
    def get_reg(self):
        return {"layers": {}, "classes": {}, "relations": {}}

    def test_generates_prefixes(self, minimal_ontology):
        turtle = generate_turtle(minimal_ontology, self.get_reg())
        assert "@prefix owl:" in turtle
        assert "@prefix rdfs:" in turtle
        assert "@prefix uod:" in turtle

    def test_generates_classes(self, minimal_ontology):
        turtle = generate_turtle(minimal_ontology, self.get_reg())
        assert "a owl:Class" in turtle
        assert '"Entity"@en' in turtle
        assert '"实体"@zh' in turtle

    def test_generates_subclass(self, minimal_ontology):
        turtle = generate_turtle(minimal_ontology, self.get_reg())
        assert "rdfs:subClassOf" in turtle

    def test_generates_relations(self, minimal_ontology):
        turtle = generate_turtle(minimal_ontology, self.get_reg())
        assert "a owl:ObjectProperty" in turtle
        assert "rdfs:domain" in turtle
        assert "rdfs:range" in turtle

    def test_generates_instances(self, minimal_ontology):
        turtle = generate_turtle(minimal_ontology, self.get_reg())
        assert "a owl:NamedIndividual" in turtle
        assert "sample_party" in turtle

    def test_abstract_flag(self, minimal_ontology):
        turtle = generate_turtle(minimal_ontology, self.get_reg())
        assert 'uod:abstract "true"' in turtle

    def test_ontology_header(self, minimal_ontology):
        turtle = generate_turtle(minimal_ontology, self.get_reg())
        assert "a owl:Ontology" in turtle
        assert "owl:versionInfo" in turtle

    def test_disjoint_axiom(self):
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
        turtle = generate_turtle(data, self.get_reg())
        assert "owl:disjointWith" in turtle

    def test_transitive_axiom(self):
        data = {
            "metadata": {"layer": "L1_universal_organization_ontology", "version": "1.0.0"},
            "classes": [],
            "relations": [{"id": "part_of", "label_en": "part of", "label_zh": "属于", "domain": None, "range": None, "definition": "d", "definition_en": "d"}],
            "axioms": [
                {"id": "ax_trans", "type": "transitive", "relation": "part_of",
                 "definition": "d", "definition_en": "d"}
            ],
            "sample_instances": [],
        }
        turtle = generate_turtle(data, self.get_reg())
        assert "owl:TransitiveProperty" in turtle

    def test_existential_axiom(self):
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
        turtle = generate_turtle(data, self.get_reg())
        assert "owl:someValuesFrom" in turtle

    def test_deprecated_classes_via_migration_registry(self):
        data = {
            "metadata": {"layer": "L1_universal_organization_ontology", "version": "1.0.0"},
            "classes": [{"id": "NewClass", "label_en": "New", "label_zh": "新"}],
            "attributes": [],
            "relations": [],
            "axioms": [],
            "migration_registry": [
                {"id": "OldClass", "kind": "class", "replaced_by": "NewClass", "deprecated_since": "2.0.0", "note": "Use NewClass instead"}
            ],
            "sample_instances": [],
        }
        turtle = generate_turtle(data, self.get_reg())
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

        reg = uod_core.build_global_registry(str(project_root))
        ttl_path = convert_file(str(dst), global_registry=reg, project_root=str(project_root))
        assert os.path.exists(ttl_path)
        assert ttl_path.endswith(".ttl")

        with open(ttl_path, "r", encoding="utf-8") as f:
            content = f.read()
        assert "@prefix owl:" in content
        assert "a owl:Class" in content
