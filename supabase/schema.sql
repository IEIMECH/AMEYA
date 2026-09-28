-- =====================================================================
-- AMEYA '26 // OFFICIAL SUPABASE MULTI-TABLE DATABASE SCHEMA
-- Dedicated tables for each official competition arena (All 8 Solo Events)
-- Zero destructive operations, full Row Level Security (RLS) enabled
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- 1. AUTOCAD (Technical // Day 1)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_autocad (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    registration_id VARCHAR(64) NOT NULL,
    event_id VARCHAR(64) NOT NULL DEFAULT 'autocad',
    event_name VARCHAR(128) NOT NULL DEFAULT 'AutoCAD',
    participant_name VARCHAR(255) NOT NULL,
    branch VARCHAR(128) NOT NULL,
    college_roll_number VARCHAR(64) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    college_id_card_url VARCHAR(512),
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reg_autocad ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_autocad' AND policyname = 'Allow public insert autocad') THEN
        CREATE POLICY "Allow public insert autocad" ON public.reg_autocad FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_autocad' AND policyname = 'Allow service read autocad') THEN
        CREATE POLICY "Allow service read autocad" ON public.reg_autocad FOR SELECT TO service_role USING (true);
    END IF;
END $$;

-- =====================================================================
-- 2. ASSEMBLE AND DISASSEMBLE THE MECHANICAL PARTS (Technical // Day 1)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_assemble_disassemble (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    registration_id VARCHAR(64) NOT NULL,
    event_id VARCHAR(64) NOT NULL DEFAULT 'assemble-disassemble',
    event_name VARCHAR(128) NOT NULL DEFAULT 'Assemble and Disassemble the Mechanical Parts',
    participant_name VARCHAR(255) NOT NULL,
    branch VARCHAR(128) NOT NULL,
    college_roll_number VARCHAR(64) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    college_id_card_url VARCHAR(512),
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reg_assemble_disassemble ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_assemble_disassemble' AND policyname = 'Allow public insert assemble') THEN
        CREATE POLICY "Allow public insert assemble" ON public.reg_assemble_disassemble FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_assemble_disassemble' AND policyname = 'Allow service read assemble') THEN
        CREATE POLICY "Allow service read assemble" ON public.reg_assemble_disassemble FOR SELECT TO service_role USING (true);
    END IF;
END $$;

-- =====================================================================
-- 3. RC CAR CHALLENGE (Non-technical // Day 1)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_rc_car_challenge (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    registration_id VARCHAR(64) NOT NULL,
    event_id VARCHAR(64) NOT NULL DEFAULT 'rc-car-challenge',
    event_name VARCHAR(128) NOT NULL DEFAULT 'RC Car Challenge',
    participant_name VARCHAR(255) NOT NULL,
    branch VARCHAR(128) NOT NULL,
    college_roll_number VARCHAR(64) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    college_id_card_url VARCHAR(512),
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reg_rc_car_challenge ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_rc_car_challenge' AND policyname = 'Allow public insert rccar') THEN
        CREATE POLICY "Allow public insert rccar" ON public.reg_rc_car_challenge FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_rc_car_challenge' AND policyname = 'Allow service read rccar') THEN
        CREATE POLICY "Allow service read rccar" ON public.reg_rc_car_challenge FOR SELECT TO service_role USING (true);
    END IF;
END $$;

-- =====================================================================
-- 4. PICTO (Non-technical // Day 1)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_picto (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    registration_id VARCHAR(64) NOT NULL,
    event_id VARCHAR(64) NOT NULL DEFAULT 'picto',
    event_name VARCHAR(128) NOT NULL DEFAULT 'Picto',
    participant_name VARCHAR(255) NOT NULL,
    branch VARCHAR(128) NOT NULL,
    college_roll_number VARCHAR(64) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    college_id_card_url VARCHAR(512),
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reg_picto ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_picto' AND policyname = 'Allow public insert picto') THEN
        CREATE POLICY "Allow public insert picto" ON public.reg_picto FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_picto' AND policyname = 'Allow service read picto') THEN
        CREATE POLICY "Allow service read picto" ON public.reg_picto FOR SELECT TO service_role USING (true);
    END IF;
END $$;

-- =====================================================================
-- 5. ENGINEERING DRAWING (Technical // Day 2)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_engineering_drawing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    registration_id VARCHAR(64) NOT NULL,
    event_id VARCHAR(64) NOT NULL DEFAULT 'engineering-drawing',
    event_name VARCHAR(128) NOT NULL DEFAULT 'Engineering Drawing',
    participant_name VARCHAR(255) NOT NULL,
    branch VARCHAR(128) NOT NULL,
    college_roll_number VARCHAR(64) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    college_id_card_url VARCHAR(512),
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reg_engineering_drawing ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_engineering_drawing' AND policyname = 'Allow public insert engdraw') THEN
        CREATE POLICY "Allow public insert engdraw" ON public.reg_engineering_drawing FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_engineering_drawing' AND policyname = 'Allow service read engdraw') THEN
        CREATE POLICY "Allow service read engdraw" ON public.reg_engineering_drawing FOR SELECT TO service_role USING (true);
    END IF;
END $$;

-- =====================================================================
-- 6. IDENTIFY THE TOOLS & ITS FUNCTION (Technical // Day 2)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_identify_tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    registration_id VARCHAR(64) NOT NULL,
    event_id VARCHAR(64) NOT NULL DEFAULT 'identify-tools',
    event_name VARCHAR(128) NOT NULL DEFAULT 'Identify the tools & its function',
    participant_name VARCHAR(255) NOT NULL,
    branch VARCHAR(128) NOT NULL,
    college_roll_number VARCHAR(64) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    college_id_card_url VARCHAR(512),
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reg_identify_tools ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_identify_tools' AND policyname = 'Allow public insert tools') THEN
        CREATE POLICY "Allow public insert tools" ON public.reg_identify_tools FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_identify_tools' AND policyname = 'Allow service read tools') THEN
        CREATE POLICY "Allow service read tools" ON public.reg_identify_tools FOR SELECT TO service_role USING (true);
    END IF;
END $$;

-- =====================================================================
-- 7. TREASURE HUNT (Non-technical // Day 2)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_treasure_hunt (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    registration_id VARCHAR(64) NOT NULL,
    event_id VARCHAR(64) NOT NULL DEFAULT 'treasure-hunt',
    event_name VARCHAR(128) NOT NULL DEFAULT 'Treasure Hunt',
    participant_name VARCHAR(255) NOT NULL,
    branch VARCHAR(128) NOT NULL,
    college_roll_number VARCHAR(64) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    college_id_card_url VARCHAR(512),
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reg_treasure_hunt ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_treasure_hunt' AND policyname = 'Allow public insert treasure') THEN
        CREATE POLICY "Allow public insert treasure" ON public.reg_treasure_hunt FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_treasure_hunt' AND policyname = 'Allow service read treasure') THEN
        CREATE POLICY "Allow service read treasure" ON public.reg_treasure_hunt FOR SELECT TO service_role USING (true);
    END IF;
END $$;

-- =====================================================================
-- 8. NUTS AND BOLTS SPEED RACE (Non-technical // Day 2)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.reg_nuts_bolts_speed_race (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    registration_id VARCHAR(64) NOT NULL,
    event_id VARCHAR(64) NOT NULL DEFAULT 'nuts-and-bolts-speed-race',
    event_name VARCHAR(128) NOT NULL DEFAULT 'Nuts and Bolts Speed Race',
    participant_name VARCHAR(255) NOT NULL,
    branch VARCHAR(128) NOT NULL,
    college_roll_number VARCHAR(64) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    college_id_card_url VARCHAR(512),
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reg_nuts_bolts_speed_race ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_nuts_bolts_speed_race' AND policyname = 'Allow public insert nutsbolts') THEN
        CREATE POLICY "Allow public insert nutsbolts" ON public.reg_nuts_bolts_speed_race FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reg_nuts_bolts_speed_race' AND policyname = 'Allow service read nutsbolts') THEN
        CREATE POLICY "Allow service read nutsbolts" ON public.reg_nuts_bolts_speed_race FOR SELECT TO service_role USING (true);
    END IF;
END $$;

-- =====================================================================
-- 9. GENERAL REGISTRATIONS (Fallback & Unified Storage)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    registration_id VARCHAR(64),
    event_id VARCHAR(64) NOT NULL,
    event_name VARCHAR(128) NOT NULL,
    participant_name VARCHAR(255) NOT NULL,
    leader_name VARCHAR(255),
    branch VARCHAR(128),
    college_roll_number VARCHAR(64),
    email VARCHAR(255) NOT NULL,
    leader_email VARCHAR(255),
    phone VARCHAR(32),
    leader_phone VARCHAR(32),
    college VARCHAR(255) DEFAULT 'VVITU Nambur',
    college_id_card_url VARCHAR(512),
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'registrations' AND policyname = 'Allow public insert registrations') THEN
        CREATE POLICY "Allow public insert registrations" ON public.registrations FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'registrations' AND policyname = 'Allow service read registrations') THEN
        CREATE POLICY "Allow service read registrations" ON public.registrations FOR SELECT TO service_role USING (true);
    END IF;
END $$;

-- =====================================================================
-- 10. INQUIRIES & CONTACT DISPATCH
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
-- 11. STORAGE BUCKET: college_ids (Private & Restricted)
-- =====================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('college_ids', 'college_ids', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/jpg'])
ON CONFLICT (id) DO NOTHING;

-- Prevent public access to private college ID storage bucket
CREATE POLICY "Allow service role full access to college_ids"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'college_ids')
WITH CHECK (bucket_id = 'college_ids');

-- =====================================================================
-- 12. MASTER UNIFIED VIEW: all_registrations
-- Aggregates all 8 competition tables for gate verification
-- =====================================================================
DROP VIEW IF EXISTS public.all_registrations CASCADE;
CREATE VIEW public.all_registrations AS
SELECT 'autocad' AS event_id, 'AutoCAD' AS event_name, ticket_id, participant_name, branch, college_roll_number, email, phone, college_id_card_url, verified_at, verified_by, created_at, 'reg_autocad' AS table_source FROM public.reg_autocad
UNION ALL
SELECT 'assemble-disassemble' AS event_id, 'Assemble and Disassemble the Mechanical Parts' AS event_name, ticket_id, participant_name, branch, college_roll_number, email, phone, college_id_card_url, verified_at, verified_by, created_at, 'reg_assemble_disassemble' AS table_source FROM public.reg_assemble_disassemble
UNION ALL
SELECT 'rc-car-challenge' AS event_id, 'RC Car Challenge' AS event_name, ticket_id, participant_name, branch, college_roll_number, email, phone, college_id_card_url, verified_at, verified_by, created_at, 'reg_rc_car_challenge' AS table_source FROM public.reg_rc_car_challenge
UNION ALL
SELECT 'picto' AS event_id, 'Picto' AS event_name, ticket_id, participant_name, branch, college_roll_number, email, phone, college_id_card_url, verified_at, verified_by, created_at, 'reg_picto' AS table_source FROM public.reg_picto
UNION ALL
SELECT 'engineering-drawing' AS event_id, 'Engineering Drawing' AS event_name, ticket_id, participant_name, branch, college_roll_number, email, phone, college_id_card_url, verified_at, verified_by, created_at, 'reg_engineering_drawing' AS table_source FROM public.reg_engineering_drawing
UNION ALL
SELECT 'identify-tools' AS event_id, 'Identify the tools & its function' AS event_name, ticket_id, participant_name, branch, college_roll_number, email, phone, college_id_card_url, verified_at, verified_by, created_at, 'reg_identify_tools' AS table_source FROM public.reg_identify_tools
UNION ALL
SELECT 'treasure-hunt' AS event_id, 'Treasure Hunt' AS event_name, ticket_id, participant_name, branch, college_roll_number, email, phone, college_id_card_url, verified_at, verified_by, created_at, 'reg_treasure_hunt' AS table_source FROM public.reg_treasure_hunt
UNION ALL
SELECT 'nuts-and-bolts-speed-race' AS event_id, 'Nuts and Bolts Speed Race' AS event_name, ticket_id, participant_name, branch, college_roll_number, email, phone, college_id_card_url, verified_at, verified_by, created_at, 'reg_nuts_bolts_speed_race' AS table_source FROM public.reg_nuts_bolts_speed_race;

COMMENT ON VIEW public.all_registrations IS 'Unified view combining all 8 official competition tables';
