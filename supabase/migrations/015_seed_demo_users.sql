-- ============================================================
-- InfoSylvita — Migration 015: Seed 3 demo test users
-- Creates test accounts for QA / demo purposes.
-- Password: LatinTest2024x (set via Supabase dashboard after seeding)
-- ============================================================

DO $$
DECLARE
  maria_id  uuid;
  carlos_id uuid;
  ana_id    uuid;
BEGIN

  -- ── Maria Garcia (free-tier owner) ───────────────────────────────────────
  SELECT id INTO maria_id FROM auth.users WHERE email = 'maria.garcia@infosylvita-test.com';
  IF maria_id IS NULL THEN
    maria_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      role, aud, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, confirmation_token, recovery_token
    ) VALUES (
      maria_id, '00000000-0000-0000-0000-000000000000',
      'maria.garcia@infosylvita-test.com',
      extensions.crypt('LatinTest2024x', extensions.gen_salt('bf')),
      now(), now(), now(),
      'authenticated', 'authenticated',
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Maria Garcia"}',
      false, '', ''
    );
    -- Upsert profile in case trigger already fired
    INSERT INTO public.profiles (id, email, full_name, role, preferred_language)
    VALUES (maria_id, 'maria.garcia@infosylvita-test.com', 'Maria Garcia', 'user', 'es')
    ON CONFLICT (id) DO UPDATE
      SET full_name = 'Maria Garcia', preferred_language = 'es';
    RAISE NOTICE 'Created: maria.garcia@infosylvita-test.com → %', maria_id;
  ELSE
    RAISE NOTICE 'Already exists: maria.garcia@infosylvita-test.com → %', maria_id;
  END IF;

  -- ── Carlos López (premium-tier owner) ────────────────────────────────────
  SELECT id INTO carlos_id FROM auth.users WHERE email = 'carlos.lopez@infosylvita-test.com';
  IF carlos_id IS NULL THEN
    carlos_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      role, aud, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, confirmation_token, recovery_token
    ) VALUES (
      carlos_id, '00000000-0000-0000-0000-000000000000',
      'carlos.lopez@infosylvita-test.com',
      extensions.crypt('LatinTest2024x', extensions.gen_salt('bf')),
      now(), now(), now(),
      'authenticated', 'authenticated',
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Carlos López"}',
      false, '', ''
    );
    INSERT INTO public.profiles (id, email, full_name, role, preferred_language)
    VALUES (carlos_id, 'carlos.lopez@infosylvita-test.com', 'Carlos López', 'user', 'es')
    ON CONFLICT (id) DO UPDATE
      SET full_name = 'Carlos López', preferred_language = 'es';
    RAISE NOTICE 'Created: carlos.lopez@infosylvita-test.com → %', carlos_id;
  ELSE
    RAISE NOTICE 'Already exists: carlos.lopez@infosylvita-test.com → %', carlos_id;
  END IF;

  -- ── Ana Martínez (featured-tier owner) ───────────────────────────────────
  SELECT id INTO ana_id FROM auth.users WHERE email = 'ana.martinez@infosylvita-test.com';
  IF ana_id IS NULL THEN
    ana_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      role, aud, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, confirmation_token, recovery_token
    ) VALUES (
      ana_id, '00000000-0000-0000-0000-000000000000',
      'ana.martinez@infosylvita-test.com',
      extensions.crypt('LatinTest2024x', extensions.gen_salt('bf')),
      now(), now(), now(),
      'authenticated', 'authenticated',
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Ana Martínez"}',
      false, '', ''
    );
    INSERT INTO public.profiles (id, email, full_name, role, preferred_language)
    VALUES (ana_id, 'ana.martinez@infosylvita-test.com', 'Ana Martínez', 'user', 'en')
    ON CONFLICT (id) DO UPDATE
      SET full_name = 'Ana Martínez', preferred_language = 'en';
    RAISE NOTICE 'Created: ana.martinez@infosylvita-test.com → %', ana_id;
  ELSE
    RAISE NOTICE 'Already exists: ana.martinez@infosylvita-test.com → %', ana_id;
  END IF;

END $$;
