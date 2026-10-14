export type FeatureId = "logs" | "brain" | "map" | "projects"

export type SiteFeature = {
  id: FeatureId
  label: string
  path: string
  enabled: boolean
  sort_order: number
}

export const FEATURE_DEFAULTS: SiteFeature[] = [
  { id: "projects", label: "Archive", path: "/projects", enabled: true, sort_order: 10 },
  { id: "brain", label: "Brain", path: "/brain", enabled: true, sort_order: 20 },
  { id: "map", label: "Connections", path: "/map", enabled: true, sort_order: 30 },
  { id: "logs", label: "Logs", path: "/log", enabled: true, sort_order: 40 },
]

export function featureByPath(path: string): FeatureId | null {
  if (path.startsWith("/log")) return "logs"
  if (path.startsWith("/brain")) return "brain"
  if (path.startsWith("/map")) return "map"
  if (path.startsWith("/projects")) return "projects"
  return null
}
