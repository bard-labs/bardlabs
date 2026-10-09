"use client"

import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { GitBranch, Save } from "lucide-react"
import { labDisciplines } from "@/lib/lab"

type Project = { id: string; title: string }

export function ProjectDisciplineLinker() {
  const supabase = createClient()
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState("")
  const [selected, setSelected] = useState<string[]>([])

  const loadProjects = useCallback(async () => {
    const { data } = await supabase.from("projects").select("id, title").order("created_at", { ascending: false })
    if (data) setProjects(data as Project[])
  }, [supabase])

  const loadLinks = useCallback(async (projectId: string) => {
    if (!projectId) {
      setSelected([])
      return
    }
    const { data } = await supabase
      .from("project_disciplines")
      .select("discipline_id")
      .eq("project_id", projectId)
    setSelected((data ?? []).map((d) => d.discipline_id as string))
  }, [supabase])

  useEffect(() => {
    void loadProjects()
  }, [loadProjects])

  useEffect(() => {
    void loadLinks(selectedProject)
  }, [selectedProject, loadLinks])

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const save = async () => {
    if (!selectedProject) return
    await supabase.from("project_disciplines").delete().eq("project_id", selectedProject)
    if (selected.length) {
      await supabase.from("project_disciplines").insert(
        selected.map((discipline_id) => ({ project_id: selectedProject, discipline_id })),
      )
    }
    alert("Links saved")
  }

  return (
    <div className="rounded-3xl border border-white/5 bg-neutral-900/50 p-6">
      <h2 className="mb-2 flex items-center gap-2 text-xl font-medium">
        <GitBranch size={20} className="text-emerald-400" />
        Map projects → disciplines
      </h2>
      <p className="mb-6 text-sm text-neutral-500">
        Connect archive items to lab fields so discipline pages stay in sync.
      </p>

      <select
        className="mb-4 w-full rounded-lg bg-neutral-800 px-3 py-2 text-sm"
        value={selectedProject}
        onChange={(e) => setSelectedProject(e.target.value)}
      >
        <option value="">Select project</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.title}
          </option>
        ))}
      </select>

      <div className="mb-4 grid grid-cols-2 gap-2">
        {labDisciplines.map((d) => (
          <label
            key={d.id}
            className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
              selected.includes(d.id)
                ? "border-emerald-500/40 bg-emerald-500/10"
                : "border-white/5 bg-white/5"
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(d.id)}
              onChange={() => toggle(d.id)}
              className="accent-emerald-500"
            />
            {d.title}
          </label>
        ))}
      </div>

      <button
        onClick={save}
        disabled={!selectedProject}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500 disabled:opacity-40"
      >
        <Save size={16} /> Save mapping
      </button>
    </div>
  )
}
