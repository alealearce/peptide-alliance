-- ============================================================
-- InfoSylvita — Create Admin User (bypasses email invite)
-- ============================================================

do $$
declare
  new_user_id uuid;
  existing_id uuid;
begin
  -- Check if user already exists
  select id into existing_id from auth.users where email = 'hi@arce.ca';

  if existing_id is not null then
    -- User already exists — just ensure admin role on profile
    insert into public.profiles (id, email, full_name, role)
    values (existing_id, 'hi@arce.ca', 'InfoSylvita Admin', 'admin')
    on conflict (id) do update
      set role = 'admin',
          full_name = 'InfoSylvita Admin';
    raise notice 'Admin user already exists: %', existing_id;
    return;
  end if;

  -- First run: create the user
  new_user_id := gen_random_uuid();
  insert into auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    role,
    aud,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    confirmation_token,
    recovery_token
  ) values (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'hi@arce.ca',
    crypt('CHANGE_VIA_SUPABASE_DASHBOARD', gen_salt('bf')), -- password must be set via Supabase dashboard after first deploy
    now(),
    now(),
    now(),
    'authenticated',
    'authenticated',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"InfoSylvita Admin"}',
    false,
    '',
    ''
  );

  -- Upsert profile with admin role
  -- (trigger may have already created it, so we upsert)
  insert into public.profiles (id, email, full_name, role)
  values (new_user_id, 'hi@arce.ca', 'InfoSylvita Admin', 'admin')
  on conflict (id) do update
    set role = 'admin',
        full_name = 'InfoSylvita Admin';

  raise notice 'Admin user created: %', new_user_id;
end $$;
