# L2 Consulting Extension / L2 咨询行业扩展

Consulting Industry and Domain Extension ontology covering engagements, practice lines, methodologies, deliverables, client relationships, knowledge management, and talent allocation.

咨询行业扩展本体，覆盖咨询项目、业务实践、方法论、交付物、客户关系、知识管理与人才配置。

---

## Organization Structure / 组织结构

### ConsultingFirm / 咨询公司

| Field | Value |
|:---|:---|
| **ID** | `ConsultingFirm` |
| **ZH** | 咨询公司 |
| **EN** | Consulting Firm |
| **Parent** | `Organization` |

**EN**: An enterprise entity providing professional consulting services such as management consulting, IT consulting, and strategy consulting.

**ZH**: 提供专业咨询服务的企业主体，如管理咨询、IT咨询、战略咨询等。

---

### ConsultingOffice / 咨询办公室

| Field | Value |
|:---|:---|
| **ID** | `ConsultingOffice` |
| **ZH** | 咨询办公室 |
| **EN** | Consulting Office |
| **Parent** | `OrgUnit` |

**EN**: A branch office set up by a consulting firm in a geographic region, e.g. Beijing office, New York office.

**ZH**: 咨询公司按地理区域设立的分支办公室，如北京办公室、纽约办公室等。

---

### PracticeLine / 业务线/实践领域

| Field | Value |
|:---|:---|
| **ID** | `PracticeLine` |
| **ZH** | 业务线/实践领域 |
| **EN** | Practice Line |
| **Parent** | `OrgUnit` |

**EN**: A practice area organized by industry or function within a consulting firm, such as strategy, operations, digital transformation, and human resources.

**ZH**: 咨询公司按行业或职能划分的业务实践领域，如战略、运营、数字化转型、人力资源等。

---

### CompetencyCenter / 能力中心

| Field | Value |
|:---|:---|
| **ID** | `CompetencyCenter` |
| **ZH** | 能力中心 |
| **EN** | Competency Center |
| **Parent** | `OrgUnit` |

**EN**: A cross-project support center organized around a specific professional competency or technology domain.

**ZH**: 围绕特定专业能力或技术方向组建的跨项目支持中心。

---

## Engagement & Delivery / 项目交付

### Engagement / 咨询项目/签约项目

| Field | Value |
|:---|:---|
| **ID** | `Engagement` |
| **ZH** | 咨询项目/签约项目 |
| **EN** | Engagement |
| **Parent** | `Resource` |

**EN**: A consulting service delivery project contracted with a client, encompassing scope, timeline, budget, and team.

**ZH**: 与客户签订合同后的咨询服务交付项目，包含范围、时间、预算和团队。

---

### EngagementMilestone / 项目里程碑

| Field | Value |
|:---|:---|
| **ID** | `EngagementMilestone` |
| **ZH** | 项目里程碑 |
| **EN** | Engagement Milestone |
| **Parent** | `Resource` |

**EN**: A key milestone node in a consulting engagement tied to deliverables and payment schedules.

**ZH**: 咨询项目中与交付和付款绑定的关键里程碑节点。

---

### WorkStream / 工作模块

| Field | Value |
|:---|:---|
| **ID** | `WorkStream` |
| **ZH** | 工作模块 |
| **EN** | Work Stream |
| **Parent** | `Resource` |

**EN**: A parallel work module within an engagement organized by theme, each with independent delivery objectives.

**ZH**: 咨询项目内按主题划分的并行工作模块，各自拥有独立交付目标。

---

### Deliverable / 交付物

| Field | Value |
|:---|:---|
| **ID** | `Deliverable` |
| **ZH** | 交付物 |
| **EN** | Deliverable |
| **Parent** | `Resource` |

**EN**: An output to be delivered to the client in a consulting engagement, such as reports, models, implementation plans, and toolkits.

**ZH**: 咨询项目中需交付给客户的成果物，如报告、模型、实施方案、工具包等。

---

### Workshop / 工作坊

| Field | Value |
|:---|:---|
| **ID** | `Workshop` |
| **ZH** | 工作坊 |
| **EN** | Workshop |
| **Parent** | `Process` |

**EN**: An interactive seminar or workshop delivery format commonly used in consulting engagements for research, co-creation, or reporting.

**ZH**: 咨询项目中常见的互动式研讨会或工作坊交付形式，用于调研、共创或汇报。

---

### StatementOfWork / 工作说明书

| Field | Value |
|:---|:---|
| **ID** | `StatementOfWork` |
| **ZH** | 工作说明书 |
| **EN** | Statement of Work |
| **Parent** | `Document` |

**EN**: A formal contract attachment defining project scope, deliverables, timeline, and acceptance criteria.

**ZH**: 定义项目范围、交付物、时间线和验收标准的正式合同附件。

---

## Business Development / 商务开发

### Proposal / 咨询提案

