-- Milestone 2: social links, project↔discipline mapping, and a filetree of connections.

CREATE TABLE IF NOT EXISTS public.site_links (
  id text PRIMARY KEY,
  label text NOT NULL,
  url text NOT NULL,
  kind text NOT NULL DEFAULT 'social',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_disciplines (
  project_id uuid NOT NULL REFERENCES public.projects (id) ON DELETE CASCADE,
  discipline_id text NOT NULL REFERENCES public.lab_disciplines (id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, discipline_id)
);

CREATE TABLE IF NOT EXISTS public.lab_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES public.lab_nodes (id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('folder', 'discipline', 'project', 'link', 'note')),
  title text NOT NULL,
  summary text,
  href text,
  ref_id text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lab_nodes_parent_id_idx ON public.lab_nodes (parent_id);
CREATE INDEX IF NOT EXISTS project_disciplines_discipline_id_idx ON public.project_disciplines (discipline_id);

ALTER TABLE public.site_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_disciplines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_nodes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read site links" ON public.site_links;
CREATE POLICY "Public can read site links"
  ON public.site_links FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admins can write site links" ON public.site_links;
CREATE POLICY "Admins can write site links"
  ON public.site_links FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can read project disciplines" ON public.project_disciplines;
CREATE POLICY "Public can read project disciplines"
  ON public.project_disciplines FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admins can write project disciplines" ON public.project_disciplines;
CREATE POLICY "Admins can write project disciplines"
  ON public.project_disciplines FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can read lab nodes" ON public.lab_nodes;
CREATE POLICY "Public can read lab nodes"
  ON public.lab_nodes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Admins can write lab nodes" ON public.lab_nodes;
CREATE POLICY "Admins can write lab nodes"
  ON public.lab_nodes FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

GRANT SELECT ON TABLE public.site_links, public.project_disciplines, public.lab_nodes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.site_links, public.project_disciplines, public.lab_nodes TO authenticated;

INSERT INTO public.site_links (id, label, url, kind, sort_order) VALUES
  ('linkedin', 'LinkedIn', 'https://www.linkedin.com/in/bardiamardan', 'social', 10),
  ('x', 'X', 'https://x.com/bardiamardan', 'social', 20),
  ('github', 'GitHub', 'https://github.com/BardiaMardan', 'social', 30),
  ('email', 'Email', 'mailto:hello@bardialabs.com', 'contact', 40),
  ('archive', 'Archive', '/projects', 'internal', 50),
  ('brain', 'Brain', '/brain', 'internal', 60)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  url = EXCLUDED.url,
  kind = EXCLUDED.kind,
  sort_order = EXCLUDED.sort_order;

-- Root filetree folders for connecting dots
INSERT INTO public.lab_nodes (id, parent_id, kind, title, summary, sort_order)
VALUES
  ('11111111-1111-1111-1111-111111111101', NULL, 'folder', 'Lab', 'Root map of Bardlabs', 0),
  ('11111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111101', 'folder', 'Disciplines', 'Primary fields', 10),
  ('11111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111101', 'folder', 'Network', 'People, products, platforms', 20),
  ('11111111-1111-1111-1111-111111111104', '11111111-1111-1111-1111-111111111101', 'folder', 'Archive', 'Projects and proof', 30)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.lab_nodes (id, parent_id, kind, title, summary, href, ref_id, sort_order)
VALUES
  ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111102', 'discipline', 'Systems', 'IoT · Embedded · Hardware', '/lab/systems', 'systems', 10),
  ('11111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111102', 'discipline', 'Intelligence', 'Software · AI · Automation', '/lab/intelligence', 'intelligence', 20),
  ('11111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111102', 'discipline', 'Mechanics', 'Robots · Motion · Control', '/lab/mechanics', 'mechanics', 30),
  ('11111111-1111-1111-1111-111111111114', '11111111-1111-1111-1111-111111111102', 'discipline', 'Inquiry', 'Physics · Study · Theory', '/lab/inquiry', 'inquiry', 40),
  ('11111111-1111-1111-1111-111111111115', '11111111-1111-1111-1111-111111111102', 'discipline', 'Flight', 'Aerospace · Avionics', '/lab/flight', 'flight', 50),
  ('11111111-1111-1111-1111-111111111116', '11111111-1111-1111-1111-111111111102', 'discipline', 'Surfaces', 'Interfaces · Aesthetic web', '/lab/surfaces', 'surfaces', 60),
  ('11111111-1111-1111-1111-111111111121', '11111111-1111-1111-1111-111111111103', 'link', 'LinkedIn', 'Professional network', 'https://www.linkedin.com/in/bardiamardan', 'linkedin', 10),
  ('11111111-1111-1111-1111-111111111122', '11111111-1111-1111-1111-111111111103', 'link', 'X', 'Public signal', 'https://x.com/bardiamardan', 'x', 20),
  ('11111111-1111-1111-1111-111111111123', '11111111-1111-1111-1111-111111111103', 'link', 'GitHub', 'Code & open work', 'https://github.com/BardiaMardan', 'github', 30),
  ('11111111-1111-1111-1111-111111111131', '11111111-1111-1111-1111-111111111104', 'link', 'Project Universe', 'Archive of builds', '/projects', 'archive', 10),
  ('11111111-1111-1111-1111-111111111132', '11111111-1111-1111-1111-111111111104', 'note', 'Connecting dots', 'Advantage: map systems ↔ software ↔ mechanics across one lab.', NULL, NULL, 20)
ON CONFLICT (id) DO NOTHING;
