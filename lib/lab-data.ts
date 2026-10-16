import { createClient } from "@/utils/supabase/server"
import { getDiscipline, labDisciplines, type LabDiscipline } from "@/lib/lab"

export type SiteLink = {
  id: string
  label: string
  url: string
  kind: string
  sort_order: number
}

export type LabProject = {
  id: string
  title: string
  description: string | null
  link: string | null
  tags: string[] | null
  images: string[] | null
  status?: string | null
  created_at: string
}

export type LabNode = {
  id: string
  parent_id: string | null
  kind: "folder" | "discipline" | "project" | "link" | "note"
  title: string
  summary: string | null
  href: string | null
  ref_id: string | null
  sort_order: number
}

export async function fetchSiteLinks(): Promise<SiteLink[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("site_links")
      .select("*")
      .order("sort_order", { ascending: true })
    return (data as SiteLink[]) ?? []
  } catch {
    return []
  }
}

export async function fetchDisciplineBundle(slug: string): Promise<{
  discipline: LabDiscipline | null
  projects: LabProject[]
  links: SiteLink[]
  relatedNodes: LabNode[]
}> {
  const fallback = getDiscipline(slug) ?? null
  try {
    const supabase = await createClient()

    const [{ data: disciplineRow }, { data: junction }, { data: links }, { data: nodes }] =
      await Promise.all([
        supabase.from("lab_disciplines").select("*").eq("id", slug).maybeSingle(),
        supabase
          .from("project_disciplines")
          .select("project_id, projects(*)")
          .eq("discipline_id", slug),
        supabase.from("site_links").select("*").order("sort_order", { ascending: true }),
        supabase
          .from("lab_nodes")
          .select("*")
          .or(`ref_id.eq.${slug},kind.eq.link,kind.eq.note`)
          .order("sort_order", { ascending: true }),
      ])

    const discipline: LabDiscipline | null = disciplineRow
      ? {
          id: disciplineRow.id,
          title: disciplineRow.title,
          subtitle: disciplineRow.subtitle,
          summary: disciplineRow.summary,
          href: `/lab/${disciplineRow.id}`,
          span: fallback?.span ?? "col-span-4",
          icon: fallback?.icon ?? labDisciplines[0]!.icon,
        }
      : fallback

    const projects = ((junction ?? []) as Array<{ projects: LabProject | LabProject[] | null }>)
      .map((row) => (Array.isArray(row.projects) ? row.projects[0] : row.projects))
      .filter(Boolean) as LabProject[]

    return {
      discipline,
      projects,
      links: (links as SiteLink[]) ?? [],
      relatedNodes: (nodes as LabNode[]) ?? [],
    }
  } catch {
    return { discipline: fallback, projects: [], links: [], relatedNodes: [] }
  }
}

export async function fetchLabTree(): Promise<LabNode[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("lab_nodes")
      .select("*")
      .order("sort_order", { ascending: true })
    return (data as LabNode[]) ?? []
  } catch {
    return []
  }
}
