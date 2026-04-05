# Architecture

This section provides a deep dive into the four-layer architecture of Universal Ontology Definition.

```mermaid
graph TB
    subgraph L3["L3: Enterprise Customization"]
        E1["Company A"] 
        E2["Company B"]
        E3["Company C"]
    end
    
    subgraph L2["L2: Industry and Domain Extension"]
        I1["Consulting"]
        I2["Luxury Goods"]
        I3["Finance"]
        I4["Manufacturing"]
    end
    
    subgraph L1["L1: Universal Core"]
        C1["Party · Organization · Role"]
        C2["Capability · Process · Activity"]
        C3["Risk · Goal · KPI · Policy"]
    end
    
    subgraph L0["L0: Platform Bindings"]
        P1["OWL/RDF"]
        P2["JSON-LD"]
        P3["GraphQL"]
        P4["SQL DDL"]
    end
    
    L3 -->|extends| L2
    L2 -->|extends| L1
    L1 -->|serialized by| L0
    
    style L3 fill:#e1bee7,stroke:#9c27b0
    style L2 fill:#bbdefb,stroke:#1976d2
    style L1 fill:#c8e6c9,stroke:#388e3c
    style L0 fill:#fff9c4,stroke:#f9a825
```

## Sections

- [Four-Layer Model](four-layer-model.md) — Detailed explanation of each layer
- [Inheritance & Extension](inheritance.md) — How layers relate to each other
- [Platform Bindings (L0)](platform-bindings.md) — Technical serialization details
