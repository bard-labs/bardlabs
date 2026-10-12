import { toast } from "sonner"

/** True when Supabase rejected the call for missing/invalid auth. */
export function isAuthFailure(error: { message?: string; code?: string; status?: number } | null) {
  if (!error) return false
  const msg = (error.message || "").toLowerCase()
  return (
    error.status === 401 ||
    error.code === "PGRST301" ||
    msg.includes("jwt") ||
    msg.includes("unauthorized") ||
    msg.includes("not authenticated") ||
    msg.includes("refresh token")
  )
}

/** Toast + send the admin back to login when the session is dead. */
export function handleAuthFailure(
  error: { message?: string; code?: string; status?: number } | null,
  label = "Session expired",
) {
  if (!isAuthFailure(error)) return false
  toast.error(label, {
    description: "Sign in again to continue.",
  })
  window.setTimeout(() => {
    window.location.assign("/login")
  }, 600)
  return true
}
