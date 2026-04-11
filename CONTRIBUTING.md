# 贡献指南 | Contributing Guide

感谢你对 Universal Ontology Definition 的关注！我们欢迎所有形式的贡献。

Thank you for your interest in Universal Ontology Definition! We welcome contributions of all kinds.

---

## 📋 目录

- [贡献类型](#贡献类型)
- [行为准则](#行为准则)
- [提交 Issue](#提交-issue)
- [贡献 Core Ontology 修改](#贡献-core-ontology-修改)
- [贡献行业与业务领域扩展](#贡献行业-extension)
- [Pull Request 流程](#pull-request-流程)
- [命名与格式规范](#命名与格式规范)

---

## 贡献类型

| 类型 | 说明 | 难度 |
|:---|:---|:---|
| 🐛 Bug 报告 | 发现定义错误、关系缺失、JSON 格式问题 | ⭐ |
| 💡 建议讨论 | 对 Core Ontology 的改进建议 | ⭐ |
| 📝 文档改进 | 完善文档、修正翻译、添加示例 | ⭐⭐ |
| 🌐 行业与业务领域扩展 | 贡献新的行业或领域扩展包 | ⭐⭐⭐ |
| 🏗️ Core 修改 | 对 L1 核心层的结构性修改 | ⭐⭐⭐⭐ |

---

## 行为准则

参与本项目需遵守 [行为准则](CODE_OF_CONDUCT.md)。请确保所有交互保持尊重和建设性。

---

## 提交 Issue

请使用对应的 Issue 模板：

- **Core Ontology 修改建议** — 对 L1 通用层的修改提议
- **行业与业务领域扩展 提交** — 提议或提交新的行业扩展
- **Bug 报告** — JSON 格式错误、关系定义不一致等

---

## 贡献 Core Ontology 修改

Core Ontology (L1) 是整个框架的基础，修改需要谨慎审核。

### 原则

1. **稳定优先** — L1 只接纳跨行业、跨企业的通用抽象
2. **非破坏性** — 新增优于修改，修改优于删除
3. **充分论证** — 必须说明修改理由和影响范围

### 流程

1. 先提交 Issue 讨论你的修改想法
2. 获得维护者认同后，Fork 本仓库
3. 在 `core/` 目录下进行修改
4. 确保通过 `schema/core_schema.json` 校验
5. 在 PR 描述中说明修改原因和影响分析
6. 等待至少 2 位维护者审核通过

---

## 🛡️ L1 Core 治理规则 (Governance Rules)

为防止 Ontology 在持续迭代中熵增失控，L1 Core 受以下硬性规则约束。所有 Core 层 PR 在合并前必须通过自动化治理检查。

> **Anti-Entropy Principle**: L1 Core 是"语义骨架"而非"概念百科"。添加新概念的成本应显著高于在 L2 中添加。

| 规则编号 | 规则名称 | 约束 | 说明 |
|:---|:---|:---|:---|
| **G-01** | 类数量硬上限 | L1 类总数 ≤ **25** | 超过上限必须先合并或下放现有类，才能新增。由 `core_schema.json` 中 `maxItems: 25` 强制执行。 |
| **G-02** | 根类数量限制 | `parent: null` 的根类 ≤ **5** | 当前 4 个抽象域根类（Entity / Governance / Operational / Measurement），仅在极特殊情况下可新增第 5 个。 |
| **G-03** | 继承深度限制 | 继承链深度 ≤ **4** 层 | 避免过度抽象导致的理解成本增加。 |
| **G-04** | 跨行业验证 | 新增 L1 类需 ≥ **3 个行业** 证明 | 提议者必须论证该概念在至少 3 个不同行业中是通用且必要的。 |
| **G-05** | 关系密度控制 | 关系数量 ≤ 类数量 × **1.0** | 避免关系爆炸。当前 12 关系 / 24 类 = 0.5，健康范围内。 |
| **G-06** | 变更速度限制 | 单次版本迭代最多变更 **3 个类** | 每个 minor 版本最多新增/修改/删除 3 个类定义，确保下游有充分适配时间。 |
| **G-07** | 废弃过渡期 | Deprecated → Removed 至少 **2 个 minor 版本** | 标记 `deprecated` 后，必须在至少 2 个后续版本中保留 `migration_registry` 记录，才能最终移除。 |
| **G-08** | 示例行业中立 | `sample_instances` 不得暗示特定行业 | 使用通用企业名称（如 "Acme Corp"）和通用流程（如 "Order to Cash"），避免引导用户误认为 L1 面向特定领域。 |

### 治理检查清单 (Core PR Checklist)

每个修改 L1 Core 的 PR 必须在描述中附上以下检查清单：

```markdown
### L1 Governance Checklist
- [ ] G-01: 修改后类总数 ≤ 25
- [ ] G-02: 根类（parent=null）总数 ≤ 5
- [ ] G-03: 所有继承链深度 ≤ 4
- [ ] G-04: 新增类已提供 ≥3 行业通用性论证
- [ ] G-05: 关系数 ≤ 类数
- [ ] G-06: 本次变更涉及 ≤ 3 个类
- [ ] G-07: 废弃的类/关系/属性已通过 status 字段标记，或记录在 migration_registry 中
- [ ] G-08: sample_instances 不含行业特定示例
- [ ] 通过 `schema/core_schema.json` 校验
- [ ] 通过 `scripts/validate_governance.py` 自动化检查
```

---

## 贡献行业与业务领域扩展

我们非常欢迎新的行业与业务领域扩展！

### 步骤

1. **复制模板**：将 `extensions/_template/` 复制为 `extensions/your-industry/`
2. **命名规范**：目录名使用英文小写 + 连字符，如 `financial-services`、`healthcare`
3. **编写定义**：
   - 所有类必须通过 `parent` 字段继承 L1 中的类
   - 使用 `extends` 字段声明继承的上层 Ontology
   - 每个类和关系都必须有 `definition` 字段（中文说明）
   - 提供 `sample_instances`（至少 5 个示例实例）
4. **编写 README**：说明该行业与业务领域扩展 的覆盖范围和设计考量
5. **格式校验**：确保通过 `schema/extension_schema.json` 校验
6. **提交 PR**：使用 PR 模板提交

### 质量要求

- ✅ 所有类必须有明确的 `parent`，不允许无根类（除非有充分理由）
- ✅ 至少覆盖 10 个行业特有概念
- ✅ 至少定义 5 个行业特有关系
- ✅ 提供至少 5 个示例实例
- ✅ 定义文本应清晰、专业，避免模糊描述

---

## Pull Request 流程

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/your-feature-name`
3. 提交修改：`git commit -m "feat: add healthcare Industry and Domain Extension"`
4. 推送到你的 Fork：`git push origin feature/your-feature-name`
5. 创建 Pull Request，使用项目提供的 PR 模板

### Commit 消息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
feat: add healthcare Industry and Domain Extension
fix: correct relationship domain in consulting extension
docs: improve extension development guide
refactor: reorganize core ontology class hierarchy
```

---

## 命名与格式规范

### 类 ID 命名

- 使用 PascalCase：`ConsultingFirm`、`LuxuryProduct`
- 避免缩写（除非是广泛认可的，如 `KPI`、`CRM`）
- L2 类建议带行业前缀以避免冲突

### 关系 ID 命名

- 使用 snake_case：`has_practice_line`、`belongs_to_collection`
- 应当读起来像自然语言：`[Domain] [relation] [Range]`

### JSON 格式

- 使用 2 空格缩进
- UTF-8 编码
- 所有字符串值使用双引号

---

感谢你的贡献！🎉
