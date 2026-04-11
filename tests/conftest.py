"""Shared fixtures for ontology test suite."""

import json
import pytest
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent


@pytest.fixture
def project_root():
    return PROJECT_ROOT


@pytest.fixture
def core_ontology_path(project_root):
    return project_root / "l1-core" / "universal_ontology_v1.json"


@pytest.fixture
def core_ontology(core_ontology_path):
    with open(core_ontology_path, "r", encoding="utf-8") as f:
        return json.load(f)


@pytest.fixture
def minimal_ontology():
    """A minimal valid L1 ontology for unit tests."""
    return {
        "metadata": {
            "name": "Test Ontology",
            "layer": "L1_universal_organization_ontology",
            "version": "1.0.0",
        },
        "classes": [
            {
                "id": "Entity",
                "label_zh": "实体",
                "label_en": "Entity",
                "parent": None,
                "abstract": True,
                "status": "stable",
                "definition": "顶层抽象",
                "definition_en": "Top-level abstraction",
            },
            {
                "id": "Party",
                "label_zh": "主体",
                "label_en": "Party",
                "parent": "Entity",
                "abstract": False,
                "status": "stable",
                "definition": "主体",
                "definition_en": "Party",
            },
        ],
        "attributes": [
            {
                "id": "name",
                "label_zh": "名称",
                "label_en": "Name",
                "owner_class": "Entity",
                "datatype": "string",
                "required": True,
                "definition": "名称",
                "definition_en": "Name",
            }
        ],
        "relations": [
            {
                "id": "part_of",
                "label_zh": "属于",
                "label_en": "part of",
                "domain": "Party",
                "range": "Entity",
                "definition": "属于关系",
                "definition_en": "Part-of relationship",
            }
        ],
        "axioms": [],
        "sample_instances": [
            {
                "id": "sample_party",
                "type": "Party",
                "label": "Sample Party",
                "label_zh": "示例主体",
            }
        ],
    }
