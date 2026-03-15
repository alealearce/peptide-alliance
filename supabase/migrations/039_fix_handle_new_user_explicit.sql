-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration 039: Fix handle_new_user to explicitly set preferred_language
-- ═══════════════════════════════════════════════════════════════════════════════
-- PROBLEM: Trigger relies on column default for preferred_language.
-- The constraint only allows 'en' but the column default was 'es'.
-- Even after migration 038 changed the default, the trigger should explicitly
-- set the value rather than rely on defaults.
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
END;
$$;

-- Re-attach the trigger (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
