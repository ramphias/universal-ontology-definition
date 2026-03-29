<div align="center">

# 🌐 Universal Ontology Definition

**An Open, Standardized Three-Layer Enterprise Ontology Framework**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

[中文](./README.md) | **English**

</div>

---

## 📖 What is Universal Ontology Definition?

Universal Ontology Definition (UOD) is an **open, standardized three-layer enterprise ontology framework** designed to provide a unified conceptual modeling foundation for enterprise knowledge graphs, semantic layers, master data management, and AI Agent knowledge bases.

### The Problem

Enterprise digitalization commonly faces:

- 🔴 **Inconsistent concept definitions** — Different teams use different terms for the same objects, making cross-system reuse difficult
- 🔴 **Industry knowledge silos** — Industry-specific knowledge is scattered with no standardized extension mechanism
- 🔴 **Customization vs. standardization conflicts** — Enterprise-specific needs continuously erode the underlying structure

### The Solution: Three-Layer Architecture

```
┌─────────────────────────────────────────────────┐
│         L3: Enterprise Customization Layer       │  ← Private extensions
│    (Company A)    (Company B)    (Company C)      │
├─────────────────────────────────────────────────┤
│         L2: Industry & Domain Addons             │  ← Optional, industry-specific
│  (Consulting) (Luxury) (Finance) (Manufacturing) │
├─────────────────────────────────────────────────┤
│         L1: Universal Enterprise Ontology Core   │  ← Mandatory inheritance
│    (Party/Org/Role/Capability/Process/Risk/Goal) │
└─────────────────────────────────────────────────┘
```

## ✨ Key Features

- 🏗️ **Three-Layer Separation** — Stable universal core, pluggable industry addons, free enterprise customization
- 📐 **Standardized Definition Format** — Unified JSON Schema for classes, relations, and instances
- 🔗 **Inheritance & Extension** — L2 extends L1, L3 extends L1+L2, with clear semantic lineage
- 🌍 **Bilingual Support** — All concepts include Chinese and English labels
- 🤝 **Community-Driven** — Anyone can contribute industry addons or improve core definitions

## 📁 Repository Structure

```
universal-ontology-definition/
├── core/                       # L1 Universal Enterprise Ontology Core
│   └── universal_ontology_v1.json
├── addons/                     # L2 Industry & Domain Addons
│   ├── consulting/             #   └── Consulting Industry Addon
│   ├── luxury-goods/           #   └── Luxury Goods Industry Addon
│   └── _template/              #   └── Addon Contribution Template
├── docs/                       # Design Documentation & Specs
│   ├── architecture.md
│   ├── ontology-design-guide.md
│   └── addon-development-guide.md
└── schema/                     # JSON Schema Validation
    ├── core_schema.json
    └── addon_schema.json
```

## 🚀 Quick Start

### Understanding Core Ontology

L1 defines **25 core classes** and **16 standard relations** covering universal enterprise concepts:

| Category | Core Classes |
|:---|:---|
| Party & Organization | Party, Person, Organization, OrgUnit, Role |
| Capability & Process | Capability, Process, Activity |
| Business Objects | BusinessObject, ProductService, Asset |
| Data & Systems | DataObject, DocumentRecord, SystemApplication |
| Governance & Compliance | Policy, Rule, Control, Risk |
| Decision & Measurement | Event, Decision, Goal, KPI |
| Market & Channel | Location, Channel, MarketSegment |

### Using Industry Addons

Browse the `addons/` directory and select the appropriate industry package. Each addon declares its parent through the `extends` field:

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
      "definition": "An enterprise entity providing professional consulting services"
    }
  ]
}
```

### Contributing a New Industry Addon

1. Copy `addons/_template/` as your starting point
2. Follow the [Addon Development Guide](docs/addon-development-guide.md)
3. Validate against `schema/addon_schema.json`
4. Submit a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 🗂️ Available Industry Addons

| Industry | Directory | Classes | Relations | Status |
|:---|:---|:---:|:---:|:---|
| Consulting | [`addons/consulting/`](addons/consulting/) | 40+ | 34 | ✅ v1.0.0 |
| Luxury Goods | [`addons/luxury-goods/`](addons/luxury-goods/) | 21 | 10 | ✅ v1.0.0 |

**We're looking for community contributions!** Finance, Manufacturing, Retail, Healthcare, Education, and more.

## 🤝 Contributing

We welcome all contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) to learn about:

- How to propose changes to the Core Ontology
- How to submit new Industry Addons
- Coding standards and PR workflow

## 📄 License

This project is licensed under the [Apache License 2.0](LICENSE).

You are free to:
- ✅ Use commercially
- ✅ Modify and distribute
- ✅ Build private L3 enterprise layers on top

## 🙏 Acknowledgments

The ontology design draws inspiration from:

- [OWL 2 Web Ontology Language](https://www.w3.org/TR/owl2-overview/)
- [RDF 1.1 Concepts and Abstract Syntax](https://www.w3.org/TR/rdf11-concepts/)
- [Schema.org](https://schema.org/)
- [ArchiMate](https://www.opengroup.org/archimate-forum/archimate-overview)

---

<div align="center">

**If this project helps you, please give it a ⭐ Star!**

</div>
