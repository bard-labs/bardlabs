import React, { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from 'lucide-react';

export interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    images: string[];
    link?: string;
}

interface ProjectCardProps {
    project: Project;
    index: number;
}

export const ProjectCard = ({ project, index }: ProjectCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(cardRef.current, {
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: "power3.out"
        });
    }, { scope: cardRef });

    return (
        <div ref={cardRef} className="relative group">
            <div
                className="relative overflow-hidden rounded-3xl bg-neutral-800/50 border border-white/5 hover:border-white/10 transition-colors duration-500 aspect-[4/3] group-hover:bg-neutral-800"
            >
                {/* Main Link Overlay */}
                <Link href={`/projects/${project.id}`} className="absolute inset-0 z-0" />

                {/* Image Placeholder or Media */}
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none" />

                {project.images && project.images.length > 0 && (
                    <div className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none" style={{ backgroundImage: `url(${project.images[0]})` }} />
                )}

                <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-2 flex-wrap">
                            {project.tags?.map(tag => (
                                <span key={tag} className="px-2 py-1 rounded-full bg-white/10 text-[10px] font-medium text-neutral-300 backdrop-blur-md">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        {/* External Link Button - Now a sibling to the main link, with higher z-index */}
                        {project.link && (
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-white/10 hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-md z-10 pointer-events-auto"
                            >
                                <ArrowUpRight size={16} />
                            </a>
                        )}
                    </div>

                    <div className="z-10">
                        <h3 className="text-xl font-bold text-white mb-1 break-words">{project.title}</h3>
                        <p className="text-sm text-neutral-400 line-clamp-2 break-words whitespace-normal">{project.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
