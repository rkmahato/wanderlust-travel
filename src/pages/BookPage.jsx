import React, { useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Asterisk, CheckCircle2, ShieldCheck, Compass, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WavyEdgeDivider } from '@/components/common/WavyEdgeDivider';
import { VectorMountainLine } from '@/components/common/VectorMountainLine';

export function BookPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setTimeout(() => setSubmitted(true), 600);
    };

    return (
        <PageWrapper className="bg-[#05070d] text-white min-h-screen">
            {/* ── CINEMATIC BOOKING HEADER ─────────────────────────── */}
            <section className="relative w-full pt-36 md:pt-44 pb-20 md:pb-28 px-6 md:px-12 overflow-hidden bg-gradient-to-b from-[#081224] via-[#0b172e] to-[#05070d]">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 pointer-events-none"
                    style={{ backgroundImage: `url('/destinations/patagonia.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#05070d]/95 via-[#081224]/85 to-[#05070d]/90 pointer-events-none" />
                <div className="absolute inset-0 img-vignette pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-blue-300 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md mb-6">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Verified Backcountry Permits & Priority Stays</span>
                    </div>

                    <div className="flex items-center justify-center gap-3 mb-4">
                        <VectorMountainLine className="w-16 h-6 text-[#FF6B6B]" />
                    </div>

                    <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.88] uppercase mb-6 text-white">
                        Reserve Your <br />
                        <span className="bg-gradient-to-r from-[#FF6B6B] to-[#ee5a24] bg-clip-text text-transparent">
                            Expedition.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-neutral-300 font-medium max-w-2xl mx-auto leading-relaxed mb-10">
                        Secure certified IFMGA alpine guides, helicopter backcountry transfers, and private wilderness lodges under one transparent reservation.
                    </p>

                    {/* Trust & Guarantee Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-2">
                            <ShieldCheck size={14} className="text-emerald-400" /> IFMGA Certified Guides
                        </span>
                        <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-2">
                            <Compass size={14} className="text-blue-400" /> Satellite Evac Coverage
                        </span>
                        <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-2">
                            <Sparkles size={14} className="text-[#FF6B6B]" /> 100% Transparent Pricing
                        </span>
                    </div>
                </div>

                <WavyEdgeDivider fill="#05070d" position="bottom" className="h-10 md:h-16" />
            </section>

            {/* ── FORM CONTENT ────────────────────────────────────── */}
            <div className="max-w-3xl mx-auto w-full px-6 md:px-12 py-16">
                {submitted ? (
                    <div className="bg-[#091122]/90 p-12 border border-white/15 text-center rounded-3xl shadow-2xl flex flex-col items-center backdrop-blur-md">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF6B6B] to-[#0048aa] flex items-center justify-center text-white mb-6 shadow-xl">
                            <CheckCircle2 size={36} />
                        </div>
                        <h2 className="font-display text-4xl md:text-5xl mb-4 text-white uppercase tracking-wider">Expedition Requested</h2>
                        <p className="text-neutral-300 font-medium mb-8 max-w-md leading-relaxed">
                            Your reservation has been securely logged. A confirmation email with gear checklist and permit details has been transmitted.
                        </p>
                        <Link to="/" className="text-white bg-gradient-to-r from-[#FF6B6B] to-[#0048aa] px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
                            Return to Expeditions
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-[#091122]/85 p-8 md:p-12 border border-white/15 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col gap-6">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-300">
                                <Asterisk size={14} className="text-[#FF6B6B]" /> <span>Explorer Details</span>
                            </div>
                            <span className="text-[10px] font-mono text-neutral-500 uppercase">OFFICIAL REGISTRATION</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Explorer Name</label>
                                <input required type="text" placeholder="Ajay" className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors text-sm" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Satellite / Email Address</label>
                                <input required type="email" placeholder="ajay@example.com" className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors text-sm" />
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 mt-2">
                            <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Expedition Destination</label>
                            <select className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors text-sm appearance-none cursor-pointer">
                                <option className="bg-[#091122]">Select a destination...</option>
                                <option className="bg-[#091122]">Patagonia, Argentina</option>
                                <option className="bg-[#091122]">Kyoto, Japan</option>
                                <option className="bg-[#091122]">Tenerife, Spain</option>
                                <option className="bg-[#091122]">Swiss Alps, Switzerland</option>
                                <option className="bg-[#091122]">Iceland Highlands, Iceland</option>
                                <option className="bg-[#091122]">Other / Bespoke Expedition</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Custom Requirements / Group Size</label>
                            <textarea rows="3" placeholder="Number of explorers, technical skill level, gear rental needs..." className="bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors text-sm"></textarea>
                        </div>

                        <button type="submit" className="mt-4 bg-gradient-to-r from-[#FF6B6B] via-[#ee5a24] to-[#0048aa] text-white py-4 font-bold text-xs uppercase tracking-widest hover:shadow-xl hover:shadow-blue-900/40 hover:scale-[1.01] transition-all rounded-full">
                            Confirm Expedition Request
                        </button>
                    </form>
                )}
            </div>
        </PageWrapper>
    );
}

export default BookPage;
