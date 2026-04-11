# Consulting Industry and Domain Extension

The Consulting Industry and Domain Extension extends L1 with concepts specific to the professional consulting domain.

## Overview

This extension covers:

- :office: **Organizational Structure** — Consulting firms, practice lines, capability centers
- :clipboard: **Project Management** — Engagements, work streams, deliverables
- :brain: **Methodology & Frameworks** — Methodologies, analysis frameworks
- :busts_in_silhouette: **Talent System** — Partners, Directors, Project Managers, Consultants, Analysts, Domain Experts
- :handshake: **Client Relationships** — Client accounts, client relationships, opportunity pipeline
- :bar_chart: **Operational Metrics** — Utilization rate, billing rate
- :books: **Knowledge Management** — Knowledge assets, case studies, thought leadership
- :scales: **Governance & Risk** — Independence policy, confidentiality policy, conflict of interest risk, scope creep risk

## Statistics

| Category | Count |
|:---|:---:|
| New Classes | 40+ |
| New Relations | 34 |
| Sample Instances | 25+ |

## Key Classes

| Class | Parent (L1) | Description |
|:---|:---|:---|
| `ConsultingFirm` | `Organization` | A professional services firm |
| `PracticeLine` | `OrgUnit` | Major business division (e.g., Strategy, Digital, Operations) |
| `Engagement` | `Resource` | A contracted consulting project |
| `Deliverable` | `Resource` | A work product delivered to the client |
| `Methodology` | `Resource` | A structured approach to solving business problems |
| `Partner` | `Role` | Senior leader who owns client relationships |
| `ClientAccount` | `Party` | A client organization managed by the firm |

## Use Cases

- Consulting firm internal knowledge graph construction
- Consulting project management system semantic layer
- Professional services firm operational analytics
- AI Agent knowledge base for the consulting industry

## Source File

:material-file-code: [`consulting_extension_v1.json`](https://github.com/ramphias/universal-ontology-definition/blob/main/extensions/consulting/consulting_extension_v1.json)
