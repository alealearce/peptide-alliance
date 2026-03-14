-- ============================================================
-- InfoSylvita — Migration 019: Fully fix demo user auth records
-- ============================================================
-- PROBLEM:
--   Demo users created via raw SQL INSERT (migration 015) may be
--   missing columns added to auth.users in newer GoTrue versions
--   (e.g. phone, is_sso_user, is_anonymous, confirmation_sent_at).
--   GoTrue fails to load these users with "Database error loading user".
--
-- FIX:
--   1. UPDATE auth.users for demo users to fill all text fields
--      (empty string instead of NULL) and boolean fields (false).
--   2. DELETE and reinsert auth.identities with all required columns
--      (identity_id auto-generated, email column populated).
-- ============================================================

DO $$
DECLARE
  maria_id  uuid;
  carlos_id uuid;
  ana_id    uuid;
BEGIN
  -- Look up actual user IDs from auth.users (migration 015 generates them dynamically)
  SELECT id INTO maria_id  FROM auth.users WHERE email = 'maria.garcia@infosylvita-test.com';
  SELECT id INTO carlos_id FROM auth.users WHERE email = 'carlos.lopez@infosylvita-test.com';
  SELECT id INTO ana_id    FROM auth.users WHERE email = 'ana.martinez@infosylvita-test.com';

  IF maria_id IS NULL OR carlos_id IS NULL OR ana_id IS NULL THEN
    RAISE NOTICE 'Demo users not found, skipping migration 019';
    RETURN;
  END IF;

  -- ── Step 1: Fix auth.users records ─────────────────────────
  -- Set all text/token fields to '' if NULL, booleans to false
  UPDATE auth.users SET
    -- NOTE: phone has a unique constraint; leave it NULL (that's valid)
    -- phone = COALESCE(phone, ''),
    confirmation_token        = COALESCE(confirmation_token, ''),
    recovery_token            = COALESCE(recovery_token, ''),
    email_change_token_new    = COALESCE(email_change_token_new, ''),
    email_change              = COALESCE(email_change, ''),
    phone_change              = COALESCE(phone_change, ''),
    phone_change_token        = COALESCE(phone_change_token, ''),
    email_change_token_current= COALESCE(email_change_token_current, ''),
    reauthentication_token    = COALESCE(reauthentication_token, ''),
    is_super_admin            = COALESCE(is_super_admin, false),
    email_change_confirm_status = COALESCE(email_change_confirm_status, 0),
    updated_at                = now()
  WHERE id IN (maria_id, carlos_id, ana_id);

  -- Set is_sso_user if the column exists (added in newer GoTrue)
  BEGIN
    UPDATE auth.users SET is_sso_user = COALESCE(is_sso_user, false)
    WHERE id IN (maria_id, carlos_id, ana_id);
  EXCEPTION WHEN undefined_column THEN
    RAISE NOTICE 'is_sso_user column does not exist, skipping';
  END;

  -- Set is_anonymous if the column exists (added in newer GoTrue)
  BEGIN
    UPDATE auth.users SET is_anonymous = COALESCE(is_anonymous, false)
    WHERE id IN (maria_id, carlos_id, ana_id);
  EXCEPTION WHEN undefined_column THEN
    RAISE NOTICE 'is_anonymous column does not exist, skipping';
  END;

  RAISE NOTICE 'auth.users updated for demo users';

  -- ── Step 2: Fix auth.identities records ────────────────────
  -- Delete any previously-inserted identities (from migration 018)
  -- and reinsert with all columns properly set.

  -- Delete by both user_id and provider_id to avoid unique constraint conflicts
  DELETE FROM auth.identities WHERE user_id IN (maria_id, carlos_id, ana_id);
  DELETE FROM auth.identities WHERE provider_id IN (
    'maria.garcia@infosylvita-test.com',
    'carlos.lopez@infosylvita-test.com',
    'ana.martinez@infosylvita-test.com'
  );
  RAISE NOTICE 'Deleted old identities for demo users';

  -- NOTE: 'email' column in auth.identities is a GENERATED column — do not insert it.

  -- Maria Garcia
  INSERT INTO auth.identities (
    user_id, provider_id, provider, identity_data,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    maria_id,
    'maria.garcia@infosylvita-test.com',
    'email',
    jsonb_build_object(
      'sub',            maria_id::text,
      'email',          'maria.garcia@infosylvita-test.com',
      'email_verified', true,
      'phone_verified', false
    ),
    now(), now(), now()
  );

  -- Carlos Lopez
  INSERT INTO auth.identities (
    user_id, provider_id, provider, identity_data,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    carlos_id,
    'carlos.lopez@infosylvita-test.com',
    'email',
    jsonb_build_object(
      'sub',            carlos_id::text,
      'email',          'carlos.lopez@infosylvita-test.com',
      'email_verified', true,
      'phone_verified', false
    ),
    now(), now(), now()
  );

  -- Ana Martinez
  INSERT INTO auth.identities (
    user_id, provider_id, provider, identity_data,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    ana_id,
    'ana.martinez@infosylvita-test.com',
    'email',
    jsonb_build_object(
      'sub',            ana_id::text,
      'email',          'ana.martinez@infosylvita-test.com',
      'email_verified', true,
      'phone_verified', false
    ),
    now(), now(), now()
  );

  RAISE NOTICE 'auth.identities recreated for all 3 demo users';

END $$;
