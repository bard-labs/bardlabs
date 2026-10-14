-- Hard stop: only allowlisted emails may exist in auth.users.
-- Even if Supabase "Enable sign ups" is left on, non-admin registration fails.

CREATE OR REPLACE FUNCTION public.guard_auth_users()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.app_admins WHERE lower(email) = lower(NEW.email)
  ) THEN
    RAISE EXCEPTION 'Signups are disabled for this project'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_auth_users_before_insert ON auth.users;
CREATE TRIGGER guard_auth_users_before_insert
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_auth_users();

DROP TRIGGER IF EXISTS guard_auth_users_before_update ON auth.users;
CREATE TRIGGER guard_auth_users_before_update
  BEFORE UPDATE OF email ON auth.users
  FOR EACH ROW
  WHEN (NEW.email IS DISTINCT FROM OLD.email)
  EXECUTE FUNCTION public.guard_auth_users();

-- Keep app_admins populated with the single admin.
INSERT INTO public.app_admins (email)
VALUES ('bardiamardan9@gmail.com')
ON CONFLICT (email) DO NOTHING;
