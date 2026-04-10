# L2 Luxury Goods Extension / L2 奢侈品行业扩展

Industry extension ontology for the luxury goods sector, covering brand management, product lifecycle, omni-channel retail, client experience, supply chain traceability & authentication, scarcity management, and industry compliance.

奢侈品行业扩展本体，覆盖品牌管理、产品生命周期、全渠道零售、客户体验、供应链溯源与鉴真、稀缺性管控与行业合规。

---

## Brand & Organization / 品牌与组织

### LuxuryBrand / 奢侈品牌

| Field | Value |
|:---|:---|
| **ID** | `LuxuryBrand` |
| **ZH** | 奢侈品牌 |
| **EN** | Luxury Brand |
| **Parent** | `Organization` |

**EN**: An enterprise or brand entity operating in the luxury goods sector, with brand heritage, craftsmanship legacy, and scarcity strategy as core competitive advantages.

**ZH**: 经营奢侈品品牌的企业或品牌主体，以独特的品牌遗产、工艺传承和稀缺性策略为核心竞争力。

---

### Maison / 品牌屋

| Field | Value |
|:---|:---|
| **ID** | `Maison` |
| **ZH** | 品牌屋 |
| **EN** | Maison |
| **Parent** | `OrgUnit` |

**EN**: An independent operating unit for a brand or sub-brand, with its own creative direction and brand positioning.

**ZH**: 品牌或子品牌的独立经营单元，拥有独立的创意方向和品牌定位。

---

### Atelier / 工坊

| Field | Value |
|:---|:---|
| **ID** | `Atelier` |
| **ZH** | 工坊 |
| **EN** | Atelier |
| **Parent** | `OrgUnit` |

**EN**: A craftsmanship center responsible for handcrafting, bespoke creation, and restoration; core to brand artisanal heritage.

**ZH**: 承担手工制作、定制和修复工作的工艺中心，是品牌工艺传承的核心场所。

---

## Product / 产品体系

### LuxuryProduct / 奢侈品商品

| Field | Value |
|:---|:---|
| **ID** | `LuxuryProduct` |
| **ZH** | 奢侈品商品 |
| **EN** | Luxury Product |
| **Parent** | `ProductService` |

**EN**: High-end products with superior craftsmanship, brand premium, and emotional connection, spanning fashion, leather goods, jewelry, watches, beauty, etc.

**ZH**: 具有高工艺价值、品牌溢价和情感连接的高端商品，涵盖时装、皮具、珠宝、腕表、美妆等品类。

---

### Collection / 系列

| Field | Value |
|:---|:---|
| **ID** | `Collection` |
| **ZH** | 系列 |
| **EN** | Collection |
| **Parent** | `Resource` |

**EN**: A product series organized by season, theme, or design language, carrying the brand's creative narrative.

**ZH**: 按季节、主题或设计语言组织的商品系列，承载品牌创意叙事。

---

### SKUVariant / SKU 变体

| Field | Value |
|:---|:---|
| **ID** | `SKUVariant` |
| **ZH** | SKU 变体 |
| **EN** | SKU Variant |
| **Parent** | `Resource` |

**EN**: A specific variant of a luxury product across color, size, material dimensions, typically with independent inventory and pricing.

**ZH**: 奢侈品商品在颜色、尺寸、材质等维度的具体变体，通常具有独立库存和定价。

---

### LimitedEdition / 限量款

| Field | Value |
|:---|:---|
| **ID** | `LimitedEdition` |
| **ZH** | 限量款 |
| **EN** | Limited Edition |
| **Parent** | `LuxuryProduct` |

**EN**: A scarce product manufactured in limited quantities, often associated with specific events, collaborations, or commemorative themes.

**ZH**: 限定数量生产的稀缺商品，通常与特定事件、合作或纪念主题关联。

---

### MaterialLot / 原料批次

| Field | Value |
|:---|:---|
| **ID** | `MaterialLot` |
| **ZH** | 原料批次 |
| **EN** | Material Lot |
| **Parent** | `Asset` |