| Field | Value |
|:---|:---|
| **ID** | `Proposal` |
| **ZH** | 咨询提案 |
| **EN** | Proposal |
| **Parent** | `Document` |

**EN**: A project proposal or bid document for clients, containing methodology, team composition, timeline, and pricing.

**ZH**: 面向客户的项目建议书或竞标方案，包含方法论、团队、时间表和报价。

---

### ClientAccount / 客户账户

| Field | Value |
|:---|:---|
| **ID** | `ClientAccount` |
| **ZH** | 客户账户 |
| **EN** | Client Account |
| **Parent** | `Resource` |

**EN**: A client entity record maintained by a consulting firm, tracking relationship history, engagement records, and revenue contribution.

**ZH**: 咨询公司维护的客户主体记录，跟踪关系历史、项目记录和收入贡献。

---

### ClientRelationship / 客户关系

| Field | Value |
|:---|:---|
| **ID** | `ClientRelationship` |
| **ZH** | 客户关系 |
| **EN** | Client Relationship |
| **Parent** | `Resource` |

**EN**: A long-term strategic partnership with a client, encompassing trust levels, contact frequency, and opportunity pipeline.

**ZH**: 与客户之间的长期战略合作关系，包含信任层级、接触频率和商机管道。

---

### Pipeline / 商机管道

| Field | Value |
|:---|:---|
| **ID** | `Pipeline` |
| **ZH** | 商机管道 |
| **EN** | Pipeline |
| **Parent** | `Resource` |

**EN**: A sales funnel of potential consulting engagements, tracking the full process from lead identification to contract signing.

**ZH**: 潜在咨询项目的销售漏斗，跟踪从线索识别到签约的全流程。

---

### ConsultingService / 咨询服务产品

| Field | Value |
|:---|:---|
| **ID** | `ConsultingService` |
| **ZH** | 咨询服务产品 |
| **EN** | Consulting Service |
| **Parent** | `ProductService` |

**EN**: Standardized or customized service offerings provided by a consulting firm, such as strategic assessment, organizational diagnostics, and digital roadmaps.

**ZH**: 咨询公司对外提供的标准化或定制化服务产品，如战略评估、组织诊断、数字化路线图等。

---

## Role Hierarchy / 角色体系

### PartnerRole / 合伙人角色

| Field | Value |
|:---|:---|
| **ID** | `PartnerRole` |
| **ZH** | 合伙人角色 |
| **EN** | Partner |
| **Parent** | `Role` |

**EN**: A senior leadership role bearing ultimate responsibility for client relationships, engagement quality, and revenue targets.

**ZH**: 对客户关系、项目质量和营收目标负最终责任的高级领导角色。

---

### PrincipalRole / 总监/副合伙人角色

| Field | Value |
|:---|:---|
| **ID** | `PrincipalRole` |
| **ZH** | 总监/副合伙人角色 |
| **EN** | Principal / Associate Partner |
| **Parent** | `Role` |

**EN**: A senior advisory role between partner and manager, responsible for program management and business development.

**ZH**: 介于合伙人和经理之间的高级顾问角色，负责项目群管理和业务拓展。

---

### EngagementManagerRole / 项目经理角色

| Field | Value |
|:---|:---|
| **ID** | `EngagementManagerRole` |
| **ZH** | 项目经理角色 |
| **EN** | Engagement Manager |
| **Parent** | `Role` |

**EN**: A role responsible for day-to-day management, team coordination, and client communication for a single engagement.

**ZH**: 负责单个项目日常管理、团队协调和客户沟通的角色。

---

### ConsultantRole / 顾问角色

| Field | Value |
|:---|:---|
| **ID** | `ConsultantRole` |
| **ZH** | 顾问角色 |
| **EN** | Consultant |
| **Parent** | `Role` |

**EN**: A professional role performing specific analysis, research, solution design, and delivery work.

**ZH**: 执行具体分析、调研、方案设计和交付工作的专业角色。

---

### AnalystRole / 分析师角色

| Field | Value |
|:---|:---|
| **ID** | `AnalystRole` |
| **ZH** | 分析师角色 |
| **EN** | Analyst |
| **Parent** | `Role` |

**EN**: A junior role responsible for data collection, analytical modeling, and material preparation.

**ZH**: 负责数据收集、分析建模和材料准备的初级角色。

---

### SubjectMatterExpertRole / 领域专家角色

| Field | Value |
|:---|:---|
| **ID** | `SubjectMatterExpertRole` |
| **ZH** | 领域专家角色 |
| **EN** | Subject Matter Expert |
| **Parent** | `Role` |

**EN**: An advisory role with deep expertise in a specific industry or functional domain, providing expert opinions and quality assurance.

**ZH**: 在特定行业或职能领域拥有深度专长的顾问角色，提供专家意见和质量把关。

---

### SubcontractorRole / 外部分包顾问角色

| Field | Value |
|:---|:---|
| **ID** | `SubcontractorRole` |
| **ZH** | 外部分包顾问角色 |
| **EN** | Subcontractor |
| **Parent** | `Role` |

