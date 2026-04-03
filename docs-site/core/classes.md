# Classes Reference

All 25 core classes defined in L1, organized by category. Each class is available for inheritance by L2 industry addons and L3 enterprise extensions.

---

## Party & Organization

### Party

| Field | Value |
|:---|:---|
| **ID** | `Party` |
| **中文** | 主体 |
| **Parent** | — (root class) |
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

### Role

| Field | Value |
|:---|:---|
| **ID** | `Role` |
| **中文** | 角色 |
| **Parent** | — (root class) |
| **Definition** | An identity or responsibility assumed by a party in a given context |
| **定义** | 主体在某一上下文中承担的身份或职责 |

---

## Capability & Process

### Capability

| Field | Value |
|:---|:---|
| **ID** | `Capability` |
| **中文** | 能力 |
| **Parent** | — (root class) |
| **Definition** | A stable and reusable business capability possessed by an organization |
| **定义** | 组织稳定具备且可被复用的业务能力 |

### Process

| Field | Value |
|:---|:---|
| **ID** | `Process` |
| **中文** | 流程 |
| **Parent** | — (root class) |
| **Definition** | An end-to-end sequence of activities defined to achieve business objectives |
| **定义** | 为实现业务目标而定义的端到端活动序列 |

### Activity

| Field | Value |
|:---|:---|
| **ID** | `Activity` |
| **中文** | 活动 |
| **Parent** | — (root class) |
| **Definition** | An executable step within a process |
| **定义** | 流程中的可执行步骤 |

---

## Business Objects

### BusinessObject

| Field | Value |
|:---|:---|
| **ID** | `BusinessObject` |
| **中文** | 业务对象 |
| **Parent** | — (root class) |
| **Definition** | An object created, modified, or managed by business processes |
| **定义** | 被业务过程创建、变更、管理的对象 |

### ProductService

| Field | Value |
|:---|:---|
| **ID** | `ProductService` |
| **中文** | 产品与服务 |
| **Parent** | `BusinessObject` |
| **Definition** | Products and services provided externally or used internally by an enterprise |
| **定义** | 企业对外提供或内部使用的产品和服务对象 |

### Asset

| Field | Value |
|:---|:---|
| **ID** | `Asset` |
| **中文** | 资产 |
| **Parent** | `BusinessObject` |
| **Definition** | Financial, physical, knowledge, data, brand, and other assets |
| **定义** | 财务、实物、知识、数据、品牌等资产 |

---

## Data & Systems

### DataObject

| Field | Value |
|:---|:---|
| **ID** | `DataObject` |
| **中文** | 数据对象 |
| **Parent** | — (root class) |
| **Definition** | A structured or unstructured data entity |
| **定义** | 结构化或非结构化的数据实体 |

### DocumentRecord

| Field | Value |
|:---|:---|
| **ID** | `DocumentRecord` |
| **中文** | 文档与记录 |
| **Parent** | `DataObject` |
| **Definition** | Contracts, reports, files, documents, and records |
| **定义** | 合同、报告、文件、单据、记录 |

### SystemApplication

| Field | Value |
|:---|:---|
| **ID** | `SystemApplication` |
| **中文** | 系统应用 |
| **Parent** | — (root class) |
| **Definition** | Software systems supporting processes, data, and decision-making |
| **定义** | 支撑流程、数据和决策的软件系统 |

---

## Governance & Compliance

### Policy

| Field | Value |
|:---|:---|
| **ID** | `Policy` |
| **中文** | 政策 |
| **Parent** | — (root class) |
| **Definition** | Management principles and constraint requirements |
| **定义** | 管理原则与约束要求 |

### Rule

| Field | Value |
|:---|:---|
| **ID** | `Rule` |
| **中文** | 规则 |
| **Parent** | — (root class) |
| **Definition** | Executable and evaluable business or control rules |
| **定义** | 可执行、可判断的业务或控制规则 |

### Control

| Field | Value |
|:---|:---|
| **ID** | `Control` |
| **中文** | 控制 |
| **Parent** | — (root class) |
| **Definition** | Control measures to reduce risk and ensure compliance and quality |
| **定义** | 用于降低风险、保障合规和质量的控制措施 |

### Risk

| Field | Value |
|:---|:---|
| **ID** | `Risk` |
| **中文** | 风险 |
| **Parent** | — (root class) |
| **Definition** | Uncertain events or conditions that may affect goal achievement |
| **定义** | 可能影响目标实现的不确定事件或状态 |

---

## Decision & Measurement

### Event

| Field | Value |
|:---|:---|
| **ID** | `Event` |
| **中文** | 事件 |
| **Parent** | — (root class) |
| **Definition** | A state change occurring in the business or technical environment |
| **定义** | 发生在业务或技术环境中的状态变化 |

### Decision

| Field | Value |
|:---|:---|
| **ID** | `Decision` |
| **中文** | 决策 |
| **Parent** | — (root class) |
| **Definition** | Choices and approvals made regarding events, rules, or goals |
| **定义** | 对事件、规则或目标做出的选择与批准 |

### Goal

| Field | Value |
|:---|:---|
| **ID** | `Goal` |
| **中文** | 目标 |
| **Parent** | — (root class) |
| **Definition** | Outcomes an organization aims to achieve |
| **定义** | 组织希望达成的结果 |

### KPI

| Field | Value |
|:---|:---|
| **ID** | `KPI` |
| **中文** | 关键指标 |
| **Parent** | — (root class) |
| **Definition** | Metrics that measure the degree of goal achievement |
| **定义** | 衡量目标达成程度的指标 |

---

## Market & Channel

### Location

| Field | Value |
|:---|:---|
| **ID** | `Location` |
| **中文** | 地点 |
| **Parent** | — (root class) |
| **Definition** | Places where organizational operations or transactions occur |
| **定义** | 组织运营或交易发生的地点 |

### Channel

| Field | Value |
|:---|:---|
| **ID** | `Channel` |
| **中文** | 渠道 |
| **Parent** | — (root class) |
| **Definition** | Channels for interacting with customers, partners, or internal users |
| **定义** | 与客户、伙伴或内部用户交互的渠道 |

### MarketSegment

| Field | Value |
|:---|:---|
| **ID** | `MarketSegment` |
| **中文** | 市场细分 |
| **Parent** | — (root class) |
| **Definition** | Classification dimensions for customers or markets |
| **定义** | 客户或市场的分类维度 |
