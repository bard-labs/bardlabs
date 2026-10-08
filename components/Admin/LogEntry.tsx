"use client"

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Send, Clock, Eye, Trash2, X } from 'lucide-react';

type Log = {
    id: string;
    content: string;
    created_at: string;
};

export const LogEntry = () => {
    const supabase = createClient();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [logs, setLogs] = useState<Log[]>([]);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchLogs = async () => {
        const { data } = await supabase.from('logs').select('*').order('created_at', { ascending: false });
        if (data) setLogs(data as Log[]);
    };

    const handleSubmit = async () => {
        if (!content) return;
        setLoading(true);

        const payload = {
            content: content
        };

        const { error } = await supabase.from('logs').insert([payload]);

        if (error) {
            console.error('Error submitting log:', error);
            alert('Failed to submit log: ' + error.message);
        } else {
            setContent('');
            // Refresh logs if modal is open
            if (showModal) fetchLogs();
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this log?')) {
            setDeletingId(id);

            const { error } = await supabase.from('logs').delete().eq('id', id);

            if (error) {
                console.error('Error deleting log:', error);
                alert('Failed to delete log.');
                setDeletingId(null);
            } else {
                setLogs(prev => prev.filter(l => l.id !== id));
                setDeletingId(null);
            }
        }
    };

    const openModal = () => {
        fetchLogs();
        setShowModal(true);
    };

    return (
        <>
            <div className="bg-neutral-900/50 border border-white/5 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium flex items-center gap-2">
                        <Clock size={20} className="text-green-400" />
                        Daily Log
                    </h2>
                    <button
                        onClick={openModal}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-white"
                        title="View All Logs"
                    >
                        <Eye size={18} />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What did you build today?"
                                className="w-full bg-neutral-800 rounded-xl px-4 py-3 outline-none text-sm border border-transparent focus:border-green-500 transition-colors pr-12"
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-green-500 rounded-lg text-black hover:bg-green-400 transition-colors disabled:opacity-50"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* View/Delete Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-xl font-bold">All Logs</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {logs.map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex items-start justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors group ${deletingId === item.id ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs text-neutral-500 font-mono">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-neutral-300 text-sm">{item.content}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {logs.length === 0 && (
                                <p className="text-neutral-500 text-center py-8">No logs found.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
