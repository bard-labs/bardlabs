import { ArrowUpRight } from "lucide-react"
import { LAB_IDENTITY, LEGACY_LAB_SUMMARY, linkNote } from "@/lib/lab-copy"
import type { PublicOverview, PublicSiteLink } from "@/lib/public-data"

export type LabSnapshot = {
  completed: { id: string; title: string }[]
  active: number
  paused: number
}

export function LabOverview({
  overview,
  links,
  snapshot,
}: {
  overview: PublicOverview
  links: PublicSiteLink[]
  snapshot: LabSnapshot
}) {
  const summary = overview.summary.trim()
  const showSummary = summary.length > 0 && summary !== LEGACY_LAB_SUMMARY

  const facts = [
    { label: "Completed", value: snapshot.completed.length },
    { label: "Active", value: snapshot.active },
    { label: "Paused", value: snapshot.paused },
  ]

  return (
    <section id="now" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-6 md:px-8 md:py-10" aria-label="Now">
      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0c0c0c]">
        <div className="grid md:grid-cols-12">
          <div className="flex flex-col justify-between gap-10 border-b border-white/10 p-8 sm:p-10 md:col-span-5 md:border-r md:border-b-0 md:p-12">
            <p className="text-[11px] font-medium tracking-[0.18em] text-neutral-500 uppercase">
              Now
            </p>
            <div>
              <p className="text-[11px] font-medium tracking-[0.18em] text-neutral-500 uppercase">
                Goal
              </p>
              <h2 className="font-display mt-3 max-w-[14ch] text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-light tracking-[-0.03em]">
                {overview.goal}
              </h2>
              <p className="font-serif mt-8 text-2xl leading-snug font-light text-neutral-300 italic">
                Bardia Mardan
              </p>
              <p className="mt-2 text-sm tracking-[0.14em] text-neutral-500 uppercase">Iran</p>
            </div>
          </div>

          <div className="p-8 sm:p-10 md:col-span-7 md:p-12">
            <p className="max-w-lg text-[15px] leading-relaxed text-neutral-300">
              {LAB_IDENTITY}
            </p>
            {showSummary ? (
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-neutral-500">{summary}</p>
            ) : null}

            <dl className="mt-8 border-t border-white/10">
              {facts.map((fact) => (
                <div key={fact.label} className="flex items-baseline justify-between gap-6 border-b border-white/10 py-3.5">
                  <dt className="text-[15px] text-neutral-300">{fact.label}</dt>
                  <dd className="text-[17px] tracking-[-0.02em] text-white tabular-nums">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-10">
              {links.map((link) => {
                const external = link.url.startsWith("http")
                const prominent = link.id === "website" || link.url.includes("bardiamardan.xyz")
                const note = linkNote(link)
                return (
                  <li key={link.id} className="border-t border-white/10">
                    <a
                      href={link.url}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      className={`flex items-center justify-between gap-4 py-3.5 transition-colors duration-150 hover:text-white active:opacity-70 ${
                        prominent ? "text-white" : "text-neutral-300"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className={`block ${prominent ? "text-[17px] tracking-[-0.01em]" : "text-[15px]"}`}>
                          {link.label}
                        </span>
                        {note ? (
                          <span className="mt-0.5 block text-sm leading-snug text-neutral-500">{note}</span>
                        ) : null}
                      </span>
                      <ArrowUpRight size={15} className="shrink-0 text-neutral-500" />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
