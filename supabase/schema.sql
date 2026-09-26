-- =====================================================================
-- AMEYA '26 — National Technical Conclave | IEI SAME, VVIIT Nambur
-- Database Schema: Separate Event Tables & Visitor Registry
-- =====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- 2. EVENT 1: HackSprint 24H (reg_hacksprint)
-- Rapid hardware-software prototyping sprint (Teams 2-4)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_hacksprint (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    team_id VARCHAR(64) NOT NULL,
    team_name VARCHAR(255) NOT NULL,
    leader_name VARCHAR(255) NOT NULL,
    leader_email VARCHAR(255) NOT NULL,
    leader_phone VARCHAR(32) NOT NULL,
    college VARCHAR(255) NOT NULL,
    year VARCHAR(64) NOT NULL,
    members JSONB NOT NULL DEFAULT '[]'::jsonb,
    domain_track VARCHAR(128) NOT NULL DEFAULT 'Automation & Robotics',
    project_title VARCHAR(255),
    proposal_synopsis TEXT,
    hardware_requirements TEXT,
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- 3. EVENT 2: Tech Manuscript (reg_tech_manuscript)
-- Research paper defense & publication (Teams 1-2)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_tech_manuscript (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    team_id VARCHAR(64) NOT NULL,
    team_name VARCHAR(255),
    leader_name VARCHAR(255) NOT NULL,
    leader_email VARCHAR(255) NOT NULL,
    leader_phone VARCHAR(32) NOT NULL,
    college VARCHAR(255) NOT NULL,
    year VARCHAR(64) NOT NULL,
    members JSONB NOT NULL DEFAULT '[]'::jsonb,
    paper_title VARCHAR(255) NOT NULL,
    research_track VARCHAR(128) NOT NULL DEFAULT 'Machine Design & Dynamics',
    abstract_text TEXT,
    drive_link VARCHAR(512),
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- 4. EVENT 3: CAD Clash (reg_cad_clash)
-- Speed CAD assembly & tolerance modeling (Solo)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_cad_clash (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    team_id VARCHAR(64) NOT NULL,
    leader_name VARCHAR(255) NOT NULL,
    leader_email VARCHAR(255) NOT NULL,
    leader_phone VARCHAR(32) NOT NULL,
    college VARCHAR(255) NOT NULL,
    year VARCHAR(64) NOT NULL,
    software_preference VARCHAR(128) NOT NULL DEFAULT 'SolidWorks',
    experience_level VARCHAR(64) NOT NULL DEFAULT 'Intermediate',
    bringing_own_laptop BOOLEAN NOT NULL DEFAULT TRUE,
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- 5. EVENT 4: Robo Rumble (reg_robo_rumble)
-- RC Combat & Obstacle Warfare (Teams 2-4)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_robo_rumble (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    team_id VARCHAR(64) NOT NULL,
    team_name VARCHAR(255) NOT NULL,
    leader_name VARCHAR(255) NOT NULL,
    leader_email VARCHAR(255) NOT NULL,
    leader_phone VARCHAR(32) NOT NULL,
    college VARCHAR(255) NOT NULL,
    year VARCHAR(64) NOT NULL,
    members JSONB NOT NULL DEFAULT '[]'::jsonb,
    bot_name VARCHAR(255) NOT NULL,
    weight_category VARCHAR(64) NOT NULL DEFAULT 'Featherweight <15kg',
    drive_system VARCHAR(64) NOT NULL DEFAULT '4WD',
    weapon_mechanism VARCHAR(128) NOT NULL DEFAULT 'Spinner',
    frequency_band VARCHAR(128) NOT NULL DEFAULT '2.4GHz Spread Spectrum',
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- 6. EVENT 5: Circuit Breaker (reg_circuit_breaker)
-- Fault diagnosis, PLC, mechatronics loops (Solo)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_circuit_breaker (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    team_id VARCHAR(64) NOT NULL,
    leader_name VARCHAR(255) NOT NULL,
    leader_email VARCHAR(255) NOT NULL,
    leader_phone VARCHAR(32) NOT NULL,
    college VARCHAR(255) NOT NULL,
    year VARCHAR(64) NOT NULL,
    preferred_controller VARCHAR(128) NOT NULL DEFAULT 'Arduino / AVR',
    lab_experience VARCHAR(128) NOT NULL DEFAULT 'Academic Coursework',
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- 7. EVENT 6: Mech Brainiac Quiz (reg_mech_brainiac)
-- Technical kinematics & machine design quiz (Teams of 2)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_mech_brainiac (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    team_id VARCHAR(64) NOT NULL,
    team_name VARCHAR(255) NOT NULL,
    leader_name VARCHAR(255) NOT NULL,
    leader_email VARCHAR(255) NOT NULL,
    leader_phone VARCHAR(32) NOT NULL,
    college VARCHAR(255) NOT NULL,
    year VARCHAR(64) NOT NULL,
    members JSONB NOT NULL DEFAULT '[]'::jsonb,
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- 8. EVENT 7: Gear Hunt Conundrum (reg_gear_hunt)
-- Mechanical scavenger hunt (Teams 3-5)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_gear_hunt (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    team_id VARCHAR(64) NOT NULL,
    team_name VARCHAR(255) NOT NULL,
    leader_name VARCHAR(255) NOT NULL,
    leader_email VARCHAR(255) NOT NULL,
    leader_phone VARCHAR(32) NOT NULL,
    college VARCHAR(255) NOT NULL,
    year VARCHAR(64) NOT NULL,
    members JSONB NOT NULL DEFAULT '[]'::jsonb,
    emergency_contact VARCHAR(32),
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- 9. EVENT 8: Industrial Lens Photography (reg_industrial_lens)
-- Machine photography & manufacturing craft (Solo)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_industrial_lens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    team_id VARCHAR(64) NOT NULL,
    leader_name VARCHAR(255) NOT NULL,
    leader_email VARCHAR(255) NOT NULL,
    leader_phone VARCHAR(32) NOT NULL,
    college VARCHAR(255) NOT NULL,
    year VARCHAR(64) NOT NULL,
    device_type VARCHAR(64) NOT NULL DEFAULT 'DSLR / Mirrorless',
    camera_model VARCHAR(128),
    portfolio_link VARCHAR(512),
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- 10. EVENT 9: Iron Tongue Debate (reg_iron_tongue)
-- Technical debate on robotics, AI, energy (Solo)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_iron_tongue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    team_id VARCHAR(64) NOT NULL,
    leader_name VARCHAR(255) NOT NULL,
    leader_email VARCHAR(255) NOT NULL,
    leader_phone VARCHAR(32) NOT NULL,
    college VARCHAR(255) NOT NULL,
    year VARCHAR(64) NOT NULL,
    topic_preference VARCHAR(128) NOT NULL DEFAULT 'Autonomous Manufacturing',
    prior_debate_experience VARCHAR(64) NOT NULL DEFAULT 'First Time',
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- 11. GENERAL FEST ATTENDEES: Fest Visitors Pass (fest_visitors)
-- Non-competitor visitor passes for attending exhibitions, talks, quad
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.fest_visitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    visitor_id VARCHAR(64) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    college VARCHAR(255) NOT NULL,
    year VARCHAR(64) NOT NULL,
    attending_days VARCHAR(64) NOT NULL DEFAULT 'Both Days (Oct 04–05)',
    areas_of_interest JSONB NOT NULL DEFAULT '["Keynote Lectures", "Robotics Arena Spectator", "Project Expo"]'::jsonb,
    purpose_of_visit TEXT,
    payment_status VARCHAR(32) NOT NULL DEFAULT 'free',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- 12. TABLE: inquiries (Communications from /contact desk)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sector VARCHAR(64) NOT NULL DEFAULT 'general',
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'unread',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- 13. MASTER UNIFIED VIEW: all_registrations
-- Aggregates all separate tables for the campus QR gate scanner
-- =====================================================================
CREATE OR REPLACE VIEW public.all_registrations AS
SELECT 'hackathon' AS event_id, 'HackSprint 24H' AS event_name, ticket_id, team_id, team_name, leader_name, leader_email, leader_phone, college, year, members, verified_at, verified_by, created_at, 'reg_hacksprint' AS table_source FROM public.reg_hacksprint
UNION ALL
SELECT 'paper-presentation', 'Tech Manuscript', ticket_id, team_id, team_name, leader_name, leader_email, leader_phone, college, year, members, verified_at, verified_by, created_at, 'reg_tech_manuscript' FROM public.reg_tech_manuscript
UNION ALL
SELECT 'cad-design', 'CAD Clash Speed Modeling', ticket_id, team_id, NULL, leader_name, leader_email, leader_phone, college, year, '[]'::jsonb, verified_at, verified_by, created_at, 'reg_cad_clash' FROM public.reg_cad_clash
UNION ALL
SELECT 'robo-race', 'Robo Rumble Combat & Race', ticket_id, team_id, team_name, leader_name, leader_email, leader_phone, college, year, members, verified_at, verified_by, created_at, 'reg_robo_rumble' FROM public.reg_robo_rumble
UNION ALL
SELECT 'circuit-debug', 'Circuit Breaker Mechatronics', ticket_id, team_id, NULL, leader_name, leader_email, leader_phone, college, year, '[]'::jsonb, verified_at, verified_by, created_at, 'reg_circuit_breaker' FROM public.reg_circuit_breaker
UNION ALL
SELECT 'quiz', 'Mech Brainiac', ticket_id, team_id, team_name, leader_name, leader_email, leader_phone, college, year, members, verified_at, verified_by, created_at, 'reg_mech_brainiac' FROM public.reg_mech_brainiac
UNION ALL
SELECT 'treasure-hunt', 'Gear Hunt Conundrum', ticket_id, team_id, team_name, leader_name, leader_email, leader_phone, college, year, members, verified_at, verified_by, created_at, 'reg_gear_hunt' FROM public.reg_gear_hunt
UNION ALL
SELECT 'photography', 'Industrial Lens Photography', ticket_id, team_id, NULL, leader_name, leader_email, leader_phone, college, year, '[]'::jsonb, verified_at, verified_by, created_at, 'reg_industrial_lens' FROM public.reg_industrial_lens
UNION ALL
SELECT 'debate', 'Iron Tongue Technical Debate', ticket_id, team_id, NULL, leader_name, leader_email, leader_phone, college, year, '[]'::jsonb, verified_at, verified_by, created_at, 'reg_iron_tongue' FROM public.reg_iron_tongue
UNION ALL
SELECT 'visitor-pass', 'Fest Visitor Pass', ticket_id, visitor_id, NULL, full_name, email, phone, college, year, '[]'::jsonb, verified_at, verified_by, created_at, 'fest_visitors' FROM public.fest_visitors;

-- =====================================================================
-- 14. ROW LEVEL SECURITY (RLS) FOR ALL SEPARATE TABLES
-- =====================================================================

DO $$ 
DECLARE
    tbl text;
    tables text[] := ARRAY[
        'reg_hacksprint', 'reg_tech_manuscript', 'reg_cad_clash', 
        'reg_robo_rumble', 'reg_circuit_breaker', 'reg_mech_brainiac', 
        'reg_gear_hunt', 'reg_industrial_lens', 'reg_iron_tongue', 
        'fest_visitors', 'inquiries'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Public insert on %I" ON public.%I;', tbl, tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Public read on %I" ON public.%I;', tbl, tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Service role all on %I" ON public.%I;', tbl, tbl);

        -- Public insert (for registration submission)
        EXECUTE format('CREATE POLICY "Public insert on %I" ON public.%I FOR INSERT TO anon, authenticated WITH CHECK (true);', tbl, tbl);
        -- Public read (for QR ticket lookup)
        EXECUTE format('CREATE POLICY "Public read on %I" ON public.%I FOR SELECT TO anon, authenticated USING (true);', tbl, tbl);
        -- Service role full access
        EXECUTE format('CREATE POLICY "Service role all on %I" ON public.%I FOR ALL TO service_role USING (true) WITH CHECK (true);', tbl, tbl);
    END LOOP;
END $$;

-- Verify
COMMENT ON VIEW public.all_registrations IS 'Unified view combining all event-specific tables and visitor passes';
