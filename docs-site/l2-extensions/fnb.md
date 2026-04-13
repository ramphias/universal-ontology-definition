# Food & Beverage Extension

The Food & Beverage (FNB) Extension extends L1 with concepts specific to restaurants, central kitchens, menus, and supply chains.

## Overview

This extension covers:

- :fork_and_knife: **Establishments** — Restaurants, central kitchens, distribution centers, dining/kitchen areas
- :hamburger: **Products** — Menu items, combo meals, seasonal specials
- :package: **Supply Chain** — Ingredients, takeaway packaging, supplier management
- :busts_in_silhouette: **Roles** — Store managers, executive chefs, shift supervisors, delivery riders
- :gear: **Systems** — POS systems, kitchen display systems
- :bar_chart: **KPIs** — Table turnover rate, food cost ratio, customer satisfaction score

## Statistics

| Category | Count |
|:---|:---:|
| New Classes | 19 |
| New Relations | 7 |
| Sample Instances | 0 |

## Key Classes

| Class | Parent (L1) | Description |
|:---|:---|:---|
| `Restaurant` | `OrgUnit` | Terminal physical establishment providing food and beverages |
| `CentralKitchen` | `OrgUnit` | Centralized hub for preliminary processing of ingredients |
| `MenuProduct` | `ProductService` | Standalone consumable food SKU sold to end customers |
| `ComboMeal` | `ProductService` | Composite sales unit binding multiple menu items |
| `Ingredient` | `Resource` | Raw material input for food production |
| `StoreManagerRole` | `Role` | Operator accountable for a single restaurant P&L |
| `ExecutiveChefRole` | `Role` | Culinary leader overseeing menu and kitchen operations |

## Use Cases

- Restaurant chain enterprise knowledge graph
- Menu optimization and food cost analytics
- Supply chain traceability (ingredient → dish → customer)
- Multi-store operations management and KPI benchmarking

## Source File

:material-file-code: [`fnb_industry_extension_v1.json`](https://github.com/ramphias/universal-ontology-definition/blob/main/l2-extensions/fnb/fnb_industry_extension_v1.json)
