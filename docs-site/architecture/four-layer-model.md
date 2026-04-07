# Four-Layer Architecture Model

Universal Ontology Definition uses a **Technical—Universal—Industry—Enterprise** four-layer architecture to balance the tension between standardization and customization.

## Layer Overview

```
┌──────────────────────────────────────────────────────────────────┐
│  L3: Enterprise Customization Layer                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                       │
│  │  Org A    │  │  Org B    │  │  Org C    │   ← Tenant isolation │
│  └──────────┘  └──────────┘  └──────────┘                       │
├──────────────────────────────────────────────────────────────────┤
│  L2: Industry & Domain Extensions                                    │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                  │
│  │Conslt│ │Luxury│ │Financ│ │Manuf │ │Retail│  ← Community      │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘                  │
├──────────────────────────────────────────────────────────────────┤
│  L1: Universal Enterprise Ontology Core                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Entity · Governance · Operational · Measurement           │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                     ← Mandatory, stable          │
├══════════════════════════════════════════════════════════════════┤
│  L0: Platform & Syntax Bindings                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                   │
│  │OWL/RDF │ │JSON-LD │ │GraphQL │ │SQL DDL │  ← Serialization  │
│  └────────┘ └────────┘ └────────┘ └────────┘                   │
└──────────────────────────────────────────────────────────────────┘
```

## L0 — Platform & Syntax Bindings

| Dimension | Description |
|:---|:---|
| **Purpose** | Map L1 abstract semantic concepts to concrete technology formats |
| **Scope** | OWL/RDF serialization, JSON-LD Context, GraphQL Schema, SQL DDL, etc. |
| **Stability** | High — updates follow technology standards evolution |
| **Modify Rights** | Project maintainers + platform contributors |
| **Relationship** | L1 concepts are mapped to executable technical formats through L0 |

!!! info "What L0 Solves"
    L0 separates *"what is an Organization"* (semantic definition) from *"how is Organization expressed in OWL / how is the table created in SQL"* (technical implementation). This enables the same semantic core to serve knowledge graphs, REST APIs, relational databases, and more simultaneously.

## L1 — Universal Enterprise Ontology Core

| Dimension | Description |
|:---|:---|
| **Purpose** | Universal concept model applicable to all enterprises |
| **Scope** | Party, Organization, Role, Capability, Process, Business Objects, Data, Systems, Governance, Risk, Goals, Metrics |
| **Stability** | Very high — only accepts long-term stable, cross-industry abstractions |
| **Modify Rights** | Only project maintainers, requires community review |
| **Inheritance** | All L2 and L3 must inherit from L1 |

## L2 — Industry & Domain Extensions

| Dimension | Description |
|:---|:---|
| **Purpose** | Industry or domain-specific concept extensions |
| **Scope** | Industry-specific entities, relations, roles, processes, rules, metrics |
| **Stability** | High — requires cross-enterprise reuse validation |
| **Modify Rights** | Industry contributors + project maintainers |
| **Inheritance** | Extends L1 via the `extends` field |

## L3 — Enterprise Customization Layer

| Dimension | Description |
|:---|:---|
| **Purpose** | Enterprise-private custom extensions |
| **Scope** | Enterprise-specific objects, system mappings, organizational constraints, internal terminology |
| **Stability** | Flexible — enterprise self-managed |
| **Modify Rights** | Enterprise administrators |
| **Inheritance** | Extends L1 + selected L2 extensions |

## Design Principles

1. **Stability First** — L1 only accommodates long-term stable abstractions
2. **Extensibility First** — L2/L3 extend through inheritance, never overwrite upstream semantics
3. **Governance First** — Every concept and relation has an owner, version, and audit trail
4. **Consumer First** — Serve queries, reviews, publishing, API integration, and AI Agent consumption
5. **Security First** — Enterprise layer is logically isolated with approval-based publishing
6. **Platform Agnostic** — L1 semantic definitions are independent of any technology platform; L0 handles platform binding
