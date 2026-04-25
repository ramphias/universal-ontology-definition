# L1 — Universal Enterprise Ontology Core

This directory contains the **L1 Universal Enterprise Ontology Core** for the Universal Ontology Definition framework.

本目录包含 Universal Ontology Definition 框架的 **第一层（L1）通用企业本体核心**。

## Overview

L1 defines the stable concepts that should apply across enterprises and industries. L2 industry/domain extensions and L3 enterprise customizations must inherit from this layer instead of redefining the same concepts.

L1 定义跨企业、跨行业长期稳定的通用概念。所有 L2 行业/领域扩展和 L3 企业定制都应继承此层，而不是重复定义这些基础概念。

## Current Contents

Source of truth: [`universal_ontology_v1.json`](universal_ontology_v1.json)

Current metadata version: **v2.1.0**

| Item | Count |
|:---|---:|
| Classes | 24 |
| Abstract classes | 6 |
| Concrete leaf classes | 18 |
| Attributes | 8 |
| Relations | 13 |
| Axioms | 18 |
| Sample instances | 8 |

## Class Domains

| Domain | Semantic Focus | Classes |
|:---|:---|:---|
| Entity | Physical and logical entities | `Party` *(abstract)*, `Person`, `Organization`, `OrgUnit`, `Resource` *(abstract)*, `ProductService`, `Asset`, `DataObject`, `Document`, `SystemApplication` |
| Governance | Control, compliance, and risk | `Policy`, `Rule`, `Control`, `Risk` |
| Operational | Execution and capabilities | `Role`, `Capability`, `Process`, `Event` |
| Measurement | Goals and performance | `Goal`, `KPI` |

The four domain roots are `Entity`, `Governance`, `Operational`, and `Measurement`. `Party` and `Resource` are intermediate abstract classes used in relation signatures such as `owns: Party -> Resource`.

## Core Relations

L1 defines 13 generalized relations:

`plays_role`, `part_of`, `owns`, `accountable_for`, `realized_by`, `consumes`, `produces`, `recorded_in`, `governed_by`, `mitigated_by`, `triggered_by`, `measured_by`, `evaluates`.

## Design Principles

- **Stability first**: L1 only accepts long-lived concepts that are broadly reusable across enterprises.
- **Minimal core**: Domain-specific concepts belong in L2 or L3 unless they pass the L1 governance rules.
- **Clear inheritance**: every class has an explicit parent, except the four abstract domain roots.
- **JSON is authoritative**: derived formats and documentation must follow `universal_ontology_v1.json`.

## Validation

Run these checks after changing L1:

```bash
python scripts/validate_governance.py
python scripts/validate_l3.py --all
python scripts/json_to_owl.py
```

Changes to L1 should also update the corresponding docs under `docs-site/l1-core/` and `docs-site/glossary/`.
