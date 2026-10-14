"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Calendar, Tag, ExternalLink, Network } from "lucide-react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import type { PublicDisciplineLink, PublicProject } from "@/lib/public-data"
import { ProjectGallery } from "@/components/Project/ProjectGallery"
import { ProseText } from "@/lib/prose-text"

type Project = PublicProject
type DisciplineLink = PublicDisciplineLink

export function ProjectDetailClient({
  initialProject,
  initialDisciplines,
}: {
  initialProject: Project
  initialDisciplines: DisciplineLink[]
}) {
  const router = useRouter()
  const [project] = useState<Project>(initialProject)
  const [disciplines] = useState<DisciplineLink[]>(initialDisciplines)
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)


  useGSAP(
    () => {
      const tl = gsap.timeline()
      tl.from(headerRef.current, { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" })
        .from(contentRef.current, { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
        .from(metaRef.current, { x: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
    },
    { scope: containerRef },
  )

  const images = project.images ?? []

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] px-4 pb-28 pt-24 text-white sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <button
            onClick={() => router.push("/projects")}
            className="mb-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-neutral-500 hover:text-white"
          >
            <ChevronLeft size={14} /> Archive
          </button>

          <header ref={headerRef}>
            <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">{project.title}</h1>
            {project.description ? (
              <ProseText
                text={project.description}
                className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-neutral-400"
              />
            ) : null}
          </header>

          <div ref={contentRef} className="mt-8">
            <ProjectGallery images={images} title={project.title} />
          </div>
        </div>

        <aside ref={metaRef} className="space-y-6 lg:col-span-4 lg:pt-16">
          <div className="border border-white/10 p-5">
            <p className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-neutral-500"><Calendar size={12} /> Created</p>
            <p className="text-sm text-neutral-300">{new Date(project.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>

          {project.tags?.length ? (
            <div className="border border-white/10 p-5">
              <p className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-neutral-500"><Tag size={12} /> Tags</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => <span key={tag} className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-wider text-neutral-400">{tag}</span>)}
              </div>
            </div>
          ) : null}

          {disciplines.length ? (
            <div className="border border-white/10 p-5">
              <p className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-neutral-500"><Network size={12} /> Lab fields</p>
              <ul className="space-y-2">
                {disciplines.map((d) => <li key={d.discipline_id}><Link href={`/lab/${d.discipline_id}`} className="text-sm text-white hover:underline">{d.title}</Link><p className="text-xs text-neutral-500">{d.subtitle}</p></li>)}
              </ul>
            </div>
          ) : null}

          {project.link ? <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center gap-2 border border-white bg-white px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200">Open project <ExternalLink size={14} /></a> : null}
          <Link href="/map" className="block text-center text-xs uppercase tracking-[0.18em] text-neutral-500 hover:text-white">See connection map</Link>
        </aside>
      </div>
    </div>
  )
}
