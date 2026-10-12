"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { createClient } from "@/utils/supabase/client"
import { Switch } from "@/components/ui/switch"
import { FEATURE_DEFAULTS, type FeatureId, type SiteFeature } from "@/lib/features"
import { handleAuthFailure } from "@/lib/auth-session"

export function FeatureToggles() {
  const supabase = createClient()
  const [features, setFeatures] = useState<SiteFeature[]>(FEATURE_DEFAULTS)
  const [pending, setPending] = useState<FeatureId | null>(null)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("site_features")
      .select("id, label, path, enabled, sort_order")
      .order("sort_order")

    if (error) {
      if (handleAuthFailure(error)) return
      toast.error("Could not load features", { description: error.message })
      return
    }

    if (data?.length) {
      setFeatures(
        FEATURE_DEFAULTS.map((def) => {
          const row = data.find((d) => d.id === def.id)
          return row
            ? {
                id: row.id as FeatureId,
                label: row.label,
                path: row.path,
                enabled: Boolean(row.enabled),
                sort_order: row.sort_order,
              }
            : def
        }),
      )
    }
  }, [supabase])

  useEffect(() => {
    void load()
  }, [load])

  const toggle = async (id: FeatureId, enabled: boolean) => {
    const prev = features
    setFeatures((p) => p.map((f) => (f.id === id ? { ...f, enabled } : f)))
    setPending(id)

    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      setFeatures(prev)
      setPending(null)
      handleAuthFailure({ message: "unauthorized", status: 401 }, "Not signed in")
      return
    }

    const label = FEATURE_DEFAULTS.find((f) => f.id === id)?.label ?? id
    const path = FEATURE_DEFAULTS.find((f) => f.id === id)?.path ?? `/${id}`
    const sort_order = FEATURE_DEFAULTS.find((f) => f.id === id)?.sort_order ?? 0
    const updated_at = new Date().toISOString()

    // Prefer UPDATE (seeded rows exist). Fall back to INSERT only if missing.
    const { data: updated, error: updateError } = await supabase
      .from("site_features")
      .update({ enabled, label, path, sort_order, updated_at })
      .eq("id", id)
      .select("id")

    let error = updateError
    if (!error && (!updated || updated.length === 0)) {
      const insert = await supabase.from("site_features").insert({
        id,
        label,
        path,
        enabled,
        sort_order,
        updated_at,
      })
      error = insert.error
    }

    setPending(null)

    if (error) {
      setFeatures(prev)
      if (handleAuthFailure(error, `${label} not updated`)) return
      toast.error(`${label} not updated`, { description: error.message })
      return
    }

    toast.success(enabled ? `${label} is on` : `${label} is off`)
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <h2 className="text-lg font-medium tracking-tight">Public features</h2>
      <p className="mt-1 text-sm text-neutral-500">
        Off routes show a minimal offline state. Hidden from navigation.
      </p>
      <ul className="mt-6 space-y-4">
        {features.map((feature) => (
          <li key={feature.id} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{feature.label}</p>
              <p className="text-xs text-neutral-500">{feature.path}</p>
            </div>
            <Switch
              checked={feature.enabled}
              disabled={pending === feature.id}
              onCheckedChange={(checked) => void toggle(feature.id, checked)}
              aria-label={`Toggle ${feature.label}`}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
