# Technology Extension

The Technology Extension extends L1 with concepts specific to SaaS companies, platform engineering, and DevOps practices.

## Overview

This extension covers:

- :office: **Organization** — Tech companies, engineering teams
- :rocket: **Products** — SaaS products, platform services, API endpoints
- :gear: **Infrastructure** — Microservices, cloud infrastructure, ML models, data pipelines
- :busts_in_silhouette: **Roles** — Product managers, software engineers, SREs, data engineers
- :clipboard: **Workflow** — Sprints, feature requests, deployments, incidents
- :warning: **Risk** — Technical debt, security vulnerabilities
- :scales: **Policies** — SLA agreements
- :repeat: **Processes** — CI/CD, incident response
- :bar_chart: **KPIs** — Service uptime, deployment frequency, MTTR, MRR, churn rate

## Statistics

| Category | Count |
|:---|:---:|
| New Classes | 29 |
| New Relations | 12 |
| Sample Instances | 7 |

## Key Classes

| Class | Parent (L1) | Description |
|:---|:---|:---|
| `SaaSProduct` | `ProductService` | Cloud software delivered via subscription |
| `Microservice` | `SystemApplication` | Independently deployable service unit |
| `CICDProcess` | `Process` | Continuous integration and delivery pipeline |
| `Incident` | `Event` | Production availability/performance issue |
| `SREEngineer` | `Role` | Site reliability and operational automation |
| `MRR` | `KPI` | Monthly recurring revenue |
| `MTTR` | `KPI` | Mean time to recovery |

## Use Cases

- Engineering organization knowledge graph
- Incident root-cause analysis across microservice dependencies
- DORA metrics dashboard (deployment frequency, lead time, MTTR, change failure rate)
- SaaS business metrics (MRR, churn, LTV) linked to product and engineering data

## Source File

:material-file-code: [`technology_extension_v1.json`](https://github.com/ramphias/universal-ontology-definition/blob/main/l2-extensions/technology/technology_extension_v1.json)