**EN**: A project subcontracting role undertaken by external partners or independent consultants, providing specialized services under contract.

**ZH**: 由外部合作方或独立顾问承担的项目分包角色，按合同提供专项服务。

---

### ClientStakeholder / 客户利益相关方

| Field | Value |
|:---|:---|
| **ID** | `ClientStakeholder` |
| **ZH** | 客户利益相关方 |
| **EN** | Client Stakeholder |
| **Parent** | `Role` |

**EN**: Key stakeholders within the client organization related to the consulting engagement, including project leads, business owners, and IT leaders.

**ZH**: 客户组织中与咨询项目相关的关键干系人，包括项目负责人、业务负责人、IT负责人等。

---

### ClientSponsor / 客户项目发起人

| Field | Value |
|:---|:---|
| **ID** | `ClientSponsor` |
| **ZH** | 客户项目发起人 |
| **EN** | Client Sponsor |
| **Parent** | `Role` |

**EN**: An executive sponsor on the client side who provides budget approval and senior-level support for the consulting engagement.

**ZH**: 客户方为咨询项目提供预算审批和高层支持的行政发起人角色。

---

### StaffingRequest / 人员配置需求

| Field | Value |
|:---|:---|
| **ID** | `StaffingRequest` |
| **ZH** | 人员配置需求 |
| **EN** | Staffing Request |
| **Parent** | `Resource` |

**EN**: A human resource request specifying required skills, experience, and availability for project team assembly.

**ZH**: 项目团队组建中对特定技能、经验和可用性的人力需求申请。

---

## Knowledge & Methods / 知识与方法

### KnowledgeAsset / 知识资产

| Field | Value |
|:---|:---|
| **ID** | `KnowledgeAsset` |
| **ZH** | 知识资产 |
| **EN** | Knowledge Asset |
| **Parent** | `Asset` |

**EN**: Reusable knowledge accumulated by a consulting firm, including case libraries, industry reports, best practices, and tool templates.

**ZH**: 咨询公司积累的可复用知识，包括案例库、行业报告、最佳实践、工具模板等。

---

### Methodology / 方法论

| Field | Value |
|:---|:---|
| **ID** | `Methodology` |
| **ZH** | 方法论 |
| **EN** | Methodology |
| **Parent** | `KnowledgeAsset` |

**EN**: A standardized methodology framework developed or adopted by a consulting firm, such as Design Thinking, Lean Six Sigma, TOGAF, etc.

**ZH**: 咨询公司自主研发或引用的标准化方法论框架，如设计思维、精益六西格玛、TOGAF等。

---

### Framework / 分析框架

| Field | Value |
|:---|:---|
| **ID** | `Framework` |
| **ZH** | 分析框架 |
| **EN** | Analytical Framework |
| **Parent** | `KnowledgeAsset` |

**EN**: A structured tool for problem analysis and strategic planning, such as Porter's Five Forces, SWOT, Value Chain Analysis, BCG Matrix, etc.

**ZH**: 用于问题分析和战略规划的结构化工具，如波特五力、SWOT、价值链分析、BCG矩阵等。

---

### CaseStudy / 案例研究

| Field | Value |
|:---|:---|
| **ID** | `CaseStudy` |
| **ZH** | 案例研究 |
| **EN** | Case Study |
| **Parent** | `Document` |

**EN**: A structured summary of past engagements used for knowledge retention, business development, and brand showcase.

**ZH**: 过往项目的结构化总结，用于知识沉淀、业务开发和品牌展示。

---

### ThoughtLeadership / 思想领导力内容

| Field | Value |
|:---|:---|
| **ID** | `ThoughtLeadership` |
| **ZH** | 思想领导力内容 |
| **EN** | Thought Leadership |
| **Parent** | `Asset` |

**EN**: Industry insight white papers, research reports, and opinion articles published by a consulting firm for brand building and client attraction.

**ZH**: 咨询公司发布的行业洞察白皮书、研究报告和观点文章，用于品牌建设和客户吸引。

---

### BenchmarkStudy / 对标研究

| Field | Value |
|:---|:---|
| **ID** | `BenchmarkStudy` |
| **ZH** | 对标研究 |
| **EN** | Benchmark Study |
| **Parent** | `Document` |

**EN**: A performance benchmarking analysis report based on industry data and best practices.

**ZH**: 基于行业数据和最佳实践的性能对标分析报告。

---

## Metrics / 度量指标

### UtilizationMetric / 利用率指标

| Field | Value |
|:---|:---|
| **ID** | `UtilizationMetric` |
| **ZH** | 利用率指标 |
| **EN** | Utilization Metric |
| **Parent** | `KPI` |

**EN**: A core operational metric measuring the ratio of a consultant's billable hours to total working hours.

**ZH**: 衡量顾问可计费时间与总工时比率的核心运营指标。

---

### RevenueMetric / 收入指标

