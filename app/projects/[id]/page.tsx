"use client"

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

import { ChevronLeft, Calendar, Tag } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface Project {
    id: string;
    title: string;
    description: string | null;
    link: string | null;
    tags: string[] | null;
    images: string[] | null;
    created_at: string;
}

export default function ProjectDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            setLoading(true);
            const projectId = Array.isArray(id) ? id[0] : id;
            if (!projectId) {
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('id', projectId)
                    .single();

                if (error) {
                    console.error("Error fetching project:", error);
                    // If invalid UUID or not found, we just stop loading and let the Not Found UI show
                    setLoading(false);
                    return;
                }

                if (data) {
                    const projectData = data as Project;
                    setProject(projectData);
                    if (projectData.images && projectData.images.length > 0) {
                        setSelectedImage(projectData.images[0]);
                    }
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            }
            setLoading(false);
        };
        fetchProject();
    }, [id, supabase]);

    const headerRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const metaRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!project || loading) return;

        const tl = gsap.timeline();

        tl.from(headerRef.current, { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" })
            .from(contentRef.current, { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
            .from(metaRef.current, { x: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4");

    }, { scope: containerRef, dependencies: [project] });

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">
                <div className="animate-pulse">Loading Project...</div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center text-white gap-4">
                <h2 className="text-2xl font-bold">Project Not Found</h2>
                <p className="text-neutral-400">The project you are looking for does not exist.</p>
                <button onClick={() => router.back()} className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-neutral-900 text-neutral-200 font-sans selection:bg-white/20 pb-32">
            <div ref={containerRef} className="max-w-5xl mx-auto p-8 pt-20 space-y-12">

                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8 group"
                >
                    <div className="p-2 rounded-full bg-neutral-800 group-hover:bg-neutral-700 transition-colors">
                        <ChevronLeft size={16} />
                    </div>
                    <span className="text-sm font-medium">Back to Universe</span>
                </button>

                <header ref={headerRef} className="space-y-6">
                    <div className="flex flex-wrap gap-3">
                        {project.tags?.map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-neutral-300">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white break-words">{project.title}</h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div ref={contentRef} className="lg:col-span-2 space-y-8 project-content">
                        {project.images && project.images.length > 0 && (
                            <div className="space-y-4">
                                <div className="w-full aspect-video rounded-3xl overflow-hidden bg-neutral-800 border border-white/5 relative">
                                    <Image
                                        src={selectedImage || project.images[0]}
                                        alt={project.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                {project.images.length > 1 && (
                                    <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                                        {project.images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedImage(img)}
                                                className={`relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-purple-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                            >
                                                <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="prose prose-invert prose-lg max-w-none">
                            <h3 className="text-2xl font-semibold text-white mb-4">Overview</h3>
                            <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap break-words">
                                {project.description}
                            </p>
                        </div>


                    </div>

                    <div ref={metaRef} className="space-y-6 project-meta">
                        <div className="p-6 rounded-3xl bg-neutral-800/30 border border-white/5 space-y-4">
                            <h4 className="font-semibold text-white">Project Details</h4>

                            <div className="flex items-center gap-3 text-neutral-400">
                                <Calendar size={18} />
                                <span className="text-sm">Started {new Date(project.created_at).toLocaleDateString()}</span>
                            </div>

                            <div className="flex items-center gap-3 text-neutral-400">
                                <Tag size={18} />
                                <span className="text-sm">{project.tags?.length || 0} Tags</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


        </div>
    );
}
