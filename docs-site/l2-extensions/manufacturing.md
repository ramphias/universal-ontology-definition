# Manufacturing Extension

The Manufacturing Extension extends L1 with concepts specific to discrete and process manufacturing operations.

## Overview

This extension covers:

- :factory: **Organization** — Factories, workshops, production lines, warehouses
- :package: **Products & Materials** — Manufactured products, raw materials, BOM
- :page_facing_up: **Documents** — Work orders, quality inspection reports, maintenance orders
- :busts_in_silhouette: **Roles** — Production planners, quality inspectors, maintenance technicians
- :warning: **Risk** — Defect risk, supply disruption risk
- :gear: **Processes** — Production planning, quality control, equipment maintenance
- :computer: **Systems** — MES, SCADA
- :bar_chart: **KPIs** — OEE, yield rate, inventory turnover

## Statistics

| Category | Count |
|:---|:---:|
| New Classes | 27 |
| New Relations | 11 |
| Sample Instances | 6 |

## Key Classes

| Class | Parent (L1) | Description |
|:---|:---|:---|
| `Factory` | `Organization` | Manufacturing facility with workshops and lines |
| `ProductionLine` | `OrgUnit` | Sequential equipment for mass production |
| `BillOfMaterials` | `Document` | Structured component and material list |
| `Equipment` | `Asset` | Machinery, tooling, and fixtures |
| `MESSystem` | `SystemApplication` | Shop-floor production execution system |
| `OEE` | `KPI` | Availability x Performance x Quality |

## Use Cases

- Smart factory digital twin and MES integration
- Supply chain visibility and supplier risk management
- Quality traceability from raw material to finished goods
- Predictive maintenance with equipment lifecycle data

## Source File

:material-file-code: [`manufacturing_extension_v1.json`](https://github.com/ramphias/universal-ontology-definition/blob/main/l2-extensions/manufacturing/manufacturing_extension_v1.json)
