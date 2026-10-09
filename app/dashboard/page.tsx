"use client"

import { CategoryManager } from "@/components/Admin/CategoryManager"
import { ProjectEditor } from "@/components/Admin/ProjectEditor"
import { LogEntry } from "@/components/Admin/LogEntry"
import { BrainNodeEditor } from "@/components/Admin/BrainNodeEditor"
import { SignOutButton } from "@/components/Admin/SignOutButton"
import { SiteLinksEditor } from "@/components/Admin/SiteLinksEditor"
import { LabTreeEditor } from "@/components/Admin/LabTreeEditor"
import { ProjectDisciplineLinker } from "@/components/Admin/ProjectDisciplineLinker"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#050505] p-8 pb-32 font-sans text-white">
      <header className="mx-auto mb-12 flex max-w-7xl items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-neutral-400">
            Content, links, and the connection tree that keeps the lab in sync.
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-[0.16em] text-neutral-500">
            <Link href="/map" className="hover:text-white">
              Public map
            </Link>
            <Link href="/projects" className="hover:text-white">
              Archive
            </Link>
            <Link href="/" className="hover:text-white">
              Site
            </Link>
          </div>
        </div>
        <SignOutButton />
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-4">
          <SiteLinksEditor />
          <ProjectDisciplineLinker />
          <LogEntry />
          <CategoryManager />
        </div>

        <div className="space-y-8 lg:col-span-8">
          <LabTreeEditor />
          <ProjectEditor />
        </div>

        <div className="lg:col-span-12">
          <BrainNodeEditor />
        </div>
      </div>
    </div>
  )
}