| Field | Value |
|:---|:---|
| **ID** | `RevenueMetric` |
| **ZH** | 收入指标 |
| **EN** | Revenue Metric |
| **Parent** | `KPI` |

**EN**: A financial metric measuring revenue performance at the firm, practice line, or engagement level.

**ZH**: 衡量咨询公司、业务线或项目层面收入表现的财务指标。

---

### MarginMetric / 利润率指标

| Field | Value |
|:---|:---|
| **ID** | `MarginMetric` |
| **ZH** | 利润率指标 |
| **EN** | Margin Metric |
| **Parent** | `KPI` |

**EN**: A financial metric measuring profit margin at the engagement or practice line level, reflecting delivery efficiency and pricing strategy effectiveness.

**ZH**: 衡量项目或业务线利润率的财务指标，反映交付效率和定价策略的有效性。

---

### BillableRate / 计费费率

| Field | Value |
|:---|:---|
| **ID** | `BillableRate` |
| **ZH** | 计费费率 |
| **EN** | Billable Rate |
| **Parent** | `Rule` |

**EN**: A billing standard rule determined by consultant grade, engagement type, and client agreement for hourly or daily rates.

**ZH**: 按顾问等级、项目类型和客户协议确定的小时/天计费标准规则。

---

## Governance & Risk / 治理与风险

### QualityReview / 质量评审

| Field | Value |
|:---|:---|
| **ID** | `QualityReview` |
| **ZH** | 质量评审 |
| **EN** | Quality Review |
| **Parent** | `Control` |

**EN**: Quality gates and review mechanisms during engagement delivery to ensure deliverables meet standards.

**ZH**: 项目交付过程中的质量关口和审核机制，确保交付物达标。

---

### ClientSatisfactionSurvey / 客户满意度调查

| Field | Value |
|:---|:---|
| **ID** | `ClientSatisfactionSurvey` |
| **ZH** | 客户满意度调查 |
| **EN** | Client Satisfaction Survey |
| **Parent** | `Document` |

**EN**: Client feedback collected after engagement completion, measuring service quality and client experience.

**ZH**: 项目结束后收集的客户反馈，衡量服务质量和客户体验。

---

### ChangeManagementPlan / 变革管理计划

| Field | Value |
|:---|:---|
| **ID** | `ChangeManagementPlan` |
| **ZH** | 变革管理计划 |
| **EN** | Change Management Plan |
| **Parent** | `Document` |

**EN**: An organizational change and personnel transformation plan developed for clients within a consulting engagement.

**ZH**: 咨询项目中为客户制定的组织变革和人员转型方案。

---

### ConflictOfInterestRisk / 利益冲突风险

| Field | Value |
|:---|:---|
| **ID** | `ConflictOfInterestRisk` |
| **ZH** | 利益冲突风险 |
| **EN** | Conflict of Interest Risk |
| **Parent** | `Risk` |

**EN**: A risk of conflicts and reputational damage arising from simultaneously serving competing clients or related parties.

**ZH**: 同时服务竞争客户或关联方可能导致的利益冲突和声誉风险。

---

### ScopeCreepRisk / 范围蔓延风险

| Field | Value |
|:---|:---|
| **ID** | `ScopeCreepRisk` |
| **ZH** | 范围蔓延风险 |
| **EN** | Scope Creep Risk |
| **Parent** | `Risk` |

**EN**: A risk of requirements scope expanding during engagement execution without corresponding adjustments to budget and timeline.

**ZH**: 项目执行过程中需求范围不断扩大但未相应调整预算和时间的风险。

---

### IndependencePolicy / 独立性政策

| Field | Value |
|:---|:---|
| **ID** | `IndependencePolicy` |
| **ZH** | 独立性政策 |
| **EN** | Independence Policy |
| **Parent** | `Policy` |

**EN**: An internal governance policy ensuring objectivity and neutrality of consulting advice, particularly applicable to audit and risk management domains.

**ZH**: 确保咨询建议客观中立的内部治理政策，特别适用于审计和风控领域。

---

### ConfidentialityPolicy / 保密政策

| Field | Value |
|:---|:---|
| **ID** | `ConfidentialityPolicy` |
| **ZH** | 保密政策 |
| **EN** | Confidentiality Policy |
| **Parent** | `Policy` |

**EN**: An information security policy governing the protection of client information, engagement data, and trade secrets.

**ZH**: 规范客户信息、项目数据和商业机密保护要求的信息安全政策。

---

## Capabilities & Processes / 能力与流程

### BusinessDevelopmentCapability / 业务开发能力

| Field | Value |
|:---|:---|
| **ID** | `BusinessDevelopmentCapability` |
| **ZH** | 业务开发能力 |
| **EN** | Business Development Capability |
| **Parent** | `Capability` |

**EN**: A market expansion capability for identifying opportunities, building client relationships, and converting leads into signed engagements.

**ZH**: 识别商机、建立客户关系和转化签约的市场拓展能力。

---

