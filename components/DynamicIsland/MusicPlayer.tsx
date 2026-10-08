import React, { useRef } from 'react';
import { ChevronLeft, Music, SkipBack, Pause, SkipForward } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface MusicPlayerProps {
    onBack: () => void;
}

export const MusicPlayer = ({ onBack }: MusicPlayerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo(containerRef.current,
            { opacity: 0, scale: 0.95, filter: 'blur(5px)' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.5, ease: "power2.out" }
        );
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="w-full h-full p-6 flex flex-col text-white">
            <div className="flex items-center justify-between mb-6">
                <button onClick={(e) => { e.stopPropagation(); onBack(); }} className="flex items-center gap-1 text-sm text-neutral-400 hover:text-white transition-colors">
                    <ChevronLeft size={16} /> Back
                </button>
                <span className="text-xs font-bold text-green-400 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Now Playing
                </span>
            </div>

            <div className="flex gap-4 items-center">
                {/* Album Art Placeholder */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center">
                    <Music size={24} className="text-white/50" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">Midnight City</h3>
                    <p className="text-sm text-neutral-400 truncate">M83 • Hurry Up, Were Dreaming</p>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-auto flex items-center justify-between px-2">
                <button className="text-neutral-400 hover:text-white transition-colors"><SkipBack size={24} fill="currentColor" /></button>
                <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform">
                    <Pause size={20} fill="currentColor" />
                </button>
                <button className="text-neutral-400 hover:text-white transition-colors"><SkipForward size={24} fill="currentColor" /></button>
            </div>
        </div>
    );
};
