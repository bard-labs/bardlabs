"use client"

import React from 'react';
import { CategoryManager } from '@/components/Admin/CategoryManager';
import { ProjectEditor } from '@/components/Admin/ProjectEditor';
import { LogEntry } from '@/components/Admin/LogEntry';
import { BrainNodeEditor } from '@/components/Admin/BrainNodeEditor';


export default function Dashboard() {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans p-8 pb-32">
            <header className="mb-12">
                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-neutral-400">Manage content, categories, and the brain.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">

                {/* Column 1: Categories & Logs (Left Side - 4 cols) */}
                <div className="col-span-1 lg:col-span-4 space-y-8">
                    <LogEntry />
                    <CategoryManager />
                </div>

                {/* Column 2: Projects (Right Side - 8 cols) */}
                <div className="col-span-1 lg:col-span-8">
                    <ProjectEditor />
                </div>

                {/* Full Width: Brain (Bottom) */}
                <div className="col-span-1 lg:col-span-12">
                    <BrainNodeEditor />
                </div>

            </div>


        </div>
    );
}
