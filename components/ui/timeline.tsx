"use client"

import { useLayoutEffect, useRef, useSyncExternalStore, type CSSProperties } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  BARDLABS_JOURNEY_TITLE,
  bardlabsJourney,
  type JourneyMilestone,
} from "@/lib/bardlabs-journey"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {}
  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY)
  mediaQueryList.addEventListener("change", callback)
  return () => mediaQueryList.removeEventListener("change", callback)
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false
  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  )
}

export type TimelineProps = {
  title?: string
  items?: JourneyMilestone[]
  compact?: boolean
  textColor?: string
  mutedTextColor?: string
  activeColor?: string
  terminatedColor?: string
  backgroundColor?: string
  imageUrl?: string
  imageAlt?: string
}

export default function Timeline({
  title = BARDLABS_JOURNEY_TITLE,
  items = bardlabsJourney,
  compact = false,
  textColor = "var(--color-foreground, #ffffff)",
  mutedTextColor = "var(--color-muted-foreground, #a1a1aa)",
  activeColor = "#ff5f00",
  terminatedColor = "#ef4444",
  backgroundColor = "var(--color-background, #0a0a0a)",
  imageUrl = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  imageAlt = "Circuit board close-up",
}: TimelineProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  const sectionStyle: CSSProperties = { color: textColor, backgroundColor }
  const mutedStyle: CSSProperties = { color: mutedTextColor }

  useLayoutEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track || compact) return

    const ctx = gsap.context(() => {
      const getEndX = () => {
        // paddingRight is 50vw on the track; scroll until last card can sit near center.
        const overflow = track.scrollWidth - window.innerWidth
        return -Math.max(overflow, window.innerWidth * 0.35)
      }

      const scrollDistance = () => Math.abs(getEndX()) + window.innerWidth * 0.2

      if (reducedMotion) {
        gsap.set(track, { x: 0 })
        gsap.set(".journey-node", { opacity: 1, y: 0 })
        gsap.set(".journey-line-fill", { scaleX: 1 })
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollDistance()}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      tl.to(track, {
        x: getEndX,
        ease: "none",
      })

      gsap.fromTo(
        ".journey-line-fill",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${scrollDistance() * 0.92}`,
            scrub: true,
          },
        },
      )

      gsap.utils.toArray<HTMLElement>(".journey-node").forEach((node) => {
        const terminated = node.dataset.status === "terminated"
        gsap.fromTo(
          node,
          { opacity: 0.2, y: terminated ? 0 : 24 },
          {
            opacity: 1,
            y: 0,
            ease: terminated ? "none" : "power2.out",
            scrollTrigger: {
              trigger: node,
              containerAnimation: tl,
              start: "left 85%",
              end: "left 45%",
              scrub: !terminated,
              toggleActions: terminated ? "play none none none" : undefined,
            },
          },
        )
      })
    }, section)

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
      ctx.revert()
    }
  }, [reducedMotion, items, compact])

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative w-full"
      style={sectionStyle}
      aria-label={title}
    >
      <div className={`flex flex-col justify-center pt-16 pb-10 sm:pt-20 ${compact ? "h-auto" : "h-[100svh] overflow-hidden"}`}>
        <div className="mx-auto mb-6 w-full max-w-6xl shrink-0 px-4 md:mb-8 md:px-8">
          <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500 sm:text-[11px]">
            Journey
          </p>
          <h2 className={`mt-2 max-w-3xl font-medium tracking-tight ${compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl md:text-4xl"}`}>
            {title}
          </h2>
        </div>

        <div className={compact ? "overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : undefined}>
        <div
          ref={trackRef}
          className="flex w-max items-start gap-6 px-4 will-change-transform sm:gap-10 sm:px-8 md:gap-14"
          style={compact ? undefined : { paddingRight: "50vw" }}
        >
          {compact ? null : (
          <div className="relative mt-10 h-[36vw] min-h-[200px] w-[72vw] max-w-[340px] shrink-0 overflow-hidden rounded-2xl border border-white/10 sm:mt-12 sm:h-[260px] sm:w-[320px] md:w-[360px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={imageAlt}
              draggable={false}
              className="h-full w-full object-cover"
            />
          </div>
          )}

          <div className="relative flex min-w-0 flex-col pt-2">
            {/* Dedicated rail above copy — never overlaps cards */}
            <div className="relative mb-12 h-4 w-full shrink-0">
              <div className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-white/10" />
              <div
                className="journey-line-fill absolute top-1/2 left-0 h-px origin-left -translate-y-1/2"
                style={{
                  width: "100%",
                  background: `linear-gradient(90deg, ${activeColor}, ${activeColor})`,
                  transform: compact ? "scaleX(1)" : "scaleX(0)",
                }}
              />
            </div>

            <div className="relative z-10 flex items-start gap-8 sm:gap-12 md:gap-16">
              {items.map((item) => {
                const terminated = item.status === "terminated"
                const accent = terminated ? terminatedColor : activeColor
                return (
                  <article
                    key={item.id}
                    data-status={item.status ?? "normal"}
                    className={`journey-node relative shrink-0 ${
                      compact
                        ? "w-[58vw] max-w-[220px] sm:w-[200px]"
                        : "w-[70vw] max-w-[300px] sm:w-[280px] md:w-[300px]"
                    }`}
                  >
                    {/* Node on the rail */}
                    <div
                      className="absolute -top-[3.85rem] left-0 flex -translate-x-1/2 items-center gap-1 sm:-top-[3.9rem]"
                      aria-hidden
                    >
                      {terminated ? (
                        <>
                          <span className="h-px w-5 bg-red-500/80" />
                          <span
                            className="size-2 rotate-45 border border-red-500 bg-[#050505] sm:size-2.5"
                            style={{ boxShadow: `0 0 0 1px ${terminatedColor}` }}
                          />
                          <span className="h-px w-5 bg-red-500/80" />
                        </>
                      ) : (
                        <span
                          className="size-2.5 rounded-full sm:size-3"
                          style={{ backgroundColor: accent }}
                        />
                      )}
                    </div>

                    <div
                      className={
                        terminated
                          ? "flex flex-col gap-3 border-l border-red-500/70 pl-4"
                          : "flex flex-col gap-3 pl-1"
                      }
                    >
                      <p
                        className="text-[10px] uppercase tracking-[0.2em]"
                        style={terminated ? { color: terminatedColor } : mutedStyle}
                      >
                        {item.category}
                        {terminated ? " · Terminated" : ""}
                      </p>
                      <p className="text-xs tracking-wide text-neutral-400 sm:text-sm">{item.when}</p>
                      <h3
                        className={`leading-tight font-medium tracking-tight ${
                          compact ? "text-lg" : "text-xl sm:text-2xl"
                        } ${terminated ? "text-red-400/90" : ""}`}
                      >
                        {item.title}
                      </h3>
                      <p className={`text-sm leading-relaxed ${compact ? "line-clamp-3" : ""}`} style={mutedStyle}>
                        {item.content}
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
