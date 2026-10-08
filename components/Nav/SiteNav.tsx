"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { labNavCells } from "@/lib/lab"

gsap.registerPlugin(useGSAP)

export function SiteNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [heroInView, setHeroInView] = useState(pathname === "/")
  const rootRef = useRef<HTMLDivElement>(null)
  const cellsRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const hero = document.getElementById("lab-hero")
    if (!hero) {
      setHeroInView(false)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) =>
        setHeroInView(Boolean(entry?.isIntersecting && entry.intersectionRatio > 0.45)),
      { threshold: [0.45, 0.7] },
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [pathname])

  const clearClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const requestOpen = () => {
    clearClose()
    setOpen(true)
  }

  const requestClose = () => {
    clearClose()
    closeTimer.current = setTimeout(() => setOpen(false), 200)
  }

  useGSAP(
    () => {
      if (!open || !cellsRef.current) return

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const frames = cellsRef.current.querySelectorAll(".nav-cell")
      const labels = cellsRef.current.querySelectorAll(".nav-cell-label")

      if (reduce) {
        gsap.set([frames, labels], { clearProps: "all", opacity: 1, x: 0, y: 0 })
        return
      }

      gsap.fromTo(
        frames,
        { opacity: 0, x: 48, y: -28 },
        { opacity: 1, x: 0, y: 0, duration: 0.45, stagger: 0.05, ease: "power3.out" },
      )
      gsap.fromTo(
        labels,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: "power3.out", delay: 0.12 },
      )
    },
    { scope: rootRef, dependencies: [open, heroInView], revertOnUpdate: true },
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const showHeroGrid = heroInView && pathname === "/"

  return (
    <div ref={rootRef} className="fixed inset-x-0 top-0 z-[60]">
      <div className="relative z-[70] flex items-start justify-between px-5 pt-5 md:px-8">
        <Link
          href="/"
          className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/50 text-xs font-medium tracking-[0.2em] text-white backdrop-blur-xl transition-transform active:scale-[0.97]"
          aria-label="Bardlabs home"
        >
          B
        </Link>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="lab-nav-overlay"
          className="relative flex h-11 items-center gap-3 rounded-full border border-white/15 bg-black/50 px-4 text-[11px] font-medium uppercase tracking-[0.22em] text-white backdrop-blur-xl transition-transform active:scale-[0.97]"
          onMouseEnter={requestOpen}
          onFocus={requestOpen}
          onClick={() => {
            clearClose()
            setOpen((v) => !v)
          }}
        >
          <span className="relative flex h-3 w-4 flex-col justify-between" aria-hidden>
            <span
              className={`block h-px w-full bg-white transition-transform duration-200 ${open ? "translate-y-[5px] rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-full bg-white transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-px w-full bg-white transition-transform duration-200 ${open ? "-translate-y-[5px] -rotate-45" : ""}`}
            />
          </span>
          Menu
        </button>
      </div>

      <div
        id="lab-nav-overlay"
        className={`fixed inset-0 z-[65] bg-black transition-[opacity,clip-path] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open
            ? "pointer-events-auto opacity-100 [clip-path:inset(0_0_0_0)]"
            : "pointer-events-none opacity-0 [clip-path:inset(0_0_100%_100%)]"
        }`}
        onMouseEnter={requestOpen}
        onMouseLeave={requestClose}
        aria-hidden={!open}
        {...(!open ? { inert: true } : {})}
      >
        <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.18] mix-blend-overlay" />
        <div className="absolute right-0 top-0 h-20 w-48" onMouseEnter={requestOpen} />

        <div ref={cellsRef} className="relative h-full w-full p-3 md:p-4">
          {showHeroGrid ? (
            <div className="grid h-full grid-cols-12 grid-rows-3 gap-0 border border-white/20">
              <div className="nav-cell group relative col-span-4 border-b border-r border-white/20 md:col-span-3">
                <NoiseHover />
              </div>
              <div className="nav-cell group relative col-span-4 border-b border-r border-white/20 md:col-span-6">
                <NoiseHover />
              </div>
              <div className="nav-cell group relative col-span-4 border-b border-white/20 md:col-span-3">
                <NoiseHover />
              </div>

              <div className="nav-cell group relative col-span-2 border-b border-r border-white/20 md:col-span-2">
                <NoiseHover />
              </div>
              <Link
                href="/"
                className="nav-cell group relative col-span-8 flex flex-col items-center justify-center border-b border-r border-white/20 md:col-span-8"
                onClick={() => setOpen(false)}
              >
                <NoiseHover />
                <div className="nav-cell-label relative z-10 text-center">
                  <p className="text-[clamp(2.5rem,10vw,7rem)] font-semibold leading-none tracking-[-0.06em] text-white">
                    BARDLABS
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.35em] text-neutral-400">
                    Laboratory
                  </p>
                </div>
              </Link>
              <div className="nav-cell group relative col-span-2 border-b border-white/20 md:col-span-2">
                <NoiseHover />
              </div>

              <Link
                href="/projects"
                className="nav-cell group relative col-span-6 flex items-end border-r border-white/20 p-5 md:col-span-6"
                onClick={() => setOpen(false)}
              >
                <NoiseHover />
                <div className="nav-cell-label relative z-10">
                  <p className="text-lg font-medium tracking-tight">Archive</p>
                  <p className="text-xs text-neutral-500">Project Universe</p>
                </div>
              </Link>
              <Link
                href="/brain"
                className="nav-cell group relative col-span-6 flex items-end p-5"
                onClick={() => setOpen(false)}
              >
                <NoiseHover />
                <div className="nav-cell-label relative z-10">
                  <p className="text-lg font-medium tracking-tight">Brain</p>
                  <p className="text-xs text-neutral-500">Knowledge map</p>
                </div>
              </Link>
            </div>
          ) : (
            <div className="grid h-full grid-cols-12 auto-rows-fr gap-0 border border-white/20">
              {labNavCells.map((cell) => (
                <Link
                  key={cell.id}
                  href={cell.href}
                  className={`nav-cell group relative flex min-h-[18vh] flex-col justify-end border border-white/15 p-5 md:min-h-0 ${cell.span}`}
                  onClick={() => setOpen(false)}
                >
                  <NoiseHover />
                  <div className="nav-cell-label relative z-10">
                    <p className="text-xl font-medium tracking-tight md:text-2xl">{cell.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-neutral-500">
                      {cell.subtitle}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function NoiseHover() {
  return (
    <span
      aria-hidden
      className="nav-noise pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
    />
  )
}
