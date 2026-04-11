# L1 — Universal Enterprise Ontology Core

本目录包含 Universal Ontology Definition 框架的 **第一层（L1）通用企业 Ontology**。

## 概述

L1 定义了适用于**所有企业**的通用组织概念模型，是整个三层架构的基础。所有行业与业务领域扩展（L2）和企业定制（L3）都必须继承此层定义。

## 设计原则

- **稳定优先**：只容纳跨行业、跨企业的长期稳定抽象
- **最小可用核心**：保持精简，只定义真正通用的概念
- **清晰分类**：每个类都有明确的父类关系和语义边界

## 包含内容

### 25 个核心类

| 领域 | 类 |
|:---|:---|
| 主体与组织 | `Party`, `Person`, `Organization`, `OrgUnit`, `Role` |
| 能力与流程 | `Capability`, `Process`, `Activity` |
| 业务对象 | `BusinessObject`, `ProductService`, `Asset` |
| 数据与系统 | `DataObject`, `DocumentRecord`, `SystemApplication` |
| 治理与合规 | `Policy`, `Rule`, `Control`, `Risk` |
| 决策与度量 | `Event`, `Decision`, `Goal`, `KPI` |
| 市场与渠道 | `Location`, `Channel`, `MarketSegment` |

### 16 种标准关系

如 `plays_role`, `belongs_to`, `owns`, `realized_by`, `composed_of`, `governed_by`, `mitigated_by`, `supports`, `measured_by` 等。

### 8 个示例实例

提供一组跨行业的典型实例，帮助理解概念用法。

## 文件

- [`universal_ontology_v1.json`](universal_ontology_v1.json) — L1 完整定义文件

## 版本

当前版本：**v1.0.0**

## 修改流程

对 L1 的修改需要经过严格的社区审核流程，请参阅 [CONTRIBUTING.md](../CONTRIBUTING.md)。
