-- Project status, and a single editable overview (current goal + short about).
-- Links stay in site_links, including the personal site.

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

ALTER TABLE public.projects
  DROP CONSTRAINT IF EXISTS projects_status_check;

ALTER TABLE public.projects
  ADD CONSTRAINT projects_status_check
  CHECK (status IN ('active', 'paused', 'done'));

CREATE TABLE IF NOT EXISTS public.site_overview (
  id text PRIMARY KEY DEFAULT 'main',
  goal text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_overview_singleton CHECK (id = 'main')
);

ALTER TABLE public.site_overview ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read site overview" ON public.site_overview;
CREATE POLICY "Public can read site overview"
  ON public.site_overview FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can write site overview" ON public.site_overview;
CREATE POLICY "Admins can write site overview"
  ON public.site_overview FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

GRANT SELECT ON TABLE public.site_overview TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.site_overview TO authenticated;

INSERT INTO public.site_overview (id, goal, summary)
VALUES (
  'main',
  'Keep the lab clear, and keep building.',
  'Bardlabs is the workshop for systems, software, mechanics, and inquiry. Projects are what got built. The brain is the map of ideas. The personal site lives apart from this lab.'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.site_links (id, label, url, kind, sort_order)
VALUES ('website', 'bardiamardan.xyz', 'https://bardiamardan.xyz', 'site', 5)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  url = EXCLUDED.url,
  kind = EXCLUDED.kind,
  sort_order = EXCLUDED.sort_order;

UPDATE public.site_links
SET label = 'Projects'
WHERE id = 'archive' OR url = '/projects';
