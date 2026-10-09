"use client"

import React, { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/utils/supabase/client"
import { ChevronLeft, Calendar, Tag, ExternalLink, Network } from "lucide-react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

interface Project {
  id: string
  title: string
  description: string | null
  link: string | null
  tags: string[] | null
  images: string[] | null
  created_at: string
}

type DisciplineLink = { discipline_id: string; title: string; subtitle: string }

export default function ProjectDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [disciplines, setDisciplines] = useState<DisciplineLink[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true)
      const projectId = Array.isArray(id) ? id[0] : id
      if (!projectId) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase.from("projects").select("*").eq("id", projectId).single()
      if (error || !data) {
        setLoading(false)
        return
      }

      const projectData = data as Project
      setProject(projectData)
      if (projectData.images?.length) setSelectedImage(projectData.images[0])

      const { data: mapped } = await supabase
        .from("project_disciplines")
        .select("discipline_id, lab_disciplines(title, subtitle)")
        .eq("project_id", projectId)

      const linked = ((mapped ?? []) as Array<{
        discipline_id: string
        lab_disciplines: { title: string; subtitle: string } | { title: string; subtitle: string }[] | null
      }>).map((row) => {
        const d = Array.isArray(row.lab_disciplines) ? row.lab_disciplines[0] : row.lab_disciplines
        return {
          discipline_id: row.discipline_id,
          title: d?.title ?? row.discipline_id,
          subtitle: d?.subtitle ?? "",
        }
      })
      setDisciplines(linked)
      setLoading(false)
    }
    void fetchProject()
  }, [id, supabase])

  useGSAP(
    () => {
      if (!project || loading) return
      const tl = gsap.timeline()
      tl.from(headerRef.current, { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" })
        .from(contentRef.current, { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
        .from(metaRef.current, { x: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
    },
    { scope: containerRef, dependencies: [project, loading] },
  )

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="animate-pulse">Loading Project...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#050505] text-white">
        <h2 className="text-2xl font-bold">Project Not Found</h2>
        <button
          onClick={() => router.push("/projects")}
          className="rounded-lg bg-white/10 px-4 py-2 transition-colors hover:bg-white/20"
        >
          Back to Archive
        </button>
      </div>
    )
  }

  const images = (project.images ?? []) as string[]

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
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-400">{project.description}</p>
            ) : null}
          </header>

          <div ref={contentRef} className="mt-8 space-y-4">
            <div className="relative aspect-[16/10] overflow-hidden border border-white/10 bg-neutral-900">
              {selectedImage ? (
                <Image src={selectedImage} alt={project.title} fill className="object-cover" sizes="(max-width:1024px) 100vw, 66vw" />
              ) : (
                <div className="flex h-full items-center justify-center text-neutral-600">No image</div>
              )}
            </div>
            {images.length > 1 ? (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden border ${selectedImage === img ? "border-white" : "border-white/15"}`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="96px" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <aside ref={metaRef} className="space-y-6 lg:col-span-4 lg:pt-16">
          <div className="border border-white/10 p-5">
            <p className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-neutral-500">
              <Calendar size={12} /> Created
            </p>
            <p className="text-sm text-neutral-300">
              {new Date(project.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {project.tags?.length ? (
            <div className="border border-white/10 p-5">
              <p className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                <Tag size={12} /> Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-wider text-neutral-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {disciplines.length ? (
            <div className="border border-white/10 p-5">
              <p className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                <Network size={12} /> Lab fields
              </p>
              <ul className="space-y-2">
                {disciplines.map((d) => (
                  <li key={d.discipline_id}>
                    <Link href={`/lab/${d.discipline_id}`} className="text-sm text-white hover:underline">
                      {d.title}
                    </Link>
                    <p className="text-xs text-neutral-500">{d.subtitle}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 border border-white bg-white px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
            >
              Open project <ExternalLink size={14} />
            </a>
          ) : null}

          <Link href="/map" className="block text-center text-xs uppercase tracking-[0.18em] text-neutral-500 hover:text-white">
            See connection map
          </Link>
        </aside>
      </div>
    </div>
  )
}
