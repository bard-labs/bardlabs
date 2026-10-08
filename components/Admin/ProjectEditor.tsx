"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Trash2, Image as ImageIcon, Save, Edit2 } from 'lucide-react';
import Image from 'next/image';

type Project = {
    id: string;
    title: string;
    description: string;
    link: string;
    tags: string[];
    images: string[];
    created_at: string;
};

export const ProjectEditor = () => {
    const supabase = createClient();
    const [projects, setProjects] = useState<Project[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        link: '',
        tags: '',
        images: [] as string[]
    });

    const fetchData = useCallback(async () => {
        const { data: projs } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (projs) setProjects(projs as Project[]);
    }, [supabase]);

    useEffect(() => {
        const run = async () => {
            await fetchData();
        };
        run();
    }, [fetchData]);

    const handleSave = async () => {
        if (!formData.title) return;

        const payload = {
            title: formData.title,
            description: formData.description,
            link: formData.link,
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
            images: formData.images
        };

        if (editingId) {
            await supabase.from('projects').update(payload).eq('id', editingId);
        } else {
            await supabase.from('projects').insert([payload]);
        }

        resetForm();
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure?')) {
            // Optimistic update
            setProjects(prev => prev.filter(p => p.id !== id));

            const { error } = await supabase.from('projects').delete().eq('id', id);

            if (error) {
                console.error('Error deleting project:', error);
                alert('Failed to delete project. It might be referenced by other items.');
                // Revert optimistic update
                fetchData();
            }
        }
    };

    const handleEdit = (project: Project) => {
        setEditingId(project.id);
        setFormData({
            title: project.title,
            description: project.description || '',
            link: project.link || '',
            tags: project.tags ? project.tags.join(', ') : '',
            images: project.images || []
        });
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            title: '',
            description: '',
            link: '',
            tags: '',
            images: []
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage.from('portfolio').upload(filePath, file);

        if (uploadError) {
            alert('Error uploading image: ' + uploadError.message);
            return;
        }

        const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath);
        if (data) {
            setFormData(prev => ({ ...prev, images: [...prev.images, data.publicUrl] }));
        }
    };

    return (
        <div className="bg-neutral-900/50 border border-white/5 rounded-3xl p-6 h-full flex flex-col">
            <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
                <Edit2 size={20} className="text-purple-400" />
                Projects
            </h2>

            {/* Form */}
            <div className="bg-white/5 rounded-2xl p-4 mb-6 space-y-4 border border-white/5">
                <div className="grid grid-cols-1 gap-4">
                    <input
                        className="bg-neutral-800 rounded-lg px-3 py-2 outline-none text-sm border border-transparent focus:border-purple-500 transition-colors"
                        placeholder="Title"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <textarea
                    className="w-full bg-neutral-800 rounded-lg px-3 py-2 outline-none text-sm border border-transparent focus:border-purple-500 transition-colors min-h-[80px]"
                    placeholder="Description"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-4">
                    <input
                        className="bg-neutral-800 rounded-lg px-3 py-2 outline-none text-sm border border-transparent focus:border-purple-500 transition-colors"
                        placeholder="Link (https://...)"
                        value={formData.link}
                        onChange={e => setFormData({ ...formData, link: e.target.value })}
                    />
                    <input
                        className="bg-neutral-800 rounded-lg px-3 py-2 outline-none text-sm border border-transparent focus:border-purple-500 transition-colors"
                        placeholder="Tags (comma separated)"
                        value={formData.tags}
                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    />
                </div>

                {/* Image Upload */}
                <div className="flex items-center gap-4">
                    <label className="cursor-pointer flex items-center gap-2 bg-neutral-800 px-3 py-2 rounded-lg hover:bg-neutral-700 transition-colors text-sm">
                        <ImageIcon size={16} />
                        <span>Upload Image</span>
                        <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                    </label>
                    <div className="flex gap-2 overflow-x-auto">
                        {formData.images.map((img, i) => (
                            <div key={i} className="relative w-10 h-10 rounded overflow-hidden border border-white/10 group">
                                <Image src={img} alt="preview" fill className="object-cover" />
                                <button
                                    onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}
                                    className="absolute top-0 right-0 bg-black/50 hover:bg-red-500 text-white p-0.5 rounded-bl opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={10} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    {editingId && (
                        <button onClick={resetForm} className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm transition-colors">Cancel</button>
                    )}
                    <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-medium transition-colors flex items-center gap-2">
                        <Save size={16} />
                        {editingId ? 'Update' : 'Save'}
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                {projects.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors group">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium truncate">{p.title}</h3>
                            </div>
                            <p className="text-xs text-neutral-500 truncate">{p.description}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                            <button onClick={() => handleEdit(p)} className="p-2 hover:bg-white/10 rounded-lg text-blue-400">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
