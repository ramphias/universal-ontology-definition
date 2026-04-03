# 四层 Ontology 架构详解 | Four-Layer Architecture

## 1. 架构总览

Universal Ontology Definition 采用**技术层—通用层—行业层—企业层**四层架构，解决"技术—共性—行业—个性"的平衡问题。

```
┌─────────────────────────────────────────────────────────────────────┐
│  L3: 企业个性化定制层 (Enterprise Customization)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                          │
│  │  企业 A   │  │  企业 B   │  │  企业 C   │   ← 租户隔离，私有扩展    │
│  │ 专属对象  │  │ 系统映射  │  │ 本地规则  │                          │
│  └──────────┘  └──────────┘  └──────────┘                          │
├─────────────────────────────────────────────────────────────────────┤
│  L2: 行业与业务领域 Addon (Industry Addons)                         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                     │
│  │ 咨询 │ │ 奢侈品│ │ 金融 │ │ 制造 │ │ 零售 │  ← 可选加载，社区维护  │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘                     │
├─────────────────────────────────────────────────────────────────────┤
│  L1: 通用企业 Ontology Core (Universal Core)                        │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Party · Organization · Role · Capability · Process · Risk    │  │
│  │ Goal · KPI · DataObject · SystemApplication · Policy · Rule  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                            ← 强制继承，稳定基础     │
├═════════════════════════════════════════════════════════════════════┤
│  L0: 技术平台绑定层 (Platform & Syntax Bindings)          [NEW]     │
│  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌───────────┐  │
│  │ OWL/RDF │ │ JSON-LD │ │ GraphQL  │ │ SQL DDL │ │ Protobuf  │  │
│  │ Binding │ │ Context │ │  Schema  │ │ Mapping │ │  Schema   │  │
│  └─────────┘ └─────────┘ └──────────┘ └─────────┘ └───────────┘  │
│                                ← 技术格式映射，多平台输出           │
└─────────────────────────────────────────────────────────────────────┘
```

## 2. 各层职责

### L0 — 技术平台绑定层 (Platform & Syntax Bindings)

| 维度 | 说明 |
|:---|:---|
| **定位** | 将 L1 抽象语义概念映射到具体技术实现格式 |
| **范围** | OWL/RDF 序列化、JSON-LD Context、GraphQL Schema、SQL DDL、Protobuf 等 |
| **稳定性** | 高 — 随技术标准演进而更新 |
| **修改权** | 项目维护者 + 平台贡献者 |
| **关系** | L1 的概念模型通过 L0 映射为可执行的技术格式 |

**L0 解决的问题**：将「什么是 Organization」（语义定义）与「Organization 在 OWL 中怎么表达、在 SQL 中怎么建表」（技术实现）分离，使同一套语义核心可同时服务于知识图谱、REST API、关系数据库等不同技术栈。

### L1 — 通用企业 Ontology Core

| 维度 | 说明 |
|:---|:---|
| **定位** | 适用于所有企业的通用概念模型 |
| **范围** | 主体、组织、角色、能力、流程、业务对象、数据、系统、治理、风险、目标、度量 |
| **稳定性** | 极高 — 只接纳长期稳定、跨行业共性的抽象 |
| **修改权** | 仅项目维护者可修改，需社区投票审核 |
| **继承** | 所有 L2、L3 必须继承 L1 |

### L2 — 行业与业务领域 Addon

| 维度 | 说明 |
|:---|:---|
| **定位** | 特定行业或业务领域的概念扩展 |
| **范围** | 行业特有实体、关系、角色、流程、规则、指标 |
| **稳定性** | 较高 — 需要跨企业复用证明 |
| **修改权** | 行业贡献者 + 项目维护者 |
| **继承** | 继承 L1，通过 `extends` 字段声明 |

### L3 — 企业个性化定制层

