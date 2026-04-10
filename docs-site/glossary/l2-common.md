# L2 Common Extension / L2 通用企业扩展

The Common Enterprise Extension contains concepts that are widely used across industries but were **demoted from L1 v1.0** to maintain core stability. These concepts are not required by every enterprise, so they live in an optional extension.

通用企业扩展包含跨行业广泛使用但在 v2.0 中**从 L1 下放**的概念。这些概念并非每个企业都需要，因此作为可选扩展存在。

| Metadata | Value |
|:---|:---|
| **Layer** | `L2_common_enterprise_extension` |
| **Version** | 1.0.0 |
| **Extends** | L1 Universal Core |
| **Classes** | 10 |
| **Relations** | 5 |

---

## Entity-Domain Classes / 实体域类

### Channel / 渠道

| Field | Value |
|:---|:---|
| **ID** | `Channel` |
| **ZH** | 渠道 |
| **EN** | Channel |
| **Parent** | `Resource` (L1) |

**EN**: Channels for interacting with customers, partners, or internal users. Demoted from L1 v1.0 — not universally applicable to all enterprises.

**ZH**: 与客户、伙伴或内部用户交互的渠道。从 L1 v1.0 下放 — 并非所有企业都适用。

---

### MarketSegment / 市场细分

| Field | Value |
|:---|:---|
| **ID** | `MarketSegment` |
| **ZH** | 市场细分 |
| **EN** | Market Segment |
| **Parent** | `Resource` (L1) |

**EN**: Classification dimensions for customers or markets. Demoted from L1 v1.0 — a marketing-domain concept.

**ZH**: 客户或市场的分类维度。从 L1 v1.0 下放 — 属于营销领域概念。

---

### Location / 地点

| Field | Value |
|:---|:---|
| **ID** | `Location` |
| **ZH** | 地点 |
| **EN** | Location |
| **Parent** | `Resource` (L1) |

**EN**: Places where organizational operations or transactions occur. Demoted from L1 v1.0 — can also be modeled as an attribute.

**ZH**: 组织运营或交易发生的地点。从 L1 v1.0 下放 — 也可建模为属性。

---

### Project / 项目

| Field | Value |
|:---|:---|
| **ID** | `Project` |
| **ZH** | 项目 |
| **EN** | Project |
| **Parent** | `Resource` (L1) |

**EN**: A temporary work organization with defined scope, timeline, and objectives.

**ZH**: 有明确起止时间、范围和目标的临时性工作组织。

---

### Contract / 合同

| Field | Value |
|:---|:---|
| **ID** | `Contract` |
| **ZH** | 合同 |
| **EN** | Contract |
| **Parent** | `Document` (L1) |

**EN**: A legally binding agreement document.

**ZH**: 具有法律约束力的协议文档。

---

### Report / 报告

| Field | Value |
|:---|:---|
| **ID** | `Report` |
| **ZH** | 报告 |
| **EN** | Report |
| **Parent** | `Document` (L1) |

**EN**: A structured analytical or business report.

**ZH**: 结构化的分析报告或业务报告。

---

## Operational-Domain Classes / 运营域类

### Decision / 决策

| Field | Value |
|:---|:---|
| **ID** | `Decision` |
| **ZH** | 决策 |
| **EN** | Decision |
| **Parent** | `Event` (L1) |

**EN**: Choices and approvals made regarding events, rules, or goals; a specialized type of Event. Demoted from L1 v1.0 — semantically a state change that can be modeled as an Event subtype.

**ZH**: 对事件、规则或目标做出的选择与批准，是事件的一种特殊类型。从 L1 v1.0 下放 — 语义上是一种状态变化，可建模为 Event 的子类型。

---

### Activity / 活动

| Field | Value |
|:---|:---|
| **ID** | `Activity` |
| **ZH** | 活动 |
| **EN** | Activity |
| **Parent** | `Process` (L1) |

**EN**: An executable step within a process; a subtype of Process. Demoted from L1 v1.0 — sub-activities can be expressed via `part_of` relation on Process.

**ZH**: 流程中的可执行步骤，是流程的子类型。从 L1 v1.0 下放 — 子活动可通过 Process 上的 `part_of` 关系表达。

---

## Governance-Domain Classes / 治理域类

### Stakeholder / 利益相关方

| Field | Value |
|:---|:---|
| **ID** | `Stakeholder` |
| **ZH** | 利益相关方 |
| **EN** | Stakeholder |
| **Parent** | `Role` (L1) |

**EN**: A role with vested interest in organizational decisions or projects.

**ZH**: 对组织决策或项目有利益关系的角色。

---

### Regulation / 法规

| Field | Value |
|:---|:---|
| **ID** | `Regulation` |
| **ZH** | 法规 |
| **EN** | Regulation |
| **Parent** | `Policy` (L1) |

**EN**: Legal and regulatory requirements from external regulatory bodies.

**ZH**: 来自外部监管机构的法律法规要求。

---

## Relations / 关系

### serves_through

| Field | Value |
|:---|:---|
| **ID** | `serves_through` |
| **Domain** | `ProductService` |
| **Range** | `Channel` |

**EN**: A product or service is delivered through a channel.

**ZH**: 产品或服务通过渠道提供。

---

### targets_segment

| Field | Value |
|:---|:---|
| **ID** | `targets_segment` |
| **Domain** | `ProductService` |
| **Range** | `MarketSegment` |

**EN**: A product or service targets a specific market segment.

**ZH**: 产品或服务面向特定市场细分。

---

### located_at

| Field | Value |
|:---|:---|
| **ID** | `located_at` |
| **Domain** | `Organization` |
| **Range** | `Location` |

**EN**: An organization is located at or operates in a place.

**ZH**: 组织位于或运营在某个地点。

---

### results_in

| Field | Value |
|:---|:---|
| **ID** | `results_in` |
| **Domain** | `Decision` |
| **Range** | `Event` |

**EN**: A decision results in subsequent events or actions.

**ZH**: 决策产生后续事件或行动。

---

### complies_with

| Field | Value |
|:---|:---|
| **ID** | `complies_with` |
| **Domain** | `Process` |
| **Range** | `Regulation` |

**EN**: A process complies with regulatory requirements.

**ZH**: 流程符合法规要求。
