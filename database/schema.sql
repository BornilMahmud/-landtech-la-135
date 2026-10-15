-- ============================================================================
-- SetuLand (সেতু-ল্যান্ড): National Smart Registry & Automated e-Mutation Engine
-- Track P4: Digital Land Records, Verification & Digitization (LandTech 2026)
-- Target: PostgreSQL 15+ / Supabase Relational Schema with Row-Level Security
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. Citizens Database (Verified via Porichoy EC API Mock)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS citizens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dummy_nid VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'DUMMY-NID-2026-XXXX'
    name_en VARCHAR(150) NOT NULL,
    name_bn VARCHAR(150) NOT NULL,
    father_name_en VARCHAR(150),
    father_name_bn VARCHAR(150),
    phone VARCHAR(30) NOT NULL,            -- e.g., '01700-00000X'
    verified_biometric BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_citizens_nid ON citizens(dummy_nid);

-- ----------------------------------------------------------------------------
-- 2. Master Khatians (Record of Rights / Porcha)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS khatian_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    khatian_no VARCHAR(50) NOT NULL,       -- e.g., 'BS-1001' or 'BS-1001/A'
    parent_rs_khatian VARCHAR(50) NOT NULL,-- e.g., 'RS-310'
    district_en VARCHAR(100) NOT NULL,
    district_bn VARCHAR(100) NOT NULL,
    upazila_en VARCHAR(100) NOT NULL,
    upazila_bn VARCHAR(100) NOT NULL,
    mouza_en VARCHAR(100) NOT NULL,
    mouza_bn VARCHAR(100) NOT NULL,
    jl_no VARCHAR(30) NOT NULL,
    dag_no VARCHAR(50) NOT NULL,           -- e.g., '405'
    land_class_en VARCHAR(100) NOT NULL,
    land_class_bn VARCHAR(100) NOT NULL,
    owner_id UUID REFERENCES citizens(id) ON DELETE RESTRICT,
    total_area_decimals NUMERIC(10, 4) NOT NULL CHECK (total_area_decimals >= 0),
    locked_area_decimals NUMERIC(10, 4) NOT NULL DEFAULT 0.0000 CHECK (locked_area_decimals >= 0),
    official_rate_per_decimal_bdt NUMERIC(15, 2) NOT NULL DEFAULT 800000.00,
    
    -- Module 1: Ejmali Joint Co-Sharer & Section 96 SAT Act Pre-Emption
    is_ejmali_property BOOLEAN DEFAULT FALSE,
    co_sharers JSONB DEFAULT '[]'::jsonb, -- Array of {citizen_id, name_en, name_bn, share_fraction, share_label_bn, max_owned_decimals, locked_decimals}
    pre_emption_notice_sent BOOLEAN DEFAULT FALSE,

    -- Module 2: Land Development Tax (Khajna) Clearance & Digital Dakhila
    ld_tax_paid_upto VARCHAR(50) DEFAULT '1433 BS (2026)',
    ld_tax_arrear_bdt NUMERIC(15, 2) DEFAULT 0.00,
    dakhila_receipt_no VARCHAR(50),

    -- Institutional Locks (Rule Book Section 4)
    is_mortgaged BOOLEAN DEFAULT FALSE,
    mortgage_bank_en VARCHAR(150),
    mortgage_bank_bn VARCHAR(150),
    mortgage_loan_amount_bdt NUMERIC(15, 2),
    
    has_court_case BOOLEAN DEFAULT FALSE,
    court_case_no VARCHAR(100),
    court_details_en TEXT,
    court_details_bn TEXT,

    is_dc_acquisition BOOLEAN DEFAULT FALSE,
    dc_project_name_en VARCHAR(200),
    dc_project_name_bn VARCHAR(200),

    -- Cadastral GIS & Module 4 Cryptographic Hash-Chain
    svg_path TEXT NOT NULL,
    label_x INTEGER NOT NULL DEFAULT 200,
    label_y INTEGER NOT NULL DEFAULT 150,
    block_index INTEGER DEFAULT 1,
    previous_hash CHAR(64) DEFAULT '0000000000000000000000000000000000000000000000000000000000000000',
    record_hash CHAR(64) NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_khatian_area_balance CHECK (locked_area_decimals <= total_area_decimals)
);

