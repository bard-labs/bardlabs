"use client"

import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Switch } from "@/components/ui/switch"
import { FEATURE_DEFAULTS, type FeatureId, type SiteFeature } from "@/lib/features"

export function FeatureToggles() {
  const supabase = createClient()
  const [features, setFeatures] = useState<SiteFeature[]>(FEATURE_DEFAULTS)

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("site_features")
      .select("id, label, path, enabled, sort_order")
      .order("sort_order")
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
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, enabled } : f)))
    await supabase.from("site_features").upsert({
      id,
      label: FEATURE_DEFAULTS.find((f) => f.id === id)?.label ?? id,
      path: FEATURE_DEFAULTS.find((f) => f.id === id)?.path ?? `/${id}`,
      enabled,
      sort_order: FEATURE_DEFAULTS.find((f) => f.id === id)?.sort_order ?? 0,
      updated_at: new Date().toISOString(),
    })
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
              onCheckedChange={(checked) => void toggle(feature.id, checked)}
              aria-label={`Toggle ${feature.label}`}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
