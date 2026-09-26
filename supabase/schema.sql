-- =====================================================================
-- AMEYA '26 // SUPABASE MULTI-TABLE DATABASE SCHEMA
-- Separate dedicated tables for each technical arena & fest visitor pass
-- Zero destructive operations, full Row Level Security (RLS) enabled
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- 1. HACKSPRINT 24H (hackathon)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_hacksprint (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    team_id VARCHAR(32) NOT NULL,
    team_name VARCHAR(128) NOT NULL,
    leader_name VARCHAR(255) NOT NULL,
    leader_email VARCHAR(255) NOT NULL,
    leader_phone VARCHAR(32) NOT NULL,
    college VARCHAR(255) NOT NULL,
    year VARCHAR(64) NOT NULL,
    members JSONB DEFAULT '[]'::jsonb,
    domain_track VARCHAR(128) DEFAULT 'Automation & Robotics',
    project_title VARCHAR(255),
    proposal_synopsis TEXT,
    hardware_requirements TEXT,
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reg_hacksprint ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_hacksprint' AND policyname = 'Allow public insert hacksprint') THEN
        CREATE POLICY "Allow public insert hacksprint" ON public.reg_hacksprint FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_hacksprint' AND policyname = 'Allow public read hacksprint') THEN
        CREATE POLICY "Allow public read hacksprint" ON public.reg_hacksprint FOR SELECT TO anon, authenticated USING (true);
    END IF;
END $$;

-- =====================================================================
-- 2. TECH MANUSCRIPT (paper-presentation)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_tech_manuscript (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    team_id VARCHAR(32) NOT NULL,
    team_name VARCHAR(128),
    leader_name VARCHAR(255) NOT NULL,
    leader_email VARCHAR(255) NOT NULL,
    leader_phone VARCHAR(32) NOT NULL,
    college VARCHAR(255) NOT NULL,
    year VARCHAR(64) NOT NULL,
    members JSONB DEFAULT '[]'::jsonb,
    paper_title VARCHAR(255),
    research_track VARCHAR(128) DEFAULT 'Thermal & Fluid Dynamics',
    abstract_text TEXT,
    manuscript_drive_link VARCHAR(512),
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reg_tech_manuscript ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_tech_manuscript' AND policyname = 'Allow public insert manuscript') THEN
        CREATE POLICY "Allow public insert manuscript" ON public.reg_tech_manuscript FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_tech_manuscript' AND policyname = 'Allow public read manuscript') THEN
        CREATE POLICY "Allow public read manuscript" ON public.reg_tech_manuscript FOR SELECT TO anon, authenticated USING (true);
    END IF;
END $$;

-- =====================================================================
-- 3. CAD CLASH (cad-design)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_cad_clash (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    team_id VARCHAR(32) NOT NULL,
    leader_name VARCHAR(255) NOT NULL,
    leader_email VARCHAR(255) NOT NULL,
    leader_phone VARCHAR(32) NOT NULL,
    college VARCHAR(255) NOT NULL,
    year VARCHAR(64) NOT NULL,
    cad_software VARCHAR(64) DEFAULT 'SolidWorks',
    cad_experience VARCHAR(64) DEFAULT 'Intermediate',
    bringing_own_laptop BOOLEAN DEFAULT true,
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reg_cad_clash ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_cad_clash' AND policyname = 'Allow public insert cad') THEN
        CREATE POLICY "Allow public insert cad" ON public.reg_cad_clash FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_cad_clash' AND policyname = 'Allow public read cad') THEN
        CREATE POLICY "Allow public read cad" ON public.reg_cad_clash FOR SELECT TO anon, authenticated USING (true);
    END IF;
END $$;

-- =====================================================================
-- 4. ROBO RUMBLE (robo-race)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_robo_rumble (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    team_id VARCHAR(32) NOT NULL,
    team_name VARCHAR(128) NOT NULL,
    leader_name VARCHAR(255) NOT NULL,
    leader_email VARCHAR(255) NOT NULL,
    leader_phone VARCHAR(32) NOT NULL,
    college VARCHAR(255) NOT NULL,
    year VARCHAR(64) NOT NULL,
    members JSONB DEFAULT '[]'::jsonb,
    bot_moniker VARCHAR(128),
    weight_class VARCHAR(64) DEFAULT 'Under 5kg (Standard Class)',
    drive_system VARCHAR(64) DEFAULT '4WD Skid Steer',
    weapon_mechanism VARCHAR(128),
    frequency_band VARCHAR(64) DEFAULT '2.4 GHz FHSS',
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reg_robo_rumble ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_robo_rumble' AND policyname = 'Allow public insert robo') THEN
        CREATE POLICY "Allow public insert robo" ON public.reg_robo_rumble FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_robo_rumble' AND policyname = 'Allow public read robo') THEN
        CREATE POLICY "Allow public read robo" ON public.reg_robo_rumble FOR SELECT TO anon, authenticated USING (true);
    END IF;
END $$;

-- =====================================================================
-- 5. CIRCUIT BREAKER (circuit-debug)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_circuit_breaker (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    team_id VARCHAR(32) NOT NULL,
    leader_name VARCHAR(255) NOT NULL,
    leader_email VARCHAR(255) NOT NULL,
    leader_phone VARCHAR(32) NOT NULL,
    college VARCHAR(255) NOT NULL,
    year VARCHAR(64) NOT NULL,
    controller_pref VARCHAR(64) DEFAULT 'Arduino / ATmega',
    lab_experience VARCHAR(64) DEFAULT 'Intermediate',
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reg_circuit_breaker ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_circuit_breaker' AND policyname = 'Allow public insert circuit') THEN
        CREATE POLICY "Allow public insert circuit" ON public.reg_circuit_breaker FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_circuit_breaker' AND policyname = 'Allow public read circuit') THEN
        CREATE POLICY "Allow public read circuit" ON public.reg_circuit_breaker FOR SELECT TO anon, authenticated USING (true);
    END IF;
END $$;

-- =====================================================================
-- 6. MECH BRAINIAC (quiz)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_mech_brainiac (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    team_id VARCHAR(32) NOT NULL,
    team_name VARCHAR(128) NOT NULL,
    leader_name VARCHAR(255) NOT NULL,
    leader_email VARCHAR(255) NOT NULL,
    leader_phone VARCHAR(32) NOT NULL,
    college VARCHAR(255) NOT NULL,
    year VARCHAR(64) NOT NULL,
    members JSONB DEFAULT '[]'::jsonb,
    sub_discipline VARCHAR(128) DEFAULT 'Core Mechanical & Manufacturing',
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reg_mech_brainiac ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_mech_brainiac' AND policyname = 'Allow public insert quiz') THEN
        CREATE POLICY "Allow public insert quiz" ON public.reg_mech_brainiac FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_mech_brainiac' AND policyname = 'Allow public read quiz') THEN
        CREATE POLICY "Allow public read quiz" ON public.reg_mech_brainiac FOR SELECT TO anon, authenticated USING (true);
    END IF;
END $$;

-- =====================================================================
-- 7. GEAR HUNT (treasure-hunt)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_gear_hunt (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    team_id VARCHAR(32) NOT NULL,
    team_name VARCHAR(128) NOT NULL,
    leader_name VARCHAR(255) NOT NULL,
    leader_email VARCHAR(255) NOT NULL,
    leader_phone VARCHAR(32) NOT NULL,
    college VARCHAR(255) NOT NULL,
    year VARCHAR(64) NOT NULL,
    members JSONB DEFAULT '[]'::jsonb,
    emergency_contact VARCHAR(32),
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reg_gear_hunt ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_gear_hunt' AND policyname = 'Allow public insert gear') THEN
        CREATE POLICY "Allow public insert gear" ON public.reg_gear_hunt FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_gear_hunt' AND policyname = 'Allow public read gear') THEN
        CREATE POLICY "Allow public read gear" ON public.reg_gear_hunt FOR SELECT TO anon, authenticated USING (true);
    END IF;
END $$;

-- =====================================================================
-- 8. INDUSTRIAL LENS (photography)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_industrial_lens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    team_id VARCHAR(32) NOT NULL,
    leader_name VARCHAR(255) NOT NULL,
    leader_email VARCHAR(255) NOT NULL,
    leader_phone VARCHAR(32) NOT NULL,
    college VARCHAR(255) NOT NULL,
    year VARCHAR(64) NOT NULL,
    device_type VARCHAR(64) DEFAULT 'DSLR / Mirrorless',
    camera_model VARCHAR(128),
    portfolio_link VARCHAR(512),
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reg_industrial_lens ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_industrial_lens' AND policyname = 'Allow public insert photo') THEN
        CREATE POLICY "Allow public insert photo" ON public.reg_industrial_lens FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_industrial_lens' AND policyname = 'Allow public read photo') THEN
        CREATE POLICY "Allow public read photo" ON public.reg_industrial_lens FOR SELECT TO anon, authenticated USING (true);
    END IF;
END $$;

-- =====================================================================
-- 9. IRON TONGUE (debate)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_iron_tongue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    team_id VARCHAR(32) NOT NULL,
    leader_name VARCHAR(255) NOT NULL,
    leader_email VARCHAR(255) NOT NULL,
    leader_phone VARCHAR(32) NOT NULL,
    college VARCHAR(255) NOT NULL,
    year VARCHAR(64) NOT NULL,
    debate_topic_pref VARCHAR(128) DEFAULT 'Autonomous Machines & Ethics',
    debate_experience VARCHAR(64) DEFAULT 'Collegiate / District Level',
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reg_iron_tongue ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_iron_tongue' AND policyname = 'Allow public insert debate') THEN
        CREATE POLICY "Allow public insert debate" ON public.reg_iron_tongue FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_iron_tongue' AND policyname = 'Allow public read debate') THEN
        CREATE POLICY "Allow public read debate" ON public.reg_iron_tongue FOR SELECT TO anon, authenticated USING (true);
    END IF;
END $$;

-- =====================================================================
-- 10. FEST VISITORS (General Pass / Non-Competitors)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.fest_visitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    visitor_id VARCHAR(32) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    college VARCHAR(255) DEFAULT 'General Delegate / Guest',
    year VARCHAR(64) DEFAULT 'Visitor Pass',
    attending_days VARCHAR(64) DEFAULT 'Both Days (Feb 27 & 28)',
    areas_of_interest JSONB DEFAULT '["Keynote Lectures", "Project Exhibitions"]'::jsonb,
    purpose_of_visit TEXT,
    payment_status VARCHAR(32) NOT NULL DEFAULT 'free',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.fest_visitors ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fest_visitors' AND policyname = 'Allow public insert visitor') THEN
        CREATE POLICY "Allow public insert visitor" ON public.fest_visitors FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fest_visitors' AND policyname = 'Allow public read visitor') THEN
        CREATE POLICY "Allow public read visitor" ON public.fest_visitors FOR SELECT TO anon, authenticated USING (true);
    END IF;
END $$;

-- =====================================================================
-- 11. INQUIRIES & CONTACT DISPATCH
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

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'inquiries' AND policyname = 'Allow public insert inquiries') THEN
        CREATE POLICY "Allow public insert inquiries" ON public.inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'inquiries' AND policyname = 'Allow public read inquiries') THEN
        CREATE POLICY "Allow public read inquiries" ON public.inquiries FOR SELECT TO anon, authenticated USING (true);
    END IF;
END $$;

-- =====================================================================
-- 12. MASTER UNIFIED VIEW: all_registrations
-- Aggregates all separate tables for the campus QR gate scanner
-- =====================================================================
CREATE OR REPLACE VIEW public.all_registrations AS
SELECT 'hackathon' AS event_id, 'HackSprint 24H' AS event_name, ticket_id, team_id, team_name, leader_name, leader_email, leader_phone, college, year, members, verified_at, verified_by, created_at, 'reg_hacksprint' AS table_source FROM public.reg_hacksprint
UNION ALL
SELECT 'paper-presentation' AS event_id, 'Tech Manuscript' AS event_name, ticket_id, team_id, team_name, leader_name, leader_email, leader_phone, college, year, members, verified_at, verified_by, created_at, 'reg_tech_manuscript' AS table_source FROM public.reg_tech_manuscript
UNION ALL
SELECT 'cad-design' AS event_id, 'CAD Clash Speed Modeling' AS event_name, ticket_id, team_id, NULL AS team_name, leader_name, leader_email, leader_phone, college, year, '[]'::jsonb AS members, verified_at, verified_by, created_at, 'reg_cad_clash' AS table_source FROM public.reg_cad_clash
UNION ALL
SELECT 'robo-race' AS event_id, 'Robo Rumble Combat & Race' AS event_name, ticket_id, team_id, team_name, leader_name, leader_email, leader_phone, college, year, members, verified_at, verified_by, created_at, 'reg_robo_rumble' AS table_source FROM public.reg_robo_rumble
UNION ALL
SELECT 'circuit-debug' AS event_id, 'Circuit Breaker Mechatronics' AS event_name, ticket_id, team_id, NULL AS team_name, leader_name, leader_email, leader_phone, college, year, '[]'::jsonb AS members, verified_at, verified_by, created_at, 'reg_circuit_breaker' AS table_source FROM public.reg_circuit_breaker
UNION ALL
SELECT 'quiz' AS event_id, 'Mech Brainiac' AS event_name, ticket_id, team_id, team_name, leader_name, leader_email, leader_phone, college, year, members, verified_at, verified_by, created_at, 'reg_mech_brainiac' AS table_source FROM public.reg_mech_brainiac
UNION ALL
SELECT 'treasure-hunt' AS event_id, 'Gear Hunt Conundrum' AS event_name, ticket_id, team_id, team_name, leader_name, leader_email, leader_phone, college, year, members, verified_at, verified_by, created_at, 'reg_gear_hunt' AS table_source FROM public.reg_gear_hunt
UNION ALL
SELECT 'photography' AS event_id, 'Industrial Lens Photography' AS event_name, ticket_id, team_id, NULL AS team_name, leader_name, leader_email, leader_phone, college, year, '[]'::jsonb AS members, verified_at, verified_by, created_at, 'reg_industrial_lens' AS table_source FROM public.reg_industrial_lens
UNION ALL
SELECT 'debate' AS event_id, 'Iron Tongue Technical Debate' AS event_name, ticket_id, team_id, NULL AS team_name, leader_name, leader_email, leader_phone, college, year, '[]'::jsonb AS members, verified_at, verified_by, created_at, 'reg_iron_tongue' AS table_source FROM public.reg_iron_tongue
UNION ALL
SELECT 'visitor-pass' AS event_id, 'Fest Visitor Pass' AS event_name, ticket_id, visitor_id AS team_id, NULL AS team_name, full_name AS leader_name, email AS leader_email, phone AS leader_phone, college, year, '[]'::jsonb AS members, verified_at, verified_by, created_at, 'fest_visitors' AS table_source FROM public.fest_visitors;

COMMENT ON VIEW public.all_registrations IS 'Unified view combining all event-specific tables and visitor passes';
