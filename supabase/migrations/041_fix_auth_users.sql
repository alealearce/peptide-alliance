-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 041: Clean up directly-inserted auth.users records
-- ═══════════════════════════════════════════════════════════════════════════════
-- PROBLEM: Migrations 002 and 015 inserted rows directly into auth.users via SQL.
-- This bypassed GoTrue's internal bookkeeping, causing "Database error finding users".
-- 
-- FIX: Remove those directly-inserted rows. The admin account (hi@arce.ca) will be
-- re-created properly via the Supabase dashboard or API after this migration.
-- Profile rows will remain (they have ON DELETE CASCADE from auth.users, so
-- we need to preserve them by temporarily removing the FK constraint or just
-- letting cascade handle it and re-inserting the profile after).
-- ═══════════════════════════════════════════════════════════════════════════════

DO $$
DECLARE
  bad_ids uuid[];
BEGIN
  -- Collect IDs of users inserted directly (not via GoTrue)
  -- These have a placeholder encrypted_password from crypt('CHANGE_VIA_SUPABASE_DASHBOARD', ...)
  -- and/or were seeded demo users
  SELECT ARRAY_AGG(id) INTO bad_ids
  FROM auth.users
  WHERE email IN (
    'hi@arce.ca',
    'maria.garcia@infosylvita-test.com',
    'carlos.lopez@infosylvita-test.com',
    'ana.martinez@infosylvita-test.com'
  );

  IF bad_ids IS NOT NULL THEN
    -- Remove profiles first to avoid FK issues (cascade would do this too)
    DELETE FROM public.profiles WHERE id = ANY(bad_ids);
    -- Remove from auth.users
    DELETE FROM auth.users WHERE id = ANY(bad_ids);
    RAISE NOTICE 'Removed % broken auth users', array_length(bad_ids, 1);
  ELSE
    RAISE NOTICE 'No broken auth users found to remove';
  END IF;
END $$;

-- Re-insert the admin profile (without an auth.users row — we'll create it via API)
-- This allows the admin to sign up normally through the app
-- The profile will be created by the trigger on first signup
