"use client"

import Link from "next/link"

const links = [
  { href: "/#now", label: "Now" },
  { href: "/#disciplines", label: "Lab" },
  { href: "/#questions", label: "Questions" },
  { href: "/projects", label: "Projects" },
  { href: "/brain", label: "Brain" },
]

export function SimpleNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
      <Link
        href="/"
        className="shrink-0 text-[11px] font-medium tracking-[0.22em] text-white uppercase"
      >
        Bardlabs
      </Link>
      <nav className="flex min-w-0 items-center gap-2 overflow-x-auto text-[11px] tracking-[0.12em] text-neutral-400 uppercase sm:gap-5 sm:text-xs sm:tracking-[0.16em] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="shrink-0 transition-colors hover:text-white">
            {link.label}
          </Link>
        ))}
        <a
          href="https://bardiamardan.xyz"
          target="_blank"
          rel="noreferrer"
          className="hidden shrink-0 text-white transition-opacity hover:opacity-70 sm:inline"
        >
          bardiamardan.xyz
        </a>
      </nav>
    </header>
  )
}
