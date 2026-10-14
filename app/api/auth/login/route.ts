import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { isAdminEmail } from "@/utils/admin"
import { authCookieOptions } from "@/utils/supabase/cookie-options"

/**
 * Server-side admin login.
 * - Rejects any email that is not the allowlisted admin (before Auth is even called).
 * - Never creates accounts; signup stays closed.
 * - Generic error text so attackers cannot probe emails.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""
  const password = typeof body?.password === "string" ? body.password : ""

  if (!email || !password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
  }

  if (!isAdminEmail(email)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

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

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!isAdminEmail(user?.email)) {
    await supabase.auth.signOut()
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  return response
}
