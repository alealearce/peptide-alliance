-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 040: Make handle_new_user completely exception-safe
-- ═══════════════════════════════════════════════════════════════════════════════
-- Even if the profile INSERT fails for any reason (constraint, FK, etc),
-- the auth signup should ALWAYS succeed. The EXCEPTION block catches any
-- error and still returns NEW so auth.users is created normally.
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, preferred_language)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'en'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error but never block the signup
  RAISE WARNING 'handle_new_user: profile insert failed for %: % %', NEW.email, SQLERRM, SQLSTATE;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
