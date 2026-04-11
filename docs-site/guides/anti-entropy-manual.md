# 防熵手册 | Anti-Entropy Manual

> **核心信条**：L1 Core 是"语义骨架"，不是"概念百科"。任何概念能在 L2 中定义，就不应进入 L1。

本手册是 Universal Ontology Definition 项目长期健康运转的操作指南。它回答三个问题：**什么是本体熵增、熵从哪里来、如何系统性阻断它。**

---

## 目录

- [1. 熵增的本质](#1-熵增的本质)
- [2. 四大熵源分析](#2-四大熵源分析)
- [3. 防熵架构总览](#3-防熵架构总览)
- [4. L1 层：结构性硬防熵](#4-l1-层结构性硬防熵)
- [5. L2 层：插件扩展防熵](#5-l2-层插件扩展防熵)
- [6. L3 层：企业定制防熵](#6-l3-层企业定制防熵)
- [7. 语义防熵：概念漂移治理](#7-语义防熵概念漂移治理)
- [8. 过程防熵：PR 与评审纪律](#8-过程防熵pr-与评审纪律)
- [9. 文档防熵：知识同步规则](#9-文档防熵知识同步规则)
- [10. 版本防熵：生命周期纪律](#10-版本防熵生命周期纪律)
- [11. 熵增预警指标](#11-熵增预警指标)
- [12. 防熵健康检查清单](#12-防熵健康检查清单)
- [13. 熵增紧急处置流程](#13-熵增紧急处置流程)

---

## 1. 熵增的本质

在本体论工程中，**熵增**（Ontological Entropy）是指知识结构随时间推移趋向无序、不一致、难以维护的过程。

### 1.1 表现形式

| 熵增形态 | 描述 | 典型症状 |
|:---|:---|:---|
| **概念膨胀** | 类数量无控制地增长 | L1 中有 50+ 类，大量单一用途类 |
| **语义漂移** | 同一概念在不同位置定义不一致 | `Document` 在 L1 指合同，在 L2 指报告 |
| **关系爆炸** | 关系数量接近或超过类数量 | 每对类之间都有专属关系，无泛型复用 |
| **层次混淆** | L2/L3 概念渗入 L1；L3 覆盖 L2 语义 | 行业特定概念出现在 Core 层 |
| **文档漂移** | 代码/Schema 与文档描述不一致 | JSON 中的 class 定义与 docs-site 中的说明不符 |
| **版本腐蚀** | 废弃项未清理，历史包袱积累 | `migration_registry` 列表持续增长无人清理 |
| **孤岛碎片化** | 多个 L2 extension 之间存在语义重叠但无复用 | `consulting` 和 `common` 都定义了 `Project` |

### 1.2 为什么 Ontology 比普通代码更容易熵增

1. **定义是主观的**：代码有测试可以验证正确性，但 "Risk 和 Control 的边界在哪里" 没有唯一答案
2. **贡献者分散**：多行业背景的贡献者各自带入领域偏见
3. **向下兼容压力**：破坏性改动成本高，导致历史设计决策无法被清理
4. **语言歧义**：中英文双语维护引入翻译不一致的额外风险

---

## 2. 四大熵源分析

### 熵源 A：需求驱动的概念蔓延

**触发场景**：某企业或行业贡献者认为某个领域特定概念"非常通用"，提议将其加入 L1。

**熵增路径**：
```
L3 私有需求 → 提议进入 L2 → 被误认为跨行业 → 进入 L1 → 膨胀
```

**典型案例**（已修正）：v1.0 中的 `Channel`、`MarketSegment`、`Location` 在 v2.0 中被下放至 `extensions/common/`，因为它们不满足"任意企业都必须建模此概念"的 L1 门槛。

**防控点**：G-04 规则（新增 L1 类需 ≥3 个行业证明）+ PR Review 流程

---

### 熵源 B：关系设计过度具体化

**触发场景**：为了精确表达某个业务语义，为每对类之间创建专属关系，而不是复用泛型关系。

**熵增路径**：
```
Process → deliverable_for → Engagement (咨询特有)
Process → produces → Product (制造特有)
Process → generates → Report (通用)
↓ 三个关系本可统一为 produces: Process → Resource
```

**防控点**：G-05 规则（关系数 ≤ 类数 × 1.0）+ 关系泛型化设计规则（见第 5 节）

---

### 熵源 C：继承层次过深

**触发场景**：为了精细分类，在现有类下不断创建子类，形成深层继承树。

**熵增路径**：
```
Entity → Party → Organization → OrgUnit → Department → 
SubDepartment → TeamUnit → ProjectTeam (深度 8，实际仅需 4)
```

**后果**：理解成本指数级上升；L2/L3 继承点选择困难；SPARQL/GraphQL 查询路径变长。

**防控点**：G-03 规则（继承深度 ≤ 4 层）

---

### 熵源 D：语义权威性缺失

**触发场景**：没有明确的"语义权威"维护者，同一概念被多处以不同方式描述。

**熵增路径**：
```
docs-site/classes.md 描述 Risk = "不确定性事件"
core/universal_ontology_v1.json definition = "可能影响目标的不确定事件"
platform/owl-rdf/core_ontology.ttl skos:definition = "威胁或机会"
↓ 三处定义不一致，下游用户无法确定权威来源
```

**防控点**：单一语义权威（JSON 为 Source of Truth）+ 文档同步校验流程

---

## 3. 防熵架构总览

本项目采用**多层次、多机制**的防熵体系，从设计时、提交时、合并时三个阶段共同防控：

```
┌─────────────────────────────────────────────────────────────────┐
│                    防熵防线体系                                   │
├──────────────┬──────────────────────────────────────────────────┤
│  设计时防熵   │  四层架构隔离 · 泛型关系设计 · 抽象域分类          │
│  (Design)    │  命名规范 · 双语定义要求 · 行业中立原则             │
├──────────────┼──────────────────────────────────────────────────┤
│  提交时防熵   │  core_schema.json 结构校验                        │
│  (Commit)    │  extension_schema.json 最低质量门槛                   │
│              │  validate_governance.py 治理规则检查 (G-01~G-08)  │
├──────────────┼──────────────────────────────────────────────────┤
│  合并时防熵   │  GitHub Actions CI 自动运行校验                   │
│  (Merge)     │  ≥2 位维护者审核 L1 Core PR                      │
│              │  PR 描述强制附治理检查清单                         │
├──────────────┼──────────────────────────────────────────────────┤
│  运行时防熵   │  CHANGELOG 版本追踪                               │
│  (Release)   │  deprecated_* 注册表 · 2-minor 废弃过渡期         │
│              │  语义版本约束 (G-06: 每版本 ≤3 类变更)             │
└──────────────┴──────────────────────────────────────────────────┘
```

### 防熵工具清单

| 工具 | 位置 | 用途 | 触发时机 |
|:---|:---|:---|:---|
| `core_schema.json` | `schema/` | L1 结构合法性校验 | 本地 + CI |
| `extension_schema.json` | `schema/` | L2 最低质量校验 | 本地 + CI |
| `validate_governance.py` | `scripts/` | G-01~G-08 硬规则检查 | 本地 + CI |
| `json_to_owl.py` | `scripts/` | JSON → OWL 一致性转换 | 发布前 |
| `merge_layers.py` | `scripts/` | 层次合并完整性验证 | 发布前 |
| `deploy-docs.yml` | `.github/workflows/` | 文档构建 (`--strict` 模式) | Push to master |
| `auto-release.yml` | `.github/workflows/` | CHANGELOG 自动发布 | Tag push |

---

## 4. L1 层：结构性硬防熵

### 4.1 八条治理规则（不可绕过）

这是整个防熵体系的核心骨架。**任何 L1 变更必须通过全部规则，无例外。**

| 规则 | 约束值 | 执行机制 | 违反处理 |
|:---|:---:|:---|:---|
| **G-01** 类数量上限 | ≤ 25 | `core_schema.json` `maxItems` | CI 阻断合并 |
| **G-02** 根类上限 | ≤ 5 | `validate_governance.py` | CI 阻断合并 |
| **G-03** 继承深度 | ≤ 4 层 | `validate_governance.py` | CI 阻断合并 |
| **G-04** 跨行业验证 | ≥ 3 行业 | PR Review 人工审核 | Reviewer 拒绝 |
| **G-05** 关系密度 | 关系数 ≤ 类数 × 1.0 | `validate_governance.py` | CI 阻断合并 |
| **G-06** 变更速度 | 每次版本 ≤ 3 类变更 | PR Review 人工审核 | Reviewer 拒绝 |
| **G-07** 废弃过渡期 | ≥ 2 个 minor 版本 | CONTRIBUTING.md 规范 | 维护者强制执行 |
| **G-08** 示例中立性 | 不含行业特定词汇 | `validate_governance.py` | CI 阻断合并 |

### 4.2 当前 L1 健康状态（v2.0.0 基准）

```
类数量:        24 / 25   (使用率 96% — 接近上限警戒线)
根类数量:       4 / 5    (健康)
最大继承深度:   3 / 4    (健康)
关系密度:      12 / 24 = 0.50  (远低于 1.0 — 健康)
抽象类覆盖:    100%      (所有抽象类均有具体子类)
双语覆盖:      100%      (所有类含中英文定义)
```

> **警告**：类数量已达上限 96%。下次 L1 新增类之前，必须先评估是否有类可以合并或下放到 L2。

### 4.3 L1 类"入场"决策树

```
提议新增 L1 类？
    │
    ├─ 是否已在某个 L2 extension 中存在类似概念？
    │       └─ 是 → 直接复用 L2，无需 L1 新增
    │
    ├─ 是否能由现有 L1 类的组合或特化表达？
    │       └─ 是 → 在 L2 中继承现有 L1 类
    │
    ├─ 能否在 ≥3 个完全不同的行业中举出真实例子？
    │       └─ 否 → 放入 L2，不符合 L1 门槛
    │
    ├─ 新增后类总数是否仍 ≤ 25？
    │       └─ 否 → 必须先合并/下放现有类
    │
    └─ 是否经过 ≥2 位维护者评审同意？
            └─ 否 → 不得合并
            └─ 是 → 可进入 L1
```

### 4.4 L1 类"退场"规则（废弃流程）

```
发现某个 L1 类需要废弃？
    │
    Step 1: 在该类添加 "status": "deprecated", "deprecated_since": "X.Y.0"
    Step 2: 在 migration_registry[] 中添加完整的迁移记录（kind, replaced_by, note）
    Step 3: 等待 ≥2 个 minor 版本（G-07）
    Step 4: 在下游 L2 extensions 中完成 parent 字段迁移
    Step 5: 在下一个 major 版本中物理删除该类
    Step 6: 更新 CHANGELOG.md 中的 Breaking Changes 节
```

---

## 5. L2 层：插件扩展防熵

### 5.1 L2 Extension 设计原则

L2 是受控制的扩展区。熵增风险主要来自：
- **多个 extension 之间的语义重叠**（如 `consulting` 和 `common` 都想定义 `Project`）
- **过度继承**（L2 类继承 L2 类，形成 L2 内部的深层树）
- **L3 需求反渗透**（某企业的特定需求被伪装成行业通用需求提交为 L2）

### 5.2 L2 质量门槛（extension_schema.json 强制执行）

| 字段 | 要求 | 目的 |
|:---|:---|:---|
| `layer` | 必须以 `L2_` 开头 | 强制层次标识 |
| `extends` | 必须包含 L1 引用 | 确保继承链完整 |
| `classes` | 至少 10 个 | 防止碎片化小 extension |
| `relations` | 至少 5 个 | 确保关系建模完整 |
| `sample_instances` | 至少 5 个 | 确保可用性验证 |
| 每个 class 的 `parent` | 不得为 null | 所有 L2 类必须根植于 L1 |
| 每个 class 的 `definition` | 必填 | 语义清晰性要求 |

### 5.3 L2 关系设计：泛型优先原则

在设计 L2 关系时，优先**复用或继承 L1 泛型关系**，而不是创建新的专属关系：

```
❌ 错误做法：为每对 L2 类创建专属关系
   ConsultingFirm --[wins]--> Engagement
   ConsultingFirm --[leads]--> WorkStream
   ConsultingFirm --[manages]--> KnowledgeAsset

✅ 正确做法：继承 L1 泛型关系，通过 domain/range 约束专化
   owns: Party → Resource        (L1 泛型)
   ConsultingFirm 继承自 Party，Engagement/WorkStream 继承自 Process/DataObject
   → 无需新建关系，语义通过类继承体系表达
```

**L2 关系新增判断标准**：
1. L1 中没有任何关系可以通过 domain/range 约束表达此语义
2. 该关系在本行业内具有明确且独特的业务含义
3. 不会与现有 L1 或其他 L2 关系产生语义歧义

### 5.4 跨 Extension 依赖规则

当 L2 extension 需要引用另一个 L2 extension 的概念时：

```json
{
  "extends": ["L1_universal_organization_ontology", "L2_common_enterprise_extension"]
}
```

**约束**：
- `extends` 中的 L2 依赖必须是已发布的稳定版本
- 不允许循环依赖（A 依赖 B，B 依赖 A）
- 深度依赖链不超过 2 级（L2a → L2b → L1，不允许 L2a → L2b → L2c → L1）

### 5.5 L2 内部继承深度控制

L2 extension 内部的继承树，加上从 L1 继承的深度，总继承深度不得超过 **6 层**：

```
L1 深度 (max 4) + L2 extension 内额外继承 (max 2) = 总深度 ≤ 6
```

```
Entity (L1, depth 1)
  └── Party (L1, depth 2)
        └── Organization (L1, depth 3)
              └── ConsultingFirm (L2, depth 4)  ✅
                    └── BoutiqueConsultingFirm (L2, depth 5)  ✅
                          └── SpecializedTeam (L2, depth 6)  ✅ 最深
                                └── SubUnit (过深, 禁止)      ❌
```

---

## 6. L3 层：企业定制防熵

### 6.1 L3 的边界原则

L3 是**私有、自治**的层。但为了防止企业层的设计缺陷反渗透或引发维护问题，需遵守以下规则：

| 规则 | 描述 |
|:---|:---|
| **只能继承，不能覆盖** | L3 只能添加新类/关系/实例，不得修改 L1/L2 的语义定义 |
| **parent 链完整** | L3 类必须通过 parent 链追溯至 L1 |
| **命名空间隔离** | L3 类 ID 建议带企业前缀，避免与 L1/L2 冲突（如 `Acme_ProjectBoard`） |
| **私有性保护** | L3 内容存储在 `private_enterprise/`，已加入 `.gitignore` |
| **不向上渗透** | 发现 L3 中的某个概念"很通用"时，应通过 L2 extension 贡献流程提交，而非直接修改 L1 |

### 6.2 L3 企业导入检查清单

当企业首次创建 L3 定义时：

```markdown
### L3 Enterprise Onboarding Checklist
- [ ] 已声明 extends 字段（包含 L1 + 所需 L2 extensions）
- [ ] 所有 L3 类都有明确的 parent（指向 L1 或 L2 类）
- [ ] 类 ID 使用企业前缀或命名空间避免冲突
- [ ] 私有文件已添加至 .gitignore 或存放于 private_enterprise/
- [ ] 未修改任何 L1/L2 的 definition 或 relations
- [ ] sample_instances 使用脱敏的示例数据
```

---

## 7. 语义防熵：概念漂移治理

### 7.1 单一语义权威原则（Source of Truth）

```
JSON 文件 (core/universal_ontology_v1.json) 是唯一语义权威

  l1-core/*.json          ← 权威来源
      │
      ├── docs-site/**/*.md     ← 必须与 JSON 保持一致
      ├── platform/owl-rdf/*.ttl ← 由 json_to_owl.py 自动生成
      ├── platform/graphql/*.graphql ← 由转换脚本生成
      └── platform/sql/*.sql    ← 由转换脚本生成
```

**规则**：当 JSON 与文档发生冲突时，**JSON 优先**。发现冲突必须修正文档（不得修改 JSON 来迁就错误文档）。

### 7.2 定义一致性检查规则

每次修改类或关系的定义时，需同步检查以下位置：

| 位置 | 修改类型 | 责任人 |
|:---|:---|:---|
| `core/universal_ontology_v1.json` 的 `definition` / `definition_en` | 语义权威 | PR 提交者 |
| `docs-site/core/classes.md` 或 `docs-site/extensions/*.md` | 人类可读说明 | PR 提交者 |
| `platform/owl-rdf/core_ontology.ttl` | 机器可读 | 运行 `json_to_owl.py` |
| README.md / README_CN.md 中的类列表 | 概述文档 | PR 提交者（重要变更时） |

### 7.3 双语一致性规则

每个类和关系必须提供中英文对应定义，且含义一致（不允许翻译时引入额外或减少语义）：

```json
"definition": "可能影响目标实现的不确定事件或状况",
"definition_en": "An uncertain event or condition that could affect the achievement of objectives"
```

**禁止行为**：
- 中文定义包含"仅指 IT 系统风险"，而英文定义写"任何风险"（范围不一致）
- 用机器翻译直接填充 `definition_en`，不经人工核验

### 7.4 语义模糊警报词

在 PR Review 时，如果定义中出现以下模糊词汇，应要求提交者明确：

| 模糊词 | 问题 | 应要求澄清 |
|:---|:---|:---|
| "相关的" / "related to" | 无方向性，过于宽泛 | 具体是什么关系？单向还是双向？ |
| "包含" / "contains" | 是组合关系还是关联关系？ | 使用 `part_of` 还是 `governs`？ |
| "管理" / "manages" | 语义过载（治理？运营？拥有？） | 使用具体关系名 |
| "等" / "etc." | 开放集合定义，无法验证完整性 | 列举完整或使用"包括但不限于"并说明原则 |

---

## 8. 过程防熵：PR 与评审纪律

### 8.1 PR 分类与处理路径

```
PR 变更类型
    │
    ├─ L1 Core 修改（类/关系/公理变更）
    │       └─ 高风险：需要 ≥2 位维护者 + 完整治理清单 + CI 全通过
    │
    ├─ L2 Extension 新增或修改
    │       └─ 中等风险：需要 ≥1 位维护者 + extension_schema 校验通过
    │
    ├─ L0 Platform Binding 更新
    │       └─ 中等风险：需验证与 L1 JSON 的一致性（round-trip test）
    │
    ├─ 文档更新（docs-site/ 修改）
    │       └─ 低风险：mkdocs build --strict 通过即可合并
    │
    └─ 工具/脚本修改（scripts/）
            └─ 需要验证所有现有 ontology 文件仍能通过校验
```

### 8.2 L1 Core PR 强制评审清单

所有修改 `core/` 目录的 PR 描述中**必须附上**以下清单（不附则 Reviewer 拒绝）：

```markdown
### L1 Governance Checklist

**结构规则**
- [ ] G-01: 修改后类总数 ≤ 25（当前: ___ 类）
- [ ] G-02: parent=null 的根类总数 ≤ 5（当前: ___ 个）
- [ ] G-03: 所有继承链深度 ≤ 4（最深: ___ 层，位于 ___）
- [ ] G-04: 如有新增类，已提供 ≥3 个行业通用性论证（行业: ___, ___, ___）
- [ ] G-05: 关系数 ≤ 类数（当前: ___ 关系 / ___ 类 = ___ 比率）
- [ ] G-06: 本次变更涉及类数量 ≤ 3（变更: ___ 个类）

**语义完整性**
- [ ] G-07: 所有废弃项已通过 status 字段标记，或已记录在 migration_registry 中
- [ ] G-08: sample_instances 不含行业特定词汇

**自动化校验**
- [ ] 通过 `python scripts/validate_governance.py` 本地运行（无 FAIL）
- [ ] 通过 `schema/core_schema.json` JSON Schema 校验

**语义影响分析**
- 变更原因：（说明为什么必须在 L1 层修改，而非 L2）
- 影响范围：（哪些下游 L2 extensions / L3 企业 需要迁移）
- 迁移指南：（下游如何适配此次变更）
```

### 8.3 评审者防熵职责

L1 PR Reviewer 在审核时，除技术正确性外，需重点检查：

1. **层次归属判断**：此概念是否真的属于 L1？能否放到 L2？
2. **泛型关系机会**：新增关系是否可以被现有泛型关系覆盖？
3. **G-04 跨行业验证**：提交者给出的 3 个行业论证是否真实、充分？
4. **G-08 中立性**：sample_instances 中是否暗示特定行业（即使没有被脚本检测到的词汇）？
5. **废弃轨迹完整**：如果是修改/删除，deprecated 注册表是否已填写？

---

## 9. 文档防熵：知识同步规则

### 9.1 文档层次与权威性

```
第一级（机器权威）: core/*.json, extensions/**/*.json, schema/*.json
第二级（人类权威）: docs-site/**/*.md, README.md, README_CN.md
第三级（辅助说明）: docs/**/*.md (设计文档, 决策记录)
```

规则：第一级永远优先。发现冲突时，修正第二、三级，不得修改第一级来"对齐"错误文档。

### 9.2 每次发布的文档同步检查

在创建 release tag 前，需验证以下文档与 JSON 一致：

| 文档文件 | 对应 JSON 内容 | 检查项 |
|:---|:---|:---|
| `docs-site/core/classes.md` | `core/universal_ontology_v1.json` `.classes[]` | 类数量、名称、层级、定义 |
| `docs-site/core/relations.md` | `core/universal_ontology_v1.json` `.relations[]` | 关系名、domain/range、基数 |
| `docs-site/core/axioms.md` | `core/universal_ontology_v1.json` `.axioms[]` | 公理 ID、类型、引用 |
| `docs-site/changelog.md` | `CHANGELOG.md` | 内容同步 |
| `README.md` | L1 JSON 的 metadata | 版本号、类数量摘要 |

### 9.3 文档质量门槛

- `mkdocs build --strict` 必须通过（任何 broken link 或格式错误即阻断）
- 每个 extension 必须有配套 `README.md`，说明：覆盖行业范围、设计考量、关键类说明
- 新增 L1 类后，必须在同一 PR 内更新 `docs-site/core/classes.md`

---

## 10. 版本防熵：生命周期纪律

### 10.1 语义版本规则

| 版本级别 | 触发条件 | 示例 |
|:---|:---|:---|
| **Major (X.0.0)** | L1 Breaking Changes（类删除、关系改名、基数变更） | 1.x → 2.0.0（删除 BusinessObject） |
| **Minor (x.Y.0)** | L1 新增类/关系、L2 新 extension 发布 | 2.0.0 → 2.1.0 |
| **Patch (x.y.Z)** | Bug 修复、文档更正、定义文字修正（无语义变更） | 2.0.0 → 2.0.1 |

### 10.2 废弃注册表维护规则

`migration_registry` 数组是**版本间迁移的契约**，必须严格维护。每条记录包含 `kind`（class / relation / attribute）以标识类型：

```json
{
  "id": "BusinessObject",
  "kind": "class",
  "deprecated_since": "2.0.0",
  "replaced_by": "Resource",
  "note": "将所有 L2/L3 中 parent: BusinessObject 替换为 parent: Resource"
}
```

**维护规则**：
1. 废弃记录最少保留 **2 个 minor 版本**（G-07）
2. 移除废弃记录时，必须在 CHANGELOG.md 的 Breaking Changes 中注明
3. 废弃记录中的 `replaced_by` 必须指向仍存在的有效类/关系

### 10.3 CHANGELOG 维护规范

遵循 [Keep a Changelog](https://keepachangelog.com) 格式，每次发布前确认：

```markdown
## [X.Y.Z] - YYYY-MM-DD — 版本主题（可选）

### ⚠️ Breaking Changes    ← 仅 Major 版本
### Added                   ← 新增
### Changed                 ← 修改（无破坏性）
### Deprecated              ← 标记废弃（仍可用）
### Removed                 ← 物理删除（已经过 deprecated 期）
### Fixed                   ← 错误修正
```

---

## 11. 熵增预警指标

定期（建议每个 minor 版本发布前）检查以下指标，任何指标进入警戒区需评估是否需要清理。

### 11.1 结构健康度仪表盘

| 指标 | 健康 | 警戒 | 危险 | 当前值 (v2.0.0) |
|:---|:---:|:---:|:---:|:---:|
| L1 类总数 | ≤ 20 | 21–24 | = 25 | **24** (警戒) |
| L1 根类数量 | ≤ 3 | 4 | = 5 | **4** (警戒边缘) |
| 最大继承深度 | ≤ 3 | 4 | > 4 | **3** (健康) |
| 关系密度比 | ≤ 0.6 | 0.7–1.0 | > 1.0 | **0.50** (健康) |
| migration_registry 积压数 | ≤ 5 | 6–10 | > 10 | — |
| L2 extension 间语义重叠类数 | 0 | 1–2 | > 2 | — |
| 无双语定义的类数 | 0 | 1–3 | > 3 | **0** (健康) |

### 11.2 版本速度指标

| 指标 | 健康 | 警戒 |
|:---|:---|:---|
| 每个 minor 版本的 L1 类变更数 | ≤ 3 (G-06) | > 3 需多版本分批 |
| major 版本之间的时间间隔 | ≥ 3 个月 | < 1 个月说明设计不稳定 |
| deprecated 状态平均停留版本数 | ≥ 2 minor | < 2 违反 G-07 |

### 11.3 文档健康度指标

| 指标 | 健康 | 行动 |
|:---|:---|:---|
| `mkdocs build --strict` 通过 | 必须通过 | 任何 WARN 级别以上错误必须修复 |
| JSON 与文档的类数量一致 | 必须一致 | 发现不一致立即修正文档 |
| 每个 L2 extension 有 README.md | 100% | 新 extension 必须包含 README |

---

## 12. 防熵健康检查清单

### 每次 PR 合并前（作者自查）

```markdown
#### 通用检查
- [ ] 修改范围在预期层次内（没有越层修改）
- [ ] 所有 JSON 文件通过对应 Schema 校验
- [ ] 新增的类/关系有完整的双语定义

#### L1 变更额外检查
- [ ] 运行 `python scripts/validate_governance.py` 无 FAIL
- [ ] PR 描述附上完整 L1 Governance Checklist
- [ ] CHANGELOG.md 已更新

#### 文档变更检查
- [ ] 在项目根运行 `mkdocs build --strict` 无报错
- [ ] 文档中的类/关系描述与 JSON 定义一致
```

### 每个 Minor 版本发布前（维护者检查）

```markdown
#### 结构健康
- [ ] L1 类总数 ≤ 25，关系密度 ≤ 1.0
- [ ] 所有继承链深度 ≤ 4
- [ ] migration_registry 中的项是否已满足 2-minor 过渡期，可以在 CHANGELOG 中公告移除时间表

#### 语义一致性
- [ ] 随机抽查 5 个类：JSON definition 与 docs-site 说明是否一致
- [ ] 所有 L2 extension 的 extends 字段是否指向当前有效的 L1 版本
- [ ] platform/ 绑定是否已同步最新 L1 变更

#### 文档完整性
- [ ] docs-site/changelog.md 与 CHANGELOG.md 同步
- [ ] README.md 中的版本号和类数量统计已更新
- [ ] `mkdocs build --strict` 通过

#### 发布操作
- [ ] 创建 git tag `vX.Y.Z` 触发 auto-release.yml
- [ ] 验证 GitHub Release 中的 changelog 摘录正确
- [ ] 验证 GitHub Pages 文档已更新
```

### 每个 Major 版本发布前（全面审计）

```markdown
#### 破坏性变更影响评估
- [ ] migration_registry 中所有项的下游迁移路径已在文档中说明
- [ ] 已通知/更新所有已知的 L2/L3 使用者
- [ ] Migration Guide 文档已发布

#### 架构健康审计
- [ ] 考虑是否有类可以合并（特别是当 L1 类数接近 25 时）
- [ ] 考虑是否有 L1 类可以下放至 extensions/common/
- [ ] 审查 4 个抽象域根类是否仍能覆盖所有 L1 具体类

#### 平台绑定审计
- [ ] OWL/RDF 文件已通过 Protégé 一致性检查
- [ ] GraphQL schema 已通过语法验证
- [ ] SQL DDL 已在 PostgreSQL 中测试执行
- [ ] JSON-LD context 已通过 JSON-LD Playground 验证
```

---

## 13. 熵增紧急处置流程

当检测到严重熵增时（如 CI 突然出现大量失败，或发现大规模语义不一致），按以下步骤处置：

### 步骤 1：评估级别

```
发现问题
    │
    ├─ 结构性违规（G-01~G-05 某规则被违反）
    │       → 立即阻断所有 L1 相关 PR 合并
    │       → 创建紧急 Issue，标记 label: governance-violation
    │
    ├─ 语义漂移（多处定义不一致）
    │       → 创建 Issue，标记 label: semantic-drift
    │       → 不阻断合并，但在下个 patch 版本中修正
    │
    └─ 文档过时（JSON 与文档不一致）
            → 创建 Issue，标记 label: doc-drift
            → 优先度：高（影响用户理解）
```

### 步骤 2：定位熵增根源

```bash
# 检查 L1 当前状态
python scripts/validate_governance.py

# 检查 JSON Schema 合法性
python -c "import jsonschema, json; \
  schema=json.load(open('schema/core_schema.json')); \
  instance=json.load(open('l1-core/universal_ontology_v1.json')); \
  jsonschema.validate(instance, schema); print('Schema OK')"

# 检查文档构建
mkdocs build --strict
```

### 步骤 3：最小化修复原则

- **只修复被报告的问题**，不借机重构无关部分
- 如果修复需要破坏性变更，评估是否等待下一个 major 版本
- 修复 PR 必须附上说明：根因是什么、为什么会发生、如何防止复发

### 步骤 4：预防改进

修复后，在 CONTRIBUTING.md 或本手册中添加对应的防控规则，确保同类问题不再发生。

---

## 附录：常见反模式速查

| 反模式 | 描述 | 正确做法 |
|:---|:---|:---|
| "先放进来再说" | 为了快速完成需求，跳过 G-04 验证 | 先在 L2 中验证，跨行业验证通过再提升 |
| "这个概念很重要" | 以重要性为由要求进入 L1 | L1 的门槛是"普遍性"，不是"重要性" |
| "改个名字而已" | 认为关系改名是小变更 | 关系改名是 Breaking Change，必须走废弃流程 |
| "文档以后再补" | 先合并代码，承诺之后补文档 | PR 必须包含文档更新，不接受无文档的 JSON 变更 |
| "这是我们公司特有的" | L3 特有概念被提交为 L2 | 描述清楚行业通用性，或保留在 L3 私有层 |
| "旧类留着向后兼容" | 废弃类无限期保留 | 执行 G-07：2 个 minor 版本后物理删除 |
| "复制现有关系改改名" | 关系语义高度重叠但命名不同 | 复用泛型关系，通过 domain/range 约束区分 |

---

*本手册随项目演进持续更新。如发现本手册本身有遗漏或不一致，请提交 Issue 或 PR。*

*版本：v1.0 | 基于 Universal Ontology Definition v2.0.0*
