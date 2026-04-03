# Sample Instances

The L1 Core includes sample instances to demonstrate how classes are used in practice.

## Instances

| ID | Type | English Label | 中文标签 |
|:---|:---|:---|:---|
| `org_global_retail_group` | Organization | Global Retail Group | 全球零售集团 |
| `ou_merchandising` | OrgUnit | Merchandising Department | 商品部 |
| `role_category_manager` | Role | Category Manager | 品类经理 |
| `cap_product_launch` | Capability | Product Launch Management | 产品上市管理 |
| `proc_new_product_intro` | Process | New Product Introduction | 新品引入流程 |
| `sys_plm` | SystemApplication | PLM Platform | PLM 平台 |
| `goal_margin_growth` | Goal | Gross Margin Growth | 毛利增长 |
| `kpi_launch_cycle_time` | KPI | Launch Cycle Time | 上市周期 |

## Usage Example

These instances demonstrate a complete business narrative:

```mermaid
graph LR
    ORG["🏢 Global Retail Group<br/>(Organization)"]
    OU["🏬 Merchandising Dept<br/>(OrgUnit)"]
    ROLE["👤 Category Manager<br/>(Role)"]
    CAP["💡 Product Launch Mgmt<br/>(Capability)"]
    PROC["⚙️ New Product Intro<br/>(Process)"]
    SYS["💻 PLM Platform<br/>(SystemApplication)"]
    GOAL["🎯 Margin Growth<br/>(Goal)"]
    KPI["📊 Launch Cycle Time<br/>(KPI)"]
    
    OU -->|belongs_to| ORG
    ROLE -->|is_accountable_for| CAP
    CAP -->|realized_by| PROC
    CAP -->|supports| GOAL
    GOAL -->|measured_by| KPI
    
    style ORG fill:#c8e6c9,stroke:#388e3c
    style OU fill:#c8e6c9,stroke:#388e3c
    style ROLE fill:#bbdefb,stroke:#1976d2
    style CAP fill:#bbdefb,stroke:#1976d2
    style PROC fill:#fff9c4,stroke:#f9a825
    style SYS fill:#ffccbc,stroke:#e64a19
    style GOAL fill:#e1bee7,stroke:#9c27b0
    style KPI fill:#e1bee7,stroke:#9c27b0
```

**Reading the narrative:**

> The **Merchandising Department** (`OrgUnit`) belongs to the **Global Retail Group** (`Organization`). The **Category Manager** (`Role`) is accountable for the **Product Launch Management** capability, which is realized by the **New Product Introduction** process. This capability supports the **Gross Margin Growth** goal, which is measured by the **Launch Cycle Time** KPI.
