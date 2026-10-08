"use client"

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

type Log = {
    id: string;
    content: string;
    created_at: string;
};

export default function Logs() {
    const supabase = createClient();
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase.from('logs').select('*').order('created_at', { ascending: false });
            if (data) setLogs(data as Log[]);
            setLoading(false);
        };
        fetchData();
    }, [supabase]);

    useGSAP(() => {
        if (!loading) {
            gsap.fromTo(".log-item",
                { x: -20, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
            );
        }
    }, [loading]);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans p-8 pb-32">
            <header className="mb-12 max-w-3xl mx-auto pt-12 relative z-10">
                <h1 className="text-4xl font-bold mb-2">Execution Logs</h1>
                <p className="text-neutral-500">Daily updates and build notes.</p>
            </header>

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

            <div className="max-w-3xl mx-auto space-y-8 relative z-10">
                {/* Timeline Line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />

                {logs.map((log) => (
                    <div key={log.id} className="log-item relative pl-12 group">
                        {/* Timeline Dot */}
                        <div className="absolute left-[13px] top-2 w-1.5 h-1.5 rounded-full bg-neutral-600 group-hover:bg-white transition-colors ring-4 ring-[#050505]" />

                        <div className="flex items-baseline gap-3 mb-1">
                            <span className="text-xs text-neutral-500 font-mono">
                                {new Date(log.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                        </div>

                        <p className="text-neutral-300 leading-relaxed text-sm">
                            {log.content}
                        </p>
                    </div>
                ))}

                {logs.length === 0 && !loading && (
                    <div className="pl-12 text-neutral-500">No logs found.</div>
                )}
            </div>
        </div>
    );
}
