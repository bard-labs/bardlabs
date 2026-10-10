"use client"

import { useEffect, useState } from "react"
import ContributionSkyline, {
  type ContributionDay,
} from "@/components/ui/contribution-skyline"

export function ActivitySkyline() {
  const [data, setData] = useState<ContributionDay[] | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    void fetch("/api/github-contributions")
      .then((res) => res.json())
      .then((json: { contributions?: ContributionDay[] }) => {
        if (!cancelled && json.contributions?.length) {
          setData(json.contributions)
        }
      })
      .catch(() => {
        /* component falls back to generated sample */
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500 sm:text-[11px]">
          Activity
        </p>
        <h2 className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
          A year of signal
        </h2>
        <p className="mt-3 max-w-xl text-sm text-neutral-500">
          github.com/BardiaMardan — heat map that rises into a skyline.
        </p>
      </div>
      <ContributionSkyline
        data={data}
        className="border-white/10 bg-[#0a0a0a] text-white"
        palette="github"
        defaultView="3d"
        unit="contribution"
        footer={
          <a
            href="https://github.com/BardiaMardan"
            target="_blank"
            rel="noreferrer"
            className="underline-offset-4 hover:underline"
          >
            BardiaMardan on GitHub
          </a>
        }
      />
    </section>
  )
}
