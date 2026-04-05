<div align="center">

# 🌐 Universal Ontology Definition

**开放、标准化的四层企业本体定义框架**

**反熵设计 — 结构化、治理化、可扩展。**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Version](https://img.shields.io/badge/Version-2.0.0-green.svg)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

[English](./README.md) | **中文**

</div>

---

## 📖 什么是 Universal Ontology Definition？

Universal Ontology Definition (UOD) 是一个**开放、标准化的四层企业本体定义框架**，旨在为企业知识图谱、语义层、主数据管理和 AI Agent 知识底座提供统一的概念建模基础。

### 痛点

在企业数字化建设中，我们常面临以下痛点：

- 🔴 **概念定义不统一** — 不同团队用不同术语描述同一对象，跨系统、跨项目难以复用
- 🔴 **行业知识难复用** — 行业特性沉淀分散，缺乏标准化的扩展机制
- 🔴 **企业个性化与通用规范冲突** — 定制需求持续侵蚀底层结构
- 🔴 **平台锁定** — 本体定义绑定在单一序列化格式，难以跨平台互操作

### 解决方案：四层架构

```
┌─────────────────────────────────────────────────────────────┐
│         L3：企业个性化定制层                                  │  ← 企业私有扩展
│    （企业A定制） （企业B定制） （企业C定制）                    │
├─────────────────────────────────────────────────────────────┤
│         L2：行业与业务领域 Addon                              │  ← 可选加载，行业特性
│  （通用扩展）（咨询）（奢侈品）（金融）（制造）                 │
├─────────────────────────────────────────────────────────────┤
│         L1：通用企业 Ontology Core (v2.0)                    │  ← 强制继承，基础规范
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐ ┌────────────┐  │
│  │  实体域   │ │  治理域   │ │   运营域     │ │   度量域   │  │
│  │Party/Org/│ │Policy/   │ │Role/Process/ │ │ Goal / KPI │  │
│  │Resource  │ │Rule/Risk │ │Capability    │ │            │  │
│  └──────────┘ └──────────┘ └─────────────┘ └────────────┘  │
├═════════════════════════════════════════════════════════════┤
│    L0：技术平台绑定层 (Platform & Syntax Bindings)            │
│    （OWL/RDF）（JSON-LD）（GraphQL）（SQL DDL）               │
└─────────────────────────────────────────────────────────────┘
```

## ✨ 核心特性

- 🏗️ **四层分离架构** — 通用底座稳定不变，行业包按需加载，企业层自由定制，多平台绑定
- 🛡️ **反熵设计** — 4 个抽象域根、类数量硬上限、治理规则、CI 校验，防止 ontology 膨胀
- 📐 **标准化定义格式** — 统一的 JSON Schema，支持生命周期管理（status, since, deprecated_since）
- 🔗 **继承与扩展机制** — L2 继承 L1，L3 继承 L1+L2，泛化的 domain/range 关系
- ⚙️ **平台绑定层** — L0 提供即用的 OWL/RDF、JSON-LD、GraphQL 和 SQL DDL 映射
- 🌍 **双语支持** — 所有概念均提供中英文标签与定义
- 🤝 **社区驱动** — 欢迎任何人贡献行业 Addon、平台绑定或完善 Core 定义

## 📁 仓库结构

```
.
├── core/                       # L1 通用企业 Ontology Core
│   └── universal_ontology_v1.json
├── addons/                     # L2 行业 & 领域 Addon
│   ├── common/                 #   └── 通用企业扩展（从 L1 降级的类）
│   ├── consulting/             #   └── 咨询行业 Addon
│   ├── luxury-goods/           #   └── 奢侈品行业 Addon
│   └── _template/              #   └── Addon 贡献模板
├── enterprise/                 # L3 企业个性化定制层（公开示例）
│   ├── acme-tech-solutions/    #   └── 示例虚拟企业
│   ├── _template/              #   └── 企业层定制模板
│   └── README.md
├── private_enterprise/         # L3 私有企业层（.gitignore 排除）
├── platform/                   # L0 技术平台绑定层
│   ├── owl-rdf/                #   └── OWL 2 / RDF Turtle 序列化
│   ├── json-ld/                #   └── JSON-LD Context 定义
│   ├── graphql/                #   └── GraphQL Schema 定义
│   ├── sql/                    #   └── PostgreSQL DDL 映射
│   └── _template/              #   └── 平台绑定贡献模板
├── scripts/                    # CI & 治理自动化
│   ├── validate_governance.py  #   └── L1 治理规则校验器
│   └── json_to_owl.py          #   └── JSON → OWL/RDF Turtle 转换器
├── schema/                     # JSON Schema 校验
│   ├── core_schema.json
│   └── addon_schema.json
├── legacy/                     # 历史遗留工具与应用（已归档）
└── docs/                       # 设计文档与规范
```

---

## 🚀 快速开始

### 了解 Core Ontology

L1 v2.0 定义了 **24 个类**（4 个抽象域 + 20 个具体类）和 **12 种泛化关系**，归入 4 大语义域：

| 域（抽象类） | 具体类 |
|:---|:---|
| 🟦 **实体 Entity** | Party, Person, Organization, OrgUnit, Resource, ProductService, Asset, DataObject, Document, SystemApplication |
| 🟨 **治理 Governance** | Policy, Rule, Control, Risk |
| 🟩 **运营 Operational** | Role, Capability, Process, Event |
| 🟪 **度量 Measurement** | Goal, KPI |

> Channel, Location, MarketSegment, Decision 等类已降级至 [`addons/common/`](addons/common/) L2 通用扩展。

### 使用平台绑定 (L0)

根据你的技术栈选择合适的绑定格式：

| 平台 | 适用场景 | 目录 |
|:---|:---|:---|
| OWL/RDF | 知识图谱、SPARQL 查询、语义网 | [`platform/owl-rdf/`](platform/owl-rdf/) |
| JSON-LD | REST API、关联数据、Web 标准 | [`platform/json-ld/`](platform/json-ld/) |
| GraphQL | 现代 API 层、前端集成 | [`platform/graphql/`](platform/graphql/) |
| SQL DDL | 关系型数据库、数据仓库 | [`platform/sql/`](platform/sql/) |

---

## 📋 Ontology 创建与更新完整指南

> **本节面向需要创建 L2 行业 Addon 或 L3 企业定制层的开发者和架构师。**
> 以下流程以创建 L3 企业定制层为主要示例，L2 行业 Addon 的流程类似。

### 总览：端到端工作流

```
步骤 1. 确认上级依赖
   ↓
步骤 2. 复制模板 & 初始化
   ↓
步骤 3. 继承上级类
   ↓
步骤 4. 定义企业/行业特有类
   ↓
步骤 5. 定义关系（带 specializes 继承链）
   ↓
步骤 6. 添加实例
   ↓
步骤 7. JSON Schema 校验
   ↓
步骤 8. 治理规则检查
   ↓
步骤 9. 引用完整性检查
   ↓
步骤 10. 生成 OWL/RDF Turtle 格式
   ↓
步骤 11. 可选：Protégé / TopBraid 验证
   ↓
步骤 12. 版本管理与发布
```

---

### 步骤 1：确认上级依赖

在创建任何新的 Ontology 之前，必须首先确定你的**继承链**：

#### L2 行业 Addon
- **必须**继承 `L1_universal_organization_ontology`
- **可选**同时继承其他 L2（如 `L2_common_enterprise_addon`）

#### L3 企业定制层
- **必须**继承 `L1_universal_organization_ontology`
- **必须**至少继承一个相关 `L2` 行业 Addon

```json
// L3 示例：一家科技咨询公司同时继承 L1 Core 和 L2 咨询行业 Addon
"extends": [
  "L1_universal_organization_ontology_v2",
  "L2_consulting_industry_addon_v1"
]
```

**检查清单：**
- [ ] 确认 L1 Core 版本（当前为 v2.0.0）
- [ ] 确认所需 L2 Addon 及版本
- [ ] 阅读上级定义中的类/关系，理解可扩展的 parent 节点
- [ ] 记录 `compatible_core_version` 和 `compatible_addon_version`

---

### 步骤 2：复制模板 & 初始化目录

#### L2 行业 Addon
```bash
cp -r addons/_template/ addons/your-industry/
```

#### L3 企业定制层
```bash
# 公开示例放在 enterprise/
cp -r enterprise/_template/ enterprise/your-company/

# 私有/保密的放在 private_enterprise/（已被 .gitignore 排除）
cp -r enterprise/_template/ private_enterprise/your-company/
```

**初始化 JSON 文件的元数据头：**

```json
{
  "$schema": "../../schema/addon_schema.json",
  "layer": "L3_enterprise_customization",
  "enterprise": {
    "name": "Your Company Name",
    "name_zh": "公司中文名",
    "id": "ENT_YOUR_COMPANY_001",
    "headquarters": "上海",
    "industry": "Your Industry"
  },
  "version": "1.0.0",
  "extends": [
    "L1_universal_organization_ontology_v2",
    "L2_your_industry_addon_v1"
  ],
  "compatible_core_version": "2.0.0",
  "compatible_addon_version": "1.1.0",
  "description": "中文描述",
  "description_en": "English description"
}
```

---

### 步骤 3：从上级继承类

**核心原则：** L3 类的 `parent` 必须指向 **L1 或 L2 中已存在的类**。不要凭空创建无根类。

**常见的继承模式：**

| 你需要定义的概念 | 应该继承的 L1/L2 parent |
|:---|:---|
| 特有组织单元（事业部、团队） | `OrgUnit` (L1) |
| 特有项目类型 | `Engagement` (L2 咨询) |
| 特有角色 | `Role` (L1) 或 `ConsultantRole` (L2) |
| 特有交付物 | `Deliverable` (L2) 或 `Document` (L1) |
| 特有方法论/框架 | `Methodology`/`Framework` (L2) |
| 特有系统 | `SystemApplication` (L1) |
| 特有策略 | `Policy` (L1) |
| 特有风险 | `Risk` (L1) |
| 特有度量 | `KPI` (L1) 或 `UtilizationMetric` (L2) |
| 特有能力 | `Capability` (L1) |
| 特有流程 | `Process` (L1) |

**示例：**

```json
{
  "id": "CloudMigrationEngagement",
  "label_zh": "云迁移项目",
  "label_en": "Cloud Migration Engagement",
  "parent": "Engagement",        // ← 继承自 L2
  "definition": "帮助客户将传统 IT 基础设施迁移到云端的咨询项目",
  "definition_en": "A consulting engagement helping clients migrate IT infrastructure to the cloud"
}
```

**⚠️ 避免的常见错误：**
1. **不要**将具体实例（如"北京办公室"）建模为类 — 应放入 `sample_instances`
2. **不要**创建 `parent` 为 `null` 的类 — 只有 L1 的 4 个抽象域根允许这样做
3. **不要**在 L3 中重新定义 L1/L2 已有的类 — 直接引用即可

---

### 步骤 4：定义企业/行业特有类

**必填字段（每个类）：**

| 字段 | 规则 | 示例 |
|:---|:---|:---|
| `id` | PascalCase，正则 `^[A-Z][a-zA-Z0-9]*$` | `SolutionArchitectRole` |
| `label_zh` | 中文标签 | `解决方案架构师角色` |
| `label_en` | 英文标签 | `Solution Architect` |
| `parent` | 必须引用 L1/L2 中已有的非抽象类 | `ConsultantRole` |
| `definition` | 中文定义，≥ 5 字符 | `负责技术方案设计的角色` |
| `definition_en` | 英文定义 | `A role responsible for solution design` |

**类的设计原则：**
- 每个类应代表一个**可复用的概念分类**，而非单一具体实体
- 类数量建议控制在 **10-40 个**，避免过度细化
- 按语义域组织：组织、项目、角色、交付物、策略、风险、度量

---

### 步骤 5：定义关系（带 specializes 继承链）

关系是 ontology 的核心连接。L3 层的关系应当声明与 L1/L2 关系的**特化（specializes）关系**。

**必填字段（每个关系）：**

| 字段 | 规则 | 示例 |
|:---|:---|:---|
| `id` | snake_case，正则 `^[a-z][a-z0-9_]*$` | `designs_solution_for` |
| `label_zh` | 中文标签 | `为…设计解决方案` |
| `label_en` | 英文标签 | `designs solution for` |
| `domain` | 源类 ID（来自 L1/L2/L3） | `SolutionArchitectRole` |
| `range` | 目标类 ID（来自 L1/L2/L3） | `Engagement` |
| `specializes` | 上级关系 ID（带层级标注） | `staffed_on (L2)` |
| `definition` | 中文定义 | `架构师为项目设计方案` |
| `definition_en` | 英文定义 | `An architect designs solutions for engagements` |

**specializes 字段的写法：**
```json
"specializes": "governed_by (L1)"         // 特化 L1 核心关系
"specializes": "governed_by_policy (L2)"  // 特化 L2 行业关系
"specializes": null                       // 全新关系，无上级
```

**示例：**
```json
{
  "id": "reviewed_by_arb",
  "label_zh": "经架构评审委员会审核",
  "label_en": "reviewed by ARB",
  "domain": "ArchitectureBlueprint",
  "range": "ArchitectureReviewBoard",
  "specializes": "reviewed_by (L2)",
  "definition": "架构蓝图须经架构评审委员会审核通过",
  "definition_en": "Architecture blueprints must be reviewed by the Architecture Review Board"
}
```

---

### 步骤 6：添加实例

实例（`sample_instances`）是类的**具体化**。它们代表真实或示例性的具体对象。

**必填字段（每个实例）：**

| 字段 | 规则 | 示例 |
|:---|:---|:---|
| `id` | snake_case，正则 `^[a-z][a-z0-9_]*$` | `office_shanghai` |
| `type` | 必须引用一个**非抽象**类 | `ConsultingOffice` |
| `label` | 英文名 | `Acme Shanghai Office` |
| `label_zh` | 中文名 | `极客方舟上海办公室` |

**注意事项：**
- 实例的 `type` 不能指向抽象类（如 `Entity`, `Resource`, `Governance`, `Operational`, `Measurement`）
- 对于涉及真实客户的项目，使用匿名化名称，如 `[匿名银行 A]`
- 建议至少包含 **5 个以上实例**

---

### 步骤 7：JSON Schema 校验

确保文件结构符合 JSON Schema 规范。

**对于 L2 Addon：**
```bash
# 使用任意 JSON Schema 校验工具
# 文件头应声明 "$schema": "../../schema/addon_schema.json"

# 使用 Python jsonschema (需安装)
pip install jsonschema
python -c "
import json, jsonschema
schema = json.load(open('schema/addon_schema.json'))
data = json.load(open('addons/your-industry/your_addon.json'))
jsonschema.validate(data, schema)
print('✅ Schema validation passed')
"
```

**对于 L3 企业层：**
```bash
# L3 文件同样引用 addon_schema.json（结构兼容）
# "$schema": "../../schema/addon_schema.json"
```

**手动检查清单：**
- [ ] `layer` 字段以 `L2_` 或 `L3_` 开头
- [ ] `version` 遵循语义化版本 `X.Y.Z`
- [ ] `extends` 包含至少一个 `L1_` 引用
- [ ] 所有类 `id` 遵循 PascalCase
- [ ] 所有关系 `id` 遵循 snake_case
- [ ] 所有类都有 `label_zh` 和 `definition`
- [ ] 类数量 ≥ 10（schema 要求）

---

### 步骤 8：治理规则检查

运行 L1 Core 治理规则校验器，确保 L1 层未被错误修改：

```bash
python scripts/validate_governance.py
```

**治理规则一览：**

| 规则 ID | 描述 | 限制 |
|:---|:---|:---|
| G-01 | L1 类总数上限 | ≤ 25 |
| G-02 | 根类（parent=null）上限 | ≤ 5 |
| G-03 | 继承深度上限 | ≤ 4 级 |
| G-05 | 关系密度（关系数/类数） | ≤ 1.0 |
| G-08 | sample_instances 不含行业术语 | 行业中性 |
| NAMING | 命名规范 | PascalCase 类名，snake_case 关系名 |
| REF | 引用完整性 | parent/domain/range 引用有效类 |
| ABSTRACT | 抽象类子类检查 | 每个抽象类至少有 1 个子类 |
| BILINGUAL | 双语检查 | 所有类有中英文标签和定义 |

> **注意：** 治理校验器主要针对 L1 Core 本身。L2/L3 的校验应通过 JSON Schema 和引用完整性检查完成。

---

### 步骤 9：引用完整性检查

**手动检查所有引用链路是否完整：**

1. **parent 引用** — 所有类的 `parent` 指向 L1、L2 或本文件中已定义的类
2. **domain/range 引用** — 所有关系的 `domain` 和 `range` 指向有效类
3. **instance type 引用** — 所有实例的 `type` 指向非抽象类
4. **specializes 引用** — 关系的 `specializes` 指向 L1/L2 中已有的关系

**典型引用错误示例：**

```
❌ parent: "BusinessObject"     → 已被 L1 v2.0 废弃，应改为 "Resource"
❌ parent: "DocumentRecord"     → 已重命名为 "Document"
❌ type: "Entity"               → Entity 是抽象类，不能实例化
❌ type: "Resource"             → Resource 是抽象类，不能实例化
```

---

### 步骤 10：生成 OWL/RDF Turtle 格式

JSON 是 Ontology 的**源格式**，OWL/RDF Turtle (.ttl) 是用于语义网工具（Protégé、TopBraid、Stardog）的**发布格式**。

#### 批量转换所有文件

```bash
python scripts/json_to_owl.py
```

#### 转换单个文件

```bash
python scripts/json_to_owl.py enterprise/acme-tech-solutions/acme_tech_solutions_ontology_v1.json
```

**输出结果：**
- 每个 `.json` 文件在同目录下生成对应 `.ttl` 文件
- 例如：`enterprise/acme-tech-solutions/acme_tech_solutions_ontology_v1.json` → `.ttl`

**重要说明：**
- 转换脚本**零外部依赖**（纯 Python 3，无需 pip install）
- `.ttl` 文件自动生成，**不要手动编辑** `.ttl` 文件
- 每次修改 `.json` 文件后，**必须重新运行**转换脚本
- `private_enterprise/` 下的 `.ttl` 文件也被 `.gitignore` 覆盖

---

### 步骤 11：可选 — Protégé / TopBraid 验证

生成 `.ttl` 文件后，可以在专业 Ontology 编辑器中进行可视化验证：

1. **打开 Protégé** → File → Open → 选择 `.ttl` 文件
2. **检查类层次结构** — 确认继承关系正确
3. **查看 Object Properties** — 确认 domain/range 绑定
4. **运行推理器（Reasoner）** — 选择 HermiT 或 Pellet，点击 Start，检查是否有不一致性
5. **导出 OntoGraf** — 可视化 ontology 图谱

---

### 步骤 12：版本管理与发布

#### 语义化版本规范

| 版本变化 | 说明 | 示例 |
|:---|:---|:---|
| `1.0.0 → 1.0.1` | 修复定义文本、拼写、格式 | 修正 label_en |
| `1.0.0 → 1.1.0` | 新增类/关系/实例，向后兼容 | 新增 3 个角色类 |
| `1.0.0 → 2.0.0` | 类结构变更、不向后兼容 | 重新设计继承层次 |

#### 发布检查清单

- [ ] JSON Schema 校验通过
- [ ] 引用完整性检查通过
- [ ] L1 治理规则通过（如修改了 Core）
- [ ] 双语标签完整
- [ ] `version` 字段已更新
- [ ] `metadata.last_updated` 已更新
- [ ] `metadata.changelog` 已更新
- [ ] `.ttl` 文件已重新生成
- [ ] Git commit message 包含版本号和变更摘要

---

## 📖 完整示例：创建一个 L3 虚拟企业 Ontology

> 以下以虚构公司"**极客方舟科技 (Acme Tech Solutions)**"为示例，完整演示 L3 层创建流程。
> 完整源文件见 [`enterprise/acme-tech-solutions/`](enterprise/acme-tech-solutions/)

### 企业背景

| 属性 | 值 |
|:---|:---|
| 公司名 | 极客方舟科技 (Acme Tech Solutions) |
| 行业 | 科技咨询 |
| 规模 | 500-1000 人 |
| 总部 | 北京 |
| 核心能力 | 云迁移、AI 平台、数据治理、DevSecOps |

### 第 1 步：确认继承链

```json
"extends": [
  "L1_universal_organization_ontology_v2",   // L1 Core v2.0
  "L2_consulting_industry_addon_v1"          // L2 咨询行业 v1.1
]
```

### 第 2 步：复制模板

```bash
cp -r enterprise/_template/ enterprise/acme-tech-solutions/
# 重命名 JSON 文件
mv enterprise/acme-tech-solutions/enterprise_ontology_template.json \
   enterprise/acme-tech-solutions/acme_tech_solutions_ontology_v1.json
```

### 第 3 步：设计类层次

```
L1 Core
├── OrgUnit
│   ├── TechConsultingDivision         ← L3 新增
│   └── SolutionArchitectTeam          ← L3 新增
├── Role → ConsultantRole (L2)
│   ├── SolutionArchitectRole          ← L3 新增
│   ├── TechLeadRole                   ← L3 新增
│   ├── DataEngineerRole               ← L3 新增
│   └── CloudEngineerRole              ← L3 新增
├── Resource → Engagement (L2)
│   ├── CloudMigrationEngagement       ← L3 新增
│   ├── AIPlatformEngagement           ← L3 新增
│   ├── DataGovernanceEngagement       ← L3 新增
│   └── DevSecOpsEngagement            ← L3 新增
├── Asset → KnowledgeAsset (L2)
│   └── TechnicalAccelerator           ← L3 新增
├── Asset → ThoughtLeadership (L2)
│   └── TechRadarReport                ← L3 新增
├── Deliverable (L2)
│   ├── CloudReadinessAssessment       ← L3 新增
│   └── ArchitectureBlueprint          ← L3 新增
├── Policy
│   ├── CloudCostOptimizationPolicy    ← L3 新增
│   └── OpenSourceCompliancePolicy     ← L3 新增
├── Risk
│   ├── VendorLockInRisk               ← L3 新增
│   └── DataLeakageRisk                ← L3 新增
├── Capability
│   ├── CloudMigrationCapability       ← L3 新增
│   └── MLOpsCapability                ← L3 新增
├── KPI
│   ├── CertificationCompletionKPI     ← L3 新增
│   ├── CodeQualityKPI                 ← L3 新增
│   └── MigrationSuccessRateKPI        ← L3 新增
├── Process
│   ├── TechBlogProgram                ← L3 新增
│   └── TechCertificationProcess       ← L3 新增
└── Control
    └── ArchitectureReviewBoard        ← L3 新增
```

### 第 4 步：定义关系与继承链

```
designs_solution_for     ← specializes: staffed_on (L2)
produces_blueprint       ← specializes: produces (L1)
reviewed_by_arb          ← specializes: reviewed_by (L2)
uses_accelerator         ← specializes: contributes_to_knowledge (L2) inverse
governed_by_oss_policy   ← specializes: governed_by_policy (L2)
migration_measured_by    ← specializes: measured_by (L1)
publishes_radar          ← specializes: publishes_thought_leadership (L2)
assessed_by_readiness    ← 全新关系
certified_through        ← 全新关系
has_tech_division        ← specializes: part_of (L1) inverse
```

### 第 5 步：添加实例（摘要）

总计 **34 个实例**覆盖：
- 3 个办公室、4 个事业部、4 个业务线
- 3 个技术加速器、2 个框架、1 个方法论
- 4 个匿名化项目、4 个系统
- 2 个策略、5 个 KPI、1 个技术雷达

### 第 6-10 步：校验与生成

```bash
# 1. 生成 OWL Turtle
python scripts/json_to_owl.py enterprise/acme-tech-solutions/acme_tech_solutions_ontology_v1.json

# 2. 运行 L1 治理规则检查（确保 Core 未被修改）
python scripts/validate_governance.py
```

---

## 🗂️ 已有行业 Addon

| 行业 | 目录 | 类数量 | 关系数量 | 状态 |
|:---|:---|:---:|:---:|:---|
| 通用企业扩展 | [`addons/common/`](addons/common/) | 10 | 5 | ✅ v1.0.0 |
| 咨询行业 | [`addons/consulting/`](addons/consulting/) | 40+ | 34 | ✅ v1.1.0 |
| 奢侈品行业 | [`addons/luxury-goods/`](addons/luxury-goods/) | 38 | 14 | ✅ v2.0.0 |

**期待社区贡献更多行业 Addon！** 如金融、制造、零售、医疗、教育等。

## ⚙️ 已有平台绑定

| 平台 | 目录 | 格式 | 状态 |
|:---|:---|:---|:---|
| OWL/RDF | [`platform/owl-rdf/`](platform/owl-rdf/) | Turtle (.ttl) | ✅ v1.0.0 |
| JSON-LD | [`platform/json-ld/`](platform/json-ld/) | JSON-LD Context (.jsonld) | ✅ v1.0.0 |
| GraphQL | [`platform/graphql/`](platform/graphql/) | GraphQL Schema (.graphql) | ✅ v1.0.0 |
| SQL DDL | [`platform/sql/`](platform/sql/) | PostgreSQL DDL (.sql) | ✅ v1.0.0 |

**还想要更多？** 欢迎贡献 Protobuf、Avro、Neo4j Cypher 等平台绑定！

## 🤝 Contributing

我们欢迎所有形式的贡献！请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解：

- 如何提议修改 Core Ontology
- 如何提交新的行业 Addon
- 如何贡献新的平台绑定
- 代码规范与 PR 流程

## 📄 License

本项目采用 [Apache License 2.0](LICENSE) 许可证。

您可以自由地：
- ✅ 商业使用
- ✅ 修改和分发
- ✅ 基于此创建企业私有的 L3 定制层

## 🙏 致谢

本项目的 Ontology 设计参考了以下标准与规范：

- [OWL 2 Web Ontology Language](https://www.w3.org/TR/owl2-overview/)
- [RDF 1.1 Concepts and Abstract Syntax](https://www.w3.org/TR/rdf11-concepts/)
- [Schema.org](https://schema.org/)
- [ArchiMate](https://www.opengroup.org/archimate-forum/archimate-overview)

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐ Star！**

</div>
