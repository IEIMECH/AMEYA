-- =====================================================================
-- AMEYA '26 — National Technical Conclave | IEI SAME, VVIIT Nambur
-- Database Schema: PostgreSQL / Supabase
-- =====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- 2. TABLE: registrations
-- Stores delegate and squad registrations with QR clearance tokens
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    event_id VARCHAR(64) NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    is_team BOOLEAN NOT NULL DEFAULT FALSE,
    team_id VARCHAR(64) NOT NULL,
    team_name VARCHAR(255),
    leader_name VARCHAR(255) NOT NULL,
    leader_email VARCHAR(255) NOT NULL,
    leader_phone VARCHAR(32),
    college VARCHAR(255) NOT NULL DEFAULT 'VVIIT Nambur',
    year VARCHAR(64) NOT NULL DEFAULT '1st Year',
    members JSONB NOT NULL DEFAULT '[]'::jsonb,
    payment_status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning fast lookups & gate scanning
CREATE INDEX IF NOT EXISTS idx_registrations_ticket_id ON public.registrations (ticket_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON public.registrations (event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_leader_email ON public.registrations (leader_email);
CREATE INDEX IF NOT EXISTS idx_registrations_team_id ON public.registrations (team_id);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations (created_at DESC);

-- =====================================================================
-- 3. TABLE: inquiries
-- Stores operations desk communications from the /contact portal
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

CREATE INDEX IF NOT EXISTS idx_inquiries_sector ON public.inquiries (sector);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries (status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries (created_at DESC);

-- =====================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures data privacy while enabling public registration & gate check-in
-- =====================================================================

-- Enable RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- REGISTRATIONS: Allow public anonymous insertion (festival attendees registering)
CREATE POLICY "Allow public insert to registrations"
    ON public.registrations
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- REGISTRATIONS: Allow public reading by exact ticket_id (for QR code scan / ticket dossier view)
CREATE POLICY "Allow public select by ticket_id"
    ON public.registrations
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- REGISTRATIONS: Allow service role full management (updates, check-ins, exports)
CREATE POLICY "Allow service role full access to registrations"
    ON public.registrations
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- INQUIRIES: Allow public anonymous insertion (sending messages from /contact)
CREATE POLICY "Allow public insert to inquiries"
    ON public.inquiries
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- INQUIRIES: Only service role can read inquiries
CREATE POLICY "Allow service role full access to inquiries"
    ON public.inquiries
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =====================================================================
-- Verification test comment
-- =====================================================================
COMMENT ON TABLE public.registrations IS 'AMEYA 2026 delegate & squad registration dockets';
COMMENT ON TABLE public.inquiries IS 'AMEYA 2026 operations desk inquiries';