**EN**: A traceable lot of high-value raw materials such as leather, precious metals, gemstones, and rare fabrics.

**ZH**: 皮革、贵金属、宝石、稀有面料等高价值原料的可追溯批次。

---

## Channel / 渠道

### Channel / 渠道

| Field | Value |
|:---|:---|
| **ID** | `Channel` |
| **ZH** | 渠道 |
| **EN** | Channel |
| **Parent** | `Resource` |

**EN**: A sales and service channel through which a brand interacts with clients, including offline stores and online platforms.

**ZH**: 品牌与客户交互的销售和服务渠道，包含线下门店和线上平台。

---

### Boutique / 精品店

| Field | Value |
|:---|:---|
| **ID** | `Boutique` |
| **ZH** | 精品店 |
| **EN** | Boutique |
| **Parent** | `Channel` |

**EN**: A brand-operated store or boutique providing an immersive brand experience.

**ZH**: 品牌直营门店或品牌精品店，提供沉浸式品牌体验。

---

### DepartmentStoreCounter / 百货专柜

| Field | Value |
|:---|:---|
| **ID** | `DepartmentStoreCounter` |
| **ZH** | 百货专柜 |
| **EN** | Department Store Counter |
| **Parent** | `Channel` |

**EN**: A brand-exclusive section within a high-end department store.

**ZH**: 设立在高端百货中的品牌专营区域。

---

### ECommerceChannel / 电商渠道

| Field | Value |
|:---|:---|
| **ID** | `ECommerceChannel` |
| **ZH** | 电商渠道 |
| **EN** | E-Commerce Channel |
| **Parent** | `Channel` |

**EN**: Brand official website, platform flagship stores, or exclusive online partner channels.

**ZH**: 品牌官网、平台旗舰店或独家线上合作渠道。

---

## Roles / 角色

### ClientAdvisorRole / 客户顾问

| Field | Value |
|:---|:---|
| **ID** | `ClientAdvisorRole` |
| **ZH** | 客户顾问 |
| **EN** | Client Advisor |
| **Parent** | `Role` |

**EN**: A store-level role responsible for one-on-one service and sales to high-net-worth clients; the core link between brand and customer.

**ZH**: 负责高净值客户一对一服务与销售的门店角色，是品牌与客户之间的核心纽带。

---

### VIPClientRole / VIP 客户

| Field | Value |
|:---|:---|
| **ID** | `VIPClientRole` |
| **ZH** | VIP 客户 |
| **EN** | VIP Client |
| **Parent** | `Role` |

**EN**: A client role with high spending value or loyalty, entitled to priority purchasing, exclusive events, and bespoke services.

**ZH**: 具有高消费价值或高忠诚度的客户角色，享有优先购买权、专属活动和定制服务。

---

### BrandAmbassadorRole / 品牌大使

| Field | Value |
|:---|:---|
| **ID** | `BrandAmbassadorRole` |
| **ZH** | 品牌大使 |
| **EN** | Brand Ambassador |
| **Parent** | `Role` |

**EN**: A role representing the brand in public communication and cultural influence, including celebrity endorsers and key opinion leaders.

**ZH**: 代表品牌进行公共传播和文化影响的角色，包含名人代言人和行业意见领袖。

---

### ArtisanRole / 工匠

| Field | Value |
|:---|:---|
| **ID** | `ArtisanRole` |
| **ZH** | 工匠 |
| **EN** | Artisan |
| **Parent** | `Role` |

**EN**: A highly skilled craftsperson mastering traditional artisanal techniques, responsible for luxury product creation.

**ZH**: 掌握传统手工技艺、负责奢侈品制作的高技能工匠角色。

---

## Services / 服务

### PersonalShoppingService / 一对一私享服务

| Field | Value |
|:---|:---|
| **ID** | `PersonalShoppingService` |
| **ZH** | 一对一私享服务 |
| **EN** | Personal Shopping Service |
| **Parent** | `ProductService` |

