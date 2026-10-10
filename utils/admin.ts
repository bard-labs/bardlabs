export function getAllowedAdminEmail() {
    // Server-only — never read NEXT_PUBLIC_* (leaks allowlist to the client bundle).
    return process.env.ALLOWED_ADMIN_EMAIL?.trim().toLowerCase() || ""
}

export function isAdminEmail(email: string | null | undefined) {
    const allowed = getAllowedAdminEmail()
    if (!allowed || !email) return false
    return email.trim().toLowerCase() === allowed
}
