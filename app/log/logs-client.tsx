"use client"

import React, { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

type Log = {
  id: string
  content: string
  created_at: string
}

export function LogsClient() {
  const supabase = createClient()
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("logs").select("*").order("created_at", { ascending: false })
      if (data) setLogs(data as Log[])
      setLoading(false)
    }
    void fetchData()
  }, [supabase])

  useGSAP(() => {
    if (!loading) {
      gsap.fromTo(
        ".log-item",
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" },
      )
    }
  }, [loading])

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
              <span className="font-mono text-xs text-neutral-500">
                {new Date(log.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-neutral-300">{log.content}</p>
          </div>
        ))}

        {logs.length === 0 && !loading ? (
          <div className="pl-12 text-neutral-500">No data found</div>
        ) : null}
      </div>
    </div>
  )
}
