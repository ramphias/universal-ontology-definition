# Glossary / 术语表

This glossary defines every concept used in the Universal Ontology Definition (UOD) project, organized from foundational ontology terminology to specific classes and relations. Each term includes bilingual (EN/ZH) definitions.

本术语表定义了通用本体定义（UOD）项目中使用的所有概念，从本体论基础术语到具体的类和关系逐层展开。每个术语均提供中英文双语定义。

---

## Part 1: Ontology Fundamentals / 本体论基础概念

These are the core building blocks of any ontology. Understanding them is a prerequisite for working with UOD.

以下是本体论的核心构建要素。理解这些概念是使用 UOD 的前提。

---

### Ontology / 本体

**EN**: A formal, explicit description of concepts, relationships, and constraints within a domain. An ontology provides a shared vocabulary and a machine-readable semantic model so that people, systems, and AI agents can communicate unambiguously about the same subject.

**ZH**: 对某一领域内概念、关系和约束的形式化、显式化描述。本体提供共享词汇和机器可读的语义模型，使人、系统和 AI 代理能够无歧义地讨论同一主题。

!!! tip "Analogy / 类比"
    An ontology is like a data dictionary on steroids: it doesn't just list field names, it encodes *what things are*, *how they relate to each other*, and *what rules they must obey*.

---

### Class / 类

**EN**: A class defines a **type** or **category** of concept. It is a template that describes what something *is*. Classes are organized into hierarchies through inheritance and serve as the building blocks across all four domains (Entity, Governance, Operational, Measurement). In UOD JSON files, classes appear in the `"classes"` array.

**ZH**: 类定义某一概念的**类型**或**分类**。它是描述某类事物"是什么"的模板。类通过继承组织成层次结构，是四大域（Entity、Governance、Operational、Measurement）的共同建模基础。在 UOD 的 JSON 文件中，类出现在 `"classes"` 数组中。

**Example**: `Organization` is a class; "Acme Corporation" is an instance of that class.

!!! warning "Not to confuse with / 不要混淆"
    A class is NOT an instance. `Organization` describes the *concept* of an organization; `org_acme_corp` is one *specific* organization.

---

### Abstract Class / 抽象类

**EN**: A class that **cannot be instantiated** directly. It exists only as a grouping parent for other classes. In UOD, abstract classes are marked with `"abstract": true`. The four semantic domain roots (`Entity`, `Resource`, `Governance`, `Operational`, `Measurement`) are abstract.

**ZH**: **不可直接实例化**的类。它仅作为其他类的分组父类存在。在 UOD 中，抽象类标记为 `"abstract": true`。四大语义域根类（`Entity`、`Resource`、`Governance`、`Operational`、`Measurement`）均为抽象类。

!!! warning "Not to confuse with / 不要混淆"
    An abstract class is different from a concrete class. You cannot create a `sample_instance` of type `Entity` — you must use a concrete subclass like `Organization` or `Person`.

---

### Concrete Class / 具体类

**EN**: A class that **can be instantiated**. It represents a real-world type that can have actual samples. In UOD, any class without `"abstract": true` (or with `"abstract": false`) is concrete. Examples: `Person`, `Organization`, `Process`, `KPI`.

**ZH**: **可以被实例化**的类。它代表可以拥有实际样本的现实世界类型。在 UOD 中，任何没有 `"abstract": true`（或 `"abstract": false`）的类都是具体类。例如：`Person`、`Organization`、`Process`、`KPI`。

---

### Instance / 实例

**EN**: A concrete individual that belongs to a class. Instances appear in the `"sample_instances"` array. They represent specific, named examples — not types. An instance must reference a concrete (non-abstract) class as its `"type"`.

**ZH**: 属于某个类的具体个体。实例出现在 `"sample_instances"` 数组中。它们代表具体的、有名字的样本 — 而非类型。实例必须引用一个具体类（非抽象类）作为其 `"type"`。

**Example**: `{"id": "org_acme_corp", "type": "Organization", "label": "Acme Corporation"}` — this is an instance of the `Organization` class.

---

### Relation / 关系

**EN**: A **directed connection** between two classes, describing how they are semantically linked. A relation has a **domain** (source class), a **range** (target class), and a **cardinality** constraint. In UOD JSON files, relations appear in the `"relations"` array.

