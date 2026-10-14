import { createClient } from "@/utils/supabase/server"
import { FEATURE_DEFAULTS, type FeatureId, type SiteFeature } from "@/lib/features"

export async function fetchFeatures(): Promise<SiteFeature[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("site_features")
      .select("id, label, path, enabled, sort_order")
      .order("sort_order", { ascending: true })

    if (!data?.length) return FEATURE_DEFAULTS

    const mapped = data.map((row) => ({
      id: row.id as FeatureId,
      label: row.label,
      path: row.path,
      enabled: Boolean(row.enabled),
      sort_order: row.sort_order,
    }))

    return FEATURE_DEFAULTS.map((def) => mapped.find((m) => m.id === def.id) ?? def)
  } catch {
    return FEATURE_DEFAULTS
  }
}

export async function isFeatureEnabled(id: FeatureId): Promise<boolean> {
  const features = await fetchFeatures()
  return features.find((f) => f.id === id)?.enabled ?? true
}
