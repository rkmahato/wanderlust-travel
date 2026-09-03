import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, MapPin, Flame, Mountain, Thermometer, ArrowUpRight } from 'lucide-react';

import { PageWrapper } from '@/components/layout/PageWrapper';
import destinationsData from '@/data/destinations.json';
import { WavyEdgeDivider } from '@/components/common/WavyEdgeDivider';
import { SquircleBadge } from '@/components/common/SquircleBadge';
import { VectorMountainLine, VectorWaveLine } from '@/components/common/VectorMountainLine';
import { FloatingNavTab } from '@/components/common/FloatingNavTab';
import { EditorialFieldStation } from '@/components/EditorialFieldStation';
import { cn } from '@/utils/motion';

/* ── Reusable scroll-reveal wrapper ──────────────────────────── */
function ScrollReveal({ children, className, delay = 0 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 35 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ── Curated Marquee Expeditions Configuration ────────────────── */
const MARQUEE_CONFIG = [
    {
        id: 'patagonia',
        categories: ['alpine', 'wilderness'],
        categoryLabel: 'Alpine Peaks',
        elevation: '3,050 M',
        temp: '8°C',
        difficulty: 'Expedition Grade',
        season: 'Nov — Mar',
        highlight: 'Granite spires, glacier traverses & untamed steppes',
        badgeIcon: 'mountain'
    },
    {
        id: 'kyoto',
        categories: ['cultural'],
        categoryLabel: 'Cultural Wonders',
        elevation: '105 M',
        temp: '18°C',
        difficulty: 'Imperial Sanctum',
        season: 'Mar — May / Oct — Nov',
        highlight: '17 UNESCO World Heritage sanctuaries & torii paths',
        badgeIcon: 'sparkle'
    },
    {
        id: 'santorini',
        categories: ['coastal'],
        categoryLabel: 'Coastal Waters',
        elevation: '300 M',
        temp: '24°C',
        difficulty: 'Caldera Ridge',
        season: 'Apr — Oct',
        highlight: 'Volcanic caldera rim & whitewashed cliffside architecture',
        badgeIcon: 'surf'
    },
    {
        id: 'swiss-alps',
        categories: ['alpine'],
        categoryLabel: 'Alpine Peaks',
        elevation: '4,478 M',
        temp: '-2°C',
        difficulty: 'High Alpine Ascent',
        season: 'Dec — Apr & Jul — Sep',
        highlight: 'Matterhorn glacial ridges, high-altitude huts & summits',
        badgeIcon: 'mountain'
    },
    {
        id: 'iceland',
        categories: ['alpine', 'wilderness'],
        categoryLabel: 'Untamed Wilderness',
        elevation: '2,110 M',
        temp: '2°C',
        difficulty: 'Sub-Arctic Trek',
        season: 'Sep — Mar (Aurora)',
        highlight: 'Active volcanic fissures, sapphire ice caves & black sands',
        badgeIcon: 'wind'
    },
    {
        id: 'amalfi-coast',
        categories: ['coastal'],
        categoryLabel: 'Coastal Waters',
        elevation: '650 M',
        temp: '22°C',
        difficulty: 'Cliffside Traverse',
        season: 'May — Sep',
        highlight: 'Path of the Gods clifftops & cobalt marine vistas',
        badgeIcon: 'surf'
    },
    {
        id: 'machu-picchu',
        categories: ['cultural', 'alpine'],
        categoryLabel: 'Cultural Wonders',
        elevation: '2,430 M',
        temp: '16°C',
        difficulty: 'Mountain Citadel',
        season: 'May — Oct',
        highlight: 'Sacred Incan citadel perched amid cloud forest pinnacles',
        badgeIcon: 'compass'
    }
];

const CATEGORY_TABS = [
    { id: 'all', label: 'All Featured' },
    { id: 'alpine', label: 'Alpine Peaks' },
    { id: 'coastal', label: 'Coastal Waters' },
    { id: 'cultural', label: 'Cultural Wonders' },
    { id: 'wilderness', label: 'Untamed Wilderness' }
];

export function LandingPage() {
    const heroWords = ["BEYOND", "THE", "EDGE"];
    const [selectedCategory, setSelectedCategory] = useState('all');
    
    /* ── Hero parallax ──────── */
    const heroRef = useRef(null);
    const { scrollYProgress: heroProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    const heroImageY = useTransform(heroProgress, [0, 1], ['0%', '30%']);
    const heroImageScale = useTransform(heroProgress, [0, 1], [1.05, 1.2]);
    const heroOverlayOpacity = useTransform(heroProgress, [0, 0.5, 1], [0.4, 0.6, 0.9]);

    /* ── Editorial section parallax ──────── */
    const editorialRef = useRef(null);
    const { scrollYProgress: editProgress } = useScroll({
        target: editorialRef,
        offset: ["start end", "end start"]
    });
    const imageScale = useTransform(editProgress, [0, 0.5, 1], [1.15, 1, 1.05]);
    const textYOffset = useTransform(editProgress, [0, 1], [80, -80]);

    const tickerItems = [
        "PATAGONIA, CHILE", "KYOTO, JAPAN", "TENERIFE, SPAIN", "AMALFI COAST, ITALY",
        "BALI, INDONESIA", "ICELAND", "TOKYO, JAPAN", "SERENGETI, TANZANIA",
        "RAJASTHAN, INDIA", "CAPE TOWN", "MALDIVES", "MACHU PICCHU, PERU"
    ];

    // Build hydrated marquee items with real destination data
    const marqueeList = MARQUEE_CONFIG.map(cfg => {
        const dest = destinationsData.find(d => d.id === cfg.id) || {};
        return {
            ...dest,
            ...cfg,
            resolvedImage: dest.imageUrl || `/destinations/${cfg.id}.jpg`
        };
    });

    const filteredMarquee = selectedCategory === 'all'
        ? marqueeList.slice(0, 6)
        : marqueeList.filter(item => item.categories.includes(selectedCategory));

    const leadExpedition = filteredMarquee[0];
    const companionExpeditions = filteredMarquee.slice(1);

    return (
        <PageWrapper className="bg-transparent">
            {/* ── HERO WITH 4K VIDEO & ORGANIC WAVY EDGE ─────────── */}
            <section id="hero" ref={heroRef} className="relative h-screen w-full flex flex-col justify-end overflow-hidden bg-genz-hero">
                {/* Floating ambient glow orbs */}
                <div className="genz-glow genz-glow-purple w-[500px] h-[500px] -top-40 -right-40" />
                <div className="genz-glow genz-glow-teal w-[400px] h-[400px] bottom-20 -left-40" />
                <div className="genz-glow genz-glow-coral w-[300px] h-[300px] top-1/3 right-1/4" />

                {/* 4K Animation Travel Video with Parallax */}
                <motion.div 
                    className="absolute inset-0 z-0 will-change-transform"
                    style={{ y: heroImageY, scale: heroImageScale }}
                >
                    <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        preload="auto"
                        poster="/destinations/patagonia.jpg"
                        className="w-full h-full object-cover opacity-85"
                    >
                        <source src="/hero-video.mp4" type="video/mp4" />
                        <source src="https://cdn.pixabay.com/video/2016/02/29/2295-157183598_large.mp4" type="video/mp4" />
                    </video>
                </motion.div>
                
                {/* Scroll-driven darkening overlay with gradient color */}
                <motion.div 
                    className="absolute inset-0 z-[1]"
                    style={{ opacity: heroOverlayOpacity }}
                >
                    <div className="w-full h-full bg-gradient-to-t from-[#0f0c29] via-[#302b63]/60 to-transparent" />
                </motion.div>
                
                {/* Vignette */}
                <div className="absolute inset-0 z-[2] img-vignette pointer-events-none" />
                
                {/* Hero Content */}
                <div className="relative z-20 w-full px-6 md:px-12 pb-20 md:pb-36 flex flex-col justify-end h-full pt-32">
                    <div className="max-w-7xl">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="flex items-center gap-3 text-[#FF6B6B] mb-5 font-bold tracking-widest uppercase text-xs md:text-sm"
                        >
                            <Flame size={15} className="text-[#FF6B6B] animate-pulse" />
                            <span>Original Extreme Expeditions 2026</span>
                            <span className="hidden sm:inline-block text-white/30">|</span>
                            <span className="hidden sm:inline-block text-neutral-400 font-medium">Curated Outdoor Guides</span>
                        </motion.div>
                        
                        <div className="flex flex-wrap mb-6">
                            {heroWords.map((word, i) => (
                                <div key={i} className="mr-[2vw] overflow-hidden">
                                    <motion.span 
                                        initial={{ y: '100%' }}
                                        animate={{ y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                        className="inline-block font-display text-7xl md:text-9xl lg:text-[11vw] leading-[0.85] uppercase text-white tracking-tighter"
                                    >
                                        {word}
                                    </motion.span>
                                </div>
                            ))}
                        </div>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="max-w-xl"
                        >
                            <p className="text-lg md:text-xl text-neutral-200 font-medium leading-relaxed mb-8">
                                Explore the world's most extreme landscapes, volcanic ridges, and untamed coasts. Inspired by top-tier adventure journalism.
                            </p>
                            <div className="flex flex-wrap items-center gap-4">
                                <Link 
                                    to="/explore" 
                                    className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF6B6B] to-[#ee5a24] text-white px-8 py-4 font-bold text-xs uppercase tracking-widest hover:shadow-xl hover:shadow-[#FF6B6B]/40 hover:scale-105 transition-all rounded-full"
                                >
                                    Start Exploring <ArrowRight size={16} />
                                </Link>
                                <Link 
                                    to="/plan" 
                                    className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-4 font-bold text-xs uppercase tracking-widest backdrop-blur-md transition-all rounded-full"
                                >
                                    <Sparkles size={16} className="text-[#FF6B6B]" /> AI Trip Planner
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Red Bull-Inspired Wavy Bottom Background Edge */}
                <WavyEdgeDivider fill="#161233" position="bottom" className="h-12 md:h-20 lg:h-28" />
            </section>

            {/* ── LIVE EXPEDITION TICKER MARQUEE ──────────────────── */}
            <div className="w-full bg-[#161233] border-y border-white/10 py-3.5 overflow-hidden whitespace-nowrap relative z-30">
                <div className="inline-flex animate-marquee gap-8 items-center text-xs font-bold uppercase tracking-[0.25em] text-neutral-300">
                    {tickerItems.concat(tickerItems).map((item, idx) => (
                        <span key={idx} className="flex items-center gap-3">
                            <span className="text-[#FF6B6B]">✦</span>
                            <span>{item}</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* ── EXPEDITION KEY STATS BAR WITH WAVY EDGE ─────────── */}
            <section id="stats" className="w-full bg-[#0d0a21] border-b border-white/10 pt-10 pb-16 px-6 md:px-12 relative z-20 overflow-hidden">
                <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
                    <div className="border-l-2 border-[#FF6B6B] pl-5">
                        <span className="font-display text-4xl md:text-5xl text-white block">20+</span>
                        <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Curated Missions</span>
                    </div>
                    <div className="border-l-2 border-[#0048aa] pl-5">
                        <span className="font-display text-4xl md:text-5xl text-white block">80+</span>
                        <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Iconic Landmarks</span>
                    </div>
                    <div className="border-l-2 border-[#06b6d4] pl-5">
                        <span className="font-display text-4xl md:text-5xl text-white block">LIVE</span>
                        <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Weather Telemetry</span>
                    </div>
                    <div className="border-l-2 border-emerald-400 pl-5">
                        <span className="font-display text-4xl md:text-5xl text-white block">GEMINI</span>
                        <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">AI Concierge</span>
                    </div>
                </div>

                {/* Transition into Editorial Section */}
                <WavyEdgeDivider fill="#10192e" position="bottom" className="h-10 md:h-16" flipX />
            </section>

            {/* ── EDITORIAL SCROLL — OUTDOOR EXPLORATION ─────────── */}
            <section id="editorial" ref={editorialRef} className="relative w-full min-h-[120vh] flex flex-col md:flex-row items-start bg-[#10192e]">
                {/* Ambient glow */}
                <div className="genz-glow genz-glow-pink w-[600px] h-[600px] top-1/4 -left-60" />
                <div className="genz-glow genz-glow-teal w-[400px] h-[400px] bottom-40 right-0" />

                {/* Red Bull-Inspired Editorial Field Station (Left Column) */}
                <div className="w-full md:w-1/2 md:sticky md:top-24 self-start px-6 md:px-12 lg:px-16 pt-12 md:pt-20 pb-16 z-10">
                    <motion.div style={{ scale: imageScale }} className="will-change-transform">
                        <EditorialFieldStation />
                    </motion.div>
                </div>
                
                {/* Scrolling Text with Red Bull Squircle Badges */}
                <div className="w-full md:w-1/2 pt-24 md:pt-[24vh] pb-36 px-8 md:px-24 flex flex-col z-10 relative">
                    <div className="flex items-center gap-4 mb-4">
                        <VectorMountainLine className="w-24 h-8 text-[#FF6B6B]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-300">Adventure Dossier</span>
                    </div>

                    <motion.h2 style={{ y: textYOffset }} className="font-display text-5xl md:text-7xl lg:text-8xl uppercase mb-14 w-full text-white leading-[0.9] tracking-tighter">
                        Defy <br/><span className="bg-gradient-to-r from-[#FF6B6B] to-[#ee5a24] bg-clip-text text-transparent">Gravity.</span>
                    </motion.h2>

                    <div className="space-y-10 w-full">
                        {[
                            { num: '01', title: 'Curated Extreme Retreats', desc: 'From volcanic ridge climbs in Tenerife to glacier expeditions in Patagonia. Handpicked for raw wilderness and high adrenaline.', badge: 'mountain' },
                            { num: '02', title: 'Gemini AI Expeditioner', desc: 'Our smart AI assistant pieces together customized day-by-day itineraries, matching boutique stays with high-octane expeditions.', badge: 'sparkle' },
                            { num: '03', title: 'Direct Seamless Booking', desc: 'One transparent reservation handles your backcountry permits, gear transfers, and luxury wilderness lodges.', badge: 'compass' },
                        ].map((item, i) => (
                            <ScrollReveal key={item.num} delay={i * 0.1}>
                                <div className="p-8 rounded-3xl bg-[#0c1427]/80 border border-white/15 backdrop-blur-md hover:border-[#0048aa]/70 transition-all duration-300 shadow-2xl group hover:-translate-y-1">
                                    <div className="flex items-center justify-between gap-4 mb-4">
                                        <SquircleBadge 
                                            icon={item.badge} 
                                            size="md" 
                                            variant="blue" 
                                        />
                                        <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B6B]">Step {item.num}</span>
                                    </div>
                                    <h3 className="font-display text-2xl md:text-3xl text-white mb-3 group-hover:text-blue-300 transition-colors">{item.title}</h3>
                                    <p className="text-sm text-neutral-300 font-medium leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>

                {/* Transition to Destinations Section with Wavy Edge */}
                <WavyEdgeDivider fill="#0b1322" position="bottom" className="h-16 md:h-24 lg:h-32" />
            </section>

            {/* ── CURATED FEATURED EXPEDITIONS SHOWCASE ──────────── */}
            <section id="destinations" className="w-full bg-gradient-to-b from-[#0b1322] via-[#0e1c31] to-[#09111c] pt-28 pb-32 relative overflow-hidden">
                <div className="genz-glow genz-glow-purple w-[500px] h-[500px] top-[15%] -right-40" />
                <div className="genz-glow genz-glow-teal w-[500px] h-[500px] top-[60%] -left-40" />

                <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
                    
                    {/* Editorial Header */}
                    <ScrollReveal className="text-center max-w-3xl mx-auto mb-10">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <VectorWaveLine className="w-14 h-4 text-blue-400" />
                            <span className="text-[#FF6B6B] text-xs font-mono font-bold uppercase tracking-[0.25em]">
                                Curated Marquee Dossiers
                            </span>
                            <VectorWaveLine className="w-14 h-4 text-blue-400" />
                        </div>
                        <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-tighter uppercase leading-none mb-4">
                            Featured Expeditions
                        </h2>
                        <p className="text-neutral-300 text-sm md:text-base max-w-xl mx-auto font-medium">
                            Hand-vetted alpine summits, volcanic calderas, and ancient citadels curated for uncompromising explorers.
                        </p>
                    </ScrollReveal>

                    {/* Interactive Category Filter Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-2.5 md:gap-3 mb-8">
                        {CATEGORY_TABS.map((tab) => {
                            const isActive = selectedCategory === tab.id;
                            const count = tab.id === 'all' 
                                ? marqueeList.length 
                                : marqueeList.filter(m => m.categories.includes(tab.id)).length;

                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setSelectedCategory(tab.id)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer focus:outline-none",
                                        isActive 
                                            ? "bg-white text-black shadow-xl shadow-white/20 scale-105" 
                                            : "bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 hover:text-white border border-white/10 hover:border-white/25"
                                    )}
                                >
                                    <span>{tab.label}</span>
                                    <span className={cn(
                                        "text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold",
                                        isActive ? "bg-black/10 text-black" : "bg-white/10 text-neutral-400"
                                    )}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Live Telemetry Bar */}
                    <div className="w-full max-w-4xl mx-auto mb-14 p-4 rounded-2xl bg-[#0c162a]/80 border border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 text-xs font-mono shadow-2xl">
                        <div className="flex items-center gap-2.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                            </span>
                            <span className="text-white uppercase tracking-wider font-semibold">
                                Live Field Telemetry Active
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 md:gap-8 text-neutral-400 text-[11px]">
                            <span>ELEVATION: <strong className="text-white">SEA LEVEL — 4,478M</strong></span>
                            <span>LATITUDES: <strong className="text-[#FF6B6B]">64°N TO 51°S</strong></span>
                            <span className="hidden sm:inline">CONDITIONS: <strong className="text-emerald-400">OPTIMAL TRAIL WINDOW</strong></span>
                        </div>
                    </div>

                    {/* Animated Expeditions Showcase */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedCategory}
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-12"
                        >
                            {/* Spotlight Lead Expedition Card */}
                            {leadExpedition && (
                                <div className="w-full rounded-3xl overflow-hidden border border-white/20 bg-[#0c1527] shadow-2xl group hover:border-[#0048aa]/60 transition-all duration-500">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
                                        
                                        {/* Image Showcase Half */}
                                        <div className="lg:col-span-7 relative min-h-[320px] lg:min-h-full overflow-hidden">
                                            <div 
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
                                                style={{ backgroundImage: `url(${leadExpedition.resolvedImage})` }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-black/30 to-transparent pointer-events-none" />
                                            <div className="absolute inset-0 img-vignette pointer-events-none" />

                                            {/* Badges on Image */}
                                            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] font-bold uppercase tracking-widest">
                                                        MARQUEE // 01
                                                    </span>
                                                    <span className="px-3.5 py-1.5 rounded-full bg-[#0048aa]/70 backdrop-blur-md border border-blue-400/30 text-blue-200 font-mono text-[10px] font-bold uppercase tracking-widest">
                                                        {leadExpedition.categoryLabel}
                                                    </span>
                                                </div>
                                                <SquircleBadge 
                                                    icon={leadExpedition.badgeIcon} 
                                                    size="md" 
                                                    variant="accent" 
                                                />
                                            </div>

                                            {/* Live telemetry chip bottom left */}
                                            <div className="absolute bottom-6 left-6 z-10 flex items-center gap-3">
                                                <div className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 text-white font-mono text-xs flex items-center gap-2">
                                                    <Mountain size={13} className="text-[#FF6B6B]" />
                                                    <span>{leadExpedition.elevation}</span>
                                                </div>
                                                <div className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 text-white font-mono text-xs flex items-center gap-2">
                                                    <Thermometer size={13} className="text-blue-400" />
                                                    <span>{leadExpedition.temp}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Editorial Dossier Half */}
                                        <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between bg-gradient-to-b from-[#0e192f] to-[#0a1222]">
                                            <div>
                                                <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest mb-3">
                                                    <MapPin size={13} className="text-[#FF6B6B]" />
                                                    <span>{leadExpedition.continent} · {leadExpedition.country}</span>
                                                </div>

                                                <h3 className="font-display text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-[0.9] mb-4">
                                                    {leadExpedition.name}
                                                </h3>

                                                <p className="text-[#FF6B6B] text-xs font-bold uppercase tracking-widest mb-4">
                                                    {leadExpedition.highlight}
                                                </p>

                                                <p className="text-neutral-300 text-sm md:text-base leading-relaxed mb-6 font-medium">
                                                    {leadExpedition.description}
                                                </p>

                                                {/* Specs Grid */}
                                                <div className="grid grid-cols-2 gap-3 py-4 border-y border-white/10 mb-6 text-xs font-mono">
                                                    <div>
                                                        <span className="text-neutral-400 block text-[10px] uppercase">Terrain Grade</span>
                                                        <span className="text-white font-bold">{leadExpedition.difficulty}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-neutral-400 block text-[10px] uppercase">Optimal Season</span>
                                                        <span className="text-white font-bold">{leadExpedition.season}</span>
                                                    </div>
                                                </div>

                                                {/* Tag chips */}
                                                <div className="flex flex-wrap gap-2 mb-8">
                                                    {leadExpedition.tags?.slice(0, 3).map((tag) => (
                                                        <span key={tag} className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <Link 
                                                to={`/destination/${leadExpedition.id}`}
                                                className="group inline-flex items-center justify-between w-full bg-gradient-to-r from-[#FF6B6B] to-[#0048aa] text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:shadow-xl hover:shadow-[#0048aa]/40 hover:scale-[1.02] transition-all duration-300"
                                            >
                                                <span>Open Expedition Dossier</span>
                                                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                                            </Link>
                                        </div>

                                    </div>
                                </div>
                            )}

                            {/* Companion Expeditions Editorial Grid */}
                            {companionExpeditions.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {companionExpeditions.map((item) => (
                                        <div 
                                            key={item.id}
                                            className="group relative rounded-3xl overflow-hidden border border-white/15 bg-[#0b1322] hover:border-[#0048aa]/60 transition-all duration-500 shadow-2xl hover:-translate-y-1.5 flex flex-col justify-between"
                                        >
                                            {/* Image Header */}
                                            <div className="relative aspect-[16/11] w-full overflow-hidden">
                                                <div 
                                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                                                    style={{ backgroundImage: `url(${item.resolvedImage})` }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1322] via-black/20 to-transparent pointer-events-none" />

                                                {/* Top Badges */}
                                                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                                                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white font-mono text-[9px] font-bold uppercase tracking-widest">
                                                        {item.continent}
                                                    </span>
                                                    <SquircleBadge icon={item.badgeIcon} size="sm" variant="blue" />
                                                </div>

                                                {/* Telemetry pill */}
                                                <div className="absolute bottom-3 left-4 z-10">
                                                    <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-white font-mono text-[10px] flex items-center gap-1.5">
                                                        <Mountain size={11} className="text-[#FF6B6B]" /> {item.elevation} · {item.temp}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Card Content */}
                                            <div className="p-6 flex flex-col flex-1 justify-between">
                                                <div>
                                                    <div className="flex items-center gap-1.5 text-blue-400 font-mono text-[11px] uppercase tracking-wider mb-2">
                                                        <MapPin size={11} className="text-[#FF6B6B]" /> {item.country}
                                                    </div>

                                                    <h4 className="font-display text-3xl md:text-4xl text-white uppercase tracking-tight mb-2 group-hover:text-blue-300 transition-colors">
                                                        {item.name}
                                                    </h4>

                                                    <p className="text-neutral-300 text-xs line-clamp-2 leading-relaxed mb-4 font-medium">
                                                        {item.highlight}
                                                    </p>

                                                    <div className="flex flex-wrap gap-1.5 mb-6">
                                                        {item.tags?.slice(0, 3).map((tag) => (
                                                            <span key={tag} className="text-[9px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400">
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <Link 
                                                    to={`/destination/${item.id}`}
                                                    className="inline-flex items-center justify-between w-full py-3 px-5 rounded-2xl bg-white/5 hover:bg-white text-neutral-200 hover:text-black font-mono text-xs uppercase font-bold tracking-wider transition-all duration-300 border border-white/10 hover:border-white"
                                                >
                                                    <span>Explore Route</span>
                                                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* ── EYE-CATCHING DIRECTORY CTA BANNER ───────────────── */}
                    <div className="mt-20 w-full rounded-3xl overflow-hidden relative border border-white/15 bg-gradient-to-br from-[#0c1629] via-[#09111e] to-[#040913] p-8 md:p-14 shadow-2xl">
                        {/* Ambient glowing radial orbs */}
                        <div className="genz-glow genz-glow-coral w-[350px] h-[350px] -top-20 -right-20 opacity-25" />
                        <div className="genz-glow genz-glow-teal w-[300px] h-[300px] -bottom-20 -left-20 opacity-20" />

                        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                            <div className="max-w-2xl">
                                <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#FF6B6B] mb-3">
                                    <VectorMountainLine className="w-12 h-4 text-[#FF6B6B]" />
                                    <span>Complete Archive Access</span>
                                </div>
                                <h3 className="font-display text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-none mb-4">
                                    Explore All 20 Global Expeditions
                                </h3>
                                <p className="text-neutral-300 text-sm md:text-base leading-relaxed mb-6 font-medium">
                                    From sub-zero Norwegian fjords to golden Thar desert dunes and Serengeti wildlife migrations. Filter by continent, terrain, and weather telemetry across our complete expedition directory.
                                </p>

                                {/* Mini expedition destination badges */}
                                <div className="flex flex-wrap gap-2">
                                    {['Patagonia', 'Kyoto', 'Santorini', 'Swiss Alps', 'Iceland', 'Amalfi Coast', 'Serengeti', 'Petra', 'Bali', 'Havana', '+10 More'].map((name) => (
                                        <span key={name} className="text-[11px] font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Big Action Button */}
                            <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
                                <Link 
                                    to="/explore" 
                                    className="group inline-flex items-center gap-3.5 bg-gradient-to-r from-[#FF6B6B] via-[#ee5a24] to-[#0048aa] text-white px-9 py-5 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 hover:shadow-2xl hover:shadow-[#FF6B6B]/30 transition-all duration-300"
                                >
                                    <span>Open Full Directory</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                                </Link>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                                    20 Missions · 6 Continents · Live Telemetry Enabled
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* ── FINAL EXPEDITION CTA WITH WAVY TRANSITION ─────── */}
            <section className="w-full py-28 bg-[#08111e] border-t border-white/10 relative overflow-hidden">
                <WavyEdgeDivider fill="#08111e" position="top" className="h-12 md:h-20" flipX />
                <div className="genz-glow genz-glow-coral w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center relative z-10 pt-6">
                    <ScrollReveal>
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <VectorMountainLine className="w-20 h-7 text-[#FF6B6B]" />
                        </div>
                        <span className="text-[#FF6B6B] text-xs font-bold uppercase tracking-[0.25em] mb-4 block">
                            Ready for the Unknown?
                        </span>
                        <h2 className="font-display text-5xl md:text-7xl text-white tracking-tighter mb-8 max-w-3xl leading-none uppercase">
                            Begin Your Field Dossier
                        </h2>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link 
                                to="/explore" 
                                className="bg-gradient-to-r from-[#FF6B6B] via-[#ee5a24] to-[#0048aa] text-white px-10 py-5 font-bold text-xs uppercase tracking-widest hover:shadow-2xl hover:shadow-blue-900/60 hover:scale-105 transition-all rounded-full flex items-center gap-3 shadow-xl"
                            >
                                VIEW ALL 20 DESTINATIONS <ArrowRight size={16} />
                            </Link>
                            <Link 
                                to="/plan" 
                                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-9 py-5 font-bold text-xs uppercase tracking-widest backdrop-blur-md transition-all rounded-full flex items-center gap-2"
                            >
                                <Sparkles size={15} className="text-[#FF6B6B]" />
                                AI EXPEDITION PLANNER
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Red Bull-Inspired Bottom Floating Nav Tab */}
            <FloatingNavTab />
        </PageWrapper>
    );
}

export default LandingPage;
