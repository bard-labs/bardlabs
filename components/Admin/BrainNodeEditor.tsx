"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Trash2, Brain, Save, Edit2 } from 'lucide-react';

type BrainNode = {
    id: string;
    label: string;
    description: string;
    category_id: string;
    parent_id: string | null;
    position: Record<string, unknown>;
};

type Category = {
    id: string;
    name: string;
    color: string;
};

export const BrainNodeEditor = () => {
    const supabase = useMemo(() => createClient(), []);
    const [nodes, setNodes] = useState<BrainNode[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        label: '',
        description: '',
        category_id: '',
        parent_id: ''
    });

    const fetchData = useCallback(async () => {
        const { data: cats } = await supabase.from('categories').select('*').eq('type', 'brain');
        if (cats) setCategories(cats as Category[]);

        const { data: nds } = await supabase.from('brain_nodes').select('*').order('created_at', { ascending: false });
        if (nds) setNodes(nds as BrainNode[]);

        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        const run = async () => {
            await fetchData();
        };
        run();
    }, [fetchData]);

    const handleSave = async () => {
        if (!formData.label || !formData.category_id) return;

        const payload = {
            label: formData.label,
            description: formData.description,
            category_id: formData.category_id,
            parent_id: formData.parent_id || null,
            position: { x: 0, y: 0, z: 0 } // Default position, will be handled by visualization later
        };

        if (editingId) {
            await supabase.from('brain_nodes').update(payload).eq('id', editingId);
        } else {
            await supabase.from('brain_nodes').insert([payload]);
        }

        resetForm();
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure?')) {
            await supabase.from('brain_nodes').delete().eq('id', id);
            fetchData();
        }
    };

    const handleEdit = (node: BrainNode) => {
        setEditingId(node.id);
        setFormData({
            label: node.label,
            description: node.description || '',
            category_id: node.category_id || '',
            parent_id: node.parent_id || ''
        });
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            label: '',
            description: '',
            category_id: '',
            parent_id: ''
        });
    };

    return (
        <div className="bg-neutral-900/50 border border-white/5 rounded-3xl p-6 h-full flex flex-col">
            <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
                <Brain size={20} className="text-cyan-400" />
                Brain Nodes
            </h2>

            {/* Form */}
            <div className="bg-white/5 rounded-2xl p-4 mb-6 space-y-4 border border-white/5">
                <div className="grid grid-cols-2 gap-4">
                    <input
                        className="bg-neutral-800 rounded-lg px-3 py-2 outline-none text-sm border border-transparent focus:border-cyan-500 transition-colors"
                        placeholder="Label"
                        value={formData.label}
                        onChange={e => setFormData({ ...formData, label: e.target.value })}
                    />
                    <select
                        className="bg-neutral-800 rounded-lg px-3 py-2 outline-none text-sm border border-transparent focus:border-cyan-500 transition-colors"
                        value={formData.category_id}
                        onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                    >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                <textarea
                    className="w-full bg-neutral-800 rounded-lg px-3 py-2 outline-none text-sm border border-transparent focus:border-cyan-500 transition-colors min-h-[60px]"
                    placeholder="Description"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                />

                <select
                    className="w-full bg-neutral-800 rounded-lg px-3 py-2 outline-none text-sm border border-transparent focus:border-cyan-500 transition-colors"
                    value={formData.parent_id}
                    onChange={e => setFormData({ ...formData, parent_id: e.target.value })}
                >
                    <option value="">Parent Node (Optional)</option>
                    {nodes.filter(n => n.id !== editingId).map(n => (
                        <option key={n.id} value={n.id}>{n.label}</option>
                    ))}
                </select>

                <div className="flex justify-end gap-2 pt-2">
                    {editingId && (
                        <button onClick={resetForm} className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm transition-colors">Cancel</button>
                    )}
                    <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-sm font-medium transition-colors flex items-center gap-2">
                        <Save size={16} />
                        {editingId ? 'Update' : 'Save'}
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2 max-h-[400px]">
                {nodes.map(n => (
                    <div key={n.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors group">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium truncate">{n.label}</h3>
                                {categories.find(c => c.id === n.category_id) && (
                                    <span
                                        className="text-[10px] px-2 py-0.5 rounded-full text-black font-medium"
                                        style={{ backgroundColor: categories.find(c => c.id === n.category_id)?.color }}
                                    >
                                        {categories.find(c => c.id === n.category_id)?.name}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-neutral-500 truncate">{n.description}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                            <button onClick={() => handleEdit(n)} className="p-2 hover:bg-white/10 rounded-lg text-blue-400">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(n.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
                {nodes.length === 0 && !loading && (
                    <p className="text-neutral-500 text-center text-sm py-4">No nodes yet.</p>
                )}
            </div>
        </div>
    );
};