### KnowledgeManagementCapability / 知识管理能力

| Field | Value |
|:---|:---|
| **ID** | `KnowledgeManagementCapability` |
| **ZH** | 知识管理能力 |
| **EN** | Knowledge Management Capability |
| **Parent** | `Capability` |

**EN**: A systematic capability for collecting, organizing, sharing, and reusing engagement experiences, industry knowledge, and methodologies.

**ZH**: 对项目经验、行业知识和方法论的系统化收集、整理、分享与复用能力。

---

### TalentDevelopmentCapability / 人才发展能力

| Field | Value |
|:---|:---|
| **ID** | `TalentDevelopmentCapability` |
| **ZH** | 人才发展能力 |
| **EN** | Talent Development Capability |
| **Parent** | `Capability` |

**EN**: A capability encompassing the selection, development, evaluation, and promotion of consulting talent, representing a core competitive advantage.

**ZH**: 咨询人才的选拔、培养、评估和晋升体系能力，是咨询公司核心竞争力。

---

### DigitalDeliveryCapability / 数字化交付能力

| Field | Value |
|:---|:---|
| **ID** | `DigitalDeliveryCapability` |
| **ZH** | 数字化交付能力 |
| **EN** | Digital Delivery Capability |
| **Parent** | `Capability` |

**EN**: A capability leveraging data analytics, AI, and automation tools to enhance delivery efficiency and output quality.

**ZH**: 利用数据分析、AI、自动化工具提升交付效率和成果质量的能力。

---

### StaffingProcess / 人员配置流程

| Field | Value |
|:---|:---|
| **ID** | `StaffingProcess` |
| **ZH** | 人员配置流程 |
| **EN** | Staffing Process |
| **Parent** | `Process` |

**EN**: A process for matching and allocating consultant resources based on engagement requirements.

**ZH**: 根据项目需求匹配和调配顾问资源的流程。

---

### EngagementDeliveryProcess / 项目交付流程

| Field | Value |
|:---|:---|
| **ID** | `EngagementDeliveryProcess` |
| **ZH** | 项目交付流程 |
| **EN** | Engagement Delivery Process |
| **Parent** | `Process` |

**EN**: An end-to-end process from engagement kickoff, research and analysis, solution design, to final delivery.

**ZH**: 从项目启动、调研分析、方案设计到最终交付的端到端流程。

---

### BusinessDevelopmentProcess / 业务开发流程

| Field | Value |
|:---|:---|
| **ID** | `BusinessDevelopmentProcess` |
| **ZH** | 业务开发流程 |
| **EN** | Business Development Process |
| **Parent** | `Process` |

**EN**: An opportunity conversion process from market intelligence, client outreach, requirements identification, to proposal and bidding.

**ZH**: 从市场情报、客户接洽、需求识别到提案竞标的商机转化流程。

---

### KnowledgeCaptureProcess / 知识沉淀流程

| Field | Value |
|:---|:---|
| **ID** | `KnowledgeCaptureProcess` |
| **ZH** | 知识沉淀流程 |
| **EN** | Knowledge Capture Process |
| **Parent** | `Process` |

**EN**: A post-engagement process for knowledge extraction, case summarization, and experience archiving.

**ZH**: 项目结束后的知识提炼、案例总结和经验入库流程。

---

## Systems / 系统

### CRMSystem / 客户关系管理系统

| Field | Value |
|:---|:---|
| **ID** | `CRMSystem` |
| **ZH** | 客户关系管理系统 |
| **EN** | CRM System |
| **Parent** | `SystemApplication` |

**EN**: A system platform for managing client information, opportunity tracking, and relationship maintenance.

**ZH**: 管理客户信息、商机追踪和关系维护的系统平台。

---

### KnowledgePortal / 知识管理门户

| Field | Value |
|:---|:---|
| **ID** | `KnowledgePortal` |
| **ZH** | 知识管理门户 |
| **EN** | Knowledge Portal |
| **Parent** | `SystemApplication` |

**EN**: A knowledge platform for storing and retrieving methodologies, case libraries, industry reports, and best practices.

**ZH**: 存储和检索方法论、案例库、行业报告和最佳实践的知识平台。

---

### ResourceManagementSystem / 资源管理系统

| Field | Value |
|:---|:---|
| **ID** | `ResourceManagementSystem` |
| **ZH** | 资源管理系统 |
| **EN** | Resource Management System |
| **Parent** | `SystemApplication` |

**EN**: A staffing system tracking consultant skills, availability, and engagement assignments.

**ZH**: 跟踪顾问技能、可用性和项目分配的人员配置系统。

---

### TimeTrackingSystem / 工时管理系统

| Field | Value |
|:---|:---|
| **ID** | `TimeTrackingSystem` |
| **ZH** | 工时管理系统 |
| **EN** | Time Tracking System |
| **Parent** | `SystemApplication` |

**EN**: A time management system for recording consultant billable hours and expense reimbursements.

