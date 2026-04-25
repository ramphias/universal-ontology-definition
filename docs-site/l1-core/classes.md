# Classes Reference

All 24 core classes defined in L1 v2.0, organized by their **4 abstract domains** (`Entity`, `Governance`, `Operational`, `Measurement`). Within the Entity domain, `Party` and `Resource` are intermediate abstract classes used as relation signatures (e.g. `owns: Party → Resource`). In total there are **6 abstract classes** (4 domain roots + Party + Resource) and **18 concrete leaf classes**. Every class is available for inheritance by L2 Industry and Domain Extensions and L3 enterprise extensions.

---

## 🟦 Entity Domain

*Top-level abstraction for all identifiable and manageable things.*

### Entity (Abstract)

| Field | Value |
|:---|:---|
| **ID** | `Entity` |
| **中文** | 实体 |
| **Parent** | — (root class) |
| **Definition** | Top-level abstraction for all identifiable and manageable things |
| **定义** | 所有可被识别和管理的事物的顶层抽象 |

### Party (Abstract)

| Field | Value |
|:---|:---|
| **ID** | `Party` |
| **中文** | 主体 |
| **Parent** | `Entity` |
| **Definition** | The superclass of all entities that can participate in business and governance relationships |
| **定义** | 可参与业务关系与治理关系的主体总类 |

### Person

| Field | Value |
|:---|:---|
| **ID** | `Person` |
| **中文** | 人员 |
| **Parent** | `Party` |
| **Definition** | A natural person entity |
| **定义** | 自然人主体 |

### Organization

| Field | Value |
|:---|:---|
| **ID** | `Organization` |
| **中文** | 组织 |
| **Parent** | `Party` |
| **Definition** | A legal or non-legal organization entity |
| **定义** | 法人或非法人组织 |

### OrgUnit

| Field | Value |
|:---|:---|
| **ID** | `OrgUnit` |
| **中文** | 组织单元 |
| **Parent** | `Organization` |
| **Definition** | Internal organizational units such as departments, teams, committees, and program groups |
| **定义** | 部门、团队、委员会、项目群等组织内部单元 |

### Resource (Abstract)

| Field | Value |
|:---|:---|
| **ID** | `Resource` |
| **中文** | 资源 |
| **Parent** | `Entity` |
| **Definition** | Tangible or intangible resources created, modified, managed, or consumed by business processes |
| **定义** | 被业务过程创建、变更、管理、消费的有形或无形资源 |

### ProductService

| Field | Value |
|:---|:---|
| **ID** | `ProductService` |
| **中文** | 产品与服务 |
| **Parent** | `Resource` |
| **Definition** | Products and services provided externally or used internally by an enterprise |
| **定义** | 企业对外提供或内部使用的产品和服务对象 |

### Asset

| Field | Value |
|:---|:---|
| **ID** | `Asset` |
| **中文** | 资产 |
| **Parent** | `Resource` |
| **Definition** | Financial, physical, knowledge, data, brand, and other assets |
| **定义** | 财务、实物、知识、数据、品牌等资产 |

### DataObject

| Field | Value |
|:---|:---|
| **ID** | `DataObject` |
| **中文** | 数据对象 |
| **Parent** | `Resource` |
| **Definition** | A structured or unstructured data entity |
| **定义** | 结构化或非结构化的数据实体 |

### Document

| Field | Value |
|:---|:---|
| **ID** | `Document` |
| **中文** | 文档与记录 |
| **Parent** | `DataObject` |
| **Definition** | Contracts, reports, files, documents, and records |
| **定义** | 合同、报告、文件、单据、记录 |

### SystemApplication

| Field | Value |
|:---|:---|
| **ID** | `SystemApplication` |
| **中文** | 系统应用 |
| **Parent** | `Resource` |
| **Definition** | Software systems supporting processes, data, and decision-making |
| **定义** | 支撑流程、数据和决策的软件系统 |

---

## 🟨 Governance Domain

*Abstract domain for constraints, governance, and risk management.*

### Governance (Abstract)

