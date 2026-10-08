"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { labNavCells } from "@/lib/lab"

gsap.registerPlugin(useGSAP)

export function SiteNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [heroInView, setHeroInView] = useState(pathname === "/")
  /** 0 = brand frame, 1 = discipline index — only used on first viewport */
  const [panel, setPanel] = useState(0)
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

  useEffect(() => {
    if (!open) setPanel(0)
  }, [open])

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
    closeTimer.current = setTimeout(() => setOpen(false), 280)
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
        { opacity: 1, x: 0, y: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" },
      )
      gsap.fromTo(
        labels,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.38, stagger: 0.04, ease: "power3.out", delay: 0.12 },
      )
    },
    { scope: rootRef, dependencies: [open, heroInView, panel], revertOnUpdate: true },
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
      if (!open || !heroInView || pathname !== "/") return
      if (e.key === "ArrowRight") setPanel(1)
      if (e.key === "ArrowLeft") setPanel(0)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, heroInView, pathname])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const showHeroChrome = heroInView && pathname === "/"
  const showBrandPanel = showHeroChrome && panel === 0
  const showIndexPanel = !showHeroChrome || panel === 1

  return (
    <div ref={rootRef} className="fixed inset-x-0 top-0 z-[60]">
      <div className="relative z-[70] flex items-start justify-end px-4 pt-4 sm:px-5 sm:pt-5 md:px-8">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="lab-nav-overlay"
          className="relative flex h-10 items-center gap-2.5 rounded-full border border-white/15 bg-black/50 px-3.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur-xl transition-transform active:scale-[0.97] sm:h-11 sm:gap-3 sm:px-4 sm:text-[11px] sm:tracking-[0.22em]"
          onMouseEnter={requestOpen}
          onFocus={requestOpen}
          onClick={() => {
            clearClose()
            setOpen((v) => !v)
          }}
        >
          <span className="relative flex h-3 w-4 flex-col justify-between" aria-hidden>
            <span
              className={`block h-px w-full bg-white transition-transform duration-300 ${open ? "translate-y-[5px] rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-full bg-white transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-px w-full bg-white transition-transform duration-300 ${open ? "-translate-y-[5px] -rotate-45" : ""}`}
            />
          </span>
          Lab
        </button>
      </div>

      <div
        id="lab-nav-overlay"
        className={`fixed inset-0 z-[65] bg-black transition-[opacity,clip-path] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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

        <div ref={cellsRef} className="relative h-full w-full p-2 sm:p-3 md:p-4">
          {showBrandPanel ? (
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

              <button
                type="button"
                className="nav-cell group relative col-span-2 flex items-center justify-center border-b border-r border-white/20 md:col-span-2"
                onClick={() => setPanel(0)}
                disabled={panel === 0}
                aria-label="Back to brand panel"
              >
                <NoiseHover />
                <ChevronLeft
                  className={`nav-cell-label relative z-10 h-7 w-7 sm:h-9 sm:w-9 ${panel === 0 ? "text-white/20" : "text-white"}`}
                  strokeWidth={1.25}
                />
              </button>

              <Link
                href="/"
                className="nav-cell group relative col-span-8 flex flex-col items-center justify-center border-b border-r border-white/20 md:col-span-8"
                onClick={() => setOpen(false)}
              >
                <NoiseHover />
                <div className="nav-cell-label relative z-10 px-2 text-center">
                  <p className="text-[clamp(1.6rem,9vw,7rem)] font-semibold leading-none tracking-[-0.06em] text-white">
                    BARDLABS
                  </p>
                  <p className="mt-2 text-[9px] uppercase tracking-[0.28em] text-neutral-400 sm:mt-3 sm:text-xs sm:tracking-[0.35em]">
                    Laboratory
                  </p>
                </div>
              </Link>

              <button
                type="button"
                className="nav-cell group relative col-span-2 flex items-center justify-center border-b border-white/20 md:col-span-2"
                onClick={() => setPanel(1)}
                aria-label="Open lab index"
              >
                <NoiseHover />
                <ChevronRight
                  className="nav-cell-label relative z-10 h-7 w-7 text-white sm:h-9 sm:w-9"
                  strokeWidth={1.25}
                />
              </button>

              <Link
                href="/projects"
                className="nav-cell group relative col-span-6 flex items-end border-r border-white/20 p-3 sm:p-5 md:col-span-6"
                onClick={() => setOpen(false)}
              >
                <NoiseHover />
                <div className="nav-cell-label relative z-10">
                  <p className="text-base font-medium tracking-tight sm:text-lg">Archive</p>
                  <p className="text-[10px] text-neutral-500 sm:text-xs">Project Universe</p>
                </div>
              </Link>
              <Link
                href="/brain"
                className="nav-cell group relative col-span-6 flex items-end p-3 sm:p-5"
                onClick={() => setOpen(false)}
              >
                <NoiseHover />
                <div className="nav-cell-label relative z-10">
                  <p className="text-base font-medium tracking-tight sm:text-lg">Brain</p>
                  <p className="text-[10px] text-neutral-500 sm:text-xs">Knowledge map</p>
                </div>
              </Link>
            </div>
          ) : null}

          {showIndexPanel ? (
            <div
              className={`grid h-full grid-cols-12 auto-rows-fr gap-0 border border-white/20 ${showBrandPanel ? "hidden" : ""}`}
            >
              {showHeroChrome ? (
                <button
                  type="button"
                  className="nav-cell group relative col-span-12 flex items-center gap-2 border-b border-white/20 px-4 py-3 md:col-span-12"
                  onClick={() => setPanel(0)}
                  aria-label="Back to brand panel"
                >
                  <NoiseHover />
                  <ChevronLeft className="nav-cell-label relative z-10 h-5 w-5 text-white" />
                  <span className="nav-cell-label relative z-10 text-[10px] uppercase tracking-[0.22em] text-neutral-400 sm:text-xs">
                    Bardlabs
                  </span>
                </button>
              ) : null}

              {labNavCells.map((cell) => (
                <Link
                  key={cell.id}
                  href={cell.href}
                  className={`nav-cell group relative flex min-h-[14vh] flex-col justify-end border border-white/15 p-3 sm:min-h-[18vh] sm:p-5 md:min-h-0 ${cell.span}`}
                  onClick={() => setOpen(false)}
                >
                  <NoiseHover />
                  <div className="nav-cell-label relative z-10">
                    <p className="text-base font-medium tracking-tight sm:text-xl md:text-2xl">
                      {cell.title}
                    </p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-neutral-500 sm:text-xs sm:tracking-[0.18em]">
                      {cell.subtitle}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
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
