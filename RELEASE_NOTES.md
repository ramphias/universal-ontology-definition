# 🌐 Universal Ontology Definition v2.0.0

**Anti-Entropy Refactoring — A major restructuring for long-term maintainability and clarity.**

## ⚠️ Breaking Changes

- **L1 Core restructured**: 25 classes → 24 classes (4 abstract domains + 20 concrete)
- **`BusinessObject` → `Resource`** — all L2 extensions must update parent references
- **`DocumentRecord` → `Document`** — all L2 extensions must update parent references
- **`Activity` demoted to L2** — now in `extensions/common/` as a subtype of `Process`
- **Relations merged/renamed**:
  - `belongs_to` + `composed_of` → `part_of`
  - `is_accountable_for` → `accountable_for`
  - `constrained_by` → merged into `governed_by`
  - `supports` and `requires_decision` removed

## 🆕 What's New in v2.0.0

### Structural Improvements
- **4 Abstract Domain Root Classes**: `Entity`, `Governance`, `Operational`, `Measurement` — organizes all classes into a clear tree
- **`Resource` abstract class** — replaces `BusinessObject` as parent for ProductService, Asset, DataObject, Document, SystemApplication
- **`migration_registry`** — unified registry providing migration guidance for removed classes, relations, and attributes
- **Schema lifecycle fields**: `abstract`, `status`, `since`, `deprecated_since`, `replaced_by`
- **Relation metadata**: `cardinality` (1:1, 1:N, N:1, N:M), `inverse_of` declarations

### New Components
- **`extensions/common/` L2 extension** — Common Enterprise Extension containing universally useful classes (Activity, Contract, Report, Project, Stakeholder, Regulation, Channel, MarketSegment, Location, Decision)
- **L3 Enterprise Layer** — `enterprise/` with template and Acme Tech Solutions example
- **MkDocs Material documentation site** — full documentation at GitHub Pages
- **`scripts/json_to_owl.py`** — JSON-to-OWL/RDF Turtle converter
- **`scripts/pack_for_webprotege.py`** — WebProtégé package builder
- **`scripts/validate_governance.py`** — Automated CI governance validator (Rules G-01 through G-08)

### Schema & Platform Updates
- **`maxItems: 25` constraint** in `core_schema.json` for class cap enforcement
- **`extension_schema.json` `extends` field** now supports both string and array format
- **All L0 platform bindings updated** to v2.0 (OWL/RDF, JSON-LD, GraphQL, SQL DDL)
- **Generalized relation domains/ranges** for better L2 reuse

## 📐 Four-Layer Architecture

| Layer | Purpose | Stability |
|:---|:---|:---|
| L0 Platform | Technical serialization for specific platforms | High |
| L1 Core | Universal enterprise semantic concepts (24 classes) | Very High |
| L2 Extensions | Industry-specific extensions | High |
| L3 Enterprise | Private customizations | Flexible |

### L1 Core Domain Structure (v2.0)

```
L1 Core (24 classes)
├── Entity (abstract)
│   ├── Party (abstract)
│   │   ├── Person, Organization, OrgUnit
│   └── Resource (abstract)
│       ├── ProductService, Asset, DataObject, Document, SystemApplication
├── Governance (abstract)
│   ├── Policy, Standard, Rule, Metric, Goal, KPI
├── Operational (abstract)
│   ├── Process, Event, Capability, Risk, Project
├── Measurement (abstract)
│   └── TimePoint
```

## 🚀 Migration Guide

For projects upgrading from v1.x:

1. Replace `"parent": "BusinessObject"` → `"parent": "Resource"` in all L2/L3 JSON files
2. Replace `"parent": "DocumentRecord"` → `"parent": "Document"`
3. Move any `Activity` references to depend on `extensions/common/`
4. Update relation names: `belongs_to` → `part_of`, `is_accountable_for` → `accountable_for`
5. Remove references to `constrained_by`, `supports`, `requires_decision`
6. Re-run `scripts/json_to_owl.py` to regenerate platform bindings

## 📄 License

Apache License 2.0 — free for commercial use, modification, and distribution.