**ZH**: 记录顾问计费时间和费用报销的工时系统。

---

## Relations / 关系

### has_practice_line / 拥有业务线

| Field | Value |
|:---|:---|
| **ID** | `has_practice_line` |
| **Domain** | `ConsultingFirm` |
| **Range** | `PracticeLine` |

**EN**: A consulting firm has a practice line.

**ZH**: 咨询公司拥有业务实践领域。

---

### has_competency_center / 设立能力中心

| Field | Value |
|:---|:---|
| **ID** | `has_competency_center` |
| **Domain** | `ConsultingFirm` |
| **Range** | `CompetencyCenter` |

**EN**: A consulting firm establishes a competency center.

**ZH**: 咨询公司设立能力中心。

---

### has_office / 设立办公室

| Field | Value |
|:---|:---|
| **ID** | `has_office` |
| **Domain** | `ConsultingFirm` |
| **Range** | `ConsultingOffice` |

**EN**: A consulting firm has a branch office.

**ZH**: 咨询公司设立分支办公室。

---

### serves_client / 服务客户

| Field | Value |
|:---|:---|
| **ID** | `serves_client` |
| **Domain** | `ConsultingFirm` |
| **Range** | `ClientAccount` |

**EN**: A consulting firm serves a client.

**ZH**: 咨询公司服务客户。

---

### manages_relationship / 管理客户关系

| Field | Value |
|:---|:---|
| **ID** | `manages_relationship` |
| **Domain** | `PartnerRole` |
| **Range** | `ClientRelationship` |

**EN**: A partner manages a client relationship.

**ZH**: 合伙人管理客户关系。

---

### leads_engagement / 领导项目

| Field | Value |
|:---|:---|
| **ID** | `leads_engagement` |
| **Domain** | `PartnerRole` |
| **Range** | `Engagement` |

**EN**: A partner leads an engagement.

**ZH**: 合伙人领导咨询项目。

---

### manages_engagement / 管理项目

| Field | Value |
|:---|:---|
| **ID** | `manages_engagement` |
| **Domain** | `EngagementManagerRole` |
| **Range** | `Engagement` |

**EN**: An engagement manager manages the day-to-day operations of an engagement.

**ZH**: 项目经理管理咨询项目日常。

---

### staffed_on / 配置到项目

| Field | Value |
|:---|:---|
| **ID** | `staffed_on` |
| **Domain** | `ConsultantRole` |
| **Range** | `Engagement` |

**EN**: A consultant is staffed on an engagement.

**ZH**: 顾问被配置到咨询项目。

---

### has_team_member / 拥有团队成员

| Field | Value |
|:---|:---|
| **ID** | `has_team_member` |
| **Domain** | `Engagement` |
| **Range** | `ConsultantRole` |

**EN**: An engagement has a team member (inverse of staffed_on).

**ZH**: 咨询项目拥有团队成员（staffed_on 的逆关系）。

---

### provides_expertise / 提供专业支持

| Field | Value |
|:---|:---|
| **ID** | `provides_expertise` |
| **Domain** | `SubjectMatterExpertRole` |
| **Range** | `Engagement` |

**EN**: A subject matter expert provides expertise to an engagement.

**ZH**: 领域专家为项目提供专业支持。

---

### subcontracted_to / 分包给

| Field | Value |
|:---|:---|
| **ID** | `subcontracted_to` |
| **Domain** | `Engagement` |
| **Range** | `SubcontractorRole` |

**EN**: An engagement subcontracts work to an external consultant.

**ZH**: 咨询项目将部分工作分包给外部顾问。

---

### engaged_by / 服务于客户

| Field | Value |
|:---|:---|
| **ID** | `engaged_by` |
| **Domain** | `Engagement` |
| **Range** | `ClientAccount` |

**EN**: An engagement is engaged by a client.

**ZH**: 咨询项目服务于客户。

---

### sponsored_by / 由发起人支持

| Field | Value |
|:---|:---|
| **ID** | `sponsored_by` |
| **Domain** | `Engagement` |
| **Range** | `ClientSponsor` |

**EN**: An engagement is sponsored by a client executive sponsor.

**ZH**: 咨询项目由客户发起人提供高层支持。

---

### has_client_stakeholder / 拥有客户干系人

| Field | Value |
|:---|:---|
| **ID** | `has_client_stakeholder` |
| **Domain** | `ClientAccount` |
| **Range** | `ClientStakeholder` |

**EN**: A client account has key stakeholders.

**ZH**: 客户账户拥有关键干系人。

---

### scoped_by / 范围由SOW定义

| Field | Value |
|:---|:---|
| **ID** | `scoped_by` |
| **Domain** | `Engagement` |
| **Range** | `StatementOfWork` |

**EN**: An engagement's scope is defined by a statement of work.

**ZH**: 项目范围由工作说明书定义。

---

### proposed_through / 通过提案赢得

