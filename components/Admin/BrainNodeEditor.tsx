"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Trash2, Brain, Save, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

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
        if (!formData.label || !formData.category_id) {
            toast.error('Label and category are required');
            return;
        }

        const payload = {
            label: formData.label,
            description: formData.description,
            category_id: formData.category_id,
            parent_id: formData.parent_id || null,
            position: { x: 0, y: 0, z: 0 }
        };

        if (editingId) {
            const { error } = await supabase.from('brain_nodes').update(payload).eq('id', editingId);
            if (error) {
                toast.error('Update failed', { description: error.message });
                return;
            }
            toast.success('Brain node updated');
        } else {
            const { error } = await supabase.from('brain_nodes').insert([payload]);
            if (error) {
                toast.error('Could not add node', { description: error.message });
                return;
            }
            toast.success('Brain node added');
        }

        resetForm();
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        const { error } = await supabase.from('brain_nodes').delete().eq('id', id);
        if (error) {
            toast.error('Delete failed', { description: error.message });
            return;
        }
        toast.success('Brain node deleted');
        fetchData();
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
            <ScrollArea className="max-h-[400px] min-h-0 flex-1 pr-2">
                <div className="space-y-2">
                    {nodes.map(n => (
                        <div key={n.id} className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3 transition-colors hover:bg-white/10">
                            <div className="min-w-0 flex-1">
                                <div className="mb-1 flex items-center gap-2">
                                    <h3 className="truncate font-medium">{n.label}</h3>
                                    {categories.find(c => c.id === n.category_id) && (
                                        <span
                                            className="rounded-full px-2 py-0.5 text-[10px] font-medium text-black"
                                            style={{ backgroundColor: categories.find(c => c.id === n.category_id)?.color }}
                                        >
                                            {categories.find(c => c.id === n.category_id)?.name}
                                        </span>
                                    )}
                                </div>
                                <p className="truncate text-xs text-neutral-500">{n.description}</p>
                            </div>
                            <div className="ml-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                <button onClick={() => handleEdit(n)} className="rounded-lg p-2 text-blue-400 hover:bg-white/10">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(n.id)} className="rounded-lg p-2 text-red-400 hover:bg-white/10">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {nodes.length === 0 && !loading ? (
                        <p className="py-4 text-center text-sm text-neutral-500">No data found</p>
                    ) : null}
                </div>
            </ScrollArea>
        </div>
    );
};
