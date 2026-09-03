import React, { useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Asterisk, CheckCircle2 } from 'lucide-react';
import { WavyEdgeDivider } from '@/components/common/WavyEdgeDivider';
import { VectorMountainLine } from '@/components/common/VectorMountainLine';
import { SquircleBadge } from '@/components/common/SquircleBadge';

export function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <PageWrapper className="bg-[#05070d] text-white min-h-screen">
            {/* ── CINEMATIC CONCIERGE HEADER ──────────────────────── */}
            <section className="relative w-full pt-36 md:pt-44 pb-20 md:pb-28 px-6 md:px-12 overflow-hidden bg-gradient-to-b from-[#081224] via-[#0b172e] to-[#05070d]">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 pointer-events-none"
                    style={{ backgroundImage: `url('/destinations/iceland.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#05070d]/95 via-[#081224]/85 to-[#05070d]/90 pointer-events-none" />
                <div className="absolute inset-0 img-vignette pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-blue-300 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md mb-6">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>24/7 Field Support & Satellite Dispatch</span>
                    </div>

                    <div className="flex items-center justify-center gap-3 mb-4">
                        <VectorMountainLine className="w-16 h-6 text-[#FF6B6B]" />
                    </div>

                    <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.88] uppercase mb-6 text-white">
                        Contact <br />
                        <span className="bg-gradient-to-r from-[#FF6B6B] to-[#ee5a24] bg-clip-text text-transparent">
                            Concierge.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-neutral-300 font-medium max-w-2xl mx-auto leading-relaxed mb-10">
                        Whether securing remote backcountry permits, helicopter gear drops, or emergency satellite support, our expedition team is always on standby.
                    </p>

                    {/* 3 Telemetry Dispatch Chips */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3">
                            <SquircleBadge icon="compass" size="sm" variant="blue" />
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Satellite Channel</span>
                                <span className="text-white text-xs font-mono font-bold">VHF 16 // SAT-4</span>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3">
                            <SquircleBadge icon="flame" size="sm" variant="accent" />
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Emergency Response</span>
                                <span className="text-white text-xs font-mono font-bold">&lt; 15 Min Standby</span>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3">
                            <SquircleBadge icon="sparkle" size="sm" variant="glass" />
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">AI Expedition Concierge</span>
                                <span className="text-white text-xs font-mono font-bold">Live AI Guidance</span>
                            </div>
                        </div>
                    </div>
                </div>

                <WavyEdgeDivider fill="#05070d" position="bottom" className="h-10 md:h-16" />
            </section>

            {/* ── FORM CONTENT ────────────────────────────────────── */}
            <div className="max-w-4xl mx-auto w-full px-6 md:px-12 py-16">
                {submitted ? (
                     <div className="bg-[#091122]/90 p-12 rounded-3xl border border-white/15 text-center flex flex-col items-center shadow-2xl backdrop-blur-md">
                         <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] to-[#0048aa] flex items-center justify-center text-white mb-6 shadow-xl">
                             <CheckCircle2 size={36} />
                         </div>
                         <h2 className="font-display text-4xl mb-3 text-white uppercase tracking-wider">Transmission Received</h2>
                         <p className="text-neutral-300 font-medium max-w-md mx-auto leading-relaxed">
                             Thank you, your expedition dispatch has been logged. A certified concierge specialist will reach out within 15 minutes.
                         </p>
                     </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-[#091122]/85 p-8 md:p-12 rounded-3xl border border-white/15 shadow-2xl backdrop-blur-xl flex flex-col gap-6">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-300">
                                <Asterisk size={14} className="text-[#FF6B6B]" /> <span>Dispatch Information</span>
                            </div>
                            <span className="text-[10px] font-mono text-neutral-500 uppercase">ENCRYPTED 256-BIT</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Explorer Full Name</label>
                                <input required type="text" defaultValue="Ajay" className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors text-sm" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Satellite / Email Address</label>
                                <input required type="email" placeholder="ajay@example.com" className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors text-sm" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Expedition Query / Field Assistance</label>
                            <textarea required rows="5" placeholder="Specify route permits, preferred dates, gear logistics, or custom requests..." className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors text-sm"></textarea>
                        </div>

                        <button type="submit" className="mt-4 bg-gradient-to-r from-[#FF6B6B] via-[#ee5a24] to-[#0048aa] text-white py-4 font-bold text-xs uppercase tracking-widest hover:shadow-xl hover:shadow-blue-900/40 hover:scale-[1.01] transition-all rounded-full">
                            Transmit Dispatch Message
                        </button>
                    </form>
                )}
            </div>
        </PageWrapper>
    );
}

export default ContactPage;