**ZH**: 两个类之间的**有向连接**，描述它们的语义关联。关系有一个**域**（源类）、一个**值域**（目标类）和一个**基数**约束。在 UOD 的 JSON 文件中，关系出现在 `"relations"` 数组中。

**Example**: `plays_role` is a relation from `Party` (domain) to `Role` (range), meaning "a party plays a specific role."

---

### Attribute / 属性（数据属性）

**EN**: A **data property** that describes an intrinsic characteristic of a class using a primitive value (string, number, date, boolean, etc.). Unlike a relation (which links class to class), an attribute assigns a typed value to instances of its owner class. Subclasses inherit their parent's attributes. In UOD JSON files, attributes appear in the `"attributes"` array.

**ZH**: 用原始值（字符串、数值、日期、布尔等）描述类自身特征的**数据属性**。与关系（类到类的连接）不同，属性为所属类的实例赋予类型化的值。子类继承父类的属性。在 UOD 的 JSON 文件中，属性出现在 `"attributes"` 数组中。

**Example**: `email` is an attribute of `Person` with datatype `string`; `severity` is an attribute of `Risk` with datatype `enum` and allowed values `["low", "medium", "high", "critical"]`.

!!! warning "Not to confuse with / 不要混淆"
    An attribute (data property) assigns a **primitive value** to an instance. A relation (object property) links an instance to **another instance**. For example, a Person's `email` is an attribute, but a Person's `plays_role` is a relation.

---

### Domain / 域（关系的源端类）

**EN**: The **source class** of a relation — the class where the relationship starts. When we say `plays_role` has domain `Party`, it means only Party (and its subclasses) can be the subject of this relationship.

**ZH**: 关系的**源端类** — 关系从这个类出发。当我们说 `plays_role` 的域是 `Party` 时，意味着只有 Party（及其子类）可以作为这个关系的主语。

!!! warning "Not to confuse with / 不要混淆"
    "Domain" here is a relation property (source class). It is different from "Semantic Domain" (语义域), which refers to the four high-level groupings (Entity, Governance, Operational, Measurement).

---

### Range / 值域（关系的目标类）

**EN**: The **target class** of a relation — the class where the relationship points to. When we say `plays_role` has range `Role`, it means the object of this relationship must be a Role (or its subclass).

**ZH**: 关系的**目标类** — 关系指向的类。当我们说 `plays_role` 的值域是 `Role` 时，意味着这个关系的宾语必须是 Role（或其子类）。

---

### Cardinality / 基数

**EN**: A constraint that specifies **how many** instances can participate on each side of a relation. Common patterns:

| Cardinality | Meaning |
|:---|:---|
| `1:1` | One source maps to exactly one target |
| `1:N` | One source maps to many targets |
| `N:1` | Many sources map to one target |
| `N:M` | Many sources map to many targets |

**ZH**: 指定关系每一端可以参与**多少个**实例的约束。常见模式：

| 基数 | 含义 |
|:---|:---|
| `1:1` | 一个源对应恰好一个目标 |
| `1:N` | 一个源对应多个目标 |
| `N:1` | 多个源对应一个目标 |
| `N:M` | 多个源对应多个目标 |

---

### Inheritance / 继承

**EN**: A mechanism where a **child class** (subclass) inherits the semantic properties and relation capabilities of its **parent class** (superclass). In UOD, inheritance is declared via the `"parent"` field. A child class IS-A specialization of its parent.

**ZH**: **子类**继承其**父类**（超类）的语义属性和关系能力的机制。在 UOD 中，继承通过 `"parent"` 字段声明。子类是父类的特化（IS-A 关系）。

**Example**: `Person` inherits from `Party`, which inherits from `Entity`. Therefore, a `Person` IS-A `Party`, and a `Party` IS-A `Entity`.

```
Entity (abstract)
└── Party
    ├── Person
    └── Organization
        └── OrgUnit
```

---

### Parent / 父类

**EN**: The class that a given class inherits from, declared via the `"parent"` field. Root classes (classes with no parent) have `"parent": null`. Every non-root class must have exactly one parent — UOD uses **single inheritance**.

**ZH**: 当前类继承自的上级类，通过 `"parent"` 字段声明。根类（没有父类的类）的 `"parent"` 为 `null`。每个非根类必须有且仅有一个父类 — UOD 使用**单继承**。

---

### Axiom / 公理

