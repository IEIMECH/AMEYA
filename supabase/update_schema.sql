-- =====================================================================
-- AMEYA '26 // SIMPLIFIED UNIFIED REGISTRATIONS SCHEMA
-- Stores ONLY the form fields + Unique Generated ID
-- =====================================================================

-- 1. Create the clean unified registrations table
DROP TABLE IF EXISTS public.registrations CASCADE;

CREATE TABLE public.registrations (
    id VARCHAR(64) PRIMARY KEY,                  -- Uniquely Generated ID (e.g. AMEYA-2026-AUTO-9253)
    event_name VARCHAR(128) NOT NULL,             -- Event Name (e.g. AutoCAD, RC Car Challenge)
    full_name VARCHAR(255) NOT NULL,              -- Full Name
    branch VARCHAR(128) NOT NULL,                 -- Branch / Department
    college_roll_number VARCHAR(64) NOT NULL,     -- College Roll Number
    email VARCHAR(255) NOT NULL,                  -- Email ID
    phone VARCHAR(32) NOT NULL,                   -- Phone Number
    college_id_card_url TEXT,                     -- College ID Card Image URL
    verified_at TIMESTAMPTZ DEFAULT NULL,         -- Attendance check-in timestamp
    verified_by VARCHAR(128) DEFAULT NULL,        -- Coordinator who checked in attendee
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW() -- Registration timestamp
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- 3. Public registrations insert policy
CREATE POLICY "Allow public insert registrations"
ON public.registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 4. Public/Service read policy for ticket verification & admin portal
CREATE POLICY "Allow public select registrations"
ON public.registrations
FOR SELECT
TO anon, authenticated
USING (true);

-- 5. Service role full access for attendance management
CREATE POLICY "Allow service role full access"
ON public.registrations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 6. Storage Bucket for ID Cards (if not already created)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('college_ids', 'college_ids', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/jpg'])
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Allow public upload college_ids"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'college_ids');

CREATE POLICY "Allow public read college_ids"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'college_ids');

-- =====================================================================
-- 7. (OPTIONAL) CLEAN UP OLD MULTI-TABLE ARTIFACTS
-- Run this if you want to remove the old 8 event-specific tables from your Supabase sidebar
-- =====================================================================
DROP VIEW IF EXISTS public.all_registrations CASCADE;
DROP TABLE IF EXISTS public.reg_autocad CASCADE;
DROP TABLE IF EXISTS public.reg_assemble_disassemble CASCADE;
DROP TABLE IF EXISTS public.reg_rc_car_challenge CASCADE;
DROP TABLE IF EXISTS public.reg_picto CASCADE;
DROP TABLE IF EXISTS public.reg_engineering_drawing CASCADE;
DROP TABLE IF EXISTS public.reg_identify_tools CASCADE;
DROP TABLE IF EXISTS public.reg_treasure_hunt CASCADE;
DROP TABLE IF EXISTS public.reg_nuts_bolts_speed_race CASCADE;
