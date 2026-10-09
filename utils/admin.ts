export function getAllowedAdminEmail() {
    // Prefer server-only env. NEXT_PUBLIC_* is a local fallback only.
    return (
        process.env.ALLOWED_ADMIN_EMAIL?.trim().toLowerCase() ||
        process.env.NEXT_PUBLIC_ALLOWED_EMAIL?.trim().toLowerCase() ||
        ""
    )
}

export function isAdminEmail(email: string | null | undefined) {
    const allowed = getAllowedAdminEmail()
    if (!allowed || !email) return false
    return email.trim().toLowerCase() === allowed
}
