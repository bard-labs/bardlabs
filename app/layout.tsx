import type { Metadata } from "next"
import "./globals.css"

import { DynamicIsland } from "@/components/DynamicIsland"
import { SiteNav } from "@/components/Nav/SiteNav"
import { ThemeProvider } from "@/components/providers/theme-provider"
import SmoothScroll from "@/components/SmoothScroll"

export const metadata: Metadata = {
  title: "Bardlabs",
  description: "A laboratory for systems, software, mechanics, and inquiry.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans bg-[#050505] text-white">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SmoothScroll />
          <SiteNav />
          {children}
          <DynamicIsland />
        </ThemeProvider>
      </body>
    </html>
  )
}
