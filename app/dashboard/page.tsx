import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Send, FolderKanban, FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const [{ count: ideasCount }, { count: outreachesCount }, { count: projectsCount }, { count: sopsCount }] =
    await Promise.all([
      supabase.from("ideas").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "active"),
      supabase.from("outreaches").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("projects").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("sops").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    ])

  const stats = [
    {
      title: "Active Ideas",
      value: ideasCount || 0,
      icon: Lightbulb,
      href: "/dashboard/ideas",
      description: "Business ideas in your base",
    },
    {
      title: "Outreaches",
      value: outreachesCount || 0,
      icon: Send,
      href: "/dashboard/outreaches",
      description: "Total outreach attempts",
    },
    {
      title: "Projects",
      value: projectsCount || 0,
      icon: FolderKanban,
      href: "/dashboard/projects",
      description: "Active and planned projects",
    },
    {
      title: "SOPs",
      value: sopsCount || 0,
      icon: FileText,
      href: "/dashboard/sops",
      description: "Standard operating procedures",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your workspace.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              <Button asChild variant="link" className="px-0 mt-2 h-auto">
                <Link href={stat.href}>View all →</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/dashboard/ideas">
                <Lightbulb className="mr-2 h-4 w-4" />
                Add new idea
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/dashboard/outreaches">
                <Send className="mr-2 h-4 w-4" />
                Create outreach
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/dashboard/projects">
                <FolderKanban className="mr-2 h-4 w-4" />
                Start new project
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/dashboard/sops">
                <FileText className="mr-2 h-4 w-4" />
                Upload SOP
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
