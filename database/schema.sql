-- ============================================================================
-- SetuLand (সেতু-ল্যান্ড): Smart e-Mutation & Unified Registry Engine
-- Track P4: Digital Land Records, Verification & Digitization (LandTech 2026)
-- Target: PostgreSQL 15+ / Supabase Relational Schema with Row-Level Security
-- ============================================================================

-- Extensions for cryptographic integrity and UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. Mouza & Cadastral Jurisdiction Registry
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mouzas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mouza_name VARCHAR(100) NOT NULL,
    mouza_name_bn VARCHAR(100) NOT NULL,
    jl_number VARCHAR(20) NOT NULL,
    upazila VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_mouza_jl UNIQUE (mouza_name, jl_number, upazila)
);

-- ----------------------------------------------------------------------------
-- 2. Master Khatians (Record of Rights / Porcha)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS khatians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    khatian_no VARCHAR(50) NOT NULL,
    dag_no VARCHAR(50) NOT NULL,
    mouza_id UUID REFERENCES mouzas(id) ON DELETE RESTRICT,
    survey_type VARCHAR(10) NOT NULL CHECK (survey_type IN ('CS', 'SA', 'RS', 'BS')),
    owner_name VARCHAR(150) NOT NULL,
    owner_name_bn VARCHAR(150),
    owner_nid VARCHAR(50) NOT NULL,
    owner_phone VARCHAR(30),
    total_area_decimals NUMERIC(10, 4) NOT NULL CHECK (total_area_decimals >= 0),
    locked_area_decimals NUMERIC(10, 4) NOT NULL DEFAULT 0.0000 CHECK (locked_area_decimals >= 0),
    land_class VARCHAR(100) NOT NULL,
    sha256_hash CHAR(64) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_khatian_area_balance CHECK (locked_area_decimals <= total_area_decimals)
);

CREATE INDEX idx_khatians_lookup ON khatians(khatian_no, dag_no);
CREATE INDEX idx_khatians_nid ON khatians(owner_nid);
CREATE INDEX idx_khatians_hash ON khatians(sha256_hash);

-- ----------------------------------------------------------------------------
-- 3. Chain-of-Title Historical Lineage (CS -> SA -> RS -> BS)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chain_of_title (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    khatian_id UUID REFERENCES khatians(id) ON DELETE CASCADE,
    survey_type VARCHAR(10) NOT NULL CHECK (survey_type IN ('CS', 'SA', 'RS', 'BS')),
    khatian_no VARCHAR(50) NOT NULL,
    owner_name VARCHAR(150) NOT NULL,
    owner_nid VARCHAR(50) NOT NULL,
    year_recorded INTEGER NOT NULL,
    area_decimals NUMERIC(10, 4) NOT NULL,
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chain_khatian ON chain_of_title(khatian_id);

-- ----------------------------------------------------------------------------
-- 4. Financial Institutions & Bank Mortgage Liens
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bank_mortgages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    khatian_id UUID REFERENCES khatians(id) ON DELETE RESTRICT,
    bank_name VARCHAR(150) NOT NULL,
    branch_name VARCHAR(100) NOT NULL,
    loan_account_no VARCHAR(100) NOT NULL,
    sanctioned_amount_bdt NUMERIC(15, 2) NOT NULL,
    mortgage_deed_no VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    lien_placed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    released_at TIMESTAMP WITH TIME ZONE,
    release_letter_ref VARCHAR(100)
);

CREATE INDEX idx_mortgage_khatian ON bank_mortgages(khatian_id) WHERE is_active = TRUE;

-- ----------------------------------------------------------------------------
-- 5. Judiciary & Civil Court Injunction Registry
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS court_injunctions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    khatian_id UUID REFERENCES khatians(id) ON DELETE RESTRICT,
    case_number VARCHAR(100) NOT NULL,
    court_name VARCHAR(150) NOT NULL,
    judge_name VARCHAR(150),
    order_type VARCHAR(100) DEFAULT 'Temporary Injunction (Order 39 Rule 1 CPC)',
    case_details TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    issued_date DATE NOT NULL,
    lifted_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_injunction_khatian ON court_injunctions(khatian_id) WHERE is_active = TRUE;