CREATE INDEX idx_khatians_lookup ON khatian_records(khatian_no, dag_no);
CREATE INDEX idx_khatians_owner ON khatian_records(owner_id);
CREATE INDEX idx_khatians_hash ON khatian_records(record_hash);
CREATE INDEX idx_khatians_ejmali ON khatian_records(is_ejmali_property);

-- ----------------------------------------------------------------------------
-- 3. Chain-of-Title Historical Lineage (CS -> SA -> RS -> BS)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lineage_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    khatian_id UUID REFERENCES khatian_records(id) ON DELETE CASCADE,
    survey_type VARCHAR(10) NOT NULL CHECK (survey_type IN ('CS', 'SA', 'RS', 'BS')),
    khatian_no VARCHAR(50) NOT NULL,
    dag_no VARCHAR(50) NOT NULL,
    recorded_owner_en VARCHAR(150) NOT NULL,
    recorded_owner_bn VARCHAR(150) NOT NULL,
    area_decimals NUMERIC(10, 4) NOT NULL,
    year_recorded INTEGER NOT NULL,
    verified_match BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lineage_khatian ON lineage_records(khatian_id);

-- ----------------------------------------------------------------------------
-- 4. Registered Deeds (Sub-Registry Office Execution)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS deeds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deed_no VARCHAR(50) UNIQUE NOT NULL,   -- e.g., 'DEED-2026-9001'
    khatian_id UUID REFERENCES khatian_records(id) ON DELETE RESTRICT,
    khatian_no VARCHAR(50) NOT NULL,
    dag_no VARCHAR(50) NOT NULL,
    mouza_en VARCHAR(100) NOT NULL,
    mouza_bn VARCHAR(100) NOT NULL,
    seller_id UUID REFERENCES citizens(id) ON DELETE RESTRICT,
    buyer_id UUID REFERENCES citizens(id) ON DELETE RESTRICT,
    transfer_area_decimals NUMERIC(10, 4) NOT NULL CHECK (transfer_area_decimals > 0),
    sale_price_bdt NUMERIC(15, 2) NOT NULL,

    -- Unified Revenue Breakdown
    declared_value_bdt NUMERIC(15, 2) NOT NULL,
    minimum_govt_value_bdt NUMERIC(15, 2) NOT NULL,
    assessable_value_bdt NUMERIC(15, 2) NOT NULL,
    stamp_duty_bdt NUMERIC(15, 2) NOT NULL,       -- 1.5%
    registration_fee_bdt NUMERIC(15, 2) NOT NULL, -- 1.0%
    local_govt_tax_bdt NUMERIC(15, 2) NOT NULL,    -- 3.0%
    source_tax_gain_bdt NUMERIC(15, 2) NOT NULL,   -- 4.0%
    bundled_e_mutation_fee_bdt NUMERIC(15, 2) NOT NULL DEFAULT 1170.00,
    bundled_khajna_arrear_bdt NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    total_payable_bdt NUMERIC(15, 2) NOT NULL,

    -- Module 3: Statutory Digital LT Notice (Section 89 SAT Act 1950)
    lt_notice_no VARCHAR(50),
    statutory_lt_packet JSONB,
    pre_emption_notice_sent BOOLEAN DEFAULT FALSE,
    dakhila_receipt_no VARCHAR(50),

    -- Module 4: Cryptographic Merkle Hash-Chain
    block_index INTEGER DEFAULT 1,
    previous_hash CHAR(64) DEFAULT '0000000000000000000000000000000000000000000000000000000000000000',
    deed_hash CHAR(64) NOT NULL,
    linked_mutation_tracking_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_deeds_khatian ON deeds(khatian_id);
CREATE INDEX idx_deeds_buyer ON deeds(buyer_id);
CREATE INDEX idx_deeds_hash ON deeds(deed_hash);
CREATE INDEX idx_deeds_lt_notice ON deeds(lt_notice_no);

