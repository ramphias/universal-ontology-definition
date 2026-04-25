# Core Concepts

This page explains the key terminology and concepts used throughout UOD.

## Layers

### L0 — Platform & Syntax Bindings

The **technical serialization layer**. Provides pre-built mappings of the L1 semantic model into specific technology formats (OWL/RDF, JSON-LD, GraphQL, SQL DDL). L0 does **not** participate in the semantic inheritance chain.

### L1 — Universal Enterprise Ontology Core

The **mandatory foundation**. Defines 24 cross-industry, cross-enterprise universal concepts (classes) and 13 standard relationships. All L2 and L3 definitions must inherit from L1.

### L2 — Industry & Domain Extensions

**Optional, pluggable** industry-specific extensions. Each extension targets a specific industry (consulting, luxury goods, finance, etc.) and adds new classes and relationships that inherit from L1.

### L3 — Enterprise Customization Layer

**Private, enterprise-specific** extensions. Organizations define their own proprietary classes, mappings, and rules that extend L1 and optionally L2.

## Key Terms

### Class

A **class** represents a type of entity in the ontology. For example, `Organization`, `Process`, or `Risk`.

```json
{
  "id": "Organization",
  "label_zh": "组织",
  "label_en": "Organization",
  "parent": "Party",
  "definition_en": "A legal or non-legal organization entity"
}
```

### Relation

A **relation** defines a directed connection between two classes.

```json
{
  "id": "plays_role",
  "domain": "Party",
  "range": "Role",
  "definition_en": "A party plays a specific role"
}
```

- **Domain**: The source class (where the relationship starts)
- **Range**: The target class (where the relationship points)

### Inheritance

Child classes **inherit** from parent classes via the `parent` field. This creates a semantic lineage:

```
Party (L1)
├── Person (L1)
├── Organization (L1)
│   ├── OrgUnit (L1)
│   ├── ConsultingFirm (L2 - Consulting Extension)
│   └── LuxuryBrand (L2 - Luxury Goods Extension)
│       └── MyCompany (L3 - Enterprise)
```

### Extension

An **extension** is a packaged set of industry-specific classes and relations that extends L1. Extensions are:

- **Optional** — Only load the ones you need
- **Community-driven** — Anyone can contribute
- **Validated** — Must conform to `schema/extension_schema.json`

### Platform Binding

A **platform binding** is a technical serialization of the L1 semantic model. It translates abstract concepts into concrete, technology-specific formats that can be directly used by downstream systems.

!!! tip "Complete Glossary / 完整术语表"
    For the full glossary of all concepts across all layers — including ontology fundamentals, architecture terms, L1/L2 class and relation references, governance rules, technical terms, and a disambiguation guide for commonly confused concepts — see the [Glossary](../glossary/index.md).
