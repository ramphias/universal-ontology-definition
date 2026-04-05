-- ═══════════════════════════════════════════════════════════════════════════════
-- Universal Enterprise Ontology Core — PostgreSQL DDL Binding
-- L0 Platform Binding for L1 Core v2.0.0
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- v2.0 Changes:
--   - Replaced business_object table with resource table
--   - Renamed document_record → document
--   - Removed demoted classes (activity, decision, location, channel, market_segment)
--   - Merged belongs_to/composed_of → part_of relation
--   - Generalized governance relations: process_governance replaces process_policy + process_rule
--   - Added abstract domain marker columns where applicable
-- ═══════════════════════════════════════════════════════════════════════════════

-- Enable UUID extension (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Abstract Domain: Entity > Party ────────────────────────────────────────

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
    first_name  VARCHAR(100),
    last_name   VARCHAR(100),
    email       VARCHAR(255)
);

CREATE TABLE organization (
    id          UUID PRIMARY KEY REFERENCES party(id) ON DELETE CASCADE,
    legal_name  VARCHAR(500),
    industry    VARCHAR(100)
);

CREATE TABLE org_unit (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    part_of     UUID NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    parent_unit UUID REFERENCES org_unit(id),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Abstract Domain: Entity > Resource ─────────────────────────────────────

CREATE TABLE resource (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_type   VARCHAR(30) NOT NULL CHECK (resource_type IN (
        'ProductService', 'Asset', 'DataObject', 'Document', 'SystemApplication', 'Other'
    )),
    label_zh        VARCHAR(255) NOT NULL,
    label_en        VARCHAR(255) NOT NULL,
    definition      TEXT,
    owner_id        UUID REFERENCES party(id),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Subtype tables for specific resource kinds
CREATE TABLE product_service (
    id UUID PRIMARY KEY REFERENCES resource(id) ON DELETE CASCADE
    -- product-specific fields
);

CREATE TABLE asset (
    id UUID PRIMARY KEY REFERENCES resource(id) ON DELETE CASCADE
    -- asset-specific fields
);

CREATE TABLE data_object (
    id UUID PRIMARY KEY REFERENCES resource(id) ON DELETE CASCADE
    -- data-specific fields
);

CREATE TABLE document (
    id UUID PRIMARY KEY REFERENCES resource(id) ON DELETE CASCADE
    -- document-specific fields
);

CREATE TABLE system_application (
    id UUID PRIMARY KEY REFERENCES resource(id) ON DELETE CASCADE
    -- system-specific fields
);

-- ─── Abstract Domain: Operational ───────────────────────────────────────────

CREATE TABLE role (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE capability (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE process (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    parent_process UUID REFERENCES process(id),  -- part_of: sub-process hierarchy
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE event (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    occurred_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Abstract Domain: Governance ────────────────────────────────────────────

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

-- ─── Abstract Domain: Measurement ───────────────────────────────────────────

CREATE TABLE goal (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE kpi (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label_zh    VARCHAR(255) NOT NULL,
    label_en    VARCHAR(255) NOT NULL,
    definition  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- JUNCTION TABLES (Relations) — v2.0 Generalized
-- ═══════════════════════════════════════════════════════════════════════════════

-- plays_role: Party ↔ Role (M:N)
CREATE TABLE party_role (
    party_id    UUID NOT NULL REFERENCES party(id) ON DELETE CASCADE,
    role_id     UUID NOT NULL REFERENCES role(id) ON DELETE CASCADE,
    context     TEXT,
    PRIMARY KEY (party_id, role_id)
);

-- owns: Party → Resource (1:N via resource.owner_id FK above)

-- accountable_for: Role ↔ Capability (M:N) — generalized from is_accountable_for
CREATE TABLE role_accountability (
    role_id       UUID NOT NULL REFERENCES role(id) ON DELETE CASCADE,
    capability_id UUID NOT NULL REFERENCES capability(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, capability_id)
);

-- realized_by: Capability ↔ Process (M:N)
CREATE TABLE capability_process (
    capability_id UUID NOT NULL REFERENCES capability(id) ON DELETE CASCADE,
    process_id    UUID NOT NULL REFERENCES process(id) ON DELETE CASCADE,
    PRIMARY KEY (capability_id, process_id)
);

-- consumes / produces: Process ↔ Resource (M:N) — generalized range from DataObject to Resource
CREATE TABLE process_resource (
    process_id    UUID NOT NULL REFERENCES process(id) ON DELETE CASCADE,
    resource_id   UUID NOT NULL REFERENCES resource(id) ON DELETE CASCADE,
    direction     VARCHAR(10) NOT NULL CHECK (direction IN ('consumes', 'produces')),
    PRIMARY KEY (process_id, resource_id, direction)
);

-- recorded_in: DataObject ↔ SystemApplication (M:N)
CREATE TABLE data_system (
    data_id     UUID NOT NULL REFERENCES resource(id) ON DELETE CASCADE,
    system_id   UUID NOT NULL REFERENCES resource(id) ON DELETE CASCADE,
    PRIMARY KEY (data_id, system_id)
);

-- governed_by: Operational ↔ Governance (M:N) — unified governance relation
-- Uses a generic pattern: subject + governance_type + governance_id
CREATE TABLE operational_governance (
    subject_type    VARCHAR(20) NOT NULL CHECK (subject_type IN ('Role', 'Capability', 'Process', 'Event')),
    subject_id      UUID NOT NULL,
    governance_type VARCHAR(20) NOT NULL CHECK (governance_type IN ('Policy', 'Rule', 'Control')),
    governance_id   UUID NOT NULL,
    PRIMARY KEY (subject_type, subject_id, governance_type, governance_id)
);

-- mitigated_by: Risk ↔ Control (M:N)
CREATE TABLE risk_control (
    risk_id     UUID NOT NULL REFERENCES risk(id) ON DELETE CASCADE,
    control_id  UUID NOT NULL REFERENCES control(id) ON DELETE CASCADE,
    PRIMARY KEY (risk_id, control_id)
);

-- triggered_by: Event ↔ Process (M:N)
CREATE TABLE event_process (
    event_id    UUID NOT NULL REFERENCES event(id) ON DELETE CASCADE,
    process_id  UUID NOT NULL REFERENCES process(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, process_id)
);

-- measured_by: Operational ↔ KPI (M:N) — generalized domain
CREATE TABLE operational_kpi (
    subject_type VARCHAR(20) NOT NULL CHECK (subject_type IN ('Role', 'Capability', 'Process', 'Event', 'Goal')),
    subject_id   UUID NOT NULL,
    kpi_id       UUID NOT NULL REFERENCES kpi(id) ON DELETE CASCADE,
    PRIMARY KEY (subject_type, subject_id, kpi_id)
);

-- ─── Indexes ────────────────────────────────────────────────────────────────

CREATE INDEX idx_party_type ON party(party_type);
CREATE INDEX idx_org_unit_part_of ON org_unit(part_of);
CREATE INDEX idx_resource_type ON resource(resource_type);
CREATE INDEX idx_resource_owner ON resource(owner_id);
CREATE INDEX idx_process_parent ON process(parent_process);
