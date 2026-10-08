import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const ALLOWED_EMAIL = process.env.NEXT_PUBLIC_ALLOWED_EMAIL

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")

  if (error) {
    console.error("Supabase auth error:", error)
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=${encodeURIComponent(`Auth error: ${error}`)}`)
  }

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=${encodeURIComponent("No code provided")}`)
  }

  try {
    const cookieStore = await cookies()

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
              cookieStore.set(name, value, options)
            })
          },
        },
      },
    )

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error("Auth exchange error:", exchangeError)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=${encodeURIComponent("Invalid or expired link")}`,
      )
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("Failed to get user:", userError?.message)
      await supabase.auth.signOut()
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=${encodeURIComponent("Failed to authenticate")}`,
      )
    }

    if (ALLOWED_EMAIL && user.email !== ALLOWED_EMAIL) {
      console.error("Unauthorized access attempt:", user.email)
      await supabase.auth.signOut()
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=${encodeURIComponent("Access denied")}`)
    }

    return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
  } catch (err) {
    console.error("Callback error:", err)
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=${encodeURIComponent("Authentication failed")}`)
  }
}
