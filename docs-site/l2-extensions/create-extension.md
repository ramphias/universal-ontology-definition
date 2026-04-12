# Create Your Own Extension | 创建行业扩展

This guide walks you through creating a new Industry and Domain Extension for UOD.
本指南帮助你创建符合规范的行业/领域 Extension。一个好的 Extension 应该覆盖该行业的核心概念，并与 L1 通用层形成清晰的继承关系。

## Quick Start | 快速开始

### Step 1: Copy the Template | 第一步：复制模板

```bash
cp -r l2-extensions/_template l2-extensions/your-industry
mv l2-extensions/your-industry/extension_template.json l2-extensions/your-industry/your_industry_extension_v1.json
```

### Step 2: Edit Metadata | 第二步：修改元数据

```json
{
  "layer": "L2_your_industry_extension",
  "version": "1.0.0",
  "extends": "L1_universal_organization_ontology",
  "description": "One-line description of your Industry and Domain Extension | 你对这个行业扩展的一句话描述"
}
```

### Step 3: Define Classes | 第三步：定义类

Each class must inherit from an L1 class via the `parent` field:
为行业特有的概念创建类。每个类必须继承 L1 中的某个类：

```json
{
  "classes": [
    {
      "id": "YourIndustryEntity",
      "label_zh": "行业实体",
      "parent": "Organization",   // ← Must point to an L1 class (必须指向 L1 的类)
      "definition": "Clear Chinese definition | 清晰的中文定义"
    }
  ]
}
```

**Available L1 parent classes | L1 可用的父类参考:**

| Parent Class | Use When (适合继承的场景) |
|:---|:---|
| `Organization` | Industry-specific organizations (行业中的组织机构) |
| `OrgUnit` | Internal organizational units (组织内部单元) |
| `Role` | Industry-specific roles (行业特有角色) |
| `Resource` | Core business entities (行业核心业务实体) |
| `ProductService` | Products or services (行业产品或服务) |
| `Asset` | Industry asset types (行业资产类型) |
| `Document` | Industry document types (行业文档类型) |
| `Process` | Industry workflows (行业流程) |
| `Capability` | Industry capabilities (行业能力) |
| `Risk` | Industry risks (行业风险) |
| `Policy` | Industry policies (行业策略) |
| `Rule` | Industry rules (行业规则) |
| `Control` | Industry control measures (行业控制措施) |
| `Event` | Industry events (行业事件) |
| `KPI` | Industry metrics (行业指标) |
| `SystemApplication` | Industry systems (行业系统) |
| `DataObject` | Industry data concepts (行业数据资产) |

### Step 4: Define Relations | 第四步：定义关系

Define industry-specific relationships between concepts:
定义行业特有的概念间关系：

```json
{
  "relations": [
    {
      "id": "your_relation_name",
      "domain": "SourceClass",   // Source class (起点类)
      "range": "TargetClass",    // Target class (终点类)
      "definition": "Chinese definition | 关系的中文定义"
    }
  ]
}
```

### Step 5: Add Sample Instances | 第五步：添加示例实例

Provide at least 5 real-world examples:
提供至少 5 个真实场景的示例实例：

```json
{
  "sample_instances": [
    {
      "id": "instance_unique_id",
      "type": "YourIndustryEntity",
      "label": "Human-Readable Name",
      "label_zh": "中文阅读名称"
    }
  ]
}
```

### Step 6: Write README | 第六步：编写 README

Include: overview, coverage, statistics, use cases.
修改 `l2-extensions/your-industry/README.md`，包含：扩展概述、覆盖范围说明、统计信息（类数量、关系数量）、适用场景。

## Quality Checklist | 质量标准

### Must Have | 必须满足

- [x] All classes have a `parent` pointing to an L1 class / 所有类都有 `parent` 指向 L1 类
- [x] All classes and relations have a `definition` field / 所有类和关系都有 `definition` 字段
- [x] Class IDs use PascalCase / 类 ID 使用 PascalCase
- [x] Relation IDs use snake_case / 关系 ID 使用 snake_case
- [x] At least 10 industry-specific classes / 至少 10 个行业特有类
- [x] At least 5 industry-specific relations / 至少 5 个行业特有关系
- [x] At least 5 sample instances / 至少 5 个示例实例
- [x] Valid JSON passing schema validation / JSON 格式正确，通过 Schema 校验
- [x] Complete README.md / 有完整的 README.md

### Nice to Have | 建议满足

- [ ] Provide `label_en` (English labels) / 提供 `label_en`（英文标签）
- [ ] Cover multiple business dimensions / 覆盖多个业务维度（组织、流程、角色、资产、风控等）
- [ ] Real-world sample instances / 示例实例来自真实业务场景
- [ ] Definitions based on industry standards / 定义基于行业标准或专业规范

## Anti-Patterns to Avoid | 避免的反模式

| Anti-Pattern (反模式) | Description (说明) | Correct Approach (正确做法) |
|:---|:---|:---|
| Redefining L1 concepts (重新定义 L1 概念) | Creating L2 classes that duplicate L1 semantics (在 L2 中创建与 L1 语义重复的类) | Inherit L1, extend with attributes (继承 L1，扩展属性) |
| Over-granularity (过度细化) | Creating a class for each enum value (为每个枚举值创建独立的类) | Use `type` or `category` attributes (使用 `type` 或 `category` 属性区分) |
| Mixing enterprise concepts (混入企业专属概念) | Adding concepts specific to one company (添加只属于某家企业的概念) | Those belong in L3 (这些应放在 L3) |
| Overly broad relations (关系过于宽泛) | `related_to` type catch-all relations (`related_to` 类型的万能关系) | Use specific verbs (用具体的动词描述) |

## Submission Process | 提交流程

1. Fork the repository / Fork 本仓库
2. Create a branch: `git checkout -b extension/your-industry` / 创建分支
3. Add the complete extension directory / 添加完整的 Extension 目录
4. Submit a PR using the project's PR template / 提交 PR，使用项目的 PR 模板
5. Wait for review (typically 1-2 weeks) / 等待审核反馈

审核周期通常为 1-2 周。
