# Common Enterprise Extension

**Layer**: L2 — Common Enterprise Extension  
**Version**: 1.0.0  
**Extends**: L1 Universal Enterprise Ontology Core v2.0+

## Overview

This extension provides commonly-needed enterprise concepts that are not part of the L1 universal core. These concepts are widely applicable but not universally required across all enterprise types.

### Included Concepts

Several classes in this extension were **demoted from L1 v1.x** during the v2.0 anti-entropy refactoring:

| Class | Origin | Rationale for Demotion |
|:---|:---|:---|
| `Channel` | L1 v1.0 | Not applicable to all enterprises (e.g., pure B2B SaaS) |
| `MarketSegment` | L1 v1.0 | Marketing-domain concept, not universally core |
| `Location` | L1 v1.0 | Can be modeled as an attribute; not always a first-class entity |
| `Decision` | L1 v1.0 | Modeled as `Event` subtype; not a separate root concept |
| `Activity` | L1 v1.0 | Modeled as `Process` subtype; sub-steps via `part_of` relation |

Additionally, this extension provides useful extensions:

| Class | Parent | Description |
|:---|:---|:---|
| `Contract` | Document | Legally binding agreements |
| `Report` | Document | Structured analytical reports |
| `Project` | Resource | Temporary work organizations |
| `Stakeholder` | Role | Interested parties in decisions |
| `Regulation` | Policy | External regulatory requirements |

## Usage

Include this extension when your enterprise model needs channels, locations, market segmentation, or formal decision tracking. Most L2 Industry and Domain Extension can depend on this common extension.

```json
{
  "extends": ["L1_universal_organization_ontology", "L2_common_enterprise_extension"]
}
```
