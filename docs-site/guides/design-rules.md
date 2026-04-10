# Ontology Design Rules | Ontology 设计规范

Design standards and best practices for L1 Core, L2 Extensions, and L3 Enterprise extensions.
本文档定义了 Universal Ontology Definition 项目的设计规范和最佳实践，适用于 L1 Core、L2 Extension 和 L3 企业定制层。

## Class Naming | 类命名规则

| Rule | Correct (正确) | Incorrect (错误) |
|:---|:---|:---|
| Use PascalCase | `ConsultingFirm` | `consultingFirm`, `consulting_firm` |
| Use singular nouns / 使用单数名词 | `Process` | `Processes` |
| Avoid abbreviations (except widely known) / 避免缩写 | `SystemApplication` | `SysApp` |
| Allowed abbreviations / 允许的缩写 | `KPI`, `CRM`, `SKU` | `Org`, `Doc` |

## Required Class Fields | 类的必要字段

Every class definition must include:
每个类定义必须包含：

```json
{
  "id": "ClassName",          // Required, unique identifier, PascalCase
  "label_zh": "中文名称",      // Required, Chinese label
  "parent": "ParentClass",    // Required (root classes can be null)
  "definition": "中文定义说明"  // Required, clear professional definition
}
```

**Recommended additional fields (L1 Core) | 建议补充的字段（L1 Core）：**

```json
{
  "label_en": "English Label",
  "definition_en": "English definition"
}
```

## Inheritance Rules | 继承原则

- Every class must have an explicit `parent` (root classes excepted) / 每个类必须有明确的 `parent`（根类除外）
- L2 classes must have `parent` pointing to an L1 class / L2 类的 `parent` 必须指向 L1 中的类
- Inheritance depth should not exceed 5 levels / 继承深度建议不超过 5 层
- No multiple inheritance (one `parent` per class) / 避免多继承（一个类只能有一个 `parent`）

## When to Create a Class | 类的粒度指导

| ✅ Should be a class (应该建类) | ❌ Should NOT be a class (不应该建类) |
|:---|:---|
| Has an independent lifecycle (有独立的生命周期) | Just an attribute value of another class (只是另一个类的属性值) |
| Has unique relationship patterns (有独特的关系模式) | Can be distinguished by an enum type (可以用枚举类型区分) |
| Referenced by multiple processes (跨多个流程被引用) | Only used in one specific context (仅在某个特定上下文中使用) |
| Has dedicated governance rules (有专属的治理规则) | No independent management needs (没有独立的管理需求) |

## Relation Naming | 关系命名规则

| Rule | Correct (正确) | Incorrect (错误) |
|:---|:---|:---|
| Use snake_case | `plays_role` | `playsRole`, `PlaysRole` |
| Read like natural language / 读起来像自然语言 | `belongs_to` | `rel_001` |
| Use verb phrases / 动词短语 | `managed_by` | `manager` |
| Show directionality / 体现方向性 | `produces`, `consumed_by` | `related_to` |

## Required Relation Fields | 关系的必要字段

```json
{
  "id": "relation_name",     // Required, unique identifier, snake_case
  "domain": "SourceClass",   // Required, source class
  "range": "TargetClass",    // Required, target class
  "definition": "中文定义说明"  // Required
}
```

## Domain & Range Rules | Domain 和 Range 规则

- `domain` and `range` must reference existing class IDs / `domain` 和 `range` 必须引用存在的类 ID
- Ensure relations point natively upward in inheritance (e.g., L2 → L1) / 确保关系自然向上级引用（例如 L2 引用 L1）
- Avoid overly broad relations (e.g., `Resource` → `Resource`) / 避免过于宽泛的关系
- Use existing generic relations like `part_of` before creating new ones / 优先使用现有的泛化关系

## Instance ID Convention | 实例 ID 命名建议

Use `type_prefix_specific_name` format (使用 `类型前缀_具体名称` 格式):

- `org_global_retail_group`
- `role_category_manager`
- `proc_new_product_intro`
- `kpi_launch_cycle_time`

## Instance Requirements | 实例数量要求

| Layer (层级) | Minimum (最低要求) |
|:---|:---|
| L1 Core | At least 1 per major category (每个主要类别至少 1 个实例) |
| L2 Extension | At least 5 sample instances (至少 5 个示例实例) |
| L3 Enterprise | Per enterprise needs (根据企业情况自定) |

## JSON Format | JSON 格式规范

- **Encoding (编码)**: UTF-8
- **Indentation (缩进)**: 2 spaces
- **Quotes (引号)**: Double quotes
- **Trailing commas (尾逗号)**: Not allowed
- **Comments (注释)**: Not supported in JSON; use `description` fields / JSON 不支持注释，请用 `description` 字段

## Definition Writing | 定义文本写作规范

### Good Definitions | 好的定义

- ✅ *"An end-to-end sequence of activities defined to achieve business objectives" / "为实现业务目标而定义的端到端活动序列"*
- ✅ *"Uncertain events or conditions that may affect goal achievement" / "可能影响目标实现的不确定事件或状态"*

### Bad Definitions | 不好的定义

- ❌ *"A process" / "一个流程"* — Too vague (太模糊)
- ❌ *"It's a risk" / "就是风险"* — Circular definition (循环定义)
- ❌ *"TBD" / "略"* — Missing definition (缺失定义)

### Writing Principles | 写作原则

1. Use "what it is" rather than "what it does" / 使用"是什么"而非"做什么"的描述方式
2. Avoid circularly referencing the term itself / 避免循环引用自身名称
3. Differentiate from similar concepts / 指出与相近概念的区别
4. Keep under 50 characters (Chinese) or one sentence (English) / 尽量简练
