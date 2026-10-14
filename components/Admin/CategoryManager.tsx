"use client"

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Plus, Trash2, Tag } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { invalidatePublicCache } from '@/lib/public-cache';

type Category = {
    id: string;
    name: string;
    color: string;
    type: 'project' | 'log' | 'brain';
};

export const CategoryManager = () => {
    const supabase = createClient();
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState({ name: '', color: '#3b82f6', type: 'project' });
    const [loading, setLoading] = useState(true);

    const containerRef = React.useRef<HTMLDivElement>(null);

    const fetchCategories = React.useCallback(async () => {
        const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
        if (data) setCategories(data as Category[]);
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        const run = async () => {
            await fetchCategories();
        };
        run();
    }, [fetchCategories]);

    const handleAdd = async () => {
        if (!newCategory.name) {
            toast.error('Category name is required');
            return;
        }

        const { error } = await supabase.from('categories').insert([
            { name: newCategory.name, color: newCategory.color, type: newCategory.type }
        ]);

        if (error) {
            toast.error('Could not add category', { description: error.message });
            return;
        }

        if (newCategory.type === 'brain') await invalidatePublicCache('brain');
        setNewCategory({ ...newCategory, name: '' });
        toast.success('Category added');
        fetchCategories();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this category? This will unlink associated projects/logs.')) return;

        await supabase.from('brain_nodes').update({ category_id: null }).eq('category_id', id);

        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) {
            toast.error('Delete failed', { description: error.message });
            return;
        }
        await invalidatePublicCache('brain');
        toast.success('Category deleted');
        fetchCategories();
    };

    useGSAP(() => {
        if (categories.length > 0) {
            gsap.fromTo(".category-item",
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" }
            );
        }
    }, [categories]);

    return (
        <div ref={containerRef} className="bg-neutral-900/50 border border-white/5 rounded-3xl p-6">
            <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
                <Tag size={20} className="text-blue-400" />
                Categories
            </h2>

            {/* Add New */}
            <div className="flex flex-wrap gap-3 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                <input
                    type="text"
                    placeholder="Category Name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="bg-transparent border-b border-white/20 px-2 py-1 outline-none focus:border-blue-400 transition-colors flex-1"
                />
                <div className="flex items-center gap-2 bg-neutral-800 rounded-lg px-2 flex-shrink-0">
                    <input
                        type="color"
                        value={newCategory.color}
                        onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                        className="w-6 h-6 bg-transparent border-none cursor-pointer"
                    />
                </div>
                <select
                    value={newCategory.type}
                    onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value as 'project' | 'log' | 'brain' })}
                    className="bg-neutral-800 rounded-lg px-3 py-1 outline-none text-sm flex-shrink-0"
                >
                    <option value="project">Project</option>
                    <option value="log">Log</option>
                    <option value="brain">Brain</option>
                </select>
                <button
                    onClick={handleAdd}
                    className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors flex-shrink-0"
                >
                    <Plus size={16} />
                </button>
            </div>

            {/* List */}
            <ScrollArea className="h-[300px] pr-2">
                <div className="space-y-2">
                    {categories.map((cat) => (
                        <div key={cat.id} className="category-item group flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3 transition-colors hover:bg-white/10">
                            <div className="flex items-center gap-3">
                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                <span className="font-medium">{cat.name}</span>
                                <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] tracking-wider uppercase opacity-50">{cat.type}</span>
                            </div>
                            <button
                                onClick={() => handleDelete(cat.id)}
                                className="text-red-400 opacity-0 transition-all group-hover:opacity-100 hover:text-red-300"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {categories.length === 0 && !loading ? (
                        <p className="py-4 text-center text-sm text-neutral-500">No data found</p>
                    ) : null}
                </div>
            </ScrollArea>
        </div>
    );
};
