-- ═══════════════════════════════════════════════════════════════════════════════
-- Universal Enterprise Ontology Core — PostgreSQL DDL Binding
-- L0 Platform Binding for L1 Core v1.0.0
-- ═══════════════════════════════════════════════════════════════════════════════
-- 
-- This schema maps L1 core classes to relational tables.
-- Design choices:
--   - Each core class → one table
--   - Inheritance (parent) → foreign key to parent table via shared PK
--   - Object properties → foreign key columns or junction tables (M:N)
--   - Bilingual labels → label_zh + label_en columns
--   - All tables use UUID primary keys for distributed compatibility
-- ═══════════════════════════════════════════════════════════════════════════════

-- Enable UUID extension (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Party & Organization ────────────────────────────────────────────────────

CREATE TABLE party (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    party_type  VARCHAR(20) NOT NULL CHECK (party_type IN ('Person', 'Organization')),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE person (
    id          UUID PRIMARY KEY REFERENCES party(id) ON DELETE CASCADE,
    -- Person-specific fields can be added here
    first_name  VARCHAR(100),
    last_name   VARCHAR(100),
    email       VARCHAR(255)
);

CREATE TABLE organization (
    id          UUID PRIMARY KEY REFERENCES party(id) ON DELETE CASCADE,
    -- Organization-specific fields
    legal_name  VARCHAR(500),
    industry    VARCHAR(100)
);

CREATE TABLE org_unit (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    belongs_to  UUID NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    parent_unit UUID REFERENCES org_unit(id),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE role (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Relation: Party plays Role (M:N)
CREATE TABLE party_role (
    party_id    UUID NOT NULL REFERENCES party(id) ON DELETE CASCADE,
    role_id     UUID NOT NULL REFERENCES role(id) ON DELETE CASCADE,
    context     TEXT,
    PRIMARY KEY (party_id, role_id)
);

-- ─── Capability & Process ────────────────────────────────────────────────────

CREATE TABLE capability (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Relation: Role is accountable for Capability (M:N)
CREATE TABLE role_capability (
    role_id       UUID NOT NULL REFERENCES role(id) ON DELETE CASCADE,
    capability_id UUID NOT NULL REFERENCES capability(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, capability_id)
);

CREATE TABLE process (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Relation: Capability realized by Process (M:N)
CREATE TABLE capability_process (
    capability_id UUID NOT NULL REFERENCES capability(id) ON DELETE CASCADE,
    process_id    UUID NOT NULL REFERENCES process(id) ON DELETE CASCADE,
    PRIMARY KEY (capability_id, process_id)
);

CREATE TABLE activity (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    process_id  UUID NOT NULL REFERENCES process(id) ON DELETE CASCADE,
    seq_order   INT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Business Objects ────────────────────────────────────────────────────────

CREATE TABLE business_object (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    obj_type    VARCHAR(30) NOT NULL CHECK (obj_type IN ('ProductService', 'Asset', 'Other')),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    owner_id    UUID REFERENCES party(id),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Data & Systems ──────────────────────────────────────────────────────────

CREATE TABLE data_object (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    obj_type    VARCHAR(30) NOT NULL CHECK (obj_type IN ('DataObject', 'DocumentRecord')),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE system_application (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Relation: DataObject recorded in SystemApplication (M:N)
CREATE TABLE data_system (
    data_id     UUID NOT NULL REFERENCES data_object(id) ON DELETE CASCADE,
    system_id   UUID NOT NULL REFERENCES system_application(id) ON DELETE CASCADE,
    PRIMARY KEY (data_id, system_id)
);

-- Relation: Process consumes/produces DataObject (M:N)
CREATE TABLE process_data (
    process_id  UUID NOT NULL REFERENCES process(id) ON DELETE CASCADE,
    data_id     UUID NOT NULL REFERENCES data_object(id) ON DELETE CASCADE,
    direction   VARCHAR(10) NOT NULL CHECK (direction IN ('consumes', 'produces')),
    PRIMARY KEY (process_id, data_id, direction)
);

-- ─── Governance & Compliance ─────────────────────────────────────────────────

CREATE TABLE policy (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE rule (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE control (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE risk (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Relation: Risk mitigated by Control (M:N)
CREATE TABLE risk_control (
    risk_id     UUID NOT NULL REFERENCES risk(id) ON DELETE CASCADE,
    control_id  UUID NOT NULL REFERENCES control(id) ON DELETE CASCADE,
    PRIMARY KEY (risk_id, control_id)
);

-- Relation: Process governed by Policy (M:N)
CREATE TABLE process_policy (
    process_id  UUID NOT NULL REFERENCES process(id) ON DELETE CASCADE,
    policy_id   UUID NOT NULL REFERENCES policy(id) ON DELETE CASCADE,
    PRIMARY KEY (process_id, policy_id)
);

-- Relation: Process constrained by Rule (M:N)
CREATE TABLE process_rule (
    process_id  UUID NOT NULL REFERENCES process(id) ON DELETE CASCADE,
    rule_id     UUID NOT NULL REFERENCES rule(id) ON DELETE CASCADE,
    PRIMARY KEY (process_id, rule_id)
);

-- ─── Decision & Measurement ──────────────────────────────────────────────────

CREATE TABLE event (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    occurred_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Relation: Event triggered by Process (M:N)
CREATE TABLE event_process (
    event_id    UUID NOT NULL REFERENCES event(id) ON DELETE CASCADE,
    process_id  UUID NOT NULL REFERENCES process(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, process_id)
);

CREATE TABLE decision (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Relation: Process requires Decision (M:N)
CREATE TABLE process_decision (
    process_id  UUID NOT NULL REFERENCES process(id) ON DELETE CASCADE,
    decision_id UUID NOT NULL REFERENCES decision(id) ON DELETE CASCADE,
    PRIMARY KEY (process_id, decision_id)
);

CREATE TABLE goal (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Relation: Capability supports Goal (M:N)
CREATE TABLE capability_goal (
    capability_id UUID NOT NULL REFERENCES capability(id) ON DELETE CASCADE,
    goal_id       UUID NOT NULL REFERENCES goal(id) ON DELETE CASCADE,
    PRIMARY KEY (capability_id, goal_id)
);

CREATE TABLE kpi (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    goal_id     UUID REFERENCES goal(id),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Market & Channel ────────────────────────────────────────────────────────

CREATE TABLE location (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    latitude    DECIMAL(10, 7),
    longitude   DECIMAL(10, 7),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE channel (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    channel_type VARCHAR(50),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE market_segment (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes for common queries ──────────────────────────────────────────────

CREATE INDEX idx_party_type ON party(party_type);
CREATE INDEX idx_org_unit_belongs ON org_unit(belongs_to);
CREATE INDEX idx_activity_process ON activity(process_id);
CREATE INDEX idx_business_object_owner ON business_object(owner_id);
CREATE INDEX idx_kpi_goal ON kpi(goal_id);
