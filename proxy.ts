import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { getAllowedAdminEmail, isAdminEmail } from "@/utils/admin"
import { authCookieOptions, isAuthCookieName } from "@/utils/supabase/cookie-options"

function clearAuthCookies(request: NextRequest, response: NextResponse) {
  for (const cookie of request.cookies.getAll()) {
    if (!isAuthCookieName(cookie.name)) continue
    response.cookies.set(cookie.name, "", {
      maxAge: 0,
      path: "/",
    })
    request.cookies.delete(cookie.name)
  }
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, authCookieOptions(options)),
          )
        },
      },
    },
  )

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // Stale / revoked refresh tokens leave broken cookies that 400 forever.
  if (
    error &&
    (error.code === "refresh_token_not_found" ||
      error.message?.toLowerCase().includes("refresh token"))
  ) {
    clearAuthCookies(request, response)
  }

  const isAdmin = isAdminEmail(user?.email)
  const isProtected =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/admin")

  if (user && !isAdmin && getAllowedAdminEmail()) {
    await supabase.auth.signOut()
    clearAuthCookies(request, response)
    if (isProtected || request.nextUrl.pathname === "/login") {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      const redirect = NextResponse.redirect(url)
      clearAuthCookies(request, redirect)
      return redirect
    }
  }

  if (isProtected && !isAdmin) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    const redirect = NextResponse.redirect(url)
    if (error) clearAuthCookies(request, redirect)
    return redirect
  }

  if (request.nextUrl.pathname === "/login" && isAdmin) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
