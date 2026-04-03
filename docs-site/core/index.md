# Core Ontology (L1)

The Universal Enterprise Ontology Core defines **25 classes** and **16 relations** that form the mandatory foundation for all industry addons and enterprise customizations.

## Overview

```mermaid
graph TD
    Party["Party<br/>主体"]
    Person["Person<br/>人员"]
    Org["Organization<br/>组织"]
    OrgUnit["OrgUnit<br/>组织单元"]
    Role["Role<br/>角色"]
    Cap["Capability<br/>能力"]
    Proc["Process<br/>流程"]
    Act["Activity<br/>活动"]
    BO["BusinessObject<br/>业务对象"]
    PS["ProductService<br/>产品与服务"]
    Asset["Asset<br/>资产"]
    DO["DataObject<br/>数据对象"]
    Doc["DocumentRecord<br/>文档与记录"]
    Sys["SystemApplication<br/>系统应用"]
    
    Party --> Person
    Party --> Org
    Org --> OrgUnit
    BO --> PS
    BO --> Asset
    DO --> Doc
    
    Party -.->|plays_role| Role
    Role -.->|is_accountable_for| Cap
    Cap -.->|realized_by| Proc
    Proc -.->|composed_of| Act
    
    style Party fill:#c8e6c9,stroke:#388e3c
    style Person fill:#c8e6c9,stroke:#388e3c
    style Org fill:#c8e6c9,stroke:#388e3c
    style OrgUnit fill:#c8e6c9,stroke:#388e3c
    style Role fill:#bbdefb,stroke:#1976d2
    style Cap fill:#bbdefb,stroke:#1976d2
    style Proc fill:#fff9c4,stroke:#f9a825
    style Act fill:#fff9c4,stroke:#f9a825
    style BO fill:#e1bee7,stroke:#9c27b0
    style PS fill:#e1bee7,stroke:#9c27b0
    style Asset fill:#e1bee7,stroke:#9c27b0
    style DO fill:#ffccbc,stroke:#e64a19
    style Doc fill:#ffccbc,stroke:#e64a19
    style Sys fill:#ffccbc,stroke:#e64a19
```

## Sections

- [Classes Reference](classes.md) — All 25 core classes with definitions
- [Relations Reference](relations.md) — All 16 standard relations
- [Sample Instances](instances.md) — Example data to understand usage
