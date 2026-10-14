"use client"

import { useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import type { PublicLog } from "@/lib/public-data"

type Log = PublicLog

export function LogsClient({ initialLogs }: { initialLogs: Log[] }) {
  const [logs] = useState<Log[]>(initialLogs)

  useGSAP(() => {
    gsap.fromTo(
      ".log-item",
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" },
    )
  }, [])

  return (
    <div className="min-h-screen bg-[#050505] p-8 pb-32 font-sans text-white">
      <header className="relative z-10 mx-auto mb-12 max-w-3xl pt-12">
        <h1 className="mb-2 text-4xl font-bold">Execution Logs</h1>
        <p className="text-neutral-500">Daily updates and build notes.</p>
      </header>

      <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

      <div className="relative z-10 mx-auto max-w-3xl space-y-8">
        <div className="absolute top-0 bottom-0 left-4 w-px bg-white/10" />

        {logs.map((log) => (
          <div key={log.id} className="log-item group relative pl-12">
            <div className="absolute top-2 left-[13px] h-1.5 w-1.5 rounded-full bg-neutral-600 ring-4 ring-[#050505] transition-colors group-hover:bg-white" />
            <div className="mb-1 flex items-baseline gap-3">
              <span className="font-mono text-xs text-neutral-500">{new Date(log.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
            </div>
            <p className="text-sm leading-relaxed text-neutral-300">{log.content}</p>
          </div>
        ))}

        {logs.length === 0 ? <div className="pl-12 text-neutral-500">No data found</div> : null}
      </div>
    </div>
  )
}
