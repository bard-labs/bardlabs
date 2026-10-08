import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { isAdminEmail } from "@/utils/admin"

export async function POST() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!isAdminEmail(user?.email)) {
        await supabase.auth.signOut()
        return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 403 })
    }

    return NextResponse.json({ ok: true })
}
