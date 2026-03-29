# Addon 开发指南 | Addon Development Guide

## 1. 概述

本指南帮助你创建符合规范的行业/领域 Addon。一个好的 Addon 应该覆盖该行业的核心概念，并与 L1 通用层形成清晰的继承关系。

## 2. 快速开始

### 第一步：复制模板

```bash
cp -r addons/_template addons/your-industry
mv addons/your-industry/addon_template.json addons/your-industry/your_industry_addon_v1.json
```

### 第二步：修改元数据

```json
{
  "layer": "L2_your_industry_addon",
  "version": "1.0.0",
  "extends": "L1_universal_organization_ontology",
  "description": "你对这个行业 Addon 的一句话描述"
}
```

### 第三步：定义类

为行业特有的概念创建类。每个类必须继承 L1 中的某个类：

```json
{
  "classes": [
    {
      "id": "YourIndustryEntity",
      "label_zh": "行业实体",
      "parent": "Organization",    // ← 必须指向 L1 的类
      "definition": "清晰的中文定义"
    }
  ]
}
```

**L1 可用的父类参考**：

| 父类 | 适合继承的场景 |
|:---|:---|
| `Organization` | 行业中的组织机构 |
| `OrgUnit` | 组织内部单元 |
| `Role` | 行业特有角色 |
| `BusinessObject` | 行业核心业务实体 |
| `ProductService` | 行业产品或服务 |
| `Asset` | 行业资产类型 |
| `DocumentRecord` | 行业文档类型 |
| `Process` | 行业流程 |
| `Capability` | 行业能力 |
| `Risk` | 行业风险 |
| `Policy` | 行业策略 |
| `Rule` | 行业规则 |
| `Control` | 行业控制措施 |
| `Event` | 行业事件 |
| `KPI` | 行业指标 |
| `SystemApplication` | 行业系统 |
| `Channel` | 行业渠道 |

### 第四步：定义关系

定义行业特有的概念间关系：

```json
{
  "relations": [
    {
      "id": "your_relation_name",
      "domain": "SourceClass",    // 起点类
      "range": "TargetClass",     // 终点类
      "definition": "关系的中文定义"
    }
  ]
}
```

### 第五步：添加示例实例

提供至少 5 个真实场景的示例实例：

```json
{
  "sample_instances": [
    {
      "id": "instance_unique_id",
      "type": "YourIndustryEntity",
      "label": "Human-Readable Name"
    }
  ]
}
```

### 第六步：编写 README

修改 `addons/your-industry/README.md`，包含：

- 行业 Addon 概述
- 覆盖范围说明
- 统计信息（类数量、关系数量）
- 适用场景

## 3. 质量标准

### 必须满足

- [x] 所有类都有 `parent` 指向 L1 类
- [x] 所有类和关系都有 `definition` 字段
- [x] 类 ID 使用 PascalCase
- [x] 关系 ID 使用 snake_case
- [x] 至少 10 个行业特有类
- [x] 至少 5 个行业特有关系
- [x] 至少 5 个示例实例
- [x] JSON 格式正确，通过 Schema 校验
- [x] 有完整的 README.md

### 建议满足

- [ ] 提供 `label_en`（英文标签）
- [ ] 覆盖多个业务维度（组织、流程、角色、资产、风控等）
- [ ] 示例实例来自真实业务场景
- [ ] 定义基于行业标准或专业规范

## 4. 行业 Addon 设计建议

### 4.1 如何选择概念

问自己以下问题：

1. 这个概念是否在该行业中**普遍存在**？（不只是某家企业）
2. 这个概念是否有**独特的属性和关系**？（不只是换个名称）
3. 这个概念是否已经在 L1 中被**更通用地表达**？（如果是，应该继承而非新建）

### 4.2 避免的反模式

| 反模式 | 说明 | 正确做法 |
|:---|:---|:---|
| 重新定义 L1 概念 | 在 L2 中创建与 L1 语义重复的类 | 继承 L1，扩展属性 |
| 过度细化 | 为每个枚举值创建独立的类 | 使用 `type` 或 `category` 属性区分 |
| 混入企业专属概念 | 添加只属于某家企业的概念 | 这些应放在 L3 |
| 关系过于宽泛 | `related_to` 类型的万能关系 | 用具体的动词描述 |

### 4.3 参考已有 Addon

- [咨询行业 Addon](../addons/consulting/) — 40+ 类的完整示例
- [奢侈品行业 Addon](../addons/luxury-goods/) — 21 类的精简示例

## 5. 提交流程

1. Fork 本仓库
2. 创建分支：`git checkout -b addon/your-industry`
3. 添加完整的 Addon 目录
4. 提交 PR，使用项目的 PR 模板
5. 等待审核反馈

审核周期通常为 1-2 周。
