# Changelog

All notable changes to this project will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-04-03

### Changed
- **Repository Flattening**: Moved all core project files from `universal-ontology-definition/` to the repository root for better accessibility and cleaner structure.
- Updated `.gitignore` to include `legacy/` archive and improve environment file exclusion.

### Added
- **L3 Enterprise Customization Layer** (`enterprise/`)
    - Enterprise layer documentation (`enterprise/README.md`)
    - Enterprise customization JSON template (`enterprise/_template/enterprise_ontology_template.json`)
- **Documentation Site** — MkDocs Material-based documentation with full-text search

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
    - 25 universal entity classes
    - 16 standard relationship definitions
    - 8 sample instances
- **Consulting Industry Addon** (`addons/consulting/consulting_addon_v1.json`)
    - 40+ consulting-specific classes
    - 34 industry relationship definitions
    - 25+ sample instances
- **Luxury Goods Industry Addon** (`addons/luxury-goods/luxury_goods_addon_v1.json`)
    - 21 luxury-specific classes
    - 10 industry relationship definitions
    - 8 sample instances
- **Addon Template** (`addons/_template/`) for community contributors
- **JSON Schema** validation for core and addon definitions
- **Documentation**: Architecture guide, design guide, addon development guide
