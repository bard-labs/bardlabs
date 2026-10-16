import "server-only"

import { unstable_cache } from "next/cache"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { normalizeProjectStatus, type ProjectStatus } from "@/lib/project-status"

export const PUBLIC_REVALIDATE_SECONDS = 60

const publicSupabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"]
export type PublicProject = Omit<ProjectRow, "images" | "tags" | "status"> & {
  images: string[]
  tags: string[]
  status: ProjectStatus
}

function normalizeProject(project: ProjectRow): PublicProject {
  const images = Array.isArray(project.images) ? project.images.filter((value): value is string => typeof value === "string") : []
  const tags = Array.isArray(project.tags) ? project.tags.filter((value): value is string => typeof value === "string") : []
  return { ...project, images, tags, status: normalizeProjectStatus(project.status) }
}

export type PublicSiteLink = {
  id: string
  label: string
  url: string
  kind: string
  sort_order: number
}

export type PublicOverview = {
  goal: string
  summary: string
}

const OVERVIEW_DEFAULT: PublicOverview = {
  goal: "Keep the lab clear, and keep building.",
  summary:
    "Bardlabs is the workshop for systems, software, mechanics, and inquiry. Projects are what got built. The brain is the map of ideas. The personal site lives apart from this lab.",
}

const PERSONAL_SITE: PublicSiteLink = {
  id: "website",
  label: "bardiamardan.xyz",
  url: "https://bardiamardan.xyz",
  kind: "site",
  sort_order: 5,
}

function presentLink(link: PublicSiteLink): PublicSiteLink {
  if (link.id === "archive" || link.url === "/projects") return { ...link, label: "Projects" }
  return link
}

function withPersonalSite(links: PublicSiteLink[]) {
  const presented = links.map(presentLink)
  if (presented.some((link) => link.url.includes("bardiamardan.xyz"))) return presented
  return [PERSONAL_SITE, ...presented]
}
export type PublicLog = Database["public"]["Tables"]["logs"]["Row"]
export type PublicCategory = Database["public"]["Tables"]["categories"]["Row"]
export type PublicBrainNode = Omit<Database["public"]["Tables"]["brain_nodes"]["Row"], "position"> & {
  position: { x: number; y: number; z: number }
}

type BrainData = {
  categories: PublicCategory[]
  nodes: PublicBrainNode[]
}

export type PublicLabGraph = {
  disciplines: Array<{ id: string; title: string; subtitle: string; href: string }>
  projects: Array<{ id: string; title: string; image: string | null; href: string }>
  links: Array<{ project_id: string; discipline_id: string }>
}

export const getPublicLabGraph = unstable_cache(
  async (): Promise<PublicLabGraph> => {
    const [{ data: disciplines, error: disciplineError }, { data: projects, error: projectError }, { data: links, error: linkError }] =
      await Promise.all([
        publicSupabase.from("lab_disciplines").select("id, title, subtitle").order("sort_order", { ascending: true }),
        publicSupabase.from("projects").select("id, title, images"),
        publicSupabase.from("project_disciplines").select("project_id, discipline_id"),
      ])

    if (disciplineError) throw disciplineError
    if (projectError) throw projectError
    if (linkError) throw linkError

    return {
      disciplines: (disciplines ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        subtitle: row.subtitle,
        href: `/lab/${row.id}`,
      })),
      projects: (projects ?? []).map((project) => {
        const images = Array.isArray(project.images)
          ? project.images.filter((value): value is string => typeof value === "string")
          : []
        return {
          id: project.id,
          title: project.title,
          image: images[0] ?? null,
          href: `/projects/${project.id}`,
        }
      }),
      links: links ?? [],
    }
  },
  ["public-lab-graph", "seed-3"],
  { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: ["public-projects", "public-lab-graph"] },
)

