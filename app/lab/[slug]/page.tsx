import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react"
import { labDisciplines } from "@/lib/lab"
import { fetchDisciplineBundle } from "@/lib/lab-data"

export function generateStaticParams() {
  return labDisciplines.map((d) => ({ slug: d.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { discipline } = await fetchDisciplineBundle(slug)
  if (!discipline) return { title: "Lab · Bardlabs" }
  return {
    title: `${discipline.title} · Bardlabs`,
    description: discipline.summary,
  }
}

export default async function LabDisciplinePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { discipline, projects, links, relatedNodes } = await fetchDisciplineBundle(slug)
  if (!discipline) notFound()

  const Icon = discipline.icon
  const socials = links.filter((l) => l.kind === "social" || l.kind === "contact")
  const notes = relatedNodes.filter((n) => n.kind === "note" || (n.kind === "link" && n.ref_id === slug))

  return (
    <main className="min-h-[100svh] bg-[#050505] px-4 pb-28 pt-28 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-neutral-500 transition-colors hover:text-white"
        >
          <ArrowLeft size={14} />
          Lab
        </Link>

        <div className="mt-10 flex items-start gap-5 border-b border-white/10 pb-8">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.03]">
            <Icon size={22} strokeWidth={1.4} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
              {discipline.subtitle}
            </p>
            <h1 className="mt-2 text-4xl font-medium tracking-tight sm:text-5xl">
              {discipline.title}
            </h1>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-neutral-400 sm:text-lg">
          {discipline.summary}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {socials.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.16em] text-neutral-300 transition-colors hover:border-white/40 hover:text-white"
            >
              {link.label}
              <ExternalLink size={12} />
            </a>
          ))}
          <Link
            href="/map"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.16em] text-neutral-300 transition-colors hover:border-white/40 hover:text-white"
          >
            Connection map
          </Link>
        </div>

        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-white/10 pb-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Projects</p>
              <h2 className="mt-1 text-2xl font-medium tracking-tight">Proof in this field</h2>
            </div>
            <Link href="/projects" className="text-xs text-neutral-500 hover:text-white">
              Full archive
            </Link>
          </div>

          {projects.length === 0 ? (
            <p className="text-sm text-neutral-500">
              No projects mapped yet — link them from the dashboard under “Map projects → disciplines”.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((project) => {
                const images = Array.isArray(project.images)
                  ? (project.images as string[])
                  : []
                const cover = images[0]
                return (
                  <article
                    key={project.id}
                    className="group overflow-hidden border border-white/10 bg-white/[0.02]"
                  >
                    <div className="relative aspect-[16/10] bg-neutral-900">
                      {cover ? (
                        <Image
                          src={cover}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width:768px) 100vw, 40vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-neutral-600">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-medium tracking-tight">{project.title}</h3>
                        {project.link ? (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-neutral-500 hover:text-white"
                          >
                            <ArrowUpRight size={18} />
                          </a>
                        ) : null}
                      </div>
                      {project.description ? (
                        <p className="mt-2 line-clamp-3 text-sm text-neutral-500">
                          {project.description}
                        </p>
                      ) : null}
                      {project.tags?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-neutral-500"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        {notes.length > 0 ? (
          <section className="mt-14 border-t border-white/10 pt-10">
            <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Connected notes</p>
            <ul className="mt-4 space-y-3">
              {notes.map((note) => (
                <li key={note.id} className="border border-white/10 p-4">
                  <p className="font-medium">{note.title}</p>
                  {note.summary ? (
                    <p className="mt-1 text-sm text-neutral-500">{note.summary}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </main>
  )
}
