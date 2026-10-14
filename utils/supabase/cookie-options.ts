type CookieOpts = {
  path?: string
  sameSite?: "lax" | "strict" | "none" | boolean
  secure?: boolean
  httpOnly?: boolean
  maxAge?: number
  domain?: string
  expires?: Date
  [key: string]: unknown
}

/**
 * Auth cookies must be readable by the browser Supabase client.
 * Forcing httpOnly broke JWT attachment → anon REST → 401 on admin writes.
 */
export function authCookieOptions(options?: CookieOpts): CookieOpts {
  return {
    ...options,
    path: options?.path ?? "/",
    sameSite: (options?.sameSite as CookieOpts["sameSite"]) ?? "lax",
    secure: options?.secure ?? process.env.NODE_ENV === "production",
    httpOnly: false,
  }
}

export function isAuthCookieName(name: string) {
  return (
    name.startsWith("sb-") ||
    name.includes("supabase") ||
    name.includes("auth-token")
  )
}
