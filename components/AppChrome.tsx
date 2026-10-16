"use client"

import { usePathname } from "next/navigation"
import { DynamicIsland } from "@/components/DynamicIsland"
import { SimpleNav } from "@/components/Nav/SimpleNav"
import SmoothScroll from "@/components/SmoothScroll"

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/login")

  return (
    <>
      {!isDashboard ? <SmoothScroll /> : null}
      {/* Full-screen lab menu is off. Restore with <SiteNav /> from components/Nav/SiteNav. */}
      {!isDashboard ? <SimpleNav /> : null}
      {children}
      {!isDashboard ? <DynamicIsland /> : null}
    </>
  )
}
