-- ==============================================================================
-- AMEYA '26 — OFFICIAL EVENT NAMES SYNCHRONIZATION SCRIPT
-- ==============================================================================
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
--
-- UPDATED FESTIVAL EVENT LINEUP:
-- Day 1:
--   1. Arc of Genius — Engineering Drawings (Technical)
--   2. Mechanica: Reassembled — Assemble & Disassemble of Parts (Technical)
--   3. StarC Circuit — RC Car Challenge (Non-technical)
--   4. The Infinity Quest — Treasure Hunt (Non-technical)
--
-- Day 2:
--   5. Dimension X — AutoCAD (Technical)
--   6. The Armory — Identify Tools & Their Functions (Technical)
--   7. Mind Snap — Picto (Non-technical)
--   8. Bolt Rush — Nuts & Bolts Speed Race (Non-technical)
-- ==============================================================================

-- 1. Synchronize any existing registrations to the new official event names
UPDATE public.registrations
SET event_name = 'Arc of Genius'
WHERE event_name ILIKE '%Engineering Drawing%' OR event_name ILIKE '%Arc of Genius%';

UPDATE public.registrations
SET event_name = 'Mechanica: Reassembled'
WHERE event_name ILIKE '%Assemble%' OR event_name ILIKE '%Mechanica%';

UPDATE public.registrations
SET event_name = 'StarC Circuit'
WHERE event_name ILIKE '%RC Car%' OR event_name ILIKE '%StarC%';

UPDATE public.registrations
SET event_name = 'The Infinity Quest'
WHERE event_name ILIKE '%Treasure%' OR event_name ILIKE '%Infinity Quest%';

UPDATE public.registrations
SET event_name = 'Dimension X'
WHERE event_name ILIKE '%AutoCAD%' OR event_name ILIKE '%Dimension X%';

UPDATE public.registrations
SET event_name = 'The Armory'
WHERE event_name ILIKE '%Identify%Tool%' OR event_name ILIKE '%Armory%';

UPDATE public.registrations
SET event_name = 'Mind Snap'
WHERE event_name ILIKE '%Picto%' OR event_name ILIKE '%Mind Snap%';

UPDATE public.registrations
SET event_name = 'Bolt Rush'
WHERE event_name ILIKE '%Bolt%' OR event_name ILIKE '%Nuts%';

-- 2. Create sub-tables for individual event logging if multi-table pattern is active
CREATE TABLE IF NOT EXISTS public.reg_arc_of_genius (LIKE public.registrations INCLUDING ALL);
CREATE TABLE IF NOT EXISTS public.reg_mechanica_reassembled (LIKE public.registrations INCLUDING ALL);
CREATE TABLE IF NOT EXISTS public.reg_starc_circuit (LIKE public.registrations INCLUDING ALL);
CREATE TABLE IF NOT EXISTS public.reg_infinity_quest (LIKE public.registrations INCLUDING ALL);
CREATE TABLE IF NOT EXISTS public.reg_dimension_x (LIKE public.registrations INCLUDING ALL);
CREATE TABLE IF NOT EXISTS public.reg_the_armory (LIKE public.registrations INCLUDING ALL);
CREATE TABLE IF NOT EXISTS public.reg_mind_snap (LIKE public.registrations INCLUDING ALL);
CREATE TABLE IF NOT EXISTS public.reg_bolt_rush (LIKE public.registrations INCLUDING ALL);

-- 3. Verification query
SELECT DISTINCT event_name, COUNT(*) as registrant_count
FROM public.registrations
GROUP BY event_name
ORDER BY event_name;
