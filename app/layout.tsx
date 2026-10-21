import type { Metadata } from "next"
import { Cormorant_Garamond, DM_Sans, Lexend, Unbounded } from "next/font/google"
import "./globals.css"

import { AppChrome } from "@/components/AppChrome"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
})

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-lexend",
  display: "swap",
})

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-unbounded",
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
})

const fontVariables = `${dmSans.variable} ${lexend.variable} ${unbounded.variable} ${cormorant.variable}`

export const metadata: Metadata = {
  title: "Bardlabs",
  description:
    "Bardlabs is Bardia Mardan's personal identity lab. A digital space for how he thinks, what he builds, what he investigates, and where those interests meet.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${fontVariables} dark bg-[#050505]`} suppressHydrationWarning>
      <body className="min-h-[100svh] bg-[#050505] font-sans text-white antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          <AppChrome>{children}</AppChrome>
          <Toaster position="bottom-right" richColors closeButton theme="dark" />
        </ThemeProvider>
      </body>
    </html>
  )
}
