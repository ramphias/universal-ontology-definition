# 🌐 Universal Ontology Definition v1.1.0

**Introducing the L0 Platform & Syntax Bindings Layer — multi-platform Ontology support.**

## 🆕 What's New in v1.1.0

### L0 — Platform & Syntax Bindings Layer

A brand new foundation layer that provides concrete technical serializations for the L1 semantic core:

| Platform | Format | Use Case |
|:---|:---|:---|
| **OWL/RDF** | Turtle (.ttl) | Knowledge graphs, SPARQL queries, Semantic Web |
| **JSON-LD** | JSON-LD Context (.jsonld) | REST APIs, Linked Data, Web standards |
| **GraphQL** | Schema (.graphql) | Modern API layers, Frontend integration |
| **SQL DDL** | PostgreSQL (.sql) | Relational databases, Data warehouses |

### Architecture Evolution: Three-Layer → Four-Layer

```
  v1.0.0 (Three-Layer)          v1.1.0 (Four-Layer)
  ┌──────────────────┐          ┌──────────────────┐
  │   L3: Enterprise │          │   L3: Enterprise │
  ├──────────────────┤          ├──────────────────┤
  │   L2: Industry   │          │   L2: Industry   │
  ├──────────────────┤          ├──────────────────┤
  │   L1: Core       │          │   L1: Core       │
  └──────────────────┘          ├══════════════════┤
                                │   L0: Platform   │  ← NEW
                                └──────────────────┘
```

**Why L0?** Separating *what concepts mean* (L1) from *how they're expressed* (L0) enables the same semantic core to serve knowledge graphs, REST APIs, relational databases, and more — without duplicating or drifting definitions.

## ✨ Full Feature Set

### L1 — Universal Enterprise Ontology Core
- 25 universal entity classes (Party, Organization, Process, Capability, Risk, Goal, KPI, etc.)
- 16 standard relationship definitions
- 8 sample instances
- Full bilingual support (English + Chinese)

### L2 — Industry Addons
- **Consulting Industry Addon** — 40+ classes, 34 relations, 25+ instances
- **Luxury Goods Industry Addon** — 21 classes, 10 relations, 8 instances
- **Addon Template** for community contributors

### L0 — Platform Bindings
- **OWL/RDF** — Full OWL 2 ontology in Turtle format with w3id.org namespace
- **JSON-LD** — Complete `@context` for seamless JSON-to-RDF mapping
- **GraphQL** — Type definitions with interfaces, enums, and query roots
- **SQL DDL** — PostgreSQL schema with UUID PKs, junction tables, indexes
- **Template** for contributing new platform bindings

### Infrastructure
- JSON Schema validation for core and addon definitions
- Four-layer architecture documentation
- Addon development guide
- Platform binding contribution guide

## 📐 Four-Layer Architecture

| Layer | Purpose | Stability |
|:---|:---|:---|
| L0 Platform | Technical serialization for specific platforms | High |
| L1 Core | Universal enterprise semantic concepts | Very High |
| L2 Addons | Industry-specific extensions | High |
| L3 Enterprise | Private customizations | Flexible |

## 🚀 Get Started

1. Choose your L0 platform binding (OWL, JSON-LD, GraphQL, or SQL)
2. Inherit L1 Core as your semantic foundation
3. Select L2 industry addons (or contribute your own)
4. Build L3 private extensions for your enterprise

## 📄 License

Apache License 2.0 — free for commercial use, modification, and distribution.
