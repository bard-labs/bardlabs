export const PROJECT_STATUSES = ["active", "paused", "done"] as const

export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export function normalizeProjectStatus(status: string | null | undefined): ProjectStatus {
  if (status === "paused" || status === "done") return status
  return "active"
}

export function projectStatusLabel(status: string | null | undefined) {
  const value = normalizeProjectStatus(status)
  if (value === "paused") return "Paused"
  if (value === "done") return "Done"
  return "Active"
}
