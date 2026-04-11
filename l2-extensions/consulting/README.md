# 咨询行业与业务领域扩展 | Consulting Industry and Domain Extension

## 概述 | Overview

咨询行业与业务领域扩展 继承 L1 通用 Ontology，新增了咨询行业特有的概念体系，覆盖：

The Consulting Industry and Domain Extension extends the L1 Universal Ontology with consulting-specific concepts, covering:

- 🏢 **组织结构** — 咨询公司、办公室、业务线、能力中心 | Consulting Firm, Office, Practice Line, Competency Center
- 📋 **项目管理** — 签约项目、工作模块、交付物、里程碑、工作坊 | Engagement, Work Stream, Deliverable, Milestone, Workshop
- 🧠 **方法论与框架** — 方法论、分析框架 | Methodology, Analytical Framework
- 👥 **人才体系** — 合伙人、总监、项目经理、顾问、分析师、领域专家、外部分包顾问 | Partner, Principal, EM, Consultant, Analyst, SME, Subcontractor
- 🤝 **客户关系** — 客户账户、客户关系、商机管道、客户干系人、客户发起人 | Client Account, Relationship, Pipeline, Stakeholder, Sponsor
- 📊 **运营指标** — 利用率、计费费率、收入指标、利润率指标 | Utilization, Billable Rate, Revenue, Margin
- 📚 **知识管理** — 知识资产、案例研究、思想领导力 | Knowledge Asset, Case Study, Thought Leadership
- ⚖️ **治理与风控** — 独立性政策、保密政策、利益冲突风险、范围蔓延风险 | Independence Policy, Confidentiality Policy, Conflict of Interest Risk, Scope Creep Risk

## 统计 | Statistics

| 类别 | 数量 |
|:---|:---:|
| 新增类 Classes | 54 |
| 新增关系 Relations | 45 |
| 示例实例 Sample Instances | 39 |

## v1.1.0 改进 | v1.1.0 Improvements

- ✅ 新增 `$schema` 声明，支持自动校验
- ✅ 所有类和关系均添加 `label_en` / `definition_en` 双语标注
- ✅ 修正 `WorkStream` 中文标签为"工作模块"（避免与 Process 混淆）
- ✅ 修正 `Methodology` / `Framework` 继承关系为 `KnowledgeAsset`
- ✅ 修正 `BillableRate` 继承关系为 `Rule`
- ✅ 合并冗余关系：`exposed_to_*` → `has_risk`; `governed_by_*` → `governed_by_policy`
- ✅ 新增 Capability ↔ Process `realized_by` 关联
- ✅ 新增反向关系 `has_team_member`
- ✅ 新增类：`ConsultingOffice`, `EngagementMilestone`, `Workshop`, `RevenueMetric`, `MarginMetric`, `SubcontractorRole`, `ClientStakeholder`, `ClientSponsor`

## 文件 | Files

- [`consulting_extension_v1.json`](consulting_extension_v1.json) — 完整定义文件 | Full definition file

## 版本 | Version

当前版本：**v1.1.0**

## 适用场景 | Use Cases

- 咨询公司内部知识图谱建设 | Internal knowledge graph construction for consulting firms
- 咨询项目管理系统的语义层 | Semantic layer for consulting project management systems
- 专业服务公司的运营分析 | Operational analytics for professional services firms
- AI Agent 的咨询行业知识底座 | Knowledge foundation for AI Agents in the consulting industry
