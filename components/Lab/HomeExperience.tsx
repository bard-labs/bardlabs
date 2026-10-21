"use client"

import Link from "next/link"
import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowUpRight, Brain } from "lucide-react"
import GlowHero from "@/components/ui/hero-1"
import { ActivitySkyline } from "@/components/Lab/ActivitySkyline"
import { LabQuestions, LabTurns } from "@/components/Lab/IdentitySections"
import { LabOverview } from "@/components/Lab/LabOverview"
import { FooterRevealSpacer, SiteFooter } from "@/components/Lab/SiteFooter"
import { labDisciplines } from "@/lib/lab"
import type { PublicOverview, PublicSiteLink } from "@/lib/public-data"
import type { LabSnapshot } from "@/components/Lab/LabOverview"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function HomeExperience({
  overview,
  links,
  snapshot,
}: {
  overview: PublicOverview
  links: PublicSiteLink[]
  snapshot: LabSnapshot
}) {
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
    <div ref={container} className="min-h-[100svh] overflow-x-hidden text-white selection:bg-white/20">
      <div className="relative z-10 bg-[#050505]">
        <section
          id="lab-hero"
          className="hero-stage relative flex min-h-[100svh] flex-col items-center justify-center px-6"
        >
          <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_55%)]" />

          <GlowHero glowText="BARDLABS" glowTextSize="xl" className="relative z-10" />
          <p className="relative z-10 mt-6 max-w-md text-center text-sm leading-relaxed tracking-wide text-neutral-400">
            Systems · Software · Mechanics · Inquiry — one lab, many surfaces.
          </p>
        </section>

        <section id="disciplines" className="discipline-grid mx-auto max-w-6xl scroll-mt-20 px-4 pt-8 pb-16 md:px-8 md:pb-20">
          <div className="mb-10 flex items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500 sm:text-[11px]">
                Lab
              </p>
              <h2 className="font-label mt-2 text-2xl font-light tracking-tight sm:text-3xl md:text-4xl">
                The fields
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
                Six interests, held in one place. The web portfolio lives on its own site.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-px bg-white/10 md:grid-cols-2">
            {labDisciplines.map(({ title, summary, href, icon: Icon }) => (
              <Link
                key={title}
                href={href}
                className="discipline-card group bg-[#050505] p-6 transition-colors hover:bg-white/[0.03] sm:p-8"
              >
                <Icon
                  className="mb-6 text-neutral-400 transition-colors group-hover:text-white"
                  size={22}
                />
                <h3 className="font-label text-xl font-light tracking-tight sm:text-2xl">{title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-500">{summary}</p>
              </Link>
            ))}
          </div>
        </section>

        <LabOverview overview={overview} links={links} snapshot={snapshot} />

        <LabTurns />

        <LabQuestions />

        <ActivitySkyline />

        <section className="mx-auto grid max-w-6xl grid-cols-1 gap-px bg-white/10 md:grid-cols-2">
          <Link
            href="/projects"
            className="group flex min-h-[180px] flex-col justify-between bg-[#050505] p-8 transition-colors hover:bg-white/[0.03]"
          >
            <ArrowUpRight className="text-neutral-500 transition-colors group-hover:text-white" />
            <div>
              <h3 className="font-label text-2xl font-light tracking-tight">Projects</h3>
              <p className="mt-2 text-sm text-neutral-500">Built inside the lab</p>
            </div>
          </Link>
          <Link
            href="/brain"
            className="group flex min-h-[180px] flex-col justify-between bg-[#050505] p-8 transition-colors hover:bg-white/[0.03]"
          >
            <Brain className="text-neutral-500 transition-colors group-hover:text-cyan-400" size={22} />
            <div>
              <h3 className="font-label text-2xl font-light tracking-tight">Brain</h3>
              <p className="mt-2 text-sm text-neutral-500">How the interests connect</p>
            </div>
          </Link>
        </section>
      </div>

      <FooterRevealSpacer />
      <SiteFooter />
    </div>
  )
}
