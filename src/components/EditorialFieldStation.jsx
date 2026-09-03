import React from 'react';
import { Activity, Radio, MapPin } from 'lucide-react';
import { SquircleBadge } from '@/components/common/SquircleBadge';
import { VectorMountainLine, VectorWaveLine } from '@/components/common/VectorMountainLine';

/**
 * EditorialFieldStation
 * Red Bull-inspired rich multimedia field station and telemetry dossier.
 * Fills the left column of the editorial section with multi-layered photography,
 * elevation profile graphs, sensor telemetry, and authentic field quotes.
 */
export function EditorialFieldStation() {
    return (
        <div className="w-full flex flex-col gap-6">
            {/* Top Live Satellite Telemetry Chip */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-4" />
                    <span>Live Field Stream</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-mono">
                    <MapPin size={13} className="text-[#FF6B6B]" />
                    <span>28°16' N, 16°38' W</span>
                </div>
            </div>

            {/* Primary Hero Adventure Card */}
            <div className="relative w-full aspect-[16/10] md:aspect-[4/3] rounded-3xl overflow-hidden border border-white/20 shadow-2xl group bg-[#0a1120]">
                <img
                    src="/destinations/machu-picchu.jpg"
                    alt="Volcanic Summit Ridge"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                <div className="absolute inset-0 img-vignette pointer-events-none" />

                {/* Top Corner Elements */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest shadow-md">
                        Primary Sector 01
                    </span>
                    <SquircleBadge icon="mountain" size="sm" variant="blue" />
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
                    <div className="flex items-center gap-2 text-blue-300 text-[11px] font-bold uppercase tracking-widest mb-1">
                        <Activity size={12} className="text-[#FF6B6B]" /> Summit Crest // 3,718 M
                    </div>
                    <p className="text-white font-display text-xl md:text-2xl uppercase tracking-wide leading-tight drop-shadow-md">
                        Volcanic Ridge Traverse
                    </p>
                </div>
            </div>

            {/* Overlapping Secondary Action Card (Signature Red Bull Boundary Bleed) */}
            <div className="-mt-14 ml-auto w-[82%] rounded-3xl overflow-hidden border-2 border-white/25 shadow-2xl relative z-20 group hover:scale-[1.02] transition-transform duration-300 bg-[#0c1427]">
                <div className="relative aspect-[16/9] w-full">
                    <img
                        src="/destinations/swiss-alps.jpg"
                        alt="High Alpine Ascent"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                    {/* Badge & Caption */}
                    <div className="absolute top-3 right-3 z-10 pointer-events-none">
                        <SquircleBadge icon="bike" size="sm" variant="accent" />
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 z-10 pointer-events-none flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF6B6B] block">
                                Technical Route
                            </span>
                            <span className="text-white font-display text-base uppercase tracking-wider">
                                Grade V Alpine Ridge
                            </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-neutral-200 text-[9px] font-bold uppercase tracking-widest border border-white/20">
                            Telemetry Active
                        </span>
                    </div>
                </div>
            </div>

            {/* Topographic Elevation Profile & Live Sensor Telemetry Strip */}
            <div className="rounded-3xl p-5 md:p-6 bg-[#0c1427]/85 border border-white/15 backdrop-blur-xl shadow-2xl relative z-20">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <VectorMountainLine className="w-14 h-5 text-blue-400" />
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-300">
                            Ridge Elevation Profile
                        </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                        <Radio size={11} className="animate-pulse" /> SENSOR SYNC
                    </span>
                </div>

                {/* SVG Topographic Wave Profile */}
                <div className="w-full h-14 relative overflow-hidden rounded-xl bg-black/30 p-1 mb-4 border border-white/5">
                    <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="w-full h-full">
                        <defs>
                            <linearGradient id="topoGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#0048aa" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#0048aa" stopOpacity="0.0" />
                            </linearGradient>
                            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#FF6B6B" />
                                <stop offset="50%" stopColor="#0048aa" />
                                <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                        </defs>
                        {/* Area fill */}
                        <path
                            d="M0,55 Q50,45 90,25 T180,35 T260,10 T340,30 T400,18 L400,60 L0,60 Z"
                            fill="url(#topoGradient)"
                        />
                        {/* Ridge Line */}
                        <path
                            d="M0,55 Q50,45 90,25 T180,35 T260,10 T340,30 T400,18"
                            fill="none"
                            stroke="url(#lineGradient)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                {/* 3 Live Telemetry Sensor Gauges */}
                <div className="grid grid-cols-3 gap-3 text-center border-t border-white/10 pt-3">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Max Elev</span>
                        <span className="text-white font-display text-lg">3,718M</span>
                    </div>
                    <div className="flex flex-col border-x border-white/10">
                        <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Wind Flow</span>
                        <span className="text-[#FF6B6B] font-display text-lg">24 KTS</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Adrenaline</span>
                        <span className="text-blue-400 font-display text-lg">9.6 / 10</span>
                    </div>
                </div>
            </div>

            {/* Authentic Red Bulletin Field Dispatch Quote */}
            <div className="p-4 rounded-2xl bg-[#091122]/70 border-l-4 border-[#FF6B6B] border-y border-r border-white/10 backdrop-blur-md">
                <p className="text-xs md:text-sm text-neutral-300 italic leading-relaxed mb-2 font-medium">
                    "Volcanic ridge descents demand razor-sharp instinct. Above 3,000 meters, elevation isn't given—it's conquered."
                </p>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    <span className="text-blue-300">— Red Bulletin Field Dispatch #04</span>
                    <VectorWaveLine className="w-12 h-3 text-[#FF6B6B]/80" />
                </div>
            </div>
        </div>
    );
}

export default EditorialFieldStation;
