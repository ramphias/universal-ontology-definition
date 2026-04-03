# Ontology Design Rules

Design standards and best practices for L1 Core, L2 Addons, and L3 Enterprise extensions.

## Class Naming

| Rule | Correct | Incorrect |
|:---|:---|:---|
| Use PascalCase | `ConsultingFirm` | `consultingFirm`, `consulting_firm` |
| Use singular nouns | `Process` | `Processes` |
| Avoid abbreviations (except widely known) | `SystemApplication` | `SysApp` |
| Allowed abbreviations | `KPI`, `CRM`, `SKU` | `Org`, `Doc` |

## Required Class Fields

Every class definition must include:

```json
{
  "id": "ClassName",
  "label_zh": "中文名称",
  "parent": "ParentClass",
  "definition": "中文定义说明"
}
```

**Recommended additional fields (L1 Core):**

```json
{
  "label_en": "English Label",
  "definition_en": "English definition"
}
```

## Inheritance Rules

- Every class must have an explicit `parent` (root classes excepted)
- L2 classes must have `parent` pointing to an L1 class
- Inheritance depth should not exceed 5 levels
- No multiple inheritance (one `parent` per class)

## When to Create a Class

| ✅ Should be a class | ❌ Should NOT be a class |
|:---|:---|
| Has an independent lifecycle | Just an attribute value of another class |
| Has unique relationship patterns | Can be distinguished by an enum type |
| Referenced by multiple processes | Only used in one specific context |
| Has dedicated governance rules | No independent management needs |

## Relation Naming

| Rule | Correct | Incorrect |
|:---|:---|:---|
| Use snake_case | `plays_role` | `playsRole`, `PlaysRole` |
| Read like natural language | `belongs_to` | `rel_001` |
| Use verb phrases | `managed_by` | `manager` |
| Show directionality | `produces`, `consumed_by` | `related_to` |

## Required Relation Fields

```json
{
  "id": "relation_name",
  "domain": "SourceClass",
  "range": "TargetClass",
  "definition": "中文定义说明"
}
```

## Domain & Range Rules

- `domain` and `range` must reference existing class IDs
- L2 relations can reference L1 classes as domain/range
- Avoid overly broad relations (e.g., `BusinessObject` → `BusinessObject`)

## Instance ID Convention

Use `type_prefix_specific_name` format:

- `org_global_retail_group`
- `role_category_manager`
- `proc_new_product_intro`
- `kpi_launch_cycle_time`

## Instance Requirements

| Layer | Minimum |
|:---|:---|
| L1 Core | At least 1 per major category |
| L2 Addon | At least 5 sample instances |
| L3 Enterprise | Per enterprise needs |

## JSON Format

- **Encoding**: UTF-8
- **Indentation**: 2 spaces
- **Quotes**: Double quotes
- **Trailing commas**: Not allowed
- **Comments**: Not supported in JSON; use `description` fields

## Definition Writing

### Good Definitions

- ✅ *"An end-to-end sequence of activities defined to achieve business objectives"*
- ✅ *"Uncertain events or conditions that may affect goal achievement"*

### Bad Definitions

- ❌ *"A process"* — Too vague
- ❌ *"It's a risk"* — Circular definition
- ❌ *"TBD"* — Missing definition

### Writing Principles

1. Use "what it is" rather than "what it does"
2. Avoid circularly referencing the term itself
3. Differentiate from similar concepts
4. Keep under 50 characters (Chinese) or one sentence (English)
