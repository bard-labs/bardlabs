"use client"
import React, { useRef } from 'react';
import {
    Home,
    Folder,
    FileText,
    Brain,
    Mail
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    active?: boolean;
    delay?: number;
}

const MenuItem = ({ icon, label, onClick, active = false, delay = 0, variant = 'vertical' }: MenuItemProps & { variant?: 'vertical' | 'horizontal' }) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useGSAP(() => {
        gsap.fromTo(buttonRef.current,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.4,
                delay: delay / 1000,
                ease: "back.out(1.7)"
            }
        );
    }, { scope: buttonRef });

    if (variant === 'horizontal') {
        return (
            <button
                ref={buttonRef}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
                className={`
            w-full flex items-center gap-3 p-3 rounded-2xl transition-colors duration-300
            ${active ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-neutral-400 hover:text-neutral-200'}
            active:scale-95
          `}
            >
                <div className={`p-2 rounded-full transition-colors ${active ? 'bg-white text-black' : 'bg-neutral-800'}`}>
                    {icon}
                </div>
                <span className="text-xs font-medium">{label}</span>
            </button>
        );
    }

    return (
        <button
            ref={buttonRef}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            className={`
        flex flex-col items-center justify-center gap-2 p-2 rounded-2xl transition-colors duration-300
        ${active ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-neutral-400 hover:text-neutral-200'}
        active:scale-95
      `}
        >
            <div className={`p-2 rounded-full transition-colors ${active ? 'bg-white text-black' : 'bg-neutral-800'}`}>
                {icon}
            </div>
            <span className="text-[10px] font-medium">{label}</span>
        </button>
    );
};

interface IslandMenuProps {
    onNavigate: (label: string) => void;
    onCollapse: () => void;
}

export const IslandMenu = ({ onNavigate, onCollapse }: IslandMenuProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo(containerRef.current,
            { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.4, ease: "power3.out" }
        );
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="w-full h-full p-3 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider px-2">Menu</span>
                <button onClick={(e) => { e.stopPropagation(); onCollapse(); }} className="p-1 rounded-full hover:bg-neutral-800 transition-colors">
                    <div className="w-8 h-1 bg-neutral-700 rounded-full" />
                </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
                <MenuItem icon={<Home size={20} />} label="Home" onClick={() => onNavigate('Home')} />
                <MenuItem icon={<Folder size={20} />} label="Projects" onClick={() => onNavigate('Projects')} />
                <MenuItem icon={<FileText size={20} />} label="Logs" onClick={() => onNavigate('Logs')} />
                <MenuItem icon={<Brain size={20} />} label="Brain" onClick={() => onNavigate('Brain')} />
            </div>

            <div className="mt-2">
                <MenuItem icon={<Mail size={20} />} label="Contact Me" onClick={() => onNavigate('Contact')} variant="horizontal" delay={100} />
            </div>
        </div>
    );
};
