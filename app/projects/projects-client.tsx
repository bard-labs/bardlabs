"use client"

import React, { useMemo } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ProjectCard, type Project as CardProject } from "@/components/ProjectCard"
import type { PublicProject } from "@/lib/public-data"

export function ProjectsClient({ initialProjects }: { initialProjects: PublicProject[] }) {
  const projects = useMemo<CardProject[]>(
    () =>
      initialProjects.map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description ?? "",
        tags: project.tags ?? [],
        images: project.images ?? [],
        link: project.link ?? undefined,
        status: project.status,
      })),
    [initialProjects],
  )

  useGSAP(() => {
    gsap.fromTo(
      ".project-card",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out" },
    )
  }, [])

  return (
    <div className="min-h-screen bg-[#050505] p-8 pb-32 font-sans text-white">
      <header className="mx-auto mb-12 max-w-7xl pt-12">
        <h1 className="mb-6 text-5xl font-bold tracking-tighter">Projects</h1>
      </header>

      {projects.length === 0 ? (
        <p className="mx-auto max-w-7xl text-neutral-500">No data found</p>
      ) : (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
