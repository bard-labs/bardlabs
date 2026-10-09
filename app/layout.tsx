import type { Metadata } from "next"
import "./globals.css"

import { AppChrome } from "@/components/AppChrome"
import { ThemeProvider } from "@/components/providers/theme-provider"

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
    <html lang="en" className="dark bg-[#050505]" suppressHydrationWarning>
      <body className="min-h-[100svh] bg-[#050505] font-sans text-white antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          <AppChrome>{children}</AppChrome>
        </ThemeProvider>
      </body>
    </html>
  )
}
