<div align="center">

# 🌐 Universal Ontology Definition

**An Open, Standardized Four-Layer Enterprise Ontology Framework**

> *Anti-entropy by design — structured, governed, and built to scale.*

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge)](https://opensource.org/licenses/Apache-2.0)
[![Version](https://img.shields.io/badge/Version-2.0.0-success.svg?style=for-the-badge)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](#contributing)

*[中文](./README_CN.md) | **English***

</div>

---

## 📖 What is Universal Ontology Definition?

Universal Ontology Definition (UOD) is an **open, standardized four-layer enterprise ontology framework** designed to provide a unified conceptual modeling foundation for enterprise knowledge graphs, semantic layers, master data management, and AI Agent knowledge bases.

### 🔴 The Problem

Enterprise digitalization commonly faces:

- **Inconsistent concept definitions** — Different teams use different terms for the same objects, making cross-system reuse difficult.
- **Industry knowledge silos** — Industry-specific knowledge is scattered with no standardized extension mechanism.
- **Customization vs. standardization conflicts** — Enterprise-specific needs continuously erode the underlying structure.
- **Platform lock-in** — Ontology definitions tied to a single serialization format, limiting interoperability.

### 🟢 The Solution: Four-Layer Architecture

```mermaid
flowchart TD
    classDef layer3 fill:#f8f9fa,stroke:#dee2e6,stroke-width:2px,stroke-dasharray: 5 5,color:#495057
    classDef layer2 fill:#e9ecef,stroke:#ced4da,stroke-width:2px,color:#495057
    classDef layer1 fill:#e0f3ff,stroke:#0d6efd,stroke-width:2px,color:#0a58ca,font-weight:bold
    classDef layer0 fill:#f8f9fa,stroke:#dee2e6,stroke-width:2px,color:#6c757d
    classDef label fill:none,stroke:none,color:#6c757d,font-size:12px
    
    L3["<b>L3: Enterprise Customization Layer</b><br/><span style='font-size:13px'>Company A | Company B | Company C</span>"]:::layer3
    L2["<b>L2: Industry & Domain Extensions</b><br/><span style='font-size:13px'>Common | Consulting | Luxury | Finance | Manufacturing</span>"]:::layer2
    L1["<b>L1: Universal Enterprise Ontology Core (v2.0)</b><br/>Entity 🔸 Governance 🔸 Operational 🔸 Measurement"]:::layer1
    L0["<b>L0: Platform & Syntax Bindings</b><br/><span style='font-size:13px'>OWL/RDF | JSON-LD | GraphQL | SQL DDL</span>"]:::layer0

    L3 -. "Private extensions (Optional)" .-> L2
    L3 -. "Mandatory inheritance" .-> L1
    L2 -- "Pluggable domain models" --> L1
    L1 == "Binds to" ==> L0
```

---

## ✨ Key Features

- 🏗️ **Four-Layer Separation** — Stable semantic core, pluggable Industry and Domain Extension, free enterprise customization, and multi-platform bindings.
- 🛡️ **Anti-Entropy by Design** — 4 abstract domain roots, hard class caps, governance rules, and CI validation prevent ontology sprawl.
- 📐 **Standardized Definition Format** — Unified JSON Schema with lifecycle management (`status`, `since`, `deprecated_since`).
- 🔗 **Inheritance & Extension** — L2 extends L1, L3 extends L1+L2, with generalized domain/range relations.
- ⚙️ **Platform Bindings** — L0 provides ready-to-use OWL/RDF, JSON-LD, GraphQL, and SQL mappings.
- 🌍 **Bilingual Support** — All concepts include Chinese and English labels and definitions.
- 🤝 **Community-Driven** — Anyone can contribute Industry and Domain Extensions, platform bindings, or improve core definitions.

---

## 📁 Repository Structure

```text
.
├── core/                       # L1 Universal Enterprise Ontology Core
│   └── universal_ontology_v1.json
├── l2-extensions/              # L2 Industry & Domain Extensions
│   ├── common/                 #   └── Common Enterprise Extension
│   ├── consulting/             #   └── Consulting Industry
│   ├── financial-services/     #   └── Financial Services (Banking, Insurance, Asset Mgmt)
│   ├── fnb/                    #   └── Food & Beverage
│   ├── healthcare/             #   └── Healthcare (Clinical, Pharma, Medical Devices)
│   ├── luxury-goods/           #   └── Luxury Goods
│   ├── manufacturing/          #   └── Manufacturing (Factory Ops, MES, Quality)
│   ├── technology/             #   └── Technology (SaaS, DevOps, AI/ML)
│   └── _template/              #   └── Extension Contribution Template
├── l3-enterprise/              # L3 Enterprise Examples
│   ├── acme-tech-solutions/    #   └── Sample Virtual Enterprise
│   └── _template/              #   └── Enterprise Layer Template
├── l0-platform/                # L0 Platform & Syntax Bindings
│   ├── owl-rdf/                #   └── OWL 2 / RDF Turtle
│   ├── json-ld/                #   └── JSON-LD Context
│   ├── graphql/                #   └── GraphQL Schema
│   ├── sql/                    #   └── PostgreSQL DDL
│   └── _template/              #   └── Platform Binding Template
├── scripts/                    # Tooling & Automation
│   ├── validate_governance.py  #   └── L1 Governance Validator
│   ├── validate_l3.py          #   └── L2/L3 Referential Integrity Validator
│   ├── merge_layers.py         #   └── Multi-Layer Merger (L1+L2+L3 → 5 formats)
│   ├── visualize_ontology.py   #   └── Interactive HTML Visualization Generator
│   ├── diff_ontology.py        #   └── Structural Diff Between Versions
│   ├── export_for_llm.py       #   └── LLM Export (System Prompt, Tools, RAG Chunks)
│   ├── export_neo4j.py         #   └── Neo4j Cypher Import Generator
│   └── json_to_owl.py          #   └── JSON → OWL/RDF Turtle Converter
├── uod/                        # Python SDK
│   ├── __init__.py             #   └── from uod import load_ontology
│   └── graph.py                #   └── OntologyGraph: query, path, search, export
├── docs-site/                  # MkDocs Documentation Site Source
└── schema/                     # JSON Schema Validation
    ├── core_schema.json
    └── extension_schema.json
```

---

## 🚀 Quick Start

### 1️⃣ Understanding Core Ontology

L1 v2.0 defines **24 classes** (4 abstract domains + 20 concrete) and **12 generalized relations**, organized into 4 semantic domains:

| Domain | Semantic Focus | Classes |
|:---|:---|:---|
| 🟦 **Entity** | Physical & logical entities | `Party`, `Person`, `Organization`, `OrgUnit`, `Resource`, `ProductService`, `Asset`, `DataObject`, `Document`, `SystemApplication` |
| 🟨 **Governance** | Control & compliance | `Policy`, `Rule`, `Control`, `Risk` |
| 🟩 **Operational** | Execution & capabilities | `Role`, `Capability`, `Process`, `Event` |
| 🟪 **Measurement** | Outcomes & metrics | `Goal`, `KPI` |

### 2️⃣ Using Platform Bindings (L0)

Choose the binding that matches your technology stack:

| Platform | Use Case | Directory |
|:---|:---|:---|
| **OWL/RDF** | Knowledge graphs, SPARQL queries | [`platform/owl-rdf/`](l0-platform/owl-rdf/) |
| **JSON-LD** | REST APIs, Linked Data | [`platform/json-ld/`](l0-platform/json-ld/) |
| **GraphQL** | Modern API layers, Frontend | [`platform/graphql/`](l0-platform/graphql/) |
| **SQL DDL** | Relational DBs, Data warehouses | [`platform/sql/`](l0-platform/sql/) |

### 3️⃣ Using Industry & Domain Extensions

Browse the `extensions/` directory and select the appropriate industry package. Each extension declares its parent through the `extends` field:

```json
{
  "layer": "L2_consulting_industry_extension",
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

### 4️⃣ Contributing a New Extension

1. Copy `extensions/_template/` as your starting point.
2. Follow the [Extension Development Guide](docs-site/extensions/create-extension.md).
3. Validate against `schema/extension_schema.json`.
4. Submit a Pull Request! *(See [CONTRIBUTING.md](CONTRIBUTING.md))*

---

## 📚 Full Ontology Creation & Update Guide

For a comprehensive, step-by-step guide on creating or updating ontologies at any layer (L2/L3), including inheritance, validation, format conversion, and version management, see **[README_CN.md — Ontology 创建与更新完整指南](README_CN.md#-ontology-创建与更新完整指南)**.

> 💡 **Pro Tip**: A working L3 sample is available at [`enterprise/acme-tech-solutions/`](l3-enterprise/acme-tech-solutions/) — a fictional technology consulting company demonstrating the full workflow.

---

## 🗂️ Available Industry & Domain Extensions

| Industry | Directory | Classes | Relations | Status |
|:---|:---|:---:|:---:|:---|
| **Common Enterprise** | [`l2-extensions/common/`](l2-extensions/common/) | 10 | 5 | ![v1.0.0](https://img.shields.io/badge/v1.0.0-blue) |
| **Consulting** | [`l2-extensions/consulting/`](l2-extensions/consulting/) | 54 | 45 | ![v1.1.0](https://img.shields.io/badge/v1.1.0-blue) |
| **Financial Services** | [`l2-extensions/financial-services/`](l2-extensions/financial-services/) | 30 | 12 | ![v1.0.0](https://img.shields.io/badge/v1.0.0-blue) |
| **Food & Beverage** | [`l2-extensions/fnb/`](l2-extensions/fnb/) | 19 | 7 | ![v1.0.0](https://img.shields.io/badge/v1.0.0-blue) |
| **Healthcare** | [`l2-extensions/healthcare/`](l2-extensions/healthcare/) | 28 | 10 | ![v1.0.0](https://img.shields.io/badge/v1.0.0-blue) |
| **Luxury Goods** | [`l2-extensions/luxury-goods/`](l2-extensions/luxury-goods/) | 39 | 14 | ![v2.0.0](https://img.shields.io/badge/v2.0.0-blue) |
| **Manufacturing** | [`l2-extensions/manufacturing/`](l2-extensions/manufacturing/) | 27 | 11 | ![v1.0.0](https://img.shields.io/badge/v1.0.0-blue) |
| **Technology** | [`l2-extensions/technology/`](l2-extensions/technology/) | 29 | 12 | ![v1.0.0](https://img.shields.io/badge/v1.0.0-blue) |

*🌟 **We're looking for community contributions!** Retail, Education, Real Estate, Logistics, Energy, and more.*

---

## ⚙️ Available Platform Bindings

| Platform | Directory | Format | Status |
|:---|:---|:---|:---|
| **OWL/RDF** | [`platform/owl-rdf/`](l0-platform/owl-rdf/) | Turtle (`.ttl`) | ![v1.0.0](https://img.shields.io/badge/v1.0.0-green) |
| **JSON-LD** | [`platform/json-ld/`](l0-platform/json-ld/) | Context (`.jsonld`) | ![v1.0.0](https://img.shields.io/badge/v1.0.0-green) |
| **GraphQL** | [`platform/graphql/`](l0-platform/graphql/) | Schema (`.graphql`) | ![v1.0.0](https://img.shields.io/badge/v1.0.0-green) |
| **SQL DDL** | [`platform/sql/`](l0-platform/sql/) | PG DDL (`.sql`) | ![v1.0.0](https://img.shields.io/badge/v1.0.0-green) |

*🌟 **Want more?** Protobuf, Avro, Neo4j Cypher, and more are welcome contributions!*

---

## 🤝 Contributing

We welcome all contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) to learn about:

- Proposing changes to the Core Ontology
- Submitting new Industry & Domain Extensions
- Contributing new Platform Bindings
- Coding standards and PR workflow

---

## 📄 License & Acknowledgments

### License
This project is licensed under the [Apache License 2.0](LICENSE). You are free to:
- ✅ Use commercially
- ✅ Modify and distribute
- ✅ Build private L3 enterprise layers on top

### Acknowledgments
The ontology design draws inspiration from:
- [OWL 2 Web Ontology Language](https://www.w3.org/TR/owl2-overview/)
- [RDF 1.1 Concepts and Abstract Syntax](https://www.w3.org/TR/rdf11-concepts/)
- [Schema.org](https://schema.org/)
- [ArchiMate](https://www.opengroup.org/archimate-forum/archimate-overview)

---

<div align="center">
<b>If this project helps you, please give it a ⭐ Star!</b>
</div>
