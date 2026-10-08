import type { Metadata } from "next";
import "./globals.css";

import { DynamicIsland } from "@/components/DynamicIsland";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Bardlabs",
  description: "Engineering. Curiosity. Evolution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-neutral-900 text-white">
        <SmoothScroll />
        {children}
        <DynamicIsland />
      </body>
    </html>
  );
}
