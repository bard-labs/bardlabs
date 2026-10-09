"use client"

import React, { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ProjectCard } from "@/components/ProjectCard"

type Project = {
  id: string
  title: string
  description: string
  link: string
  tags: string[]
  images: string[]
  created_at: string
}

export function ProjectsClient() {
  const supabase = createClient()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: projs } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })
      if (projs) setProjects(projs as Project[])
      setLoading(false)
    }
    void fetchData()
  }, [supabase])

  useGSAP(() => {
    if (!loading) {
      gsap.fromTo(
        ".project-card",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out" },
      )
    }
  }, [loading])

  return (
    <div className="min-h-screen bg-[#050505] p-8 pb-32 font-sans text-white">
      <header className="mx-auto mb-12 max-w-7xl pt-12">
        <h1 className="mb-6 text-5xl font-bold tracking-tighter">Project Universe</h1>
      </header>

      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="space-y-4 text-center">
            <div className="animate-pulse text-2xl font-medium text-neutral-400">Fetching projects...</div>
            <div className="flex justify-center gap-2">
              <div className="h-2 w-2 animate-bounce rounded-full bg-purple-500" style={{ animationDelay: "0ms" }} />
              <div className="h-2 w-2 animate-bounce rounded-full bg-purple-500" style={{ animationDelay: "150ms" }} />
              <div className="h-2 w-2 animate-bounce rounded-full bg-purple-500" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      ) : projects.length === 0 ? (
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