**EN**: A **formal logical constraint** that classes and relations must obey. Axioms encode domain truths that go beyond simple hierarchy — for example, "Person and Organization are mutually exclusive" (disjoint axiom) or "part_of is transitive" (if A is part of B and B is part of C, then A is part of C). In UOD JSON files, axioms appear in the `"axioms"` array and map to OWL 2 constructs.

**ZH**: 类和关系必须遵守的**形式化逻辑约束**。公理编码的领域真理超越了简单层次结构 — 例如，"Person 和 Organization 互斥"（不相交公理）或"part_of 具有传递性"（如果 A 是 B 的一部分且 B 是 C 的一部分，则 A 是 C 的一部分）。在 UOD 的 JSON 文件中，公理出现在 `"axioms"` 数组中，映射到 OWL 2 构造。

See [L1 Axioms Reference](l1-axioms.md) for the full list of 18 axioms and 12 axiom types.

---

### Semantic Domain / 语义域

**EN**: One of the **four top-level groupings** that organize all L1 classes by their fundamental nature. Each domain is represented by an abstract root class. Every concrete L1 class belongs to exactly one domain. The four domains are **mutually exclusive** (enforced by disjoint axioms).

**ZH**: **四个顶层分组**之一，按事物的根本性质组织所有 L1 类。每个语义域由一个抽象根类代表。每个具体的 L1 类恰好属于一个语义域。四个语义域**互斥**（由不相交公理保证）。

| Domain | 语义域 | Abstract Root | What it answers |
|:---|:---|:---|:---|
| **Entity** | 实体域 | `Entity` | What things exist? / 有哪些事物？ |
| **Governance** | 治理域 | `Governance` | What rules and constraints apply? / 有哪些规则和约束？ |
| **Operational** | 运营域 | `Operational` | How does the organization operate? / 组织如何运作？ |
| **Measurement** | 度量域 | `Measurement` | How do we measure success? / 如何衡量成功？ |