| 维度 | 说明 |
|:---|:---|
| **定位** | 企业私有的定制扩展 |
| **范围** | 企业专属对象、系统映射、组织约束、内部术语 |
| **稳定性** | 灵活 — 企业自主管理 |
| **修改权** | 企业管理员 |
| **继承** | 继承 L1 + 所选 L2 Addon |

## 3. 层间关系

### 3.1 语义继承 (L1 → L2 → L3)

```
L3 企业层
  │ extends
  ├── L2 行业 Addon (可选多个)
  │     │ extends
  │     └── L1 通用 Core (必选)
  │
  └── L1 通用 Core (直接继承)
```

- **新增**：下层可自由新增类、关系、属性、规则
- **继承**：下层自动继承上层所有已发布元素
- **覆盖**：仅允许覆盖标签、别名等元数据；核心定义默认不可覆盖
- **保护**：上层可将核心元素标记为 protected，下层不能删除或重写

### 3.2 技术映射 (L1 → L0)

```
L1 通用 Core (语义模型)
  │
  │ "is serialized by"
  ▼
L0 Platform Bindings (技术格式)
  ├── OWL/RDF   → 语义网、知识图谱、SPARQL
  ├── JSON-LD   → REST API、关联数据、Web 标准
  ├── GraphQL   → 现代 API 层、前端集成
  └── SQL DDL   → 关系数据库、数据仓库
```

L0 不参与语义继承链，而是提供 L1 语义模型到具体技术平台的**映射绑定**。

### 3.3 类的继承示例

```json
// L1 Core 定义
{ "id": "Organization", "label_zh": "组织", "parent": null }

// L2 咨询行业 Addon — 继承 Organization
{ "id": "ConsultingFirm", "label_zh": "咨询公司", "parent": "Organization" }

// L2 奢侈品行业 Addon — 继承 Organization
{ "id": "LuxuryBrand", "label_zh": "奢侈品牌", "parent": "Organization" }

// L3 企业定制 — 继承 ConsultingFirm
{ "id": "MyCompany_DigitalPractice", "label_zh": "数字化实践部", "parent": "ConsultingFirm" }
```

### 3.4 平台绑定示例

同一个 `Organization` 类在不同 L0 绑定中的表现：

**OWL/RDF (Turtle)**:
```turtle
uod:Organization a owl:Class ;
    rdfs:subClassOf uod:Party ;
    rdfs:label "Organization"@en ;
    rdfs:label "组织"@zh .
```

**GraphQL**:
```graphql
type Organization implements Party {
  id: ID!
  labelZh: String!
  labelEn: String!
  units: [OrgUnit!]!
}
```

**SQL DDL**:
```sql
CREATE TABLE organization (
    id UUID PRIMARY KEY REFERENCES party(id),
    legal_name VARCHAR(500),
    industry VARCHAR(100)
);
```

## 4. 冲突处理

| 场景 | 处理策略 |
|:---|:---|
| L2 新增的类名与 L1 重复 | 系统预警，要求重命名或使用前缀 |
| 两个 L2 Addon 中同名类 | 加载时冲突检测，需人工裁决 |
| L3 尝试重定义 L1/L2 的核心概念 | 拦截并提示，需审批 |
| L0 绑定间的映射不一致 | 以 L1 JSON 定义为 source of truth |

## 5. 版本管理

- 每层独立版本号，遵循 [Semantic Versioning](https://semver.org/)
- L1 版本升级时，自动分析对 L2/L3 的影响
- L0 绑定版本跟随 L1 版本，确保同步
- 重大变更会生成 Impact Report，通知下游

## 6. 设计原则

1. **稳定优先**：L1 只容纳长期稳定的抽象
2. **可扩展优先**：L2/L3 通过继承扩展，不改写上层语义
3. **治理优先**：每个概念和关系都有 owner、版本和审计轨迹
4. **消费优先**：服务查询、评审、发布、API 集成与 AI Agent 消费
5. **安全优先**：企业层逻辑隔离，审批发布
6. **平台无关**：L1 语义定义独立于任何技术平台，L0 负责平台绑定
