"use client"

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ProjectCard } from '@/components/ProjectCard';

type Project = {
    id: string;
    title: string;
    description: string;
    link: string;
    tags: string[];
    images: string[];
    created_at: string;
};

export default function Projects() {
    const supabase = createClient();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data: projs } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
            if (projs) setProjects(projs as Project[]);
            setLoading(false);
        };
        fetchData();
    }, [supabase]);

    useGSAP(() => {
        if (!loading) {
            gsap.fromTo(".project-card",
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out" }
            );
        }
    }, [loading]);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans p-8 pb-32">
            <header className="mb-12 max-w-7xl mx-auto pt-12">
                <h1 className="text-5xl font-bold mb-6 tracking-tighter">Project Universe</h1>
            </header>

            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center space-y-4">
                        <div className="animate-pulse text-2xl font-medium text-neutral-400">
                            Fetching projects...
                        </div>
                        <div className="flex gap-2 justify-center">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>
            )}
        </div>
    );
}