| Field | Value |
|:---|:---|
| **ID** | `proposed_through` |
| **Domain** | `Engagement` |
| **Range** | `Proposal` |

**EN**: An engagement is won through a proposal.

**ZH**: 项目通过提案赢得。

---

### has_workstream / 包含工作模块

| Field | Value |
|:---|:---|
| **ID** | `has_workstream` |
| **Domain** | `Engagement` |
| **Range** | `WorkStream` |

**EN**: An engagement contains work streams.

**ZH**: 项目包含工作模块。

---

### has_milestone / 包含里程碑

| Field | Value |
|:---|:---|
| **ID** | `has_milestone` |
| **Domain** | `Engagement` |
| **Range** | `EngagementMilestone` |

**EN**: An engagement has key milestones.

**ZH**: 咨询项目包含关键里程碑。

---

### conducts_workshop / 开展工作坊

| Field | Value |
|:---|:---|
| **ID** | `conducts_workshop` |
| **Domain** | `Engagement` |
| **Range** | `Workshop` |

**EN**: An engagement conducts workshop activities.

**ZH**: 咨询项目中开展工作坊活动。

---

### produces_deliverable / 产出交付物

| Field | Value |
|:---|:---|
| **ID** | `produces_deliverable` |
| **Domain** | `WorkStream` |
| **Range** | `Deliverable` |

**EN**: A work stream produces deliverables.

**ZH**: 工作模块产出交付物。

---

### applies_methodology / 应用方法论

| Field | Value |
|:---|:---|
| **ID** | `applies_methodology` |
| **Domain** | `Engagement` |
| **Range** | `Methodology` |

**EN**: An engagement applies a methodology.

**ZH**: 项目应用方法论。

---

### uses_framework / 使用分析框架

| Field | Value |
|:---|:---|
| **ID** | `uses_framework` |
| **Domain** | `Deliverable` |
| **Range** | `Framework` |

**EN**: A deliverable uses an analytical framework.

**ZH**: 交付物使用分析框架。

---

### fulfills_staffing_request / 满足配置需求

| Field | Value |
|:---|:---|
| **ID** | `fulfills_staffing_request` |
| **Domain** | `ConsultantRole` |
| **Range** | `StaffingRequest` |

**EN**: A consultant fulfills a staffing request.

**ZH**: 顾问满足人员配置需求。

---

### generates_pipeline / 产生商机管道

| Field | Value |
|:---|:---|
| **ID** | `generates_pipeline` |
| **Domain** | `ClientRelationship` |
| **Range** | `Pipeline` |

**EN**: A client relationship generates a pipeline opportunity.

**ZH**: 客户关系产生商机管道。

---

### converts_to_engagement / 转化为签约项目

| Field | Value |
|:---|:---|
| **ID** | `converts_to_engagement` |
| **Domain** | `Pipeline` |
| **Range** | `Engagement` |

**EN**: A pipeline opportunity converts into a signed engagement.

**ZH**: 商机转化为签约项目。

---

### reviewed_by / 经过质量评审

| Field | Value |
|:---|:---|
| **ID** | `reviewed_by` |
| **Domain** | `Deliverable` |
| **Range** | `QualityReview` |

**EN**: A deliverable is reviewed through quality review.

**ZH**: 交付物经过质量评审。

---

### assessed_by_survey / 通过满意度调查评估

| Field | Value |
|:---|:---|
| **ID** | `assessed_by_survey` |
| **Domain** | `Engagement` |
| **Range** | `ClientSatisfactionSurvey` |

**EN**: An engagement is assessed by a client satisfaction survey.

**ZH**: 项目通过客户满意度调查评估。

---

### contributes_to_knowledge / 沉淀为知识资产

| Field | Value |
|:---|:---|
| **ID** | `contributes_to_knowledge` |
| **Domain** | `Engagement` |
| **Range** | `KnowledgeAsset` |

**EN**: An engagement contributes to knowledge assets.

**ZH**: 项目经验沉淀为知识资产。

---

### documented_as_case / 记录为案例研究

| Field | Value |
|:---|:---|
| **ID** | `documented_as_case` |
| **Domain** | `Engagement` |
| **Range** | `CaseStudy` |

**EN**: An engagement is documented as a case study.

**ZH**: 项目记录为案例研究。

---

### publishes_thought_leadership / 发布思想领导力内容

| Field | Value |
|:---|:---|
| **ID** | `publishes_thought_leadership` |
| **Domain** | `PracticeLine` |
| **Range** | `ThoughtLeadership` |

**EN**: A practice line publishes thought leadership content.

**ZH**: 业务线发布思想领导力内容。

---

### benchmarked_against / 使用对标研究

| Field | Value |
|:---|:---|
| **ID** | `benchmarked_against` |
| **Domain** | `Deliverable` |
| **Range** | `BenchmarkStudy` |

**EN**: A deliverable is benchmarked against a benchmark study.

**ZH**: 交付物使用对标研究支撑。

---

### includes_change_plan / 包含变革管理计划

