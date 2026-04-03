# SQL DDL Binding

This directory contains the PostgreSQL DDL (Data Definition Language) mapping for the L1 Universal Enterprise Ontology Core.

## Files

- `schema.sql` — PostgreSQL table definitions

## Design Decisions

| Ontology Concept | SQL Mapping |
|:---|:---|
| Class | Table |
| Inheritance (`parent`) | Table-per-type with shared PK FK to parent table |
| 1:N relation | Foreign key column |
| M:N relation | Junction table |
| Bilingual labels | `label_zh` + `label_en` columns |
| Identity | UUID primary keys (distributed-friendly) |

## Usage

```bash
# Create the schema
psql -d your_database -f schema.sql

# Or with Docker
docker run -d --name uod-db \
  -e POSTGRES_DB=uod \
  -e POSTGRES_PASSWORD=secret \
  -p 5432:5432 \
  postgres:16

docker exec -i uod-db psql -U postgres -d uod < schema.sql
```

## Table Overview

| Category | Tables |
|:---|:---|
| Party & Organization | `party`, `person`, `organization`, `org_unit`, `role` |
| Capability & Process | `capability`, `process`, `activity` |
| Business Objects | `business_object` |
| Data & Systems | `data_object`, `system_application` |
| Governance | `policy`, `rule`, `control`, `risk` |
| Decision & Measurement | `event`, `decision`, `goal`, `kpi` |
| Market & Channel | `location`, `channel`, `market_segment` |
| Junction (Relations) | `party_role`, `role_capability`, `capability_process`, etc. |
