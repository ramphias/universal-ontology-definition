<div align="center">

# 🌐 Universal Ontology Definition

**An Open, Standardized Four-Layer Enterprise Ontology Framework**

**Anti-entropy by design — structured, governed, and built to scale.**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Version](https://img.shields.io/badge/Version-2.0.0-green.svg)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

[中文](./README_CN.md) | **English**

</div>

---

## 📖 What is Universal Ontology Definition?

Universal Ontology Definition (UOD) is an **open, standardized four-layer enterprise ontology framework** designed to provide a unified conceptual modeling foundation for enterprise knowledge graphs, semantic layers, master data management, and AI Agent knowledge bases.

### The Problem

Enterprise digitalization commonly faces:

- 🔴 **Inconsistent concept definitions** — Different teams use different terms for the same objects, making cross-system reuse difficult
- 🔴 **Industry knowledge silos** — Industry-specific knowledge is scattered with no standardized extension mechanism
- 🔴 **Customization vs. standardization conflicts** — Enterprise-specific needs continuously erode the underlying structure
- 🔴 **Platform lock-in** — Ontology definitions tied to a single serialization format, limiting interoperability

### The Solution: Four-Layer Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│         L3: Enterprise Customization Layer                       │  ← Private extensions
│    (Company A)    (Company B)    (Company C)                     │
├──────────────────────────────────────────────────────────────────┤
│         L2: Industry & Domain Addons                             │  ← Optional, pluggable
│  (Common)  (Consulting)  (Luxury)  (Finance)  (Manufacturing)   │
├──────────────────────────────────────────────────────────────────┤
│         L1: Universal Enterprise Ontology Core (v2.0)            │  ← Mandatory inheritance
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │  Entity   │ │Governance│ │ Operational  │ │ Measurement │      │
│  │Party/Org/ │ │Policy/   │ │Role/Process/ │ │ Goal / KPI  │      │
│  │Resource   │ │Rule/Risk │ │Capability    │ │             │      │
│  └──────────┘ └──────────┘ └─────────────┘ └─────────────┘      │
├═════════════════════════════════════════════════════════════╤════╡
│    L0: Platform & Syntax Bindings                           │    │
│  (OWL/RDF)  (JSON-LD)  (GraphQL)  (SQL DDL)                │    │
└─────────────────────────────────────────────────────────────┘    │
```

## ✨ Key Features

- 🏗️ **Four-Layer Separation** — Stable semantic core, pluggable industry addons, free enterprise customization, multi-platform bindings
- 🛡️ **Anti-Entropy by Design** — 4 abstract domain roots, hard class caps, governance rules, and CI validation prevent ontology sprawl
- 📐 **Standardized Definition Format** — Unified JSON Schema with lifecycle management (status, since, deprecated_since)
- 🔗 **Inheritance & Extension** — L2 extends L1, L3 extends L1+L2, with generalized domain/range relations
- ⚙️ **Platform Bindings** — L0 provides ready-to-use OWL/RDF, JSON-LD, GraphQL, and SQL mappings
- 🌍 **Bilingual Support** — All concepts include Chinese and English labels
- 🤝 **Community-Driven** — Anyone can contribute industry addons, platform bindings, or improve core definitions

## 📁 Repository Structure

```
.
├── core/                       # L1 Universal Enterprise Ontology Core
│   └── universal_ontology_v1.json
├── addons/                     # L2 Industry & Domain Addons
│   ├── common/                 #   └── Common Enterprise Extension (demoted L1 classes)
│   ├── consulting/             #   └── Consulting Industry Addon
│   ├── luxury-goods/           #   └── Luxury Goods Industry Addon
│   └── _template/              #   └── Addon Contribution Template
├── enterprise/                 # L3 Enterprise Customization Layer (public samples)
│   ├── acme-tech-solutions/    #   └── Sample Virtual Enterprise (L3 demo)
│   ├── _template/              #   └── Enterprise Layer Template
│   └── README.md
├── private_enterprise/         # L3 Private Enterprise Layer (.gitignore excluded)
├── platform/                   # L0 Platform & Syntax Bindings
│   ├── owl-rdf/                #   └── OWL 2 / RDF Turtle Serialization
│   ├── json-ld/                #   └── JSON-LD Context Definition
│   ├── graphql/                #   └── GraphQL Schema Definition
│   ├── sql/                    #   └── PostgreSQL DDL Mapping
│   └── _template/              #   └── Platform Binding Template
├── scripts/                    # CI & Governance Automation
│   ├── validate_governance.py  #   └── L1 Governance Rule Validator
│   └── json_to_owl.py          #   └── JSON → OWL/RDF Turtle Converter
├── legacy/                     # Archived legacy tools and apps
├── docs/                       # Design Documentation & Specs
└── schema/                     # JSON Schema Validation
    ├── core_schema.json
    └── addon_schema.json
```

## 🚀 Quick Start

### Understanding Core Ontology

L1 v2.0 defines **24 classes** (4 abstract domains + 20 concrete) and **12 generalized relations**, organized into 4 semantic domains:

| Domain (Abstract) | Concrete Classes |
|:---|:---|
| 🟦 **Entity** | Party, Person, Organization, OrgUnit, Resource, ProductService, Asset, DataObject, Document, SystemApplication |
| 🟨 **Governance** | Policy, Rule, Control, Risk |
| 🟩 **Operational** | Role, Capability, Process, Event |
| 🟪 **Measurement** | Goal, KPI |

> Classes like Channel, Location, MarketSegment, Decision, and Activity have been moved to the [`addons/common/`](addons/common/) L2 addon for better separation of concerns.

### Using Platform Bindings (L0)

Choose the binding that matches your technology stack:

| Platform | Use Case | File |
|:---|:---|:---|
| OWL/RDF | Knowledge graphs, SPARQL queries, Semantic Web | [`platform/owl-rdf/`](platform/owl-rdf/) |
| JSON-LD | REST APIs, Linked Data, Web standards | [`platform/json-ld/`](platform/json-ld/) |
| GraphQL | Modern API layers, Frontend integration | [`platform/graphql/`](platform/graphql/) |
| SQL DDL | Relational databases, Data warehouses | [`platform/sql/`](platform/sql/) |

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

### 📋 Full Ontology Creation & Update Guide

For a comprehensive, step-by-step guide on creating or updating ontologies at any layer (L2/L3), including inheritance, validation, format conversion, and version management, see **[README_CN.md — Ontology 创建与更新完整指南](README_CN.md#-ontology-创建与更新完整指南)**.

A working L3 sample is available at [`enterprise/acme-tech-solutions/`](enterprise/acme-tech-solutions/) — a fictional technology consulting company demonstrating the full workflow.

## 🗂️ Available Industry Addons

| Industry | Directory | Classes | Relations | Status |
|:---|:---|:---:|:---:|:---|
| Common Enterprise | [`addons/common/`](addons/common/) | 10 | 5 | ✅ v1.0.0 |
| Consulting | [`addons/consulting/`](addons/consulting/) | 40+ | 34 | ✅ v1.0.0 |
| Luxury Goods | [`addons/luxury-goods/`](addons/luxury-goods/) | 38 | 14 | ✅ v2.0.0 |

**We're looking for community contributions!** Finance, Manufacturing, Retail, Healthcare, Education, and more.

## ⚙️ Available Platform Bindings

| Platform | Directory | Format | Status |
|:---|:---|:---|:---|
| OWL/RDF | [`platform/owl-rdf/`](platform/owl-rdf/) | Turtle (.ttl) | ✅ v1.0.0 |
| JSON-LD | [`platform/json-ld/`](platform/json-ld/) | JSON-LD Context (.jsonld) | ✅ v1.0.0 |
| GraphQL | [`platform/graphql/`](platform/graphql/) | GraphQL Schema (.graphql) | ✅ v1.0.0 |
| SQL DDL | [`platform/sql/`](platform/sql/) | PostgreSQL DDL (.sql) | ✅ v1.0.0 |

**Want more?** Protobuf, Avro, Neo4j Cypher, and more are welcome contributions!

## 🤝 Contributing

We welcome all contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) to learn about:

- How to propose changes to the Core Ontology
- How to submit new Industry Addons
- How to contribute new Platform Bindings
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
