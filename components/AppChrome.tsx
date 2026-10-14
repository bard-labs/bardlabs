"use client"

import { usePathname } from "next/navigation"
import { DynamicIsland } from "@/components/DynamicIsland"
import { SiteNav } from "@/components/Nav/SiteNav"
import SmoothScroll from "@/components/SmoothScroll"

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/login")

  return (
    <>
      {!isDashboard ? <SmoothScroll /> : null}
      {!isDashboard ? <SiteNav /> : null}
      {children}
      {!isDashboard ? <DynamicIsland /> : null}
    </>
  )
}
