# L0: Platform & Syntax Bindings (技术平台绑定层)

## Overview

The **L0 Platform Bindings Layer** provides concrete technical serializations and schema mappings for the L1 Universal Enterprise Ontology Core. While L1 defines the **semantic model** (what concepts mean and how they relate), L0 defines **how those concepts are expressed** in specific technical platforms and serialization formats.

## Purpose

| Aspect | Description |
|:---|:---|
| **Position** | Foundation layer below L1, providing technical implementation formats |
| **Scope** | OWL/RDF serialization, JSON-LD contexts, GraphQL schemas, SQL DDL, and more |
| **Stability** | High — evolves with technology standards |
| **Governance** | Project maintainers + platform contributors |

## Available Bindings

| Platform | Directory | Format | Status |
|:---|:---|:---|:---|
| OWL/RDF | [`owl-rdf/`](owl-rdf/) | Turtle (.ttl) | ✅ v1.0.0 |
| JSON-LD | [`json-ld/`](json-ld/) | JSON-LD Context (.jsonld) | ✅ v1.0.0 |
| GraphQL | [`graphql/`](graphql/) | GraphQL Schema (.graphql) | ✅ v1.0.0 |
| SQL | [`sql/`](sql/) | PostgreSQL DDL (.sql) | ✅ v1.0.0 |

## Architecture Relationship

```
L1 Universal Core (Semantic Model)
        │
        │  "is serialized by"
        ▼
L0 Platform Bindings (Technical Formats)
   ├── OWL/RDF   → Semantic Web, Knowledge Graphs, SPARQL
   ├── JSON-LD   → REST APIs, Linked Data, Web Standards
   ├── GraphQL   → Modern API Layer, Frontend Integration
   └── SQL DDL   → Relational Databases, Data Warehouses
```

## Contributing a New Binding

1. Copy `_template/` as your starting point
2. Implement the mapping for all L1 core classes and relations
3. Add a `README.md` explaining the binding decisions
4. Submit a Pull Request

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.

## Design Principles

1. **Faithfulness** — Every L1 concept must have a corresponding L0 representation
2. **Idiomatic** — Each binding should follow the conventions of its target platform
3. **Lossless** — Round-tripping between L0 formats should preserve semantic meaning
4. **Documented** — Every mapping decision should be explicitly documented