export const getPublicOverview = unstable_cache(
  async (): Promise<PublicOverview> => {
    const { data, error } = await publicSupabase
      .from("site_overview")
      .select("goal, summary")
      .eq("id", "main")
      .maybeSingle()

    if (error || !data) return OVERVIEW_DEFAULT
    return {
      goal: data.goal.trim() || OVERVIEW_DEFAULT.goal,
      summary: data.summary.trim() || OVERVIEW_DEFAULT.summary,
    }
  },
  ["public-overview", "seed-1"],
  { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: ["public-overview"] },
)

export const getPublicSiteLinks = unstable_cache(
  async (): Promise<PublicSiteLink[]> => {
    const { data, error } = await publicSupabase
      .from("site_links")
      .select("id, label, url, kind, sort_order")
      .order("sort_order", { ascending: true })

    if (error || !data?.length) return withPersonalSite([])
    return withPersonalSite(data)
  },
  ["public-site-links", "seed-1"],
  { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: ["public-overview"] },
)

export const getPublicProjects = unstable_cache(
  async (): Promise<PublicProject[]> => {
    const { data, error } = await publicSupabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return (data ?? []).map(normalizeProject)
  },
  ["public-projects", "seed-4"],
  { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: ["public-projects"] },
)

export type PublicDisciplineLink = {
  discipline_id: string
  title: string
  subtitle: string
}

export async function getPublicProjectDetail(id: string): Promise<{
  project: PublicProject | null
  disciplines: PublicDisciplineLink[]
}> {
  return unstable_cache(
    async () => {
      const [{ data: project, error: projectError }, { data: mapped, error: mappedError }] = await Promise.all([
        publicSupabase.from("projects").select("*").eq("id", id).maybeSingle(),
        publicSupabase
          .from("project_disciplines")
          .select("discipline_id, lab_disciplines(title, subtitle)")
          .eq("project_id", id),
      ])

      if (projectError) throw projectError
      if (mappedError) throw mappedError

      const disciplines = ((mapped ?? []) as Array<{
        discipline_id: string
        lab_disciplines: { title: string; subtitle: string } | { title: string; subtitle: string }[] | null
      }>).map((row) => {
        const discipline = Array.isArray(row.lab_disciplines) ? row.lab_disciplines[0] : row.lab_disciplines
        return {
          discipline_id: row.discipline_id,
          title: discipline?.title ?? row.discipline_id,
          subtitle: discipline?.subtitle ?? "",
        }
      })

      return { project: project ? normalizeProject(project) : null, disciplines }
    },
    ["public-project-detail", id, "seed-4"],
    { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: ["public-projects", `public-project:${id}`] },
  )()
}

export async function getPublicProject(id: string): Promise<PublicProject | null> {
  return (await getPublicProjectDetail(id)).project
}

export const getPublicLogs = unstable_cache(
  async (): Promise<PublicLog[]> => {
    const { data, error } = await publicSupabase
      .from("logs")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return data ?? []
  },
  ["public-logs"],
  { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: ["public-logs"] },
)

export const getPublicBrain = unstable_cache(
  async (): Promise<BrainData> => {
    const [{ data: categories, error: categoriesError }, { data: nodes, error: nodesError }] = await Promise.all([
      publicSupabase.from("categories").select("*").eq("type", "brain"),
      publicSupabase.from("brain_nodes").select("*"),
    ])

    if (categoriesError) throw categoriesError
    if (nodesError) throw nodesError

    const normalizedNodes = (nodes ?? []).flatMap((node) => {
      const position = node.position
      const candidate = position && typeof position === "object" && !Array.isArray(position)
        ? position as { x?: unknown; y?: unknown; z?: unknown }
        : null
      if (
        !candidate ||
        typeof candidate.x !== "number" ||
        typeof candidate.y !== "number" ||
        typeof candidate.z !== "number"
      ) {
        return []
      }
      return [{ ...node, position: { x: candidate.x, y: candidate.y, z: candidate.z } }]
    })

    return { categories: categories ?? [], nodes: normalizedNodes }
  },
  ["public-brain", "seed-3"],
  { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: ["public-brain"] },
)
