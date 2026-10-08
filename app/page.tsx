"use client"

import React, { useRef, useEffect } from 'react';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Twitter, Instagram, Mail, Plane, Cpu, Dumbbell, Mountain, Rocket, Zap, Sigma, Atom } from 'lucide-react';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const polymathWords = [
  "Aerospace", "Aviation", "IoT", "Electronics", "Entrepreneurship",
  "Builder", "Programmer", "Calisthenics", "Rock Climber", "AI Automation", "Designer", "Physics", "Mathematics"
];

export default function Home() {
  const container = useRef<HTMLDivElement>(null);
  const heroText = useRef<HTMLHeadingElement>(null);
  const polymathTextRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Hero Animation
    gsap.from(heroText.current, {
      y: 100,
      opacity: 0,
      duration: 1.5,
      ease: "power4.out",
      delay: 0.2
    });

    // Continuous Animations
    gsap.to(".animate-float", {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.5
    });

    gsap.to(".animate-pulse-glow", {
      opacity: 0.5,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".animate-spin-slow", {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "linear"
    });

    // Scroll Trigger for Grid
    const cards = gsap.utils.toArray('.bento-card') as Element[];
    gsap.from(cards, {
      scrollTrigger: {
        trigger: ".bento-grid",
        start: "top 85%",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out"
    });

  }, { scope: container });

  // Polymath Word Cycler
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (polymathTextRef.current) {
        const nextIndex = (currentIndex + 1) % polymathWords.length;
        const nextWord = polymathWords[nextIndex];

        gsap.to(polymathTextRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          onComplete: () => {
            if (polymathTextRef.current) {
              polymathTextRef.current.innerText = nextWord;
              gsap.fromTo(polymathTextRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.3 }
              );
            }
          }
        });
        currentIndex = nextIndex;
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={container} className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20 overflow-x-hidden">

      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

        <div className="relative z-10 text-center">
          <h1 ref={heroText} className="text-[15vw] font-bold leading-none tracking-tighter mix-blend-difference select-none">
            BARDLABS
          </h1>
          <div className="mt-4 h-8 overflow-hidden">
            <p ref={polymathTextRef} className="text-xl text-neutral-400 font-light tracking-widest uppercase">
              POLYMATH
            </p>
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="px-4 pb-40 max-w-7xl mx-auto mt-24">
        <div className="bento-grid grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[240px]">

          {/* 1. The Polymath (Large) - 2x2 */}
          <div className="bento-card col-span-1 md:col-span-2 row-span-2 bg-neutral-900/40 border border-white/5 rounded-[32px] p-8 flex flex-col justify-between group hover:bg-neutral-900/60 transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none animate-pulse-glow" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 animate-float">
                <Rocket size={24} className="text-blue-400" />
              </div>
              <h3 className="text-4xl font-medium mb-4 leading-tight">
                The Polymath <br />
                <span className="text-neutral-500">Perspective.</span>
              </h3>
              <p className="text-neutral-400 max-w-md leading-relaxed">
                Beyond code. A fusion of Aerospace, Electronics, and Entrepreneurship. Building the future with a multidisciplinary approach.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-8">
              <span className="px-3 py-1 rounded-full bg-white/5 text-xs border border-white/5 text-neutral-400">Aviation</span>
              <span className="px-3 py-1 rounded-full bg-white/5 text-xs border border-white/5 text-neutral-400">IoT</span>
              <span className="px-3 py-1 rounded-full bg-white/5 text-xs border border-white/5 text-neutral-400">Robotics</span>
              <span className="px-3 py-1 rounded-full bg-white/5 text-xs border border-white/5 text-neutral-400">Design</span>
            </div>
          </div>

          {/* 2. Physical / Calisthenics - 1x1 */}
          <div className="bento-card col-span-1 row-span-1 bg-neutral-900/40 border border-white/5 rounded-[32px] p-6 flex flex-col justify-between group hover:bg-neutral-900/60 transition-colors relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
              <Mountain size={100} strokeWidth={1} />
            </div>
            <div className="relative z-10">
              <Dumbbell size={24} className="text-neutral-400 mb-4" />
              <h3 className="text-lg font-medium">Physical</h3>
              <p className="text-neutral-500 text-xs mt-1">Calisthenics & Climbing</p>
            </div>
          </div>

          {/* 3. Hardware / Electronics - 1x1 */}
          <div className="bento-card col-span-1 row-span-1 bg-neutral-900/40 border border-white/5 rounded-[32px] p-6 flex flex-col justify-between group hover:bg-neutral-900/60 transition-colors relative overflow-hidden">
            <div className="absolute right-4 top-4 animate-pulse">
              <Zap size={20} className="text-yellow-500/50" />
            </div>
            <div className="relative z-10">
              <Cpu size={24} className="text-neutral-400 mb-4" />
              <h3 className="text-lg font-medium">Hardware</h3>
              <p className="text-neutral-500 text-xs mt-1">Electronics & IoT</p>
            </div>
          </div>

          {/* 4. Maths & Physics - 1x1 */}
          <div className="bento-card col-span-1 row-span-1 bg-neutral-900/40 border border-white/5 rounded-[32px] p-6 flex flex-col justify-between group hover:bg-neutral-900/60 transition-colors relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
              <Atom size={100} strokeWidth={1} className="animate-spin-slow" />
            </div>
            <div className="relative z-10">
              <Sigma size={24} className="text-neutral-400 mb-4" />
              <h3 className="text-lg font-medium">Science</h3>
              <p className="text-neutral-500 text-xs mt-1">Maths & Physics</p>
            </div>
          </div>

          {/* 5. Aerospace / Aviation - 1x1 */}
          <div className="bento-card col-span-1 row-span-1 bg-neutral-900/40 border border-white/5 rounded-[32px] p-6 flex flex-col justify-center group hover:bg-neutral-900/60 transition-colors relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10 transform -rotate-12">
              <Plane size={100} />
            </div>
            <div className="relative z-10">
              <Plane size={24} className="text-neutral-400 mb-4" />
              <h3 className="text-lg font-medium">Aerospace</h3>
              <p className="text-neutral-500 text-xs mt-1">Aviation Enthusiast</p>
            </div>
          </div>

          {/* 6. Project Universe Link - 2x1 */}
          <Link href="/projects" className="bento-card col-span-1 md:col-span-2 row-span-1 bg-gradient-to-br from-neutral-900 to-neutral-950 border border-white/5 rounded-[32px] p-8 flex items-center justify-between group hover:border-white/20 transition-all relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <h3 className="text-2xl font-medium mb-1">Project Universe</h3>
              <p className="text-neutral-500 text-sm">The Archive</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
              <ArrowUpRight size={24} />
            </div>
          </Link>

          {/* 7. The Brain Link - 1x1 */}
          <Link href="/brain" className="bento-card col-span-1 row-span-1 bg-neutral-900/40 border border-white/5 rounded-[32px] p-6 flex flex-col justify-between group hover:bg-neutral-900/60 transition-colors relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
              <div className="w-24 h-24 border-2 border-dashed border-green-500/30 rounded-full animate-spin-slow" />
            </div>

            <div className="relative z-10">
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              </div>
              <h3 className="text-lg font-medium">The Brain</h3>
            </div>
            <div className="relative z-10 flex justify-between items-end">
              <p className="text-neutral-500 text-[10px]">Interactive Map</p>
              <ArrowUpRight size={14} className="text-neutral-500 group-hover:text-white transition-colors" />
            </div>
          </Link>

          {/* 8. Contact / Mail - 1x1 */}
          <a href="mailto:hello@bardalabs.com" className="bento-card col-span-1 row-span-1 bg-neutral-900/40 border border-white/5 rounded-[32px] p-6 flex flex-col justify-between group hover:bg-neutral-900/60 transition-colors">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
              <Mail size={20} className="text-neutral-300" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Contact</h3>
              <p className="text-neutral-500 text-xs truncate">hello@bardialabs.com</p>
            </div>
          </a>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-600 text-xs uppercase tracking-widest">© {new Date().getFullYear()} Bardlabs</p>
          <div className="flex gap-6 text-neutral-500">
            <a href="#" className="hover:text-white transition-colors"><Instagram size={18} /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter size={18} /></a>
          </div>
        </div>
      </footer>


    </div>
  );
}