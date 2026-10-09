CREATE TABLE IF NOT EXISTS public.site_features (
  id text PRIMARY KEY,
  label text NOT NULL,
  path text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read site features" ON public.site_features;
CREATE POLICY "Public can read site features"
  ON public.site_features FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can write site features" ON public.site_features;
CREATE POLICY "Admins can write site features"
  ON public.site_features FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

GRANT SELECT ON TABLE public.site_features TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.site_features TO authenticated;

INSERT INTO public.site_features (id, label, path, enabled, sort_order) VALUES
  ('projects', 'Archive', '/projects', true, 10),
  ('brain', 'Brain', '/brain', true, 20),
  ('map', 'Connections', '/map', true, 30),
  ('logs', 'Logs', '/log', true, 40)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  path = EXCLUDED.path,
  sort_order = EXCLUDED.sort_order;