**EN**: An appointment-based private shopping and styling consultation experience for VIP clients.

**ZH**: 面向 VIP 客户的预约制私密购物和造型顾问体验。

---

### AfterSalesService / 售后养护服务

| Field | Value |
|:---|:---|
| **ID** | `AfterSalesService` |
| **ZH** | 售后养护服务 |
| **EN** | After-Sales Service |
| **Parent** | `ProductService` |

**EN**: Full lifecycle product care covering repair, maintenance, restoration, engraving, and extended warranty.

**ZH**: 涵盖维修、保养、翻新、刻字和延保的全生命周期产品养护。

---

### BespokeService / 定制服务

| Field | Value |
|:---|:---|
| **ID** | `BespokeService` |
| **ZH** | 定制服务 |
| **EN** | Bespoke Service |
| **Parent** | `ProductService` |

**EN**: Exclusive customization based on individual client needs, including material selection, design personalization, and handcrafting.

**ZH**: 根据客户个性化需求进行的专属定制，包含材质选择、设计定制和手工制作。

---

## Traceability & Certification / 溯源与认证

### CraftsmanshipCertificate / 工艺证书

| Field | Value |
|:---|:---|
| **ID** | `CraftsmanshipCertificate` |
| **ZH** | 工艺证书 |
| **EN** | Craftsmanship Certificate |
| **Parent** | `Document` |

**EN**: A quality certification document attesting to a product's craftsmanship, origin, and artisanal process.

**ZH**: 证明商品工艺、产地和手工流程的品质认证文件。

---

### AuthenticityCertificate / 真伪证书

| Field | Value |
|:---|:---|
| **ID** | `AuthenticityCertificate` |
| **ZH** | 真伪证书 |
| **EN** | Authenticity Certificate |
| **Parent** | `Document` |

**EN**: Product authenticity certification based on anti-counterfeiting technologies (serial numbers, NFC chips, blockchain digital passports).

**ZH**: 基于防伪技术（序列号、NFC芯片、区块链数字护照）的商品真伪认证。

---

### DigitalProductPassport / 数字产品护照

| Field | Value |
|:---|:---|
| **ID** | `DigitalProductPassport` |
| **ZH** | 数字产品护照 |
| **EN** | Digital Product Passport |
| **Parent** | `Document` |

**EN**: A digital identity record of a product's full lifecycle from raw materials to end customer, compliant with EU DPP regulations.

**ZH**: 记录商品从原料到终端客户全生命周期的数字化身份档案，符合欧盟 DPP 法规要求。

---

### TraceabilityEvent / 溯源事件

| Field | Value |
|:---|:---|
| **ID** | `TraceabilityEvent` |
| **ZH** | 溯源事件 |
| **EN** | Traceability Event |
| **Parent** | `Event` |

**EN**: Key tracking nodes throughout a product's lifecycle: material intake, production completion, QC pass, warehousing, sale, transfer, repair.

**ZH**: 商品全生命周期中的关键追踪节点：原料入库、生产完工、质检通过、入库、销售、转移、维修。

---

## Governance & Risk / 治理与风险

### CounterfeitRisk / 假货风险

| Field | Value |
|:---|:---|
| **ID** | `CounterfeitRisk` |
| **ZH** | 假货风险 |
| **EN** | Counterfeit Risk |
| **Parent** | `Risk` |

**EN**: Risk to brand value and consumer trust from counterfeit products, grey markets, parallel imports, and unauthorized secondary market circulation.

**ZH**: 仿冒品、灰色市场、串货和非授权二手流转对品牌价值和消费者信任造成的风险。

---

### BrandDilutionRisk / 品牌稀释风险

| Field | Value |
|:---|:---|
| **ID** | `BrandDilutionRisk` |
| **ZH** | 品牌稀释风险 |
| **EN** | Brand Dilution Risk |
| **Parent** | `Risk` |

