# L2 Manufacturing Extension / L2 制造业扩展

L2 Manufacturing Industry and Domain Extension — 27 classes, 11 relations (v1.0.0).

L2 制造业扩展 —— 包含 27 个类、11 个关系（v1.0.0）。

> Source: [`l2-extensions/manufacturing/manufacturing_extension_v1.json`](https://github.com/ramphias/universal-ontology-definition/blob/main/l2-extensions/manufacturing/manufacturing_extension_v1.json)


---


## Classes / 类 (27)


| ID | EN | ZH | Parent | Definition (EN) |
|:---|:---|:---|:---|:---|
| `Factory` | Factory | 工厂 | `Organization` | A physical entity engaged in product manufacturing, comprising one or more workshops and production lines |
| `Workshop` | Workshop | 车间 | `OrgUnit` | A production area within a factory organized by process or product type |
| `ProductionLine` | Production Line | 产线 | `OrgUnit` | A sequence of equipment and workstations arranged for mass production of a specific product |
| `Warehouse` | Warehouse | 仓库 | `OrgUnit` | Physical storage for raw materials, work-in-progress, and finished goods |
| `ManufacturedProduct` | Manufactured Product | 制造产品 | `ProductService` | Finished or semi-finished goods produced by a factory |
| `RawMaterial` | Raw Material | 原材料 | `Asset` | Input materials for manufacturing, including metals, chemicals, electronic components |
| `BillOfMaterials` | Bill of Materials (BOM) | 物料清单 | `Document` | Structured list of all components and raw materials required for a product |
| `WorkOrder` | Work Order | 工单 | `Document` | A manufacturing instruction to produce a specific quantity of a product |
| `QualityInspectionReport` | Quality Inspection Report | 质检报告 | `Document` | Record of quality inspection results for a product or process |
| `Equipment` | Equipment | 生产设备 | `Asset` | Machinery, tooling, and fixtures used for processing, assembly, and inspection |
| `MaintenanceOrder` | Maintenance Order | 维保工单 | `Document` | Work instruction for preventive maintenance or corrective repair of equipment |
| `Supplier` | Supplier | 供应商 | `Organization` | External enterprise supplying raw materials, components, or services to a factory |
| `ProductionPlanner` | Production Planner | 生产计划员 | `Role` | A role responsible for creating and adjusting production plans and scheduling |
| `QualityInspector` | Quality Inspector | 质检员 | `Role` | A quality control role performing incoming, in-process, and final inspections |
| `MaintenanceTechnician` | Maintenance Technician | 维修技师 | `Role` | A technical role responsible for equipment maintenance, troubleshooting, and repair |
| `QualityPolicy` | Quality Policy | 质量政策 | `Policy` | Top-level quality management system policy, typically based on ISO 9001 |
| `DefectRisk` | Defect Risk | 质量缺陷风险 | `Risk` | Risk of product defects leading to rework, returns, or recalls |
| `SupplyDisruptionRisk` | Supply Disruption Risk | 供应中断风险 | `Risk` | Risk of raw material supply interruption due to supplier, logistics, or geopolitical factors |
| `ProductionPlanningProcess` | Production Planning Process | 生产计划流程 | `Process` | End-to-end planning from demand forecast, master production schedule to detailed scheduling |
| `QualityControlProcess` | Quality Control Process | 质量控制流程 | `Process` | Full-chain quality management from incoming inspection, in-process control to final inspection |
| `MaintenanceProcess` | Maintenance Process | 设备维护流程 | `Process` | Management process for preventive, predictive, and corrective maintenance |
| `LeanManufacturingCapability` | Lean Manufacturing Capability | 精益制造能力 | `Capability` | Organizational capability to eliminate waste, continuously improve, and achieve efficient production |
| `MESSystem` | Manufacturing Execution System | 制造执行系统 | `SystemApplication` | Information system managing and monitoring shop-floor production execution |
| `SCADASystem` | SCADA System | 数据采集与监控系统 | `SystemApplication` | Industrial control system for real-time equipment data acquisition and process monitoring |
| `OEE` | Overall Equipment Effectiveness | 设备综合效率 | `KPI` | Availability × Performance × Quality — measures equipment output efficiency |
| `YieldRate` | Yield Rate | 良品率 | `KPI` | Ratio of conforming units to total units produced |
| `InventoryTurnover` | Inventory Turnover | 库存周转率 | `KPI` | Number of times inventory is consumed and replenished in a period, measuring inventory management efficiency |

## Relations / 关系 (11)


| ID | Domain | Range | Definition (EN) |
|:---|:---|:---|:---|
| `has_workshop` | `Factory` | `Workshop` | A factory has workshops |
| `has_production_line` | `Workshop` | `ProductionLine` | A workshop contains production lines |
| `produces_product` | `ProductionLine` | `ManufacturedProduct` | A production line produces a manufactured product |
| `defined_by_bom` | `ManufacturedProduct` | `BillOfMaterials` | A product is defined by a bill of materials |
| `consumes_material` | `WorkOrder` | `RawMaterial` | A work order consumes raw materials |
| `inspected_by` | `ManufacturedProduct` | `QualityInspectionReport` | A product is inspected and documented in a quality inspection report |
| `maintained_by` | `Equipment` | `MaintenanceOrder` | Equipment is maintained through maintenance orders |
| `supplies_to` | `Supplier` | `Factory` | A supplier provides materials to a factory |
| `scheduled_by` | `WorkOrder` | `ProductionPlanningProcess` | A work order is scheduled by the production planning process |
| `monitored_by_mes` | `ProductionLine` | `MESSystem` | A production line is monitored by the MES system |
| `controlled_by_scada` | `Equipment` | `SCADASystem` | Equipment data is collected and monitored by the SCADA system |
