import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { isAdminEmail } from "@/utils/admin"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!isAdminEmail(user?.email)) {
        redirect("/login")
    }

    return <>{children}</>
}
