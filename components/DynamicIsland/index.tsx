'use client'
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { IslandMenu } from './IslandMenu';
import { ContactForm } from './ContactForm';
import { Brain, Folder, FileText, Activity } from 'lucide-react';

type IslandState = 'idle' | 'menu' | 'details';
type DetailView = 'contact' | null;

export const DynamicIsland = () => {
    const router = useRouter();
    const pathname = usePathname();
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const circleRef = useRef<HTMLDivElement>(null);

    const [viewState, setViewState] = useState<IslandState>('idle');
    const [activeDetail, setActiveDetail] = useState<DetailView>(null);
    const [contactMode, setContactMode] = useState<'socials' | 'form'>('socials');
    const [isHovered, setIsHovered] = useState(false);
    const [isSqueezed, setIsSqueezed] = useState(false);
    const [showCircle, setShowCircle] = useState(false);

    // Determine active context based on route
    const activeContext = useMemo(() => {
        if (pathname === '/brain') return { icon: <Brain size={14} className="text-cyan-400" />, label: 'Brain' };
        if (pathname === '/projects') return { icon: <Folder size={14} className="text-yellow-400" />, label: 'Projects' };
        if (pathname === '/log') return { icon: <FileText size={14} className="text-green-400" />, label: 'Logs' };
        if (pathname === '/dashboard') return { icon: <Activity size={14} className="text-red-400" />, label: 'Admin' };
        return null;
    }, [pathname]);

    useEffect(() => {
        if (activeContext) {
            const timer = setTimeout(() => {
                setShowCircle(true);
            }, 800);
            return () => clearTimeout(timer);
        } else {
            if (showCircle) setShowCircle(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeContext]);

    // --- Configuration ---
    const targetDimensions = useMemo(() => {
        if (viewState === 'idle') return { width: 120, height: 40, borderRadius: 24 };
        if (viewState === 'menu') return { width: 360, height: 200, borderRadius: 32 }; // Taller for extra row

        if (activeDetail === 'contact') {
            if (contactMode === 'socials') return { width: 360, height: 260, borderRadius: 32 };
            if (contactMode === 'form') return { width: 360, height: 320, borderRadius: 32 };
        }

        return { width: 120, height: 40, borderRadius: 24 };
    }, [viewState, activeDetail, contactMode]);

    // --- GSAP Animation ---
    useGSAP(() => {
        if (!containerRef.current) return;

        gsap.to(containerRef.current, {
            width: targetDimensions.width,
            height: targetDimensions.height,
            borderRadius: targetDimensions.borderRadius,
            duration: 0.6,
            ease: "elastic.out(1, 0.75)",
        });

    }, [targetDimensions]);

    // Squeeze animation
    useGSAP(() => {
        if (!containerRef.current) return;

        if (isSqueezed) {
            gsap.to(containerRef.current, { scale: 0.95, duration: 0.1, ease: "power1.out" });
        } else {
            gsap.to(containerRef.current, {
                scale: isHovered && viewState === 'idle' ? 1.05 : 1,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
        }
    }, [isSqueezed, isHovered, viewState]);

    // Circle Animation (Cell Division)
    useGSAP(() => {
        if (circleRef.current) {
            if (viewState === 'idle' && showCircle && activeContext) {
                // Cell Division: Start from center (behind pill) and move out
                gsap.fromTo(circleRef.current,
                    { x: -20, scale: 0.5, opacity: 0 },
                    {
                        x: 0,
                        width: 40,
                        height: 40,
                        opacity: 1,
                        scale: 1,
                        marginLeft: 12,
                        duration: 0.6,
                        ease: "elastic.out(1, 0.6)"
                    }
                );
            } else {
                // Absorb back
                gsap.to(circleRef.current, {
                    width: 0,
                    height: 0,
                    opacity: 0,
                    scale: 0,
                    marginLeft: 0,
                    duration: 0.3,
                    ease: "power3.inOut"
                });
            }
        }
    }, [viewState, showCircle, activeContext]);


    // --- Handlers ---
    const handleMainClick = () => {
        if (viewState === 'idle') {
            setIsSqueezed(true);
            setTimeout(() => {
                setIsSqueezed(false);
                setViewState('menu');
            }, 150);
        }
    };

    const handleCollapse = () => {
        setViewState('idle');
        setActiveDetail(null);
        setContactMode('socials');
    };

    const handleBack = () => {
        setViewState('menu');
        setActiveDetail(null);
        setContactMode('socials');
    };

    const handleNavigate = (label: string) => {
        if (label === 'Contact') {
            setViewState('details');
            setActiveDetail('contact');
            return;
        }

        // Smooth Transition Logic
        // 1. Close Menu firmly
        setViewState('idle');

        // 2. Wait for close animation to finish before navigating (optional, but feels smoother)
        setTimeout(() => {
            if (label === 'Home') router.push('/');
            else if (label === 'Logs') router.push('/log');
            else if (label === 'Projects') router.push('/projects');
            else if (label === 'Brain') router.push('/brain');
            else if (label === 'Admin') router.push('/dashboard');
        }, 300); // Wait for island to shrink back to idle
    };

    // Click outside logic
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                if (viewState !== 'idle') {
                    setViewState('idle');
                    setActiveDetail(null);
                    setContactMode('socials');
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [viewState]);

    return (
        <div className="fixed bottom-8 left-0 w-full flex justify-center items-end z-50 pointer-events-none">

            <div className="flex items-end justify-center">
                {/* Main Island */}
                <div
                    ref={containerRef}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={handleMainClick}
                    className="pointer-events-auto relative bg-[#000000] shadow-[0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden cursor-pointer origin-bottom z-20"
                    style={{ borderRadius: 24 }}
                >
                    {/* Removed border-top artifact by ensuring border is uniform via shadow or clean class */}

                    <div ref={contentRef} className="w-full h-full relative">

                        {/* IDLE STATE - With "Menu" Text */}
                        {viewState === 'idle' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-neutral-500 text-xs font-medium tracking-widest uppercase transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-70'}`}>
                                    Menu
                                </span>
                            </div>
                        )}

                        {/* MENU STATE */}
                        {viewState === 'menu' && (
                            <IslandMenu onNavigate={handleNavigate} onCollapse={handleCollapse} />
                        )}

                        {/* DETAIL STATES */}
                        {viewState === 'details' && activeDetail === 'contact' && (
                            <ContactForm
                                onBack={handleBack}
                                onModeChange={setContactMode}
                            />
                        )}

                    </div>
                </div>

                {/* Context Circle (Split State) */}
                <div
                    ref={circleRef}
                    className="pointer-events-auto rounded-full bg-[#000000] shadow-[0_0_0_1px_rgba(255,255,255,0.08)] flex items-center justify-center overflow-hidden z-10"
                    style={{ width: 0, height: 0, opacity: 0, marginLeft: 0 }}
                >
                    {activeContext?.icon}
                </div>
            </div>

        </div>
    );
};
