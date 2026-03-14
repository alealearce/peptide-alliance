-- ============================================================
-- InfoSylvita — Update existing user to admin
-- ============================================================

do $$
declare
  existing_user_id uuid;
begin
  -- Get existing user ID
  select id into existing_user_id
  from auth.users
  where email = 'hi@arce.ca';

  -- Update password and confirm email
  update auth.users set
    encrypted_password = crypt('CHANGE_VIA_SUPABASE_DASHBOARD', gen_salt('bf')), -- password must be set via Supabase dashboard after first deploy
    email_confirmed_at = coalesce(email_confirmed_at, now()),
    updated_at = now()
  where id = existing_user_id;

  -- Upsert profile with admin role
  insert into public.profiles (id, email, full_name, role)
  values (existing_user_id, 'hi@arce.ca', 'InfoSylvita Admin', 'admin')
  on conflict (id) do update
    set role = 'admin',
        full_name = 'InfoSylvita Admin';

  raise notice 'Admin user updated: %', existing_user_id;
end $$;
