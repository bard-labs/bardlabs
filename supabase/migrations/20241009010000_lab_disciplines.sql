-- Milestone 1: lab discipline catalog for Bardlabs pages.
-- Public read; admin write via existing is_admin().

CREATE TABLE IF NOT EXISTS public.lab_disciplines (
  id text PRIMARY KEY,
  title text NOT NULL,
  subtitle text NOT NULL,
  summary text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lab_disciplines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read lab disciplines" ON public.lab_disciplines;
CREATE POLICY "Public can read lab disciplines"
  ON public.lab_disciplines FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can write lab disciplines" ON public.lab_disciplines;
CREATE POLICY "Admins can write lab disciplines"
  ON public.lab_disciplines FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

GRANT SELECT ON TABLE public.lab_disciplines TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.lab_disciplines TO authenticated;

INSERT INTO public.lab_disciplines (id, title, subtitle, summary, sort_order) VALUES
  ('systems', 'Systems', 'IoT · Embedded · Hardware',
   'Boards, sensors, radios, and firmware that connect the physical world to software.', 10),
  ('intelligence', 'Intelligence', 'Software · AI · Automation',
   'Product software, models, and automation loops that compound human effort.', 20),
  ('mechanics', 'Mechanics', 'Robots · Motion · Control',
   'Mechanisms, actuators, and control systems that move matter with intent.', 30),
  ('inquiry', 'Inquiry', 'Physics · Study · Theory',
   'First-principles study — physics, maths, and the notes that feed every build.', 40),
  ('flight', 'Flight', 'Aerospace · Avionics',
   'Structures, sensing, and avionics thinking applied to flight-adjacent systems.', 50),
  ('surfaces', 'Surfaces', 'Interfaces · Aesthetic web',
   'Interfaces and aesthetic websites — software you can feel, not only use.', 60)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  summary = EXCLUDED.summary,
  sort_order = EXCLUDED.sort_order;
