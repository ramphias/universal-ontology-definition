# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-04-03 — Anti-Entropy Refactoring

### ⚠️ Breaking Changes
- **L1 Core restructured**: 25 classes → 24 classes (4 abstract domains + 20 concrete)
- **`BusinessObject` replaced by `Resource`** — all L2 extensions using `"parent": "BusinessObject"` must change to `"parent": "Resource"`
- **`DocumentRecord` renamed to `Document`** — all L2 extensions using `"parent": "DocumentRecord"` must change to `"parent": "Document"`
- **`Activity` class removed from L1** — now available in `extensions/common/` as a subtype of `Process`
- **Relations renamed/merged**:
  - `belongs_to` + `composed_of` → `part_of`
  - `is_accountable_for` → `accountable_for`
  - `constrained_by` merged into `governed_by` (generalized domain/range)
  - `supports` and `requires_decision` removed (expressible via other relations)
- **Classes demoted to L2 `extensions/common/`**: `Channel`, `MarketSegment`, `Location`, `Decision`

### Added
- **4 Abstract Domain Root Classes**: `Entity`, `Governance`, `Operational`, `Measurement` — organizes all classes into a structured tree instead of a flat list
- **`Resource` abstract class** — replaces `BusinessObject` as parent for ProductService, Asset, DataObject, Document, SystemApplication
- **`migration_registry`** — unified registry providing migration guidance for removed classes, relations, and attributes (replaces the former `deprecated_classes` / `deprecated_relations` arrays)
- **Schema lifecycle fields**: `abstract`, `status`, `since`, `deprecated_since`, `replaced_by` for versioned evolution
- **Relation metadata**: `cardinality` (1:1, 1:N, N:1, N:M), `inverse_of` for bidirectional relation declarations
- **`extensions/common/` L2 extension** — Common Enterprise Extension containing demoted L1 classes plus new universally useful classes (Contract, Report, Project, Stakeholder, Regulation)
- **`scripts/validate_governance.py`** — Automated CI governance validator enforcing rules G-01 through G-08
- **Governance Rules G-01 through G-08** in CONTRIBUTING.md — hard structural constraints to prevent entropy growth
- **`maxItems: 25` constraint** in core_schema.json — schema-level enforcement of class cap

### Changed
- **Relation domain/range generalized** — `governed_by` now accepts `Operational → Governance` instead of `Process → Policy`, enabling L2 reuse without creating duplicate relations
- **`measured_by` generalized** — domain changed from `Goal` to `Operational`, allowing any operational element to be measured
- **`consumes`/`produces` generalized** — range changed from `DataObject` to `Resource`
- **All L0 platform bindings updated** to v2.0 (OWL/RDF, JSON-LD, GraphQL, SQL DDL)
- **`extension_schema.json` `extends` field relaxed** — now supports both string and array format, enabling L2-to-L2 dependencies
- **`sample_instances` made industry-neutral** — removed retail/manufacturing specific examples
- **Consulting extension** updated to use `Resource`/`Document` parent classes
- **Luxury Goods extension** updated to use `Resource`/`Document` parent classes
- README.md updated with v2.0 architecture diagram and class domain table

## [1.2.0] - 2026-04-03

### Changed
- **Repository Flattening**: Moved all core project files from `universal-ontology-definition/` to the repository root for better accessibility and cleaner structure.
- Updated `.gitignore` to include `legacy/` archive and improve environment file exclusion.

### Added
- **L3 Enterprise Customization Layer** (`enterprise/`)
  - Enterprise layer documentation (`enterprise/README.md`)
  - Enterprise customization JSON template (`enterprise/_template/enterprise_ontology_template.json`)


## [1.1.0] - 2026-03-30

### Added
- **L0 Platform & Syntax Bindings Layer** (`platform/`)
  - OWL 2 / RDF Turtle serialization (`platform/owl-rdf/core_ontology.ttl`)
  - JSON-LD Context definition (`platform/json-ld/context.jsonld`)
  - GraphQL Schema definition (`platform/graphql/schema.graphql`)
  - PostgreSQL DDL mapping (`platform/sql/schema.sql`)
  - Platform binding contribution template (`platform/_template/`)

### Changed
- Architecture upgraded from three-layer to **four-layer** (L0–L3)
- Updated README.md and README_CN.md to reflect four-layer architecture
- Updated `docs/architecture.md` with L0 layer documentation
- Version badge updated to 1.1.0

## [1.0.0] - 2026-03-29

### Added
- **L1 Core Ontology** (`core/universal_ontology_v1.json`)
  - 25 universal entity classes covering Party, Organization, Process, Capability, Risk, Goal, KPI, etc.
  - 16 standard relationship definitions
  - 8 sample instances
- **Consulting Industry and Domain Extension** (`extensions/consulting/consulting_extension_v1.json`)
  - 40+ consulting-specific classes (Engagement, Deliverable, Methodology, Framework, etc.)
  - 34 industry relationship definitions
  - 25+ sample instances
- **Luxury Goods Industry and Domain Extension** (`extensions/luxury-goods/luxury_goods_extension_v1.json`)
  - 21 luxury-specific classes (Brand, Collection, SKU, Boutique, etc.)
  - 10 industry relationship definitions
  - 8 sample instances
- **Extension Template** (`extensions/_template/`) for community contributors
- **JSON Schema** validation for core and extension definitions
- **Documentation**: Architecture guide, design guide, extension development guide
