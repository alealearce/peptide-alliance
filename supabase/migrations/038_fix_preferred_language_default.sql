-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 038: Fix preferred_language default value
-- ═══════════════════════════════════════════════════════════════════════════════
-- PROBLEM: profiles.preferred_language defaults to 'es' (from InfoSylvita),
-- but migration 028 added CHECK (preferred_language IN ('en')).
-- New signups fail with check constraint violation.
--
-- FIX: Set the default to 'en' so handle_new_user trigger inserts succeed.
-- ═══════════════════════════════════════════════════════════════════════════════

ALTER TABLE profiles ALTER COLUMN preferred_language SET DEFAULT 'en';

-- Also update any existing rows that still have 'es' (just in case)
UPDATE profiles SET preferred_language = 'en' WHERE preferred_language = 'es' OR preferred_language IS NULL;
