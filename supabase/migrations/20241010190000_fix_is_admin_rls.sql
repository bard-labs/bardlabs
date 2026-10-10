-- Make is_admin() reliable: prefer auth.users email via auth.uid(),
-- then JWT claims (email / user_metadata), always case-insensitive.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.app_admins a
    WHERE lower(a.email) = lower(coalesce(
      (SELECT u.email FROM auth.users u WHERE u.id = auth.uid()),
      auth.jwt() ->> 'email',
      auth.jwt() -> 'user_metadata' ->> 'email',
      ''
    ))
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

-- Explicit write policies (clearer than FOR ALL alone) for site_features.
DROP POLICY IF EXISTS "Admins can write site features" ON public.site_features;
DROP POLICY IF EXISTS "Admins can insert site features" ON public.site_features;
DROP POLICY IF EXISTS "Admins can update site features" ON public.site_features;
DROP POLICY IF EXISTS "Admins can delete site features" ON public.site_features;

CREATE POLICY "Admins can insert site features"
  ON public.site_features FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update site features"
  ON public.site_features FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete site features"
  ON public.site_features FOR DELETE TO authenticated
  USING (public.is_admin());

-- Same clarity for projects.
DROP POLICY IF EXISTS "Admins can write projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;

CREATE POLICY "Admins can insert projects"
  ON public.projects FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update projects"
  ON public.projects FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete projects"
  ON public.projects FOR DELETE TO authenticated
  USING (public.is_admin());

-- Anon must never hold write grants (RLS is not enough if policies are mis-scoped).
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.projects FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.site_features FROM anon;
GRANT SELECT ON TABLE public.projects TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.projects TO authenticated;
GRANT SELECT ON TABLE public.site_features TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.site_features TO authenticated;
