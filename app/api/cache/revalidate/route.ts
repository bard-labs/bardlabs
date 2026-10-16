import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { isAdminEmail } from "@/utils/admin"

const resources = {
  projects: "public-projects",
  logs: "public-logs",
  brain: "public-brain",
  overview: "public-overview",
} as const

type Resource = keyof typeof resources

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!isAdminEmail(user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body: unknown = await request.json().catch(() => null)
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const resource = "resource" in body && typeof body.resource === "string" ? body.resource as Resource : null
  if (!resource || !(resource in resources)) {
    return NextResponse.json({ error: "Invalid resource" }, { status: 400 })
  }

  revalidateTag(resources[resource], "max")
  if (resource === "projects") {
    revalidateTag("public-lab-graph", "max")
    if ("id" in body && typeof body.id === "string" && body.id) {
      revalidateTag(`public-project:${body.id}`, "max")
    }
  }

  return NextResponse.json({ ok: true })
}
