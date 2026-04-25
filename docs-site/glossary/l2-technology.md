# L2 Technology Extension / L2 科技行业扩展

L2 Technology Industry and Domain Extension — 29 classes, 12 relations (v1.0.0).

L2 科技行业扩展 —— 包含 29 个类、12 个关系（v1.0.0）。

> Source: [`l2-extensions/technology/technology_extension_v1.json`](https://github.com/ramphias/universal-ontology-definition/blob/main/l2-extensions/technology/technology_extension_v1.json)


---


## Classes / 类 (29)


| ID | EN | ZH | Parent | Definition (EN) |
|:---|:---|:---|:---|:---|
| `TechCompany` | Technology Company | 科技公司 | `Organization` | An enterprise with technology products or platforms as its core business |
| `EngineeringTeam` | Engineering Team | 工程团队 | `OrgUnit` | An organizational unit responsible for product development and technical delivery |
| `SaaSProduct` | SaaS Product | SaaS 产品 | `ProductService` | Cloud-based software-as-a-service product delivered via subscription model |
| `PlatformService` | Platform Service | 平台服务 | `ProductService` | Platform products providing foundational capabilities, e.g., API platforms, data platforms, AI platforms |
| `APIEndpoint` | API Endpoint | API 接口 | `Resource` | An externally exposed application programming interface endpoint |
| `Microservice` | Microservice | 微服务 | `SystemApplication` | A fine-grained service unit that can be independently deployed and scaled |
| `CloudInfrastructure` | Cloud Infrastructure | 云基础设施 | `Asset` | Compute, storage, and networking resources running on public or private cloud |
| `DataPipeline` | Data Pipeline | 数据管道 | `Process` | Automated data flow from ingestion, transformation, to loading into target systems |
| `MLModel` | ML Model | 机器学习模型 | `Asset` | A trained machine learning model asset used for prediction or classification |
| `Sprint` | Sprint | 迭代 | `Event` | A fixed time-box work iteration in agile development, typically 1-4 weeks |
| `FeatureRequest` | Feature Request | 需求工单 | `Document` | A structured ticket describing a new product feature or enhancement request |
| `Incident` | Incident | 故障事件 | `Event` | An abnormal production event affecting service availability or performance |
| `Deployment` | Deployment | 部署 | `Event` | An operational event releasing code changes to the production environment |
| `TechDebt` | Technical Debt | 技术债务 | `Risk` | Code quality issues accumulated from short-term compromises, increasing future maintenance cost and failure risk |
| `SecurityVulnerability` | Security Vulnerability | 安全漏洞 | `Risk` | Exploitable weaknesses in systems, e.g., code vulnerabilities, misconfigurations, dependency CVEs |
| `ProductManager` | Product Manager | 产品经理 | `Role` | A role responsible for product strategy, roadmap, and requirement prioritization |
| `SoftwareEngineer` | Software Engineer | 软件工程师 | `Role` | A technical role designing, writing, and maintaining software code |
| `SREEngineer` | Site Reliability Engineer | SRE 工程师 | `Role` | An engineering role responsible for system reliability, observability, and operational automation |
| `DataEngineer` | Data Engineer | 数据工程师 | `Role` | A technical role building and maintaining data pipelines, warehouses, and data lakes |
| `SLAPolicy` | Service Level Agreement Policy | SLA 策略 | `Policy` | Policy defining service availability, response time, and recovery commitments |
| `CICDProcess` | CI/CD Process | CI/CD 流程 | `Process` | Continuous integration and delivery pipeline from commit, build, test to automated deployment |
| `IncidentResponseProcess` | Incident Response Process | 故障响应流程 | `Process` | Emergency response from detection, triage, mitigation, recovery to post-mortem review |
| `ProductDevelopmentCapability` | Product Development Capability | 产品研发能力 | `Capability` | Organizational capability to rapidly iterate and deliver high-quality software products |
| `ObservabilityPlatform` | Observability Platform | 可观测性平台 | `SystemApplication` | Monitoring platform integrating logs, metrics, and distributed tracing |
| `ServiceUptime` | Service Uptime | 服务可用率 | `KPI` | Ratio of service uptime to total time, typically targeting 99.9%+ |
| `DeploymentFrequency` | Deployment Frequency | 部署频率 | `KPI` | Number of code releases to production per unit time |
| `MTTR` | Mean Time to Recovery | 平均恢复时间 | `KPI` | Average duration from incident occurrence to service recovery |
| `MRR` | Monthly Recurring Revenue | 月度经常性收入 | `KPI` | Monthly subscription recurring revenue for SaaS products |
| `CustomerChurnRate` | Customer Churn Rate | 客户流失率 | `KPI` | Rate of customers who stop using the product or cancel subscriptions in a period |

## Relations / 关系 (12)


| ID | Domain | Range | Definition (EN) |
|:---|:---|:---|:---|
| `has_engineering_team` | `TechCompany` | `EngineeringTeam` | A tech company has engineering teams |
| `develops_product` | `EngineeringTeam` | `SaaSProduct` | An engineering team develops a product |
| `exposes_api` | `SaaSProduct` | `APIEndpoint` | A product exposes API endpoints |
| `composed_of_microservices` | `PlatformService` | `Microservice` | A platform is composed of microservices |
| `runs_on` | `Microservice` | `CloudInfrastructure` | A microservice runs on cloud infrastructure |
| `trains_model` | `DataPipeline` | `MLModel` | A data pipeline trains an ML model |
| `planned_in_sprint` | `FeatureRequest` | `Sprint` | A feature request is planned and delivered in a sprint |
| `deployed_via` | `Microservice` | `CICDProcess` | A microservice is deployed via the CI/CD process |
| `triggers_incident` | `Deployment` | `Incident` | A deployment may trigger an incident |
| `resolved_by` | `Incident` | `IncidentResponseProcess` | An incident is resolved through the incident response process |
| `monitored_by` | `Microservice` | `ObservabilityPlatform` | A microservice is monitored by the observability platform |
| `governed_by_sla` | `SaaSProduct` | `SLAPolicy` | A SaaS product is governed by an SLA policy |
