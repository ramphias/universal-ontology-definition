---
hide:
  - navigation
  - toc
---

<div style="text-align: center; padding: 2rem 0;">

# 🌐 Universal Ontology Definition

**An Open, Standardized Four-Layer Enterprise Ontology Framework**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Version](https://img.shields.io/badge/Version-1.2.0-green.svg)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](guides/contributing.md)

</div>

---

## The Problem

Enterprise digitalization commonly faces:

- :red_circle: **Inconsistent concept definitions** — Different teams use different terms for the same objects
- :red_circle: **Industry knowledge silos** — Industry-specific knowledge is scattered with no standardized extension mechanism
- :red_circle: **Customization vs. standardization conflicts** — Enterprise-specific needs continuously erode the underlying structure
- :red_circle: **Platform lock-in** — Ontology definitions tied to a single serialization format

## The Solution: Four-Layer Architecture

```
┌──────────────────────────────────────────────────────────────┐
│         L3: Enterprise Customization Layer                   │  ← Private extensions
│    (Company A)    (Company B)    (Company C)                 │
├──────────────────────────────────────────────────────────────┤
│         L2: Industry & Domain Addons                         │  ← Optional, industry-specific
│  (Consulting) (Luxury) (Finance) (Manufacturing)             │
├──────────────────────────────────────────────────────────────┤
│         L1: Universal Enterprise Ontology Core               │  ← Mandatory inheritance
│    (Party/Org/Role/Capability/Process/Risk/Goal/KPI)         │
├══════════════════════════════════════════════════════════════┤
│    L0: Platform & Syntax Bindings                            │  ← Technical serialization
│  (OWL/RDF)  (JSON-LD)  (GraphQL)  (SQL DDL)                 │
└──────────────────────────────────────────────────────────────┘
```

## Key Features

<div class="grid cards" markdown>

-   :building_construction: **Four-Layer Separation**

    ---

    Stable semantic core, pluggable industry addons, free enterprise customization, multi-platform bindings

-   :triangular_ruler: **Standardized Format**

    ---

    Unified JSON Schema for classes, relations, and instances

-   :link: **Inheritance & Extension**

    ---

    L2 extends L1, L3 extends L1+L2, with clear semantic lineage

-   :gear: **Platform Bindings**

    ---

    Ready-to-use OWL/RDF, JSON-LD, GraphQL, and SQL mappings

-   :globe_with_meridians: **Bilingual Support**

    ---

    All concepts include Chinese and English labels

-   :handshake: **Community-Driven**

    ---

    Anyone can contribute industry addons, platform bindings, or improve core definitions

</div>

## Quick Links

| Resource | Description |
|:---|:---|
| [Getting Started](getting-started/quick-start.md) | Start using UOD in 5 minutes |
| [Core Classes Reference](core/classes.md) | Browse all 25 L1 core classes |
| [Architecture Deep Dive](architecture/four-layer-model.md) | Understand the four-layer design |
| [Industry Addons](addons/index.md) | Browse available industry packages |
| [Create an Addon](addons/create-addon.md) | Contribute your own industry addon |
| [Contributing Guide](guides/contributing.md) | How to contribute to this project |
