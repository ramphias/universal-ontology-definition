# SQL DDL Binding | PostgreSQL 映射绑定

The SQL binding converts the semantic graph into a relational database schema (DDL), allowing you to physically instantiate the ontology in standard SQL environments like PostgreSQL.

## How it works | 转换机制

- **PascalCase to snake_case**: Class names are flattened (e.g. `SystemApplication` becomes the `system_application` table).
- **Abstract Classes**: Abstract classes (like `Entity`, `Operational`) do not generate tables. They act as abstract logic anchors.
- **Concrete Classes**: Generates a standard table with a `UUID` primary key and default metadata tracking fields.
- **Relations**: N:M relations generate junction tables (e.g., `process_resource_consumes`).
- **Axioms**: Stored in a global `axiom` metadata table or converted into table-level constraints (like explicit domains/ranges).

## Example | 示例代码

```sql
-- Generated table for Organization
CREATE TABLE organization (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255),
    definition  TEXT,
    parent_id   UUID REFERENCES party(id),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
```
