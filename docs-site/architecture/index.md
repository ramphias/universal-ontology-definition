# Architecture | 架构

This section provides a deep dive into the four-layer architecture of Universal Ontology Definition.
本章节深入解析 Universal Ontology Definition 的四层架构设计。

```mermaid
graph TB
    subgraph L3["L3: Enterprise Customization (企业定制层)"]
        E1["Company A"] 
        E2["Company B"]
        E3["Company C"]
    end
    
    subgraph L2["L2: Industry and Domain Extension (行业与业务领域扩展层)"]
        I1["Consulting"]
        I2["Luxury Goods"]
        I3["Finance"]
        I4["Manufacturing"]
    end
    
    subgraph L1["L1: Universal Core (通用基础核心)"]
        C1["Party · Organization · Role"]
        C2["Capability · Process · Activity"]
        C3["Risk · Goal · KPI · Policy"]
    end
    
    subgraph L0["L0: Platform Bindings (技术平台映射层)"]
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

## Sections | 目录

- [Four-Layer Model | 四层架构模型](four-layer-model.md) — Detailed explanation of each layer / 各层设计的详细说明
- [Inheritance & Extension | 继承与扩展](inheritance.md) — How layers relate to each other / 本体的语义继承关系和扩展规则
- [Platform Bindings (L0) | 平台绑定](platform-bindings.md) — Technical serialization details / 技术格式的具体绑定细节
