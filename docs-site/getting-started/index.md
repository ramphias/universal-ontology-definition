# Getting Started

Welcome to Universal Ontology Definition (UOD)! This section will help you understand what UOD is and how to use it in your projects.

## What is UOD?

UOD is an **open, standardized four-layer enterprise ontology framework** designed to provide a unified conceptual modeling foundation for:

- :brain: **Knowledge Graphs** — Build enterprise knowledge graphs with standardized concepts
- :bar_chart: **Semantic Layers** — Create consistent data semantic layers across systems
- :file_cabinet: **Master Data Management** — Standardize entity definitions across the organization
- :robot: **AI Agent Knowledge Bases** — Provide structured domain knowledge to AI agents

## How It Works

```mermaid
graph TB
    L3["🏢 L3: Enterprise Layer<br/>Your Company's Custom Extensions"]
    L2["🏭 L2: Industry Addons<br/>Consulting, Luxury, Finance..."]
    L1["🌐 L1: Universal Core<br/>25 Classes · 16 Relations"]
    L0["⚙️ L0: Platform Bindings<br/>OWL/RDF · JSON-LD · GraphQL · SQL"]
    
    L3 -->|extends| L2
    L2 -->|extends| L1
    L1 -->|serialized by| L0
    
    style L3 fill:#e1bee7,stroke:#9c27b0
    style L2 fill:#bbdefb,stroke:#1976d2
    style L1 fill:#c8e6c9,stroke:#388e3c
    style L0 fill:#fff9c4,stroke:#f9a825
```

## Next Steps

- [Quick Start](quick-start.md) — Start using UOD in 5 minutes
- [Core Concepts](core-concepts.md) — Understand the key terminology