| Field | Value |
|:---|:---|
| **ID** | `includes_change_plan` |
| **Domain** | `Engagement` |
| **Range** | `ChangeManagementPlan` |

**EN**: An engagement includes a change management plan.

**ZH**: 项目包含变革管理计划。

---

### has_risk / 面临风险

| Field | Value |
|:---|:---|
| **ID** | `has_risk` |
| **Domain** | `Engagement` |
| **Range** | `Risk` |

**EN**: Risks faced by an engagement, including conflict of interest, scope creep, and other risk types.

**ZH**: 咨询项目面临的风险，包括利益冲突、范围蔓延等各类风险。

---

### governed_by_policy / 受政策约束

| Field | Value |
|:---|:---|
| **ID** | `governed_by_policy` |
| **Domain** | `Engagement` |
| **Range** | `Policy` |

**EN**: An engagement is governed by policies, including independence policy, confidentiality policy, etc.

**ZH**: 咨询项目受治理政策约束，包括独立性政策、保密政策等。

---

### measured_by_utilization / 由利用率衡量

| Field | Value |
|:---|:---|
| **ID** | `measured_by_utilization` |
| **Domain** | `ConsultantRole` |
| **Range** | `UtilizationMetric` |

**EN**: Consultant performance is measured by utilization metrics.

**ZH**: 顾问绩效由利用率指标衡量。

---

### measured_by_revenue / 由收入指标衡量

| Field | Value |
|:---|:---|
| **ID** | `measured_by_revenue` |
| **Domain** | `PracticeLine` |
| **Range** | `RevenueMetric` |

**EN**: Practice line performance is measured by revenue metrics.

**ZH**: 业务线业绩由收入指标衡量。

---

### billed_at / 按费率计费

| Field | Value |
|:---|:---|
| **ID** | `billed_at` |
| **Domain** | `ConsultantRole` |
| **Range** | `BillableRate` |

**EN**: A consultant is billed at a specific billable rate.

**ZH**: 顾问按照费率标准计费。

---

### tracked_in_crm / 在CRM中管理

| Field | Value |
|:---|:---|
| **ID** | `tracked_in_crm` |
| **Domain** | `ClientAccount` |
| **Range** | `CRMSystem` |

**EN**: A client account is tracked in the CRM system.

**ZH**: 客户账户在CRM系统中管理。

---

### stored_in_portal / 存储于知识门户

| Field | Value |
|:---|:---|
| **ID** | `stored_in_portal` |
| **Domain** | `KnowledgeAsset` |
| **Range** | `KnowledgePortal` |

**EN**: Knowledge assets are stored in the knowledge portal.

**ZH**: 知识资产存储于知识管理门户。

---

### scheduled_in_rms / 通过资源管理系统调度

| Field | Value |
|:---|:---|
| **ID** | `scheduled_in_rms` |
| **Domain** | `StaffingRequest` |
| **Range** | `ResourceManagementSystem` |

**EN**: Staffing requests are scheduled through the resource management system.

**ZH**: 人员配置通过资源管理系统调度。

---

### logged_in_timesheet / 在工时系统中记录

| Field | Value |
|:---|:---|
| **ID** | `logged_in_timesheet` |
| **Domain** | `Engagement` |
| **Range** | `TimeTrackingSystem` |

**EN**: Engagement hours are logged in the time tracking system.

**ZH**: 项目工时在工时管理系统中记录。

---

### bd_capability_realized_by / 业务开发能力实现

| Field | Value |
|:---|:---|
| **ID** | `bd_capability_realized_by` |
| **Domain** | `BusinessDevelopmentCapability` |
| **Range** | `BusinessDevelopmentProcess` |

**EN**: Business development capability is realized by the business development process.

**ZH**: 业务开发能力由业务开发流程实现。

---

### km_capability_realized_by / 知识管理能力实现

| Field | Value |
|:---|:---|
| **ID** | `km_capability_realized_by` |
| **Domain** | `KnowledgeManagementCapability` |
| **Range** | `KnowledgeCaptureProcess` |

**EN**: Knowledge management capability is realized by the knowledge capture process.

**ZH**: 知识管理能力由知识沉淀流程实现。

---

### talent_capability_realized_by / 人才发展能力实现

| Field | Value |
|:---|:---|
| **ID** | `talent_capability_realized_by` |
| **Domain** | `TalentDevelopmentCapability` |
| **Range** | `StaffingProcess` |

**EN**: Talent development capability is realized by the staffing process.

**ZH**: 人才发展能力由人员配置流程实现。

---

### digital_capability_realized_by / 数字化交付能力实现

| Field | Value |
|:---|:---|
| **ID** | `digital_capability_realized_by` |
| **Domain** | `DigitalDeliveryCapability` |
| **Range** | `EngagementDeliveryProcess` |

**EN**: Digital delivery capability is realized by the engagement delivery process.

**ZH**: 数字化交付能力由项目交付流程实现。
