"use client"

import { useCallback, useEffect, useState } from "react"
import { Save } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/utils/supabase/client"
import { handleAuthFailure } from "@/lib/auth-session"
import { invalidatePublicCache } from "@/lib/public-cache"

const EMPTY = {
  goal: "",
  summary: "",
}

export function OverviewEditor() {
  const supabase = createClient()
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("site_overview")
      .select("goal, summary")
      .eq("id", "main")
      .maybeSingle()

    if (error) {
      if (handleAuthFailure(error)) return
      toast.error("Could not load the overview", { description: error.message })
      return
    }

    if (data) {
      setForm({ goal: data.goal ?? "", summary: data.summary ?? "" })
    }
  }, [supabase])

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0)
    return () => window.clearTimeout(timer)
  }, [load])

  const save = async () => {
    if (!form.goal.trim()) {
      toast.error("Current goal is required")
      return
    }

    setSaving(true)
    const { error } = await supabase.from("site_overview").upsert({
      id: "main",
      goal: form.goal.trim(),
      summary: form.summary.trim(),
      updated_at: new Date().toISOString(),
    })
    setSaving(false)

    if (error) {
      if (handleAuthFailure(error, "Could not save the overview")) return
      toast.error("Could not save the overview", { description: error.message })
      return
    }

    await invalidatePublicCache("overview")
    toast.success("Overview saved")
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <p className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Now</p>
      <h2 className="mt-2 text-lg font-medium">Current goal</h2>
      <p className="mt-2 max-w-xl text-sm text-neutral-500">
        This is the full-screen section at the end of the homepage. Links are edited in the Links tab.
        Write a direction, not a deadline.
      </p>

      <label className="mt-5 block text-xs uppercase tracking-[0.16em] text-neutral-500">
        Goal
        <textarea
          className="mt-2 w-full rounded-lg border border-transparent bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-white/30"
          rows={3}
          value={form.goal}
          onChange={(event) => setForm({ ...form, goal: event.target.value })}
        />
      </label>

      <label className="mt-4 block text-xs uppercase tracking-[0.16em] text-neutral-500">
        About
        <textarea
          className="mt-2 w-full rounded-lg border border-transparent bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-white/30"
          rows={4}
          value={form.summary}
          onChange={(event) => setForm({ ...form, summary: event.target.value })}
        />
      </label>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200 disabled:opacity-60"
        >
          <Save size={16} />
          Save
        </button>
      </div>
    </section>
  )
}
