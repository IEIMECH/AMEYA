-- ==============================================================================
-- AMEYA '26 — ROW LEVEL SECURITY (RLS) HARDENING SCRIPT
-- ==============================================================================
-- Run this script in your Supabase Project SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
--
-- PURPOSE:
-- 1. Closes public data leaks where anonymous users could dump participant PII.
-- 2. Restricts read access strictly to the server-side service role.
-- 3. Preserves public registration and contact form submissions without design/flow interruption.
-- ==============================================================================

-- 1. Secure Registrations Table
ALTER TABLE IF EXISTS public.registrations ENABLE ROW LEVEL SECURITY;

-- Revoke insecure public select policies
DROP POLICY IF EXISTS "Allow public select registrations" ON public.registrations;
DROP POLICY IF EXISTS "Allow public read registrations" ON public.registrations;

-- Keep public registration submissions enabled
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'registrations' AND policyname = 'Allow public insert registrations') THEN
        CREATE POLICY "Allow public insert registrations" ON public.registrations
        FOR INSERT TO anon, authenticated
        WITH CHECK (true);
    END IF;
END $$;

-- Enforce service-role-only read & management access
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'registrations' AND policyname = 'Allow service role full access') THEN
        CREATE POLICY "Allow service role full access" ON public.registrations
        FOR ALL TO service_role
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

-- 2. Secure Contact Inquiries Table
ALTER TABLE IF EXISTS public.inquiries ENABLE ROW LEVEL SECURITY;

-- Revoke insecure public reading of inquiries
DROP POLICY IF EXISTS "Allow public read inquiries" ON public.inquiries;

-- Keep public inquiry submission enabled
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'inquiries' AND policyname = 'Allow public insert inquiries') THEN
        CREATE POLICY "Allow public insert inquiries" ON public.inquiries
        FOR INSERT TO anon, authenticated
        WITH CHECK (true);
    END IF;
END $$;

-- Enforce service-role-only access for inquiries management
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'inquiries' AND policyname = 'Allow service role read inquiries') THEN
        CREATE POLICY "Allow service role read inquiries" ON public.inquiries
        FOR ALL TO service_role
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

-- ==============================================================================
-- Verification Query
-- ==============================================================================
SELECT tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename IN ('registrations', 'inquiries');
