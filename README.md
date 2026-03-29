<div align="center">

# 🌐 Universal Ontology Definition

**开放、标准化的三层企业本体定义框架**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

[English](./README_EN.md) | **中文**

</div>

---

## 📖 什么是 Universal Ontology Definition？

Universal Ontology Definition (UOD) 是一个**开放、标准化的三层企业本体定义框架**，旨在为企业知识图谱、语义层、主数据管理和 AI Agent 知识底座提供统一的概念建模基础。

在企业数字化建设中，我们常面临以下痛点：

- 🔴 **概念定义不统一** — 不同团队用不同术语描述同一对象，跨系统、跨项目难以复用
- 🔴 **行业知识难复用** — 行业特性沉淀分散，缺乏标准化的扩展机制
- 🔴 **企业个性化与通用规范冲突** — 定制需求持续侵蚀底层结构

UOD 通过**三层继承架构**解决这些问题：

```
┌─────────────────────────────────────────────────┐
│         L3：企业个性化定制层                       │  ← 企业私有扩展
│    （企业A定制） （企业B定制） （企业C定制）          │
├─────────────────────────────────────────────────┤
│         L2：行业与业务领域 Addon                   │  ← 可选加载，行业特性
│    （咨询）（奢侈品）（金融）（制造）（零售）          │
├─────────────────────────────────────────────────┤
│         L1：通用企业 Ontology Core                │  ← 强制继承，基础规范
│    （主体/组织/角色/能力/流程/资产/风险/目标）        │
└─────────────────────────────────────────────────┘
```

## ✨ 核心特性

- 🏗️ **三层分离架构** — 通用底座稳定不变，行业包按需加载，企业层自由定制
- 📐 **标准化定义格式** — 统一的 JSON Schema，支持类、关系、实例的结构化定义
- 🔗 **继承与扩展机制** — L2 继承 L1，L3 继承 L1+L2，语义链条清晰可追溯
- 🌍 **双语支持** — 所有概念均提供中英文标签与定义
- 🤝 **社区驱动** — 欢迎任何人贡献行业 Addon 或完善 Core 定义

## 📁 仓库结构

```
universal-ontology-definition/
├── core/                       # L1 通用企业 Ontology Core
│   └── universal_ontology_v1.json
├── addons/                     # L2 行业 & 领域 Addon
│   ├── consulting/             #   └── 咨询行业 Addon
│   ├── luxury-goods/           #   └── 奢侈品行业 Addon
│   └── _template/              #   └── Addon 贡献模板
├── docs/                       # 设计文档与规范
│   ├── architecture.md         #   └── 三层架构详解
│   ├── ontology-design-guide.md#   └── Ontology 设计规范
│   └── addon-development-guide.md  # └── Addon 开发指南
└── schema/                     # JSON Schema 校验
    ├── core_schema.json
    └── addon_schema.json
```

## 🚀 快速开始

### 了解 Core Ontology

L1 通用层定义了 **25 个核心类** 和 **16 种标准关系**，覆盖所有企业通用概念：

| 类别 | 核心类 |
|:---|:---|
| 主体与组织 | Party, Person, Organization, OrgUnit, Role |
| 能力与流程 | Capability, Process, Activity |
| 业务对象 | BusinessObject, ProductService, Asset |
| 数据与系统 | DataObject, DocumentRecord, SystemApplication |
| 治理与合规 | Policy, Rule, Control, Risk |
| 决策与度量 | Event, Decision, Goal, KPI |
| 市场与渠道 | Location, Channel, MarketSegment |

### 使用行业 Addon

浏览 `addons/` 目录，选择适合的行业包。每个 Addon 通过 `extends` 字段声明其继承的上层定义：

```json
{
  "layer": "L2_consulting_industry_addon",
  "version": "1.0.0",
  "extends": "L1_universal_organization_ontology",
  "classes": [
    {
      "id": "ConsultingFirm",
      "label_zh": "咨询公司",
      "parent": "Organization",
      "definition": "提供专业咨询服务的企业主体"
    }
  ]
}
```

### 贡献新的行业 Addon

1. 复制 `addons/_template/` 作为起点
2. 按照 [Addon 开发指南](docs/addon-development-guide.md) 填充定义
3. 使用 `schema/addon_schema.json` 校验格式
4. 提交 Pull Request

详见 [CONTRIBUTING.md](CONTRIBUTING.md)

## 🗂️ 已有行业 Addon

| 行业 | 目录 | 类数量 | 关系数量 | 状态 |
|:---|:---|:---:|:---:|:---|
| 咨询行业 | [`addons/consulting/`](addons/consulting/) | 40+ | 34 | ✅ v1.0.0 |
| 奢侈品行业 | [`addons/luxury-goods/`](addons/luxury-goods/) | 21 | 10 | ✅ v1.0.0 |

**期待社区贡献更多行业 Addon！** 如金融、制造、零售、医疗、教育等。

## 🤝 Contributing

我们欢迎所有形式的贡献！请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解：

- 如何提议修改 Core Ontology
- 如何提交新的行业 Addon
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
