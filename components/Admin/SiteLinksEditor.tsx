"use client"

import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Link2, Save, Trash2 } from "lucide-react"

type SiteLink = {
  id: string
  label: string
  url: string
  kind: string
  sort_order: number
}

export function SiteLinksEditor() {
  const supabase = createClient()
  const [links, setLinks] = useState<SiteLink[]>([])
  const [form, setForm] = useState({ id: "", label: "", url: "", kind: "social" })

  const fetchData = useCallback(async () => {
    const { data } = await supabase.from("site_links").select("*").order("sort_order")
    if (data) setLinks(data as SiteLink[])
  }, [supabase])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  const save = async () => {
    if (!form.id || !form.label || !form.url) return
    await supabase.from("site_links").upsert({
      id: form.id.trim().toLowerCase(),
      label: form.label,
      url: form.url,
      kind: form.kind,
      sort_order: links.length * 10 + 10,
    })
    setForm({ id: "", label: "", url: "", kind: "social" })
    fetchData()
  }

  const remove = async (id: string) => {
    if (!confirm(`Delete ${id}?`)) return
    await supabase.from("site_links").delete().eq("id", id)
    fetchData()
  }

  return (
    <div className="rounded-3xl border border-white/5 bg-neutral-900/50 p-6">
      <h2 className="mb-6 flex items-center gap-2 text-xl font-medium">
        <Link2 size={20} className="text-sky-400" />
        Links · X · LinkedIn
      </h2>

      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        <input
          className="rounded-lg border border-transparent bg-neutral-800 px-3 py-2 text-sm outline-none focus:border-sky-500"
          placeholder="id (linkedin)"
          value={form.id}
          onChange={(e) => setForm({ ...form, id: e.target.value })}
        />
        <input
          className="rounded-lg border border-transparent bg-neutral-800 px-3 py-2 text-sm outline-none focus:border-sky-500"
          placeholder="Label"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
        />
        <input
          className="rounded-lg border border-transparent bg-neutral-800 px-3 py-2 text-sm outline-none focus:border-sky-500 sm:col-span-2"
          placeholder="https://..."
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
        />
        <button
          onClick={save}
          className="flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium hover:bg-sky-500 sm:col-span-2"
        >
          <Save size={16} /> Save link
        </button>
      </div>

      <ul className="space-y-2">
        {links.map((link) => (
          <li
            key={link.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{link.label}</p>
              <p className="truncate text-xs text-neutral-500">{link.url}</p>
            </div>
            <button onClick={() => remove(link.id)} className="p-2 text-red-400 hover:bg-white/10 rounded-lg">
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
