# Ontology 设计规范 | Ontology Design Guide

## 1. 概述

本文档定义了 Universal Ontology Definition 项目的设计规范和最佳实践，适用于 L1 Core、L2 Addon 和 L3 企业定制层。

## 2. 类 (Class) 设计规范

### 2.1 命名规则

| 规则 | 正确示例 | 错误示例 |
|:---|:---|:---|
| 使用 PascalCase | `ConsultingFirm` | `consultingFirm`, `consulting_firm` |
| 使用单数名词 | `Process` | `Processes` |
| 避免缩写（除广泛认可的） | `SystemApplication` | `SysApp` |
| 允许的缩写 | `KPI`, `CRM`, `SKU` | `Org`, `Doc` |

### 2.2 必要字段

每个类定义必须包含：

```json
{
  "id": "ClassName",          // 必须，唯一标识符，PascalCase
  "label_zh": "中文名称",      // 必须，中文标签
  "parent": "ParentClass",    // 必须（根类可为 null）
  "definition": "中文定义说明"  // 必须，清晰专业的定义
}
```

### 2.3 建议字段（L1 Core）

```json
{
  "label_en": "English Label",           // 英文标签
  "definition_en": "English definition"  // 英文定义
}
```

### 2.4 继承原则

- 每个类必须有明确的 `parent`（根类除外）
- L2 类的 `parent` 必须指向 L1 中的类
- 继承深度建议不超过 5 层
- 避免多继承（一个类只能有一个 `parent`）

### 2.5 类的粒度指导

| 应该建类 | 不应该建类 |
|:---|:---|
| 有独立的生命周期 | 只是另一个类的属性值 |
| 有独特的关系模式 | 可以用枚举类型区分 |
| 跨多个流程被引用 | 仅在某个特定上下文中使用 |
| 有专属的治理规则 | 没有独立的管理需求 |

## 3. 关系 (Relation) 设计规范

### 3.1 命名规则

| 规则 | 正确示例 | 错误示例 |
|:---|:---|:---|
| 使用 snake_case | `plays_role` | `playsRole`, `PlaysRole` |
| 读起来像自然语言 | `belongs_to` | `rel_001` |
| 动词短语 | `managed_by` | `manager` |
| 体现方向性 | `produces`, `consumed_by` | `related_to` |

### 3.2 必要字段

```json
{
  "id": "relation_name",     // 必须，唯一标识符，snake_case
  "domain": "SourceClass",   // 必须，关系起点类
  "range": "TargetClass",    // 必须，关系终点类
  "definition": "中文定义说明"  // 必须
}
```

### 3.3 Domain 和 Range 规则

- `domain` 和 `range` 必须引用存在的类 ID
- L2 关系可以引用 L1 的类作为 domain/range
- 避免过于宽泛的关系（如 `BusinessObject` → `BusinessObject`）

## 4. 示例实例 (Sample Instance) 设计规范

### 4.1 必要字段

```json
{
  "id": "instance_id",          // 必须，snake_case + 有意义的前缀
  "type": "ClassName",          // 必须，对应的类 ID
  "label": "Human-Readable Name" // 必须，英文标签
}
```

### 4.2 ID 命名建议

使用 `类型前缀_具体名称` 格式：

- `org_global_retail_group`
- `role_category_manager`
- `proc_new_product_intro`
- `kpi_launch_cycle_time`

### 4.3 数量要求

| 层级 | 最低要求 |
|:---|:---|
| L1 Core | 每个主要类别至少 1 个实例 |
| L2 Addon | 至少 5 个示例实例 |
| L3 Enterprise | 根据企业情况自定 |

## 5. JSON 格式规范

- **编码**：UTF-8
- **缩进**：2 空格
- **引号**：双引号
- **尾逗号**：不允许
- **注释**：JSON 不支持注释，请用 `description` 字段

## 6. 定义文本写作规范

### 好的定义

- ✅ "为实现业务目标而定义的端到端活动序列"
- ✅ "可能影响目标实现的不确定事件或状态"

### 不好的定义

- ❌ "一个流程" （太模糊）
- ❌ "就是风险" （循环定义）
- ❌ "略" （缺失定义）

### 定义写作原则

1. 使用"是什么"而非"做什么"的描述方式
2. 避免循环引用自身名称
3. 指出与相近概念的区别
4. 控制在 50 字以内
