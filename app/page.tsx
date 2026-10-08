"use client"

import Link from "next/link"
import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  ArrowUpRight,
  Brain,
  Cpu,
  Mail,
  Orbit,
  Sparkles,
  Waves,
} from "lucide-react"
import GlowHero from "@/components/ui/hero-1"
import { WheelCarousel } from "@/components/ui/wheel-carousel"
import { skillWheelItems } from "@/lib/lab"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const disciplines = [
  {
    title: "Systems",
    detail: "IoT, embedded boards, and hardware that talks to the world.",
    icon: Cpu,
  },
  {
    title: "Intelligence",
    detail: "Software, AI, and automation that compounds effort.",
    icon: Sparkles,
  },
  {
    title: "Mechanics",
    detail: "Robots, motion, and control loops that move matter.",
    icon: Waves,
  },
  {
    title: "Flight",
    detail: "Aerospace thinking — structures, sensing, and avionics.",
    icon: Orbit,
  },
]

export default function Home() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      gsap.from(".hero-stage", {
        opacity: 0,
        y: reduce ? 0 : 40,
        duration: 1.1,
        ease: "power3.out",
      })

      gsap.from(".discipline-card", {
        scrollTrigger: {
          trigger: ".discipline-grid",
          start: "top 80%",
        },
        y: reduce ? 0 : 36,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
      })
    },
    { scope: container },
  )

  return (
    <div
      ref={container}
      className="min-h-screen bg-[#050505] text-white selection:bg-white/20 overflow-x-hidden"
    >
      {/* Hero — first viewport */}
      <section
        id="lab-hero"
        className="hero-stage relative flex min-h-[100svh] flex-col items-center justify-center px-6"
      >
        <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_55%)]" />

        <GlowHero
          label="Bardlabs Laboratory"
          glowText="BARDLABS"
          labelSize="sm"
          glowTextSize="xl"
          className="relative z-10"
        />
        <p className="relative z-10 mt-6 max-w-md text-center text-sm leading-relaxed text-neutral-400 tracking-wide">
          Systems · Software · Mechanics · Inquiry — one lab, many surfaces.
        </p>
      </section>

      {/* Disciplines */}
      <section className="discipline-grid mx-auto max-w-6xl px-4 pb-24 pt-8 md:px-8">
        <div className="mb-10 flex items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">
              Disciplines
            </p>
            <h2 className="mt-2 text-3xl font-medium tracking-tight md:text-4xl">
              Where the work overlaps
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 md:grid-cols-2">
          {disciplines.map(({ title, detail, icon: Icon }) => (
            <article
              key={title}
              className="discipline-card group bg-[#050505] p-8 transition-colors hover:bg-white/[0.03]"
            >
              <Icon className="mb-6 text-neutral-400 transition-colors group-hover:text-white" size={22} />
              <h3 className="text-2xl font-medium tracking-tight">{title}</h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-500">
                {detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Skills wheel — limited height, scrollable interaction */}
      <section className="mx-auto max-w-6xl px-4 pb-28 md:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">
              Skills
            </p>
            <h2 className="mt-2 text-3xl font-medium tracking-tight">
              Scroll the orbit
            </h2>
          </div>
          <p className="hidden max-w-xs text-right text-xs text-neutral-500 md:block">
            Drag or scroll — limited stage, full catalog.
          </p>
        </div>
        <div className="h-[min(70vh,560px)] overflow-hidden rounded-none border border-white/15">
          <WheelCarousel
            items={skillWheelItems}
            mode="dark"
            photoSide="left"
            photoWidth={38}
            photoAspect="4/3"
            photoRadius={0}
            contentWidth={1100}
            visibleItems={5}
            edgeFadeSize={22}
            className="min-h-0"
          />
        </div>
      </section>

      {/* Portal links */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-px bg-white/10 px-0 pb-32 md:grid-cols-3">
        <Link
          href="/projects"
          className="group flex min-h-[200px] flex-col justify-between bg-[#050505] p-8 transition-colors hover:bg-white/[0.03]"
        >
          <ArrowUpRight className="text-neutral-500 transition-colors group-hover:text-white" />
          <div>
            <h3 className="text-2xl font-medium tracking-tight">Archive</h3>
            <p className="mt-2 text-sm text-neutral-500">Project Universe</p>
          </div>
        </Link>
        <Link
          href="/brain"
          className="group flex min-h-[200px] flex-col justify-between bg-[#050505] p-8 transition-colors hover:bg-white/[0.03]"
        >
          <Brain className="text-neutral-500 transition-colors group-hover:text-cyan-400" size={22} />
          <div>
            <h3 className="text-2xl font-medium tracking-tight">The Brain</h3>
            <p className="mt-2 text-sm text-neutral-500">Interactive knowledge map</p>
          </div>
        </Link>
        <a
          href="mailto:hello@bardialabs.com"
          className="group flex min-h-[200px] flex-col justify-between bg-[#050505] p-8 transition-colors hover:bg-white/[0.03]"
        >
          <Mail className="text-neutral-500 transition-colors group-hover:text-white" size={22} />
          <div>
            <h3 className="text-2xl font-medium tracking-tight">Contact</h3>
            <p className="mt-2 text-sm text-neutral-500">hello@bardialabs.com</p>
          </div>
        </a>
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-8 text-[11px] uppercase tracking-[0.22em] text-neutral-600 md:flex-row">
          <p>© {new Date().getFullYear()} Bardlabs</p>
          <p>Laboratory · Not a résumé</p>
        </div>
      </footer>
    </div>
  )
}