**EN**: Blurred brand positioning and declining pricing power caused by over-extension of product lines, promotional discounting, or channel downgrading.

**ZH**: 过度扩张产品线、折扣促销或渠道下沉导致的品牌定位模糊和溢价能力下降。

---

### ScarcityRule / 稀缺性分配规则

| Field | Value |
|:---|:---|
| **ID** | `ScarcityRule` |
| **ZH** | 稀缺性分配规则 |
| **EN** | Scarcity Rule |
| **Parent** | `Rule` |

**EN**: Allocation, reservation, and purchase eligibility rules for limited-edition and high-demand products, typically linked to client tier and purchase history.

**ZH**: 限量商品和热门款式的配货、预约和购买资格规则，通常与客户层级和购买历史关联。

---

### PricingIntegrityPolicy / 价格一致性政策

| Field | Value |
|:---|:---|
| **ID** | `PricingIntegrityPolicy` |
| **ZH** | 价格一致性政策 |
| **EN** | Pricing Integrity Policy |
| **Parent** | `Policy` |

**EN**: A governance policy ensuring consistent pricing strategy and strict discount control across global markets and all channels.

**ZH**: 确保品牌在全球市场和全渠道中维持一致定价策略和严格折扣管控的治理政策。

---

## Capabilities & Processes / 能力与流程

### ClientelingCapability / 客户经营能力

| Field | Value |
|:---|:---|
| **ID** | `ClientelingCapability` |
| **ZH** | 客户经营能力 |
| **EN** | Clienteling Capability |
| **Parent** | `Capability` |

**EN**: Systematic operational capability for identifying, segmenting, engaging, and personally servicing high-net-worth client groups.

**ZH**: 围绕高净值客群的识别、分层、触达和个性化服务的系统性运营能力。

---

### ProductPassportCapability / 数字护照能力

| Field | Value |
|:---|:---|
| **ID** | `ProductPassportCapability` |
| **ZH** | 数字护照能力 |
| **EN** | Product Passport Capability |
| **Parent** | `Capability` |

**EN**: Digital capability for establishing and managing product digital identity, authenticity verification, and full lifecycle after-sales service.

**ZH**: 建立和管理商品数字身份、真伪验证与售后服务全生命周期的数字化能力。

---

### AssortmentPlanningCapability / 精品配货能力

| Field | Value |
|:---|:---|
| **ID** | `AssortmentPlanningCapability` |
| **ZH** | 精品配货能力 |
| **EN** | Assortment Planning Capability |
| **Parent** | `Capability` |

**EN**: Business capability for intelligent assortment allocation based on scarce SKU supply, store tier, client profiles, and regional preferences.

**ZH**: 基于稀缺 SKU 供给、门店等级、客户画像和区域偏好进行智能配货分配的业务能力。

---

### OmniChannelCapability / 全渠道能力

| Field | Value |
|:---|:---|
| **ID** | `OmniChannelCapability` |
| **ZH** | 全渠道能力 |
| **EN** | Omni-Channel Capability |
| **Parent** | `Capability` |

**EN**: Capability for cross-channel inventory visibility, client recognition, and seamless shopping experience across boutiques, department stores, and online channels.

**ZH**: 打通精品店、百货专柜和线上渠道的库存可见性、客户识别和无缝购物体验的能力。

---

### ClientelingProcess / 客户经营流程

| Field | Value |
|:---|:---|
| **ID** | `ClientelingProcess` |
| **ZH** | 客户经营流程 |
| **EN** | Clienteling Process |
| **Parent** | `Process` |

**EN**: End-to-end client engagement process from identification, segmentation, outreach, personal service to long-term relationship maintenance.

**ZH**: 从客户识别、分层、触达、私享服务到长期关系维护的端到端客户经营流程。

---

### ProductAuthenticationProcess / 产品鉴真流程

| Field | Value |
|:---|:---|
| **ID** | `ProductAuthenticationProcess` |
| **ZH** | 产品鉴真流程 |
| **EN** | Product Authentication Process |
| **Parent** | `Process` |

