import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { authCookieOptions, isAuthCookieName } from "@/utils/supabase/cookie-options"

/**
 * Clears the Supabase auth session cookies.
 * Always expires sb-* cookies even when signOut fails (dead refresh token).
 */
export async function POST() {
  const cookieStore = await cookies()
  const response = NextResponse.json({ ok: true })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const opts = authCookieOptions(options)
            cookieStore.set(name, value, opts)
            response.cookies.set(name, value, opts)
          })
        },
      },
    },
  )

  // Ignore refresh-token errors — we still wipe cookies below.
  await supabase.auth.signOut().catch(() => undefined)

  for (const cookie of cookieStore.getAll()) {
    if (!isAuthCookieName(cookie.name)) continue
    response.cookies.set(cookie.name, "", { maxAge: 0, path: "/" })
    try {
      cookieStore.set(cookie.name, "", { maxAge: 0, path: "/" })
    } catch {
      /* ignore */
    }
  }

  return response
}