See [Part 3: Semantic Domains in Detail](#part-3-semantic-domains-in-detail) for full breakdowns.

---

### Namespace / 命名空间

**EN**: A **URI prefix** that uniquely identifies the scope of a set of concepts. Namespaces prevent naming collisions when concepts from different layers are combined. UOD uses `https://w3id.org/uod/core/` for L1 and layer-specific URIs for L2/L3.

**ZH**: **URI 前缀**，唯一标识一组概念的作用域。命名空间在不同层的概念合并时防止命名冲突。UOD 的 L1 使用 `https://w3id.org/uod/core/`，L2/L3 使用各层特定的 URI。

---

### Deprecation / 废弃

**EN**: The process of marking a concept as **no longer recommended** for use, while keeping it temporarily available for backward compatibility. Deprecated concepts include a `"deprecated_since"` version, a `"replaced_by"` pointer (if applicable), and a migration `"note"`. UOD governance rule G-07 guarantees a **2-version grace period** before removal.

**ZH**: 将概念标记为**不再推荐使用**的过程，同时暂时保留以向后兼容。废弃概念包含 `"deprecated_since"` 版本、`"replaced_by"` 指针（如适用）和迁移 `"note"`。UOD 治理规则 G-07 保证**两个版本的宽限期**。

**Example**: `BusinessObject` was deprecated in v2.0.0, replaced by `Resource`.

---

### Lifecycle Status / 生命周期状态

**EN**: Every class, relation, and axiom has a lifecycle status indicating its maturity:

| Status | Meaning |
|:---|:---|
| `stable` | Production-ready, safe to depend on |
| `experimental` | Under evaluation, may change or be removed |
| `deprecated` | Scheduled for removal, use the replacement instead |

**ZH**: 每个类、关系和公理都有一个生命周期状态表示其成熟度：

| 状态 | 含义 |
|:---|:---|
| `stable` | 生产就绪，可安全依赖 |
| `experimental` | 评估中，可能变更或移除 |
| `deprecated` | 计划移除，请使用替代概念 |

---

## Part 2: Architecture Concepts / 架构概念

These terms describe UOD's four-layer architecture and the mechanisms for extending it.

以下术语描述 UOD 的四层架构及其扩展机制。

---

### Layer / 层

**EN**: An **architectural level** in UOD's four-layer stack. Each layer has a distinct purpose, stability guarantee, and modification scope. Layers form a one-way dependency: upper layers depend on lower layers, never the reverse.

**ZH**: UOD 四层架构中的一个**架构级别**。每层有不同的用途、稳定性保证和修改范围。层间形成单向依赖：上层依赖下层，不可反向。

---

### L0 — Platform Binding / 平台绑定层

**EN**: The **technical serialization layer** that maps L1 semantic concepts into concrete technology formats. L0 does NOT add any new semantic concepts — it only translates existing ones into formats that downstream tools can consume directly. L0 is independent of the semantic inheritance chain (L1→L2→L3).

**ZH**: **技术序列化层**，将 L1 语义概念映射为具体的技术格式。L0 **不添加**任何新的语义概念 — 它仅将已有概念翻译为下游工具可直接消费的格式。L0 独立于语义继承链（L1→L2→L3）。

| Binding | Format | Use Case |
|:---|:---|:---|
| OWL/RDF | Turtle (.ttl) | Knowledge graphs, SPARQL endpoints, Protege |
| JSON-LD | .jsonld | REST APIs, linked data |
| GraphQL | .graphql | Modern API layers |
| SQL DDL | .sql | PostgreSQL relational databases |

---

### L1 — Universal Core / 通用核心层

**EN**: The **mandatory foundation** of UOD. Defines 24 concrete classes + 4 abstract domain roots + 12 relations that are universally applicable to all enterprises across all industries. L1 is the most stable layer — changes are rare and strictly governed by rules G-01 through G-08. All L2 and L3 definitions **must** inherit from L1.

**ZH**: UOD 的**必选基础层**。定义了 24 个具体类 + 4 个抽象域根 + 12 个关系，适用于所有行业的所有企业。L1 是最稳定的层 — 变更罕见且受治理规则 G-01 至 G-08 严格约束。所有 L2 和 L3 定义**必须**继承自 L1。

---

### L2 — Industry Extension / 行业扩展层

**EN**: **Optional, pluggable** extensions that add industry-specific or domain-specific concepts on top of L1. Each extension targets a particular industry (consulting, luxury goods, etc.) and adds new classes and relations that inherit from L1 classes. Extensions are community-driven, reusable across enterprises, and validated against `schema/extension_schema.json`.

**ZH**: **可选的、可插拔的**扩展，在 L1 之上添加行业或领域特定的概念。每个扩展面向特定行业（咨询、奢侈品等），添加继承自 L1 类的新类和关系。扩展由社区驱动、可跨企业复用，并通过 `schema/extension_schema.json` 校验。

Currently available: **Common Enterprise**, **Consulting**, **Luxury Goods**.

---

### L3 — Enterprise Customization / 企业定制层

**EN**: **Private, enterprise-specific** extensions. Each organization defines its own proprietary classes, system mappings, and business rules that extend L1 and optionally L2. L3 ontologies are isolated per tenant and typically excluded from the public repository.

**ZH**: **私有的、企业特定的**扩展。每个组织定义自己专有的类、系统映射和业务规则，扩展 L1 并可选地扩展 L2。L3 本体按租户隔离，通常不纳入公开仓库。

---

### Extension / 扩展

**EN**: A packaged set of industry-specific classes and relations at L2. An extension declares which layer(s) it extends via the `"extends"` field and must include at least L1. Extensions are self-contained modules — you only load the ones relevant to your industry.

**ZH**: L2 层中打包的一组行业特定的类和关系。扩展通过 `"extends"` 字段声明其继承来源，且必须至少包含 L1。扩展是自包含的模块 — 只需加载与自身行业相关的扩展。

!!! warning "Not to confuse with / 不要混淆"
    An **Extension** (L2) adds new semantic concepts. A **Platform Binding** (L0) maps existing concepts to technical formats. They operate at different architectural levels.

---

### `extends` Declaration / `extends` 声明

**EN**: A JSON field in L2/L3 ontology files that declares the **inheritance source(s)**. It lists the layer IDs that the current ontology builds upon.

**ZH**: L2/L3 本体 JSON 文件中的一个字段，声明**继承来源**。它列出当前本体构建于其上的层 ID。

```json
"extends": ["L1_universal_organization_ontology", "L2_consulting_industry_extension"]
```

---

### `specializes` Declaration / `specializes` 声明

**EN**: A field on L2/L3 relations that declares which **parent relation** (from L1 or L2) the current relation is a specialization of. This creates a relation inheritance hierarchy analogous to class inheritance.

**ZH**: L2/L3 关系上的一个字段，声明当前关系是哪个**父关系**（来自 L1 或 L2）的特化。这创建了类似于类继承的关系继承层次。

```json
{
  "id": "designs_solution_for",
  "specializes": "staffed_on (L2)",
  "domain": "SolutionArchitectRole",
  "range": "Engagement"
}
```

---

## Part 3: Semantic Domains in Detail / 四大语义域详解

L1 organizes its 28 classes into 4 mutually exclusive semantic domains. Each domain answers a different fundamental question about the enterprise.

L1 将其 28 个类组织为 4 个互斥的语义域。每个语义域回答关于企业的不同根本问题。

---

### Entity Domain / 实体域

**EN**: The domain of **all identifiable and manageable things** — people, organizations, products, data, systems, and assets. This is the largest domain, containing 10 concrete classes under 2 abstract roots (`Entity` and `Resource`).

**ZH**: **所有可识别和可管理事物**的领域 — 人员、组织、产品、数据、系统和资产。这是最大的语义域，包含 2 个抽象根类（`Entity` 和 `Resource`）下的 10 个具体类。

```
Entity (abstract)
├── Party
│   ├── Person
│   └── Organization
│       └── OrgUnit
└── Resource (abstract)
    ├── ProductService
    ├── Asset
    ├── DataObject
    │   └── Document
    └── SystemApplication
```

| Class | ZH | What it represents |
|:---|:---|:---|
| `Party` | 主体 | Any entity that can participate in business relationships |
| `Person` | 人员 | A natural person (individual human being) |
| `Organization` | 组织 | A legal or non-legal organization |
| `OrgUnit` | 组织单元 | A department, team, or committee within an organization |
| `ProductService` | 产品与服务 | Products and services offered by the enterprise |
| `Asset` | 资产 | Valuable things owned: financial, physical, knowledge, brand |
| `DataObject` | 数据对象 | Any structured or unstructured data entity |
| `Document` | 文档与记录 | Contracts, reports, files, records |
| `SystemApplication` | 系统应用 | Software systems (ERP, CRM, etc.) |

---

### Governance Domain / 治理域

**EN**: The domain of **rules, constraints, and risk management**. It captures the governance framework that controls how an organization operates, from high-level policies down to specific controls.

**ZH**: **规则、约束和风险管理**的领域。它刻画控制组织运作方式的治理框架，从高层策略到具体控制措施。

```
Governance (abstract)
├── Policy
├── Rule
├── Control
└── Risk
```

| Class | ZH | What it represents |
|:---|:---|:---|
| `Policy` | 政策 | High-level management principles and directives (the "why") |
| `Rule` | 规则 | Executable, evaluable business or control rules (the "what") |
| `Control` | 控制 | Concrete measures to reduce risk and ensure compliance (the "how") |
| `Risk` | 风险 | Uncertain events that may affect goal achievement |

!!! tip "How to distinguish Policy, Rule, and Control / 如何区分"
    **Policy**: "We must protect customer data" (principle)
    **Rule**: "Personal data must be encrypted at rest with AES-256" (evaluable rule)
    **Control**: "Deploy encryption-at-rest on all databases and audit quarterly" (concrete measure)

---

### Operational Domain / 运营域

**EN**: The domain that describes **how an organization operates** — who does what, what capabilities exist, what processes run, and what events occur.

**ZH**: 描述**组织如何运作**的领域 — 谁做什么、有哪些能力、运行什么流程、发生什么事件。

```
Operational (abstract)
├── Role
├── Capability
├── Process
└── Event
```

| Class | ZH | What it represents |
|:---|:---|:---|
| `Role` | 角色 | An identity or responsibility assumed by a Party in a given context |
| `Capability` | 能力 | A stable, reusable business capability possessed by the organization |
| `Process` | 流程 | An end-to-end sequence of activities to achieve business objectives |
| `Event` | 事件 | A state change in the business or technical environment |

!!! tip "How to distinguish Capability and Process / 如何区分"
    **Capability**: "Supply Chain Management" — what the organization *can do* (stable, enduring).
    **Process**: "Order to Cash" — *how* it is done step by step (executable, has a start and end).
    They connect via `realized_by`: a Capability is realized by one or more Processes.

---

### Measurement Domain / 度量域

**EN**: The domain of **goal-setting and performance measurement**. It captures what the organization wants to achieve and how it measures progress.

**ZH**: **目标设定和绩效衡量**的领域。它刻画组织想要达成的目标以及如何衡量进展。

```
Measurement (abstract)
├── Goal
└── KPI
```

| Class | ZH | What it represents |
|:---|:---|:---|
| `Goal` | 目标 | Outcomes the organization aims to achieve (qualitative or directional) |
| `KPI` | 关键指标 | Metrics that measure the degree of goal achievement (quantitative) |

!!! tip "How to distinguish Goal and KPI / 如何区分"
    **Goal**: "Increase customer satisfaction" — the desired outcome.
    **KPI**: "Customer Satisfaction Score ≥ 90%" — the measurable metric.

---

## Part 4: Governance Rules / 治理规则 G-01 ~ G-08

Governance rules are hard constraints that protect L1 from entropy growth. They are enforced by `scripts/validate_governance.py` and checked in CI/CD.

治理规则是保护 L1 不发生熵增长的硬约束。由 `scripts/validate_governance.py` 执行，在 CI/CD 中检查。

| Rule | EN Description | ZH 描述 | Value |
|:---|:---|:---|:---|
| **G-01** | Maximum L1 class count | L1 类数上限（防止本体膨胀） | ≤ 25 |
| **G-02** | Maximum root classes (parent=null) | 根类上限（保持清晰的域划分） | ≤ 5 |
| **G-03** | Maximum inheritance depth | 继承深度上限（避免过深的层次） | ≤ 4 |
| **G-04** | Cross-industry validation | 跨行业验证（新 L1 类需适用于 ≥3 个行业） | ≥ 3 industries |
| **G-05** | Relation density cap | 关系密度上限（防止过度关联） | ≤ class count x 1.0 |
| **G-06** | Change velocity limit per version | 每版类变更上限（控制演进速度） | ≤ 3 classes |
| **G-07** | Deprecation grace period | 废弃宽限期（保证下游迁移时间） | 2 versions |
| **G-08** | Sample instances must be industry-neutral | 样本实例行业中立（L1 不含行业术语） | No industry terms |

---

## Part 5: Technical Terms / 技术术语

Terms related to serialization formats and tools used by UOD.

与 UOD 使用的序列化格式和工具相关的术语。

---

### OWL / Web Ontology Language

**EN**: A W3C standard language for defining ontologies on the Semantic Web. UOD uses **OWL 2** constructs for classes, properties, and axioms. OWL files are serialized in Turtle format (`.ttl`).

**ZH**: W3C 标准的语义网本体定义语言。UOD 使用 **OWL 2** 构造来定义类、属性和公理。OWL 文件以 Turtle 格式（`.ttl`）序列化。

---

### RDF / Resource Description Framework

**EN**: A W3C standard model for data interchange on the web. RDF represents information as **triples** (subject-predicate-object). OWL is built on top of RDF.

**ZH**: W3C 标准的网络数据交换模型。RDF 将信息表示为**三元组**（主语-谓语-宾语）。OWL 构建在 RDF 之上。

---

### Turtle (.ttl)

**EN**: A compact, human-readable serialization format for RDF data. UOD's `json_to_owl.py` script generates `.ttl` files from JSON source definitions.

**ZH**: RDF 数据的紧凑、人类可读的序列化格式。UOD 的 `json_to_owl.py` 脚本从 JSON 源定义生成 `.ttl` 文件。

---

### JSON-LD

**EN**: JSON for Linking Data — a method to encode linked data using JSON syntax. UOD generates JSON-LD context files (`.jsonld`) that map class and relation IDs to their full semantic URIs.

**ZH**: 用于关联数据的 JSON — 一种使用 JSON 语法编码关联数据的方法。UOD 生成 JSON-LD 上下文文件（`.jsonld`），将类和关系 ID 映射到完整的语义 URI。

---

### JSON Schema

**EN**: A vocabulary for annotating and validating JSON documents. UOD uses two schemas: `schema/core_schema.json` (validates L1) and `schema/extension_schema.json` (validates L2/L3).

**ZH**: 用于标注和验证 JSON 文档的词汇表。UOD 使用两个 schema：`schema/core_schema.json`（验证 L1）和 `schema/extension_schema.json`（验证 L2/L3）。

---

### GraphQL

**EN**: A query language for APIs. UOD generates GraphQL schema files (`.graphql`) where classes become types/interfaces and relations become fields.

**ZH**: API 查询语言。UOD 生成 GraphQL schema 文件（`.graphql`），其中类变为类型/接口，关系变为字段。

---

### SQL DDL

**EN**: SQL Data Definition Language. UOD generates PostgreSQL DDL files (`.sql`) that create tables for concrete classes and junction tables for N:M relations.

**ZH**: SQL 数据定义语言。UOD 生成 PostgreSQL DDL 文件（`.sql`），为具体类创建表，为 N:M 关系创建联结表。

---

### SPARQL

**EN**: A query language for RDF databases. Once UOD ontologies are loaded into a triple store, SPARQL can be used to query across the semantic model.

**ZH**: RDF 数据库查询语言。UOD 本体加载到三元组存储后，可使用 SPARQL 跨语义模型查询。

---

### WebProtege

**EN**: An open-source ontology editor by Stanford University. UOD provides `.zip` packages (generated by `pack_for_webprotege.py`) for direct import into WebProtege.

**ZH**: 斯坦福大学开发的开源本体编辑器。UOD 提供 `.zip` 包（由 `pack_for_webprotege.py` 生成）可直接导入 WebProtege。

---

### Semantic Versioning

**EN**: A versioning scheme (`MAJOR.MINOR.PATCH`) used by all UOD layers. MAJOR = breaking changes, MINOR = backward-compatible additions, PATCH = fixes.

**ZH**: 所有 UOD 层使用的版本号方案（`MAJOR.MINOR.PATCH`）。MAJOR = 破坏性变更，MINOR = 向后兼容的新增，PATCH = 修复。

---

## Part 6: Naming Conventions / 命名约定

| Element | Convention | Example | Rule |
|:---|:---|:---|:---|
| Class ID | `PascalCase` | `ProductService` | First letter uppercase, no underscores |
| Relation ID | `snake_case` | `plays_role` | All lowercase, underscores |
| Axiom ID | `ax_` + `snake_case` | `ax_part_of_transitive` | Must start with `ax_` prefix |
| Instance ID | `snake_case` | `org_acme_corp` | All lowercase, underscores |
| Layer ID | `L{n}_` + `snake_case` | `L1_universal_organization_ontology` | Layer prefix + descriptive name |

---

## Part 7: Disambiguation Guide / 易混淆概念消歧指南

The following concept groups are commonly confused. Each entry highlights the key difference.

以下概念组容易混淆。每条记录突出关键区别。

---

### Party vs Person vs Organization

| | Party | Person | Organization |
|:---|:---|:---|:---|
| **ZH** | 主体 | 人员 | 组织 |
| **Layer** | L1 | L1 | L1 |
| **Abstract?** | No (but acts as superclass) | No | No |
| **Key Difference** | Generic participant in business relationships | A natural individual (human being) | A legal or formal entity (company, NGO, government) |

`Party` is the **parent class** — `Person` and `Organization` are its two children. Use `Party` when the participant could be either a person or an organization.

---

### Rule vs Policy vs Control

| | Policy | Rule | Control |
|:---|:---|:---|:---|
| **ZH** | 政策 | 规则 | 控制 |
| **Answers** | Why? (Principle) | What? (Evaluable logic) | How? (Concrete measure) |
| **Example** | "Protect customer data" | "Encrypt data at rest with AES-256" | "Deploy encryption + quarterly audit" |

Policy → Rule → Control forms a governance cascade from abstract to concrete.

---

### Process vs Event vs Activity

| | Process | Event | Activity |
|:---|:---|:---|:---|
| **ZH** | 流程 | 事件 | 活动 |
| **Layer** | L1 | L1 | L2 Common |
| **Key Difference** | End-to-end sequence with a goal | A point-in-time state change | A single step within a process |
| **Has duration?** | Yes | No (instantaneous) | Yes |

`Activity` (L2) is a subtype of `Process`, representing one executable step. `Event` triggers or results from processes.

---

### Resource vs Asset vs DataObject

| | Resource | Asset | DataObject |
|:---|:---|:---|:---|
| **ZH** | 资源 | 资产 | 数据对象 |
| **Abstract?** | Yes | No | No |
| **Key Difference** | Abstract parent for all business objects | Owned valuable things (financial, physical, IP) | Structured/unstructured data entities |

`Resource` is the abstract grouping. `Asset` and `DataObject` are both subtypes of `Resource`, but they represent different kinds of things.

---

### Goal vs KPI

| | Goal | KPI |
|:---|:---|:---|
| **ZH** | 目标 | 关键指标 |
| **Key Difference** | What you want to achieve (outcome) | How you measure whether you achieved it (metric) |
| **Example** | "Improve delivery speed" | "Average delivery time ≤ 3 days" |

Connected via `measured_by`: Operational elements are measured by KPIs, which track progress toward Goals.

---

### Document vs DataObject

| | DataObject | Document |
|:---|:---|:---|
| **ZH** | 数据对象 | 文档与记录 |
| **Key Difference** | Any data entity (broad) | Specific business documents: contracts, reports, records |
| **Relationship** | Parent class | Child class (`Document` inherits from `DataObject`) |

---

### part_of vs belongs_to (deprecated)

`belongs_to` and `composed_of` were **merged into `part_of`** in v2.0.0. Use `part_of` for all containment/composition relationships. The deprecated relations are listed in the `"migration_registry"` with migration notes.

`belongs_to` 和 `composed_of` 在 v2.0.0 中**合并为 `part_of`**。所有包含/组成关系请使用 `part_of`。

---

### governed_by vs constrained_by (deprecated)

`constrained_by` was **merged into `governed_by`** in v2.0.0. `governed_by` now covers all relationships between Operational elements and Governance elements.

`constrained_by` 在 v2.0.0 中**合并为 `governed_by`**。`governed_by` 现在覆盖运营要素与治理要素之间的所有关系。

---

### Extension (L2) vs Binding (L0)

| | Extension (L2) | Binding (L0) |
|:---|:---|:---|
| **ZH** | 扩展 | 绑定 |
| **Purpose** | Adds new semantic concepts (classes, relations) | Maps existing concepts to technical formats |
| **Example** | Consulting Extension adds `Engagement`, `Deliverable` | OWL Binding serializes `Organization` as `owl:Class` |

---

### Engagement (L2 Consulting) vs Project (L2 Common)

| | Engagement | Project |
|:---|:---|:---|
| **ZH** | 咨询项目/签约项目 | 项目 |
| **Layer** | L2 Consulting | L2 Common |
| **Parent** | `Resource` | `Resource` |
| **Key Difference** | Client-contracted consulting delivery with budget, team, and scope | Any temporary work organization with defined scope and timeline |

---

### Methodology vs Framework (L2 Consulting)

| | Methodology | Framework |
|:---|:---|:---|
| **ZH** | 方法论 | 分析框架 |
| **Key Difference** | A complete process approach (Design Thinking, Lean Six Sigma) | A structured analysis tool (Porter's Five Forces, SWOT) |
| **Parent** | `KnowledgeAsset` | `KnowledgeAsset` |

---

### Abstract Class vs Concrete Class

| | Abstract Class | Concrete Class |
|:---|:---|:---|
| **ZH** | 抽象类 | 具体类 |
| **Can be instantiated?** | No | Yes |
| **Purpose** | Structural grouping / domain root | Represents real-world types |
| **L1 Examples** | `Entity`, `Resource`, `Governance`, `Operational`, `Measurement` | `Person`, `Organization`, `Process`, `KPI`, etc. |

---

### Class vs Instance

| | Class | Instance |
|:---|:---|:---|
| **ZH** | 类 | 实例 |
| **What it represents** | A type/category (template) | A specific, named individual |
| **JSON location** | `"classes"` array | `"sample_instances"` array |
| **Example** | `Organization` | `org_acme_corp` (Acme Corporation) |

---

### Capability vs Process

| | Capability | Process |
|:---|:---|:---|
| **ZH** | 能力 | 流程 |
| **Key Difference** | What the org *can do* (enduring, stable) | *How* it is done step by step (executable) |
| **Connected by** | `realized_by` — a Capability is realized by one or more Processes |
| **Example** | "Supply Chain Management" | "Order to Cash" |

---

## Subpage Index / 子页面索引

For detailed reference of every class, relation, and axiom:

| Page | Content |
|:---|:---|
| [L1 Classes](l1-classes.md) | All 28 L1 classes with hierarchy tree and bilingual definitions |
| [L1 Relations](l1-relations.md) | All 12 L1 relations + 6 deprecated relations |
| [L1 Axioms](l1-axioms.md) | All 18 L1 axioms + 12 axiom type explanations |
| [L2 Common Extension](l2-common.md) | 10 classes + 5 relations from Common Enterprise Extension |
| [L2 Consulting](l2-consulting.md) | ~54 classes + ~48 relations from Consulting Industry Extension |
| [L2 Luxury Goods](l2-luxury-goods.md) | ~41 classes + ~14 relations from Luxury Goods Industry Extension |