-- ----------------------------------------------------------------------------
-- 5. Automated e-Mutation Workflow (AC Land Secretariat)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mutations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'MUT-2026-5001'
    case_no VARCHAR(50) NOT NULL,            -- e.g., 'MISC-CASE-2026-114'
    deed_id UUID REFERENCES deeds(id) ON DELETE RESTRICT,
    deed_no VARCHAR(50) NOT NULL,
    source_khatian_id UUID REFERENCES khatian_records(id) ON DELETE RESTRICT,
    source_khatian_no VARCHAR(50) NOT NULL,
    dag_no VARCHAR(50) NOT NULL,
    seller_id UUID REFERENCES citizens(id) ON DELETE RESTRICT,
    buyer_id UUID REFERENCES citizens(id) ON DELETE RESTRICT,
    transfer_area_decimals NUMERIC(10, 4) NOT NULL,
    stage VARCHAR(50) NOT NULL DEFAULT 'STAGE_3_AUTO_SENT_TO_AC_LAND',

    -- Module 6: Statutory 28-Day SLA Countdown & Anti-Harassment Escalation
    sla_target_days INTEGER DEFAULT 7,
    statutory_max_days INTEGER DEFAULT 28,
    days_elapsed INTEGER DEFAULT 1,
    sla_escalation_status VARCHAR(50) DEFAULT 'ON_TRACK', -- 'ON_TRACK', 'WARNING_ADC_NOTIFIED', 'ESCALATED_TO_ADC_REVENUE'
    lt_notice_no VARCHAR(50),
    dakhila_receipt_no VARCHAR(50),

    tahsil_report_note_en TEXT,
    tahsil_report_note_bn TEXT,
    tahsil_verified_at TIMESTAMP WITH TIME ZONE,
    ac_land_approved_at TIMESTAMP WITH TIME ZONE,
    issued_new_khatian_no VARCHAR(50),
    issued_new_khatian_id UUID REFERENCES khatian_records(id),
    seller_remaining_decimals_after_split NUMERIC(10, 4),
    mutation_hash CHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mutations_tracking ON mutations(tracking_id);
CREATE INDEX idx_mutations_stage ON mutations(stage);
CREATE INDEX idx_mutations_sla ON mutations(sla_escalation_status);

-- ----------------------------------------------------------------------------
-- 6. Immutable Blockchain-Style Audit Ledger
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    block_index INTEGER DEFAULT 1,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    event_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    details_en TEXT NOT NULL,
    details_bn TEXT NOT NULL,
    actor_role VARCHAR(100) NOT NULL,
    actor_name VARCHAR(150) NOT NULL,
    previous_hash CHAR(64) DEFAULT '0000000000000000000000000000000000000000000000000000000000000000',
    prev_hash CHAR(64) NOT NULL,
    current_hash CHAR(64) NOT NULL
);

CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_hash ON audit_logs(current_hash);
CREATE INDEX idx_audit_block ON audit_logs(block_index);

-- ----------------------------------------------------------------------------
-- 7. Automated PL/pgSQL Triggers
-- ----------------------------------------------------------------------------

-- Trigger A: Anti-Double-Selling Escrow Lock on Deed Registration
CREATE OR REPLACE FUNCTION trg_lock_area_on_deed()
RETURNS TRIGGER AS $$
DECLARE
    v_available NUMERIC(10, 4);
BEGIN
    SELECT (total_area_decimals - locked_area_decimals)
    INTO v_available
    FROM khatian_records
    WHERE id = NEW.khatian_id;

    IF NEW.transfer_area_decimals > v_available THEN
        RAISE EXCEPTION 'FRAUD BLOCKED: Requested % decimals exceeds available % decimals on Khatian',
            NEW.transfer_area_decimals, v_available;
    END IF;

    UPDATE khatian_records
    SET locked_area_decimals = locked_area_decimals + NEW.transfer_area_decimals,
        last_updated = CURRENT_TIMESTAMP
    WHERE id = NEW.khatian_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_enforce_deed_escrow_lock
AFTER INSERT ON deeds
FOR EACH ROW EXECUTE FUNCTION trg_lock_area_on_deed();

-- Trigger B: Automated Khatian Split upon AC Land Mutation Approval
CREATE OR REPLACE FUNCTION trg_execute_khatian_split()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stage = 'STAGE_5_MUTATION_APPROVED_KHATIAN_ISSUED' AND OLD.stage != 'STAGE_5_MUTATION_APPROVED_KHATIAN_ISSUED' THEN
        -- Deduct from seller's parent khatian
        UPDATE khatian_records
        SET total_area_decimals = total_area_decimals - NEW.transfer_area_decimals,
            locked_area_decimals = GREATEST(0, locked_area_decimals - NEW.transfer_area_decimals),
            last_updated = CURRENT_TIMESTAMP
        WHERE id = NEW.source_khatian_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_split_khatian_on_approval
AFTER UPDATE ON mutations
FOR EACH ROW EXECUTE FUNCTION trg_execute_khatian_split();
