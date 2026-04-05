# 奢侈品行业 Addon | Luxury Goods Industry Addon

**Layer**: L2 — Industry Addon  
**Version**: 2.0.0  
**Extends**: L1 Core v2.0 + L2 Common Enterprise Addon  

## 概述

奢侈品行业 Addon 继承 L1 通用 Ontology 和 L2 通用企业扩展包（Channel 等），新增了奢侈品行业特有的完整概念体系：

- 👜 **品牌与产品** — 奢侈品牌、品牌屋、工坊、商品、系列、SKU 变体、限量款
- 🏪 **全渠道零售** — 精品店、百货专柜、电商渠道（继承 Common 的 Channel）
- 💎 **客户体验** — 客户顾问、VIP 客户、品牌大使、工匠、私享服务、定制服务
- 🔗 **供应链与溯源** — 原料批次、工艺证书、溯源事件、区块链溯源系统
- 🛡️ **真伪与风控** — 真伪证书、数字产品护照、假货风险、品牌稀释风险
- 📏 **治理与合规** — 稀缺性分配规则、价格一致性政策
- 🎯 **核心能力** — 客户经营、数字护照、精品配货、全渠道运营
- ⚙️ **业务流程** — 客户经营流程、产品鉴真流程、配货分配流程
- 📊 **行业 KPI** — 客单价、复购率、售罄率

## v2.0 升级说明

| 变更 | 详情 |
|:---|:---|
| **新增类** | +19 个（LimitedEdition, Atelier, ECommerceChannel, DigitalProductPassport, BrandAmbassadorRole, ArtisanRole, BespokeService, BrandDilutionRisk, PricingIntegrityPolicy, OmniChannelCapability, 3 流程, 2 系统, 3 KPI） |
| **关系优化** | 10 → 14 个；消除关系名膨胀（如 `governed_by_scarcity_rule` → 直接使用 L1 `governed_by`） |
| **双语完善** | 所有类和关系均补充 `label_en` / `definition_en` |
| **父类迁移** | `BusinessObject` → `Resource`，`DocumentRecord` → `Document`（适配 L1 v2.0） |
| **依赖声明** | 显式声明对 L2 Common 的依赖（因使用 Channel 类） |

## 统计

| 类别 | 数量 |
|:---|:---:|
| 新增类 | 38 |
| 新增关系 | 14 |
| 示例实例 | 22 |

## 覆盖 L1 域

| L1 Abstract Domain | 覆盖的行业类 |
|:---|:---|
| 🟦 **Entity** | LuxuryBrand, Maison, Atelier, LuxuryProduct, Collection, SKUVariant, LimitedEdition, MaterialLot, CraftsmanshipCertificate, AuthenticityCertificate, DigitalProductPassport |
| 🟨 **Governance** | ScarcityRule, PricingIntegrityPolicy, CounterfeitRisk, BrandDilutionRisk |
| 🟩 **Operational** | ClientAdvisorRole, VIPClientRole, BrandAmbassadorRole, ArtisanRole, ClientelingCapability, ProductPassportCapability, AssortmentPlanningCapability, OmniChannelCapability, ClientelingProcess, ProductAuthenticationProcess, AssortmentAllocationProcess, TraceabilityEvent |
| 🟪 **Measurement** | AvgTransactionValue, RepurchaseRate, SellThroughRate |
| 🔌 **L2 Common** | Boutique, DepartmentStoreCounter, ECommerceChannel (→ Channel) |
| 🔌 **L2 Common** | PersonalShoppingService, AfterSalesService, BespokeService (→ ProductService) |

## 文件

- [`luxury_goods_addon_v1.json`](luxury_goods_addon_v1.json) — 完整定义文件

## 适用场景

- 奢侈品集团的知识图谱与数据中台建设
- 品牌数字化转型项目的语义基础设施
- VIP 客户经营与 CRM 系统概念建模
- 产品溯源、数字护照与 EU DPP 合规
- 全渠道零售与配货优化系统
- 品牌保护与假货风险管理
