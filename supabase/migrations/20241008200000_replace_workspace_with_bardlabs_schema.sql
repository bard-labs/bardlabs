-- Replace the internal-workspace schema that was pushed earlier today
-- with the Bardlabs site schema (projects, categories, brain_nodes, logs).

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

DROP TABLE IF EXISTS public.ideas CASCADE;
DROP TABLE IF EXISTS public.outreaches CASCADE;
DROP TABLE IF EXISTS public.sops CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;

DROP POLICY IF EXISTS "Users can upload their own SOPs" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own SOPs" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own SOPs" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own SOPs" ON storage.objects;

CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL,
  type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  images jsonb,
  link text,
  tags text[],
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.brain_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  description text,
  category_id uuid REFERENCES public.categories (id) ON DELETE SET NULL,
  parent_id uuid REFERENCES public.brain_nodes (id) ON DELETE SET NULL,
  position jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX brain_nodes_category_id_idx ON public.brain_nodes (category_id);
CREATE INDEX brain_nodes_parent_id_idx ON public.brain_nodes (parent_id);

CREATE TABLE public.logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.app_admins (
  email text PRIMARY KEY
);

INSERT INTO public.app_admins (email)
VALUES ('bardiamardan9@gmail.com')
ON CONFLICT (email) DO NOTHING;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((auth.jwt() ->> 'email'), '') IN (
    SELECT email FROM public.app_admins
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brain_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read categories"
  ON public.categories FOR SELECT TO anon, authenticated
  USING (true);
CREATE POLICY "Admins can write categories"
  ON public.categories FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Public can read projects"
  ON public.projects FOR SELECT TO anon, authenticated
  USING (true);
CREATE POLICY "Admins can write projects"
  ON public.projects FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Public can read brain nodes"
  ON public.brain_nodes FOR SELECT TO anon, authenticated
  USING (true);
CREATE POLICY "Admins can write brain nodes"
  ON public.brain_nodes FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Public can read logs"
  ON public.logs FOR SELECT TO anon, authenticated
  USING (true);
CREATE POLICY "Admins can write logs"
  ON public.logs FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

REVOKE ALL ON TABLE public.app_admins FROM anon, authenticated;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON TABLE public.categories, public.projects, public.brain_nodes, public.logs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.categories, public.projects, public.brain_nodes, public.logs TO authenticated;

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public can read portfolio images"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'portfolio');

CREATE POLICY "Admins can upload portfolio images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio' AND public.is_admin());

CREATE POLICY "Admins can update portfolio images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio' AND public.is_admin())
  WITH CHECK (bucket_id = 'portfolio' AND public.is_admin());

CREATE POLICY "Admins can delete portfolio images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio' AND public.is_admin());
