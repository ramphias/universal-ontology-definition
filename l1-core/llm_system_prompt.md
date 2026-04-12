# Universal Enterprise Ontology Core
Generated: N/A
Layers: 
Stats: 24 classes, 13 relations, 8 attributes, 8 instances

## Class Hierarchy

- **Entity** 实体 (abstract)
  - **Party** 主体 (abstract)
    - **Organization** 组织
      - **OrgUnit** 组织单元
    - **Person** 人员
  - **Resource** 资源 (abstract)
    - **Asset** 资产
    - **DataObject** 数据对象
      - **Document** 文档与记录
    - **ProductService** 产品与服务
    - **SystemApplication** 系统应用
- **Governance** 治理 (abstract)
  - **Control** 控制
  - **Policy** 政策
  - **Risk** 风险
  - **Rule** 规则
- **Measurement** 度量 (abstract)
  - **Goal** 目标
  - **KPI** 关键指标
- **Operational** 运营 (abstract)
  - **Capability** 能力
  - **Event** 事件
  - **Process** 流程
  - **Role** 角色

## Relations

| Relation | Domain | Range | Description |
|:--|:--|:--|:--|
| plays_role | Party | Role | A party plays a specific role |
| part_of | None | None | An entity is part of another entity (unifies belongs_to and  |
| owns | Party | Resource | A party owns or is responsible for a resource |
| accountable_for | Role | Operational | A role is accountable for an operational element (capability |
| realized_by | Capability | Process | A capability is realized by a process |
| consumes | Process | Resource | A process consumes resources |
| produces | Process | Resource | A process produces resources |
| recorded_in | DataObject | SystemApplication | A data object is recorded in a system application |
| governed_by | Operational | Governance | An operational element is governed by a governance element ( |
| mitigated_by | Risk | Control | A risk is mitigated by a control measure |
| triggered_by | Event | Process | An event triggers a process |
| measured_by | Operational | KPI | An operational element is measured by a KPI (generalizes the |
| evaluates | KPI | Goal | A KPI evaluates the achievement of a specific business goal |

## Attributes

| Attribute | Owner | Type | Required |
|:--|:--|:--|:--|
| name | Entity | string | Yes |
| description | Entity | string |  |
| email | Person | string |  |
| effective_date | Policy | date |  |
| severity | Risk | enum |  |
| target_value | KPI | decimal |  |
| unit | KPI | string |  |
| is_automated | Process | boolean |  |

## Semantic Constraints

- **ax_person_org_disjoint**: An instance cannot be both a Person and an Organization
- **ax_entity_governance_disjoint**: Entity domain and Governance domain instances are mutually exclusive
- **ax_entity_operational_disjoint**: Entity domain and Operational domain instances are mutually exclusive
- **ax_entity_measurement_disjoint**: Entity domain and Measurement domain instances are mutually exclusive
- **ax_governance_operational_disjoint**: Governance domain and Operational domain instances are mutually exclusive
- **ax_governance_measurement_disjoint**: Governance domain and Measurement domain instances are mutually exclusive
- **ax_operational_measurement_disjoint**: Operational domain and Measurement domain instances are mutually exclusive
- **ax_policy_rule_disjoint**: An instance cannot be both a Policy and a Rule
- **ax_part_of_transitive**: If A is part of B and B is part of C, then A is part of C
- **ax_part_of_asymmetric**: If A is part of B, then B cannot be part of A