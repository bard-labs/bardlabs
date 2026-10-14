"use client"

import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { FEATURE_DEFAULTS, type FeatureId, type SiteFeature } from "@/lib/features"

export function useSiteFeatures() {
  const supabase = createClient()
  const [features, setFeatures] = useState<SiteFeature[]>(FEATURE_DEFAULTS)

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("site_features")
      .select("id, label, path, enabled, sort_order")
      .order("sort_order")

    if (!data?.length) return

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
  }, [supabase])

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0)
    return () => window.clearTimeout(timer)
  }, [load])

  const enabled = (id: FeatureId) =>
    features.find((f) => f.id === id)?.enabled ?? true

  return { features, enabled, reload: load }
}
