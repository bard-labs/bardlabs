"use client"

import Link from "next/link"
import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { skillOrbitItems } from "@/lib/lab"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function SkillOrbit() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      const section = sectionRef.current
      const stage = stageRef.current
      if (!section || !stage) return

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const cards = gsap.utils.toArray<HTMLElement>(".orbit-item")
      if (!cards.length) return

      const apply = (progress: number) => {
        const index = Math.min(
          cards.length - 1,
          Math.max(0, Math.round(progress * (cards.length - 1))),
        )
        setActive(index)

        cards.forEach((card, i) => {
          const offset = i - progress * (cards.length - 1)
          const distance = Math.min(Math.abs(offset) / 2.2, 1)
          const y = offset * 54
          const scale = 1 - Math.min(Math.abs(offset) * 0.08, 0.35)
          const opacity = Math.max(0.18, Math.cos((distance * Math.PI) / 2))
          gsap.set(card, {
            y,
            scale,
            opacity,
            zIndex: 20 - Math.round(Math.abs(offset) * 10),
          })
        })
      }

      apply(0)

      if (reduce) return

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${Math.max(window.innerHeight * 1.35, 700)}`,
        pin: true,
        scrub: 0.65,
        anticipatePin: 1,
        onUpdate: (self) => apply(self.progress),
      })
    },
    { scope: sectionRef },
  )

  const current = skillOrbitItems[active]!

  return (
    <section ref={sectionRef} className="relative mx-auto max-w-6xl px-4 md:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500 sm:text-[11px]">
            Atlas
          </p>
          <h2 className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
            Fields in motion
          </h2>
        </div>
        <p className="hidden max-w-xs text-right text-xs text-neutral-500 md:block">
          Keep scrolling — the atlas advances with the page.
        </p>
      </div>

      <div
        ref={stageRef}
        className="relative flex h-[min(58vh,460px)] items-center justify-center bg-transparent"
      >
        <div className="pointer-events-none absolute inset-y-8 left-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent md:left-[42%]" />

        <div className="relative z-10 flex w-full max-w-3xl items-center gap-8 md:gap-16">
          <div className="flex w-[38%] shrink-0 justify-center md:w-[42%]">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm sm:h-36 sm:w-36">
              <current.icon className="h-10 w-10 text-white sm:h-12 sm:w-12" strokeWidth={1.25} />
            </div>
          </div>

          <div className="relative h-64 flex-1 overflow-hidden">
            {skillOrbitItems.map((item, index) => (
              <Link
                key={item.id}
                href={item.href}
                className="orbit-item absolute left-0 top-1/2 block -translate-y-1/2 whitespace-nowrap text-[clamp(1.05rem,3.4vw,1.75rem)] font-medium tracking-[-0.02em] text-white/90"
                style={{ willChange: "transform, opacity" }}
                aria-current={index === active ? "true" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <p className="absolute bottom-4 left-0 right-0 text-center text-[11px] uppercase tracking-[0.22em] text-neutral-500">
          {current.detail}
        </p>
      </div>
    </section>
  )
}
