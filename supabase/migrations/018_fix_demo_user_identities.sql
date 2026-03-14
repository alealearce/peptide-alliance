-- ============================================================
-- InfoSylvita — Migration 018: Fix missing auth.identities for demo users
-- ============================================================
-- PROBLEM:
--   Migration 015 created demo users via direct SQL INSERT into auth.users,
--   but did NOT create the required rows in auth.identities.
--   Newer GoTrue versions require an identity record for every user —
--   without it, GoTrue returns "Database error querying schema" (500)
--   and the user cannot log in at all.
--
-- FIX:
--   Insert a missing email-provider identity for each demo user.
--   provider_id = email address (required by newer GoTrue).
--   Uses ON CONFLICT DO NOTHING so it is safe to re-run.
-- ============================================================

DO $$
DECLARE
  maria_id  uuid;
  carlos_id uuid;
  ana_id    uuid;
BEGIN
  SELECT id INTO maria_id  FROM auth.users WHERE email = 'maria.garcia@infosylvita-test.com';
  SELECT id INTO carlos_id FROM auth.users WHERE email = 'carlos.lopez@infosylvita-test.com';
  SELECT id INTO ana_id    FROM auth.users WHERE email = 'ana.martinez@infosylvita-test.com';

  IF maria_id IS NOT NULL THEN
    INSERT INTO auth.identities (
      id, user_id, provider_id, provider, identity_data,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      maria_id,
      maria_id,
      'maria.garcia@infosylvita-test.com',
      'email',
      json_build_object(
        'sub',            maria_id::text,
        'email',          'maria.garcia@infosylvita-test.com',
        'email_verified', true,
        'phone_verified', false
      ),
      now(), now(), now()
    ) ON CONFLICT DO NOTHING;
    RAISE NOTICE 'Identity fixed: maria.garcia@infosylvita-test.com';
  END IF;

  IF carlos_id IS NOT NULL THEN
    INSERT INTO auth.identities (
      id, user_id, provider_id, provider, identity_data,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      carlos_id,
      carlos_id,
      'carlos.lopez@infosylvita-test.com',
      'email',
      json_build_object(
        'sub',            carlos_id::text,
        'email',          'carlos.lopez@infosylvita-test.com',
        'email_verified', true,
        'phone_verified', false
      ),
      now(), now(), now()
    ) ON CONFLICT DO NOTHING;
    RAISE NOTICE 'Identity fixed: carlos.lopez@infosylvita-test.com';
  END IF;

  IF ana_id IS NOT NULL THEN
    INSERT INTO auth.identities (
      id, user_id, provider_id, provider, identity_data,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      ana_id,
      ana_id,
      'ana.martinez@infosylvita-test.com',
      'email',
      json_build_object(
        'sub',            ana_id::text,
        'email',          'ana.martinez@infosylvita-test.com',
        'email_verified', true,
        'phone_verified', false
      ),
      now(), now(), now()
    ) ON CONFLICT DO NOTHING;
    RAISE NOTICE 'Identity fixed: ana.martinez@infosylvita-test.com';
  END IF;
END $$;
