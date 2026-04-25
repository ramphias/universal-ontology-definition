# Core Ontology (L1)

The Universal Enterprise Ontology Core defines **24 classes** and **13 relations** that form the mandatory foundation for all Industry and Domain Extension and enterprise customizations.

The 24 classes are organized under **4 abstract domains** (Entity, Governance, Operational, Measurement). Within the Entity domain, two intermediate abstractions — `Party` and `Resource` — group related concrete classes and serve as relation signatures (e.g. `owns: Party → Resource`). In total: **6 abstract classes** (4 domain roots + 2 intermediate) and **18 concrete leaf classes**.

## High-Level Architecture

The four abstract domains are mutually disjoint (enforced by axioms `ax_entity_governance_disjoint`, etc.). Cross-domain relations bind them into a coherent operating model:

```mermaid
graph LR
    classDef domain fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,color:#0d47a1
    
    Entity["🟦 <b>Entity</b><br/>实体<br/><i>Party · Resource</i>"]:::domain
    Op["🟩 <b>Operational</b><br/>运营<br/><i>Role · Capability · Process · Event</i>"]:::domain
    Gov["🟨 <b>Governance</b><br/>治理<br/><i>Policy · Rule · Control · Risk</i>"]:::domain
    Meas["🟪 <b>Measurement</b><br/>度量<br/><i>Goal · KPI</i>"]:::domain
    
    Entity -->|plays_role / owns| Op
    Op -->|consumes / produces| Entity
    Op -->|governed_by| Gov
    Op -->|measured_by| Meas
```

## Full Inheritance Tree

All 24 L1 classes with parent–child relationships. Abstract classes are shown in italic / orange; concrete leaves in green.

```mermaid
graph TD
    classDef abstract fill:#fff3e0,stroke:#e65100,stroke-width:2px,font-style:italic
    classDef concrete fill:#e8f5e9,stroke:#2e7d32
    
    Entity["Entity<br/>实体"]:::abstract
    Party["Party<br/>主体"]:::abstract
    Resource["Resource<br/>资源"]:::abstract
    Person["Person<br/>人员"]:::concrete
    Org["Organization<br/>组织"]:::concrete
    OrgUnit["OrgUnit<br/>组织单元"]:::concrete
    PS["ProductService<br/>产品与服务"]:::concrete
    Asset["Asset<br/>资产"]:::concrete
    DO["DataObject<br/>数据对象"]:::concrete
    Doc["Document<br/>文档"]:::concrete
    Sys["SystemApplication<br/>系统应用"]:::concrete
    Entity --> Party
    Entity --> Resource
    Party --> Person
    Party --> Org
    Org --> OrgUnit
    Resource --> PS
    Resource --> Asset
    Resource --> DO
    Resource --> Sys
    DO --> Doc
    
    Gov["Governance<br/>治理"]:::abstract
    Policy["Policy<br/>政策"]:::concrete
    Rule["Rule<br/>规则"]:::concrete
    Control["Control<br/>控制"]:::concrete
    Risk["Risk<br/>风险"]:::concrete
    Gov --> Policy
    Gov --> Rule
    Gov --> Control
    Gov --> Risk
    
    Op["Operational<br/>运营"]:::abstract
    Role["Role<br/>角色"]:::concrete
    Cap["Capability<br/>能力"]:::concrete
    Proc["Process<br/>流程"]:::concrete
    Event["Event<br/>事件"]:::concrete
    Op --> Role
    Op --> Cap
    Op --> Proc
    Op --> Event
    
    Meas["Measurement<br/>度量"]:::abstract
    Goal["Goal<br/>目标"]:::concrete
    KPI["KPI<br/>关键指标"]:::concrete
    Meas --> Goal
    Meas --> KPI
```

## Sections

- [Classes Reference](classes.md) — All 24 core classes with definitions
- [Relations Reference](relations.md) — All 13 standard relations
- [Axioms Reference](axioms.md) — 18 OWL 2 semantic constraints
- [Sample Instances](instances.md) — Example data to understand usage