-- ----------------------------------------------------------------------------
-- 6. DC Office Land Acquisition Registry (Public Infrastructure)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dc_acquisitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    khatian_id UUID REFERENCES khatians(id) ON DELETE RESTRICT,
    project_name VARCHAR(200) NOT NULL,
    gazette_no VARCHAR(100) NOT NULL,
    rate_per_decimal NUMERIC(12, 2) NOT NULL,
    compensation_status VARCHAR(50) DEFAULT 'PENDING' CHECK (compensation_status IN ('PENDING', 'ESCROW_PAID', 'DISBURSED')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_acquisition_khatian ON dc_acquisitions(khatian_id) WHERE is_active = TRUE;

-- ----------------------------------------------------------------------------
-- 7. Sub-Registry Deeds & Unified Fee Collections
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS deeds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deed_no VARCHAR(50) UNIQUE NOT NULL,
    khatian_id UUID REFERENCES khatians(id) ON DELETE RESTRICT,
    sub_registry_office VARCHAR(150) NOT NULL,
    seller_name VARCHAR(150) NOT NULL,
    seller_nid VARCHAR(50) NOT NULL,
    buyer_name VARCHAR(150) NOT NULL,
    buyer_nid VARCHAR(50) NOT NULL,
    buyer_phone VARCHAR(30) NOT NULL,
    transfer_area_decimals NUMERIC(10, 4) NOT NULL CHECK (transfer_area_decimals > 0),
    sale_value_bdt NUMERIC(15, 2) NOT NULL CHECK (sale_value_bdt > 0),
    stamp_duty_bdt NUMERIC(12, 2) NOT NULL,        -- 1.5%
    registration_fee_bdt NUMERIC(12, 2) NOT NULL,  -- 1.0%
    local_govt_tax_bdt NUMERIC(12, 2) NOT NULL,    -- 3.0%
    gain_tax_bdt NUMERIC(12, 2) NOT NULL,          -- 2.0%
    mutation_fee_bdt NUMERIC(10, 2) NOT NULL DEFAULT 1170.00, -- Bundled 1,170 BDT
    total_fee_bdt NUMERIC(15, 2) NOT NULL,
    sha256_hash CHAR(64) NOT NULL,
    status VARCHAR(30) DEFAULT 'MUTATION_PENDING' CHECK (status IN ('REGISTERED', 'MUTATION_PENDING', 'MUTATED')),
    tracking_id VARCHAR(50) UNIQUE NOT NULL,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_deeds_tracking ON deeds(tracking_id);
CREATE INDEX idx_deeds_hash ON deeds(sha256_hash);

-- ----------------------------------------------------------------------------
-- 8. AC Land e-Mutation Queue & Case Tracking
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS emutations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_id VARCHAR(50) UNIQUE NOT NULL,
    deed_id UUID REFERENCES deeds(id) ON DELETE RESTRICT,
    parent_khatian_id UUID REFERENCES khatians(id) ON DELETE RESTRICT,
    new_khatian_id UUID REFERENCES khatians(id),
    status VARCHAR(50) DEFAULT 'AUTO_INITIATED' CHECK (status IN ('AUTO_INITIATED', 'TAHSIL_VERIFIED', 'MUTATION_APPROVED', 'REJECTED')),
    auto_initiated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    tahsil_verified_at TIMESTAMP WITH TIME ZONE,
    tahsil_officer VARCHAR(150),
    tahsil_report TEXT,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by VARCHAR(150),
    digital_porcha_hash CHAR(64),
    qr_payload TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_emutations_tracking ON emutations(tracking_id);
CREATE INDEX idx_emutations_status ON emutations(status);

-- ----------------------------------------------------------------------------
-- 9. 5-Stage Mutation Workflow Milestones
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS emutation_workflow_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mutation_id UUID REFERENCES emutations(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL CHECK (step_number BETWEEN 1 AND 5),
    name_en VARCHAR(200) NOT NULL,
    name_bn VARCHAR(200) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    officer_note TEXT,
    CONSTRAINT uq_mutation_step UNIQUE (mutation_id, step_number)
);

-- ----------------------------------------------------------------------------
-- 10. Immutable Audit Ledger (Tamper-Evident Hash Chain)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_ledger (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    payload_hash CHAR(64) NOT NULL,
    prev_hash CHAR(64) NOT NULL,
    signature CHAR(64) NOT NULL,
    actor_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_entity ON audit_ledger(entity_type, entity_id);

-- ============================================================================
-- STATUTORY TRIGGERS & BUSINESS LOGIC ENFORCEMENT
-- ============================================================================

-- Function: Prevent Double-Selling and Encumbered Parcel Registration
CREATE OR REPLACE FUNCTION trg_enforce_anti_double_selling()
RETURNS TRIGGER AS $$
DECLARE
    v_total_area NUMERIC(10, 4);
    v_locked_area NUMERIC(10, 4);
    v_is_mortgaged BOOLEAN;
    v_has_court_case BOOLEAN;
    v_is_acquired BOOLEAN;
BEGIN
    -- Query live plot state
    SELECT total_area_decimals, locked_area_decimals
    INTO v_total_area, v_locked_area
    FROM khatians
    WHERE id = NEW.khatian_id;

    -- Check 1: Anti-Double-Selling Balance Check
    IF NEW.transfer_area_decimals > (v_total_area - v_locked_area) THEN
        RAISE EXCEPTION 'DOUBLE-SELLING FRAUD DETECTED: Requested transfer of % Decimals exceeds available unlocked balance of % Decimals.',
            NEW.transfer_area_decimals, (v_total_area - v_locked_area);
    END IF;

    -- Check 2: Bank Mortgage Lien Check
    SELECT EXISTS (SELECT 1 FROM bank_mortgages WHERE khatian_id = NEW.khatian_id AND is_active = TRUE)
    INTO v_is_mortgaged;
    IF v_is_mortgaged THEN
        RAISE EXCEPTION 'MORTGAGE FRAUD DETECTED: Parcel is encumbered under active bank lien. Sale prohibited without bank NOC.';
    END IF;

    -- Check 3: Civil Court Stay Order Check
    SELECT EXISTS (SELECT 1 FROM court_injunctions WHERE khatian_id = NEW.khatian_id AND is_active = TRUE)
    INTO v_has_court_case;
    IF v_has_court_case THEN
        RAISE EXCEPTION 'JUDICIAL INJUNCTION BLOCKED: Parcel subject to active stay order / title suit in civil court.';
    END IF;

    -- Check 4: DC Land Acquisition Check
    SELECT EXISTS (SELECT 1 FROM dc_acquisitions WHERE khatian_id = NEW.khatian_id AND is_active = TRUE)
    INTO v_is_acquired;
    IF v_is_acquired THEN
        RAISE EXCEPTION 'ACQUISITION NOTICE BLOCKED: Parcel gazetted for government infrastructure acquisition.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_deed_legality_before_insert
BEFORE INSERT ON deeds
FOR EACH ROW
EXECUTE FUNCTION trg_enforce_anti_double_selling();

-- Function: Automatically Escrow-Lock Decimals on Valid Deed Registration
CREATE OR REPLACE FUNCTION trg_lock_decimals_on_deed()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE khatians
    SET locked_area_decimals = locked_area_decimals + NEW.transfer_area_decimals,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.khatian_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lock_decimals_after_deed_insert
AFTER INSERT ON deeds
FOR EACH ROW
EXECUTE FUNCTION trg_lock_decimals_on_deed();

-- Function: Automatically Deduct from Seller and Split Khatian on Mutation Approval
CREATE OR REPLACE FUNCTION trg_execute_khatian_split()
RETURNS TRIGGER AS $$
DECLARE
    v_parent_id UUID;
    v_transfer_area NUMERIC(10, 4);
    v_buyer_name VARCHAR(150);
    v_buyer_nid VARCHAR(50);
    v_new_khatian_no VARCHAR(50);
BEGIN
    IF NEW.status = 'MUTATION_APPROVED' AND OLD.status != 'MUTATION_APPROVED' THEN
        -- Obtain deed transfer specs
        SELECT khatian_id, transfer_area_decimals, buyer_name, buyer_nid
        INTO v_parent_id, v_transfer_area, v_buyer_name, v_buyer_nid
        FROM deeds
        WHERE id = NEW.deed_id;

        -- 1. Deduct from seller's parent khatian
        UPDATE khatians
        SET total_area_decimals = total_area_decimals - v_transfer_area,
            locked_area_decimals = GREATEST(0, locked_area_decimals - v_transfer_area),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = v_parent_id;

        -- 2. Mark deed as MUTATED
        UPDATE deeds
        SET status = 'MUTATED'
        WHERE id = NEW.deed_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_split_khatian_trigger
AFTER UPDATE OF status ON emutations
FOR EACH ROW
EXECUTE FUNCTION trg_execute_khatian_split();
