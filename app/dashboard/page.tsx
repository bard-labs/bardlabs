"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { CategoryManager } from "@/components/Admin/CategoryManager"
import { ProjectEditor } from "@/components/Admin/ProjectEditor"
import { LogEntry } from "@/components/Admin/LogEntry"
import { BrainNodeEditor } from "@/components/Admin/BrainNodeEditor"
import { SignOutButton } from "@/components/Admin/SignOutButton"
import { SiteLinksEditor } from "@/components/Admin/SiteLinksEditor"
import { LabTreeEditor } from "@/components/Admin/LabTreeEditor"
import { ProjectDisciplineLinker } from "@/components/Admin/ProjectDisciplineLinker"
import { FeatureToggles } from "@/components/Admin/FeatureToggles"
import { OverviewEditor } from "@/components/Admin/OverviewEditor"
import { Menu } from "lucide-react"

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "projects", label: "Projects" },
  { value: "links", label: "Links" },
  { value: "connections", label: "Connections" },
  { value: "brain", label: "Brain" },
  { value: "categories", label: "Categories" },
  { value: "logs", label: "Logs" },
] as const

export default function Dashboard() {
  const [tab, setTab] = useState<string>("overview")

  return (
    <div className="min-h-[100svh] bg-[#050505] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Admin</p>
            <h1 className="truncate text-lg font-medium tracking-tight sm:text-xl">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden text-[11px] uppercase tracking-[0.18em] text-neutral-500 hover:text-white sm:inline"
            >
              Site
            </Link>
            <SignOutButton />
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-white/15 bg-transparent md:hidden"
                  aria-label="Open sections"
                >
                  <Menu size={16} />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-[#0a0a0a] text-white">
                <DrawerHeader>
                  <DrawerTitle>Sections</DrawerTitle>
                </DrawerHeader>
                <div className="grid gap-1 px-4 pb-8">
                  {TABS.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setTab(item.value)}
                      className={`rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                        tab === item.value ? "bg-white text-black" : "bg-white/5 text-neutral-300"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        <div className="mx-auto hidden max-w-6xl px-4 pb-3 sm:px-6 md:block">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList
              variant="line"
              className="h-9 max-h-9 w-full justify-start gap-1 overflow-x-auto overflow-y-hidden bg-transparent p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {TABS.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="shrink-0 rounded-none px-3 py-2 text-xs tracking-wide text-neutral-500 data-[state=active]:text-white"
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsContent value="overview" className="mt-0 space-y-6 outline-none">
            <OverviewEditor />
            <FeatureToggles />
            <div className="grid gap-6 lg:grid-cols-2">
              <ProjectDisciplineLinker />
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h2 className="text-lg font-medium">Quick links</h2>
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <Link href="/map" className="underline-offset-4 hover:underline">
                    Connections
                  </Link>
                  <Link href="/projects" className="underline-offset-4 hover:underline">
                    Projects
                  </Link>
                  <Link href="/brain" className="underline-offset-4 hover:underline">
                    Brain
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-0 outline-none">
            <div className="h-[min(78svh,820px)]">
              <ProjectEditor />
            </div>
          </TabsContent>

          <TabsContent value="links" className="mt-0 outline-none">
            <SiteLinksEditor />
          </TabsContent>

          <TabsContent value="connections" className="mt-0 outline-none">
            <div className="h-[min(78svh,820px)]">
              <LabTreeEditor />
            </div>
          </TabsContent>

          <TabsContent value="brain" className="mt-0 outline-none">
            <div className="h-[min(78svh,820px)]">
              <BrainNodeEditor />
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-0 outline-none">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="logs" className="mt-0 outline-none">
            <LogEntry />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