**EN**: Full-chain authentication process from production registration, NFC/blockchain enrollment, sales activation to secondary market verification.

**ZH**: 从生产注册、NFC/区块链录入、销售激活到二手流转验证的全链路鉴真流程。

---

### AssortmentAllocationProcess / 配货分配流程

| Field | Value |
|:---|:---|
| **ID** | `AssortmentAllocationProcess` |
| **ZH** | 配货分配流程 |
| **EN** | Assortment Allocation Process |
| **Parent** | `Process` |

**EN**: Allocation and distribution process for limited-edition and new products based on store tier, client demand, and inventory strategy.

**ZH**: 根据门店等级、客户需求和库存策略进行限量商品和新品的配货调拨流程。

---

## Systems / 系统

### ClientelingCRM / 客户经营系统

| Field | Value |
|:---|:---|
| **ID** | `ClientelingCRM` |
| **ZH** | 客户经营系统 |
| **EN** | Clienteling CRM |
| **Parent** | `SystemApplication` |

**EN**: A specialized CRM system managing VIP client profiles, purchase history, preference profiles, and engagement records.

**ZH**: 管理 VIP 客户档案、购买历史、偏好画像和触达记录的专业客户关系系统。

---

### ProductTraceabilitySystem / 产品溯源系统

| Field | Value |
|:---|:---|
| **ID** | `ProductTraceabilitySystem` |
| **ZH** | 产品溯源系统 |
| **EN** | Product Traceability System |
| **Parent** | `SystemApplication` |

**EN**: A product lifecycle traceability and authentication platform based on blockchain, NFC, or IoT technologies.

**ZH**: 基于区块链、NFC或物联网技术的商品全生命周期溯源和鉴真平台。

---

## Metrics / 度量指标

### AvgTransactionValue / 客单价

| Field | Value |
|:---|:---|
| **ID** | `AvgTransactionValue` |
| **ZH** | 客单价 |
| **EN** | Average Transaction Value |
| **Parent** | `KPI` |

**EN**: Core retail metric measuring the average monetary value per transaction at a store or channel.

**ZH**: 衡量门店或渠道平均每笔交易金额的核心零售指标。

---

### RepurchaseRate / 复购率

| Field | Value |
|:---|:---|
| **ID** | `RepurchaseRate` |
| **ZH** | 复购率 |
| **EN** | Repurchase Rate |
| **Parent** | `KPI` |

**EN**: Metric measuring the proportion of clients making repeat purchases within a given period, reflecting client loyalty and brand stickiness.

**ZH**: 衡量客户在一定周期内再次购买的比例，反映客户忠诚度和品牌粘性。

---

### SellThroughRate / 售罄率

| Field | Value |
|:---|:---|
| **ID** | `SellThroughRate` |
| **ZH** | 售罄率 |
| **EN** | Sell-Through Rate |
| **Parent** | `KPI` |

**EN**: Metric measuring the proportion of inventory sold within a specific period, key to evaluating assortment accuracy and product appeal.

**ZH**: 衡量商品在特定时间段内的销售比例，是评估配货精准度和产品吸引力的关键指标。

---

## Relations / 关系

### belongs_to_collection / 属于系列

| Field | Value |
|:---|:---|
| **ID** | `belongs_to_collection` |
| **Domain** | `LuxuryProduct` |
| **Range** | `Collection` |

**EN**: A product belongs to a design collection.

**ZH**: 商品属于某个设计系列。

---

### has_variant / 拥有变体

| Field | Value |
|:---|:---|
| **ID** | `has_variant` |
| **Domain** | `LuxuryProduct` |
| **Range** | `SKUVariant` |

**EN**: A product has SKU variants of different specifications.

**ZH**: 商品具有不同规格的 SKU 变体。

---

### crafted_from / 由…制作

