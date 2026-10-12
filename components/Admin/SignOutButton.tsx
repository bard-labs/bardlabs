"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { toastAction } from "@/lib/toast-action"

export function SignOutButton() {
  const [pending, setPending] = useState(false)

  const handleSignOut = async () => {
    if (pending) return
    setPending(true)

    try {
      await toastAction(
        async () => {
          const supabase = createClient()
          await supabase.auth.signOut({ scope: "local" })

          const res = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "same-origin",
          })

          if (!res.ok) {
            const body = (await res.json().catch(() => null)) as { error?: string } | null
            throw new Error(body?.error || "Sign out failed")
          }
        },
        {
          loading: "Signing out…",
          success: "Signed out",
          error: "Could not sign out",
        },
      )

      window.location.assign("/login")
    } catch {
      setPending(false)
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleSignOut()}
      disabled={pending}
      className="text-sm text-neutral-400 transition-colors hover:text-white disabled:cursor-wait disabled:opacity-50"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  )
}
