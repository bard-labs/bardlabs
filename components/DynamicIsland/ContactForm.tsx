import React, { useState, useRef } from 'react';
import { ArrowLeft, Instagram, Twitter, Mail, Send, Check, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

export const ContactForm = ({ onBack, onModeChange }: { onBack: () => void, onModeChange: (mode: 'socials' | 'form') => void }) => {
    const [mode, setMode] = useState<'socials' | 'form'>('socials');
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const turnstileRef = useRef<TurnstileInstance>(null);

    const handleSubmit = async () => {
        if (!formData.message || !formData.email) {
            alert('Please fill in all fields');
            return;
        }

        if (!token) {
            alert('Please complete the captcha');
            return;
        }

        // Button bump animation
        gsap.to(".send-btn", { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });

        setSending(true);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, token }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send message');
            }

            setSending(false);
            setSent(true);
            setTimeout(() => {
                onBack();
            }, 3000);
        } catch (error) {
            console.error(error);
            alert('Failed to send message. Please try again.');
            setSending(false);
            turnstileRef.current?.reset();
        }
    };

    useGSAP(() => {
        if (sent) {
            gsap.fromTo(".sent-icon",
                { scale: 0, rotation: -180 },
                { scale: 1, rotation: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" }
            );
            gsap.fromTo(".sent-text",
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4, delay: 0.2 }
            );
        }
    }, [sent]);

    if (mode === 'socials') {
        return (
            <div className="w-full h-full p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                    <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ArrowLeft size={16} className="text-neutral-400" />
                    </button>
                    <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Contact</span>
                    <div className="w-8" /> {/* Spacer */}
                </div>

                <div className="flex gap-2 justify-center mb-4">
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-white/20 transition-colors text-pink-400">
                        <Instagram size={20} />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-white/20 transition-colors text-blue-400">
                        <Twitter size={20} />
                    </a>
                    <a href="mailto:hello@bardalabs.com" className="p-3 bg-white/5 rounded-full hover:bg-white/20 transition-colors text-green-400">
                        <Mail size={20} />
                    </a>
                </div>

                <button
                    onClick={() => {
                        setMode('form');
                        onModeChange('form');
                    }}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                    <Send size={16} />
                    Send a Message
                </button>
            </div>
        );
    }

    return (
        <div className="w-full h-full p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
                <button onClick={() => {
                    setMode('socials');
                    onModeChange('socials');
                }} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft size={14} className="text-neutral-400" />
                </button>
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">New Message</span>
            </div>

            {sent ? (
                <div className="flex-1 flex flex-col items-center justify-center text-green-400">
                    <div className="sent-icon w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                        <Check size={32} />
                    </div>
                    <span className="sent-text text-lg font-medium">Sent!</span>
                </div>
            ) : (
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1">
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            placeholder="Name"
                            className="bg-white/5 rounded-lg px-3 py-2 text-sm outline-none focus:bg-white/10 transition-colors"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                            placeholder="Email"
                            className="bg-white/5 rounded-lg px-3 py-2 text-sm outline-none focus:bg-white/10 transition-colors"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <textarea
                        placeholder="Message..."
                        className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm outline-none focus:bg-white/10 transition-colors h-20 resize-none"
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                    />

                    <div className="flex justify-center py-1">
                        <Turnstile
                            ref={turnstileRef}
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                            onSuccess={setToken}
                            options={{ theme: 'dark', size: 'flexible' }}
                            className='w-full'
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={sending || !token}
                        className="send-btn w-full py-2 bg-white text-black rounded-xl font-medium text-sm hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-auto"
                    >
                        {sending ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Send Message</>}
                    </button>
                </div>
            )}
        </div>
    );
};