| Field | Value |
|:---|:---|
| **ID** | `crafted_from` |
| **Domain** | `LuxuryProduct` |
| **Range** | `MaterialLot` |

**EN**: A product is crafted from a specific material lot.

**ZH**: 商品由特定原料批次制作。

---

### authenticated_by / 由…认证

| Field | Value |
|:---|:---|
| **ID** | `authenticated_by` |
| **Domain** | `LuxuryProduct` |
| **Range** | `AuthenticityCertificate` |

**EN**: A product is authenticated by an authenticity certificate.

**ZH**: 商品由真伪证书认证。

---

### passported_by / 由…登记

| Field | Value |
|:---|:---|
| **ID** | `passported_by` |
| **Domain** | `LuxuryProduct` |
| **Range** | `DigitalProductPassport` |

**EN**: A product's full lifecycle is registered by a digital product passport.

**ZH**: 商品的全生命周期由数字产品护照登记。

---

### sold_through / 通过…销售

| Field | Value |
|:---|:---|
| **ID** | `sold_through` |
| **Domain** | `LuxuryProduct` |
| **Range** | `Channel` |

**EN**: A product is sold through a specific channel.

**ZH**: 商品通过特定渠道销售。

---

### advised_by / 由…服务

| Field | Value |
|:---|:---|
| **ID** | `advised_by` |
| **Domain** | `VIPClientRole` |
| **Range** | `ClientAdvisorRole` |

**EN**: A VIP client is served by an assigned client advisor.

**ZH**: VIP 客户由指定客户顾问提供专属服务。

---

### crafted_by / 由…制作

| Field | Value |
|:---|:---|
| **ID** | `crafted_by` |
| **Domain** | `LuxuryProduct` |
| **Range** | `ArtisanRole` |

**EN**: A product is handcrafted by an artisan.

**ZH**: 商品由工匠手工制作。

---

### endorsed_by / 由…代言

| Field | Value |
|:---|:---|
| **ID** | `endorsed_by` |
| **Domain** | `Collection` |
| **Range** | `BrandAmbassadorRole` |

**EN**: A collection is endorsed and promoted by a brand ambassador.

**ZH**: 系列由品牌大使代言推广。

---

### tracked_by_event / 被…追踪

| Field | Value |
|:---|:---|
| **ID** | `tracked_by_event` |
| **Domain** | `LuxuryProduct` |
| **Range** | `TraceabilityEvent` |

**EN**: A product is tracked and recorded at key nodes by traceability events.

**ZH**: 商品在关键节点被溯源事件追踪记录。

---

### exposed_to / 面临…风险

| Field | Value |
|:---|:---|
| **ID** | `exposed_to` |
| **Domain** | `LuxuryProduct` |
| **Range** | `Risk` |

**EN**: A product is exposed to specific risks (counterfeit, brand dilution, etc.).

**ZH**: 商品面临特定风险（假货风险、品牌稀释风险等）。

---

### allocated_by / 由…配货

| Field | Value |
|:---|:---|
| **ID** | `allocated_by` |
| **Domain** | `SKUVariant` |
| **Range** | `AssortmentAllocationProcess` |

**EN**: A SKU variant is distributed to channels through the assortment allocation process.

**ZH**: SKU 变体通过配货分配流程分配到各渠道。

---

### profiled_in / 画像记录于

| Field | Value |
|:---|:---|
| **ID** | `profiled_in` |
| **Domain** | `VIPClientRole` |
| **Range** | `ClientelingCRM` |

**EN**: A VIP client's profile and interaction records are stored in the clienteling CRM.

**ZH**: VIP 客户的画像和交互记录存储在客户经营系统中。

---

### verified_by / 由…验证

| Field | Value |
|:---|:---|
| **ID** | `verified_by` |
| **Domain** | `AuthenticityCertificate` |
| **Range** | `ProductTraceabilitySystem` |

**EN**: An authenticity certificate is verified by the product traceability system.

**ZH**: 真伪证书由产品溯源系统验证。
