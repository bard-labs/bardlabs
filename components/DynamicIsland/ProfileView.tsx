import React, { useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface ProfileViewProps {
    onBack: () => void;
}

export const ProfileView = ({ onBack }: ProfileViewProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo(containerRef.current,
            { opacity: 0, y: 10, filter: 'blur(5px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: "power2.out" }
        );
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="w-full h-full p-6 flex flex-col items-center text-center">
            <button onClick={(e) => { e.stopPropagation(); onBack(); }} className="absolute top-6 left-6 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors">
                <ChevronLeft size={16} />
            </button>

            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-400 to-rose-400 mb-4 border-4 border-neutral-900 shadow-xl" />

            <h2 className="text-xl font-bold text-white">Alex Morgan</h2>
            <p className="text-sm text-neutral-400 mb-6">Product Designer</p>

            <div className="w-full space-y-2">
                <div className="w-full p-3 rounded-2xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-between px-4">
                    <span className="text-sm">Edit Profile</span>
                    <ChevronLeft size={14} className="rotate-180 text-neutral-500" />
                </div>
                <div className="w-full p-3 rounded-2xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-between px-4">
                    <span className="text-sm">Privacy</span>
                    <ChevronLeft size={14} className="rotate-180 text-neutral-500" />
                </div>
                <div className="w-full p-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer flex items-center justify-between px-4 text-red-400">
                    <span className="text-sm">Sign Out</span>
                </div>
            </div>
        </div>
    );
};