| Field | Value |
|:---|:---|
| **ID** | `Governance` |
| **中文** | 治理 |
| **Parent** | — (root class) |
| **Definition** | Abstract domain for constraints, governance, and risk management |
| **定义** | 用于约束、治理和风险管控的抽象域 |

### Policy

| Field | Value |
|:---|:---|
| **ID** | `Policy` |
| **中文** | 政策 |
| **Parent** | `Governance` |
| **Definition** | Management principles and constraint requirements |
| **定义** | 管理原则与约束要求 |

### Rule

| Field | Value |
|:---|:---|
| **ID** | `Rule` |
| **中文** | 规则 |
| **Parent** | `Governance` |
| **Definition** | Executable and evaluable business or control rules |
| **定义** | 可执行、可判断的业务或控制规则 |

### Control

| Field | Value |
|:---|:---|
| **ID** | `Control` |
| **中文** | 控制 |
| **Parent** | `Governance` |
| **Definition** | Control measures to reduce risk and ensure compliance and quality |
| **定义** | 用于降低风险、保障合规和质量的控制措施 |

### Risk

| Field | Value |
|:---|:---|
| **ID** | `Risk` |
| **中文** | 风险 |
| **Parent** | `Governance` |
| **Definition** | Uncertain events or conditions that may affect goal achievement |
| **定义** | 可能影响目标实现的不确定事件或状态 |

---

## 🟩 Operational Domain

*Abstract domain describing how an organization operates, including roles, capabilities, processes, and events.*

### Operational (Abstract)

| Field | Value |
|:---|:---|
| **ID** | `Operational` |
| **中文** | 运营 |
| **Parent** | — (root class) |
| **Definition** | Abstract domain describing how an organization operates, including roles, capabilities, processes, and events |
| **定义** | 描述组织运作方式的抽象域，包含角色、能力、流程与事件 |

### Role

| Field | Value |
|:---|:---|
| **ID** | `Role` |
| **中文** | 角色 |
| **Parent** | `Operational` |
| **Definition** | An identity or responsibility assumed by a party in a given context |
| **定义** | 主体在某一上下文中承担的身份或职责 |

### Capability

| Field | Value |
|:---|:---|
| **ID** | `Capability` |
| **中文** | 能力 |
| **Parent** | `Operational` |
| **Definition** | A stable and reusable business capability possessed by an organization |
| **定义** | 组织稳定具备且可被复用的业务能力 |

### Process

| Field | Value |
|:---|:---|
| **ID** | `Process` |
| **中文** | 流程 |
| **Parent** | `Operational` |
| **Definition** | An end-to-end sequence of activities defined to achieve business objectives; sub-activities expressed via part_of relation |
| **定义** | 为实现业务目标而定义的端到端活动序列，可通过 part_of 关系表达子活动 |

### Event

| Field | Value |
|:---|:---|
| **ID** | `Event` |
| **中文** | 事件 |
| **Parent** | `Operational` |
| **Definition** | A state change occurring in the business or technical environment |
| **定义** | 发生在业务或技术环境中的状态变化 |

---

## 🟪 Measurement Domain

*Abstract domain for goal-setting and performance measurement.*

### Measurement (Abstract)

| Field | Value |
|:---|:---|
| **ID** | `Measurement` |
| **中文** | 度量 |
| **Parent** | — (root class) |
| **Definition** | Abstract domain for goal-setting and performance measurement |
| **定义** | 描述目标设定与绩效衡量的抽象域 |

### Goal

| Field | Value |
|:---|:---|
| **ID** | `Goal` |
| **中文** | 目标 |
| **Parent** | `Measurement` |
| **Definition** | Outcomes an organization aims to achieve |
| **定义** | 组织希望达成的结果 |

### KPI

| Field | Value |
|:---|:---|
| **ID** | `KPI` |
| **中文** | 关键指标 |
| **Parent** | `Measurement` |
| **Definition** | Metrics that measure the degree of goal achievement |
| **定义** | 衡量目标达成程度的指标 |
