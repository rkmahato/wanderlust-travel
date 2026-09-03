import { useEffect } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ChatWidget } from '@/components/ChatWidget';
import { ItineraryPanel } from '@/components/ItineraryPanel';
import { motion } from 'framer-motion';
import { WavyEdgeDivider } from '@/components/common/WavyEdgeDivider';

export function PlanningPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <PageWrapper className="bg-genz-1 text-white min-h-screen relative overflow-hidden">
            {/* Gen-Z Glowing ambient orbs */}
            <div className="genz-glow genz-glow-purple w-[600px] h-[600px] -top-20 -right-40" />
            <div className="genz-glow genz-glow-coral w-[400px] h-[400px] top-1/3 -left-40" />
            <div className="genz-glow genz-glow-teal w-[500px] h-[500px] bottom-20 right-10" />

            {/* ── PHOTO HERO SECTION ──────────────────────── */}
            <section className="relative w-full h-[48vh] min-h-[380px] border-b border-white/10 overflow-hidden">
                <img
                    src="/destinations/machu-picchu.jpg"
                    alt="Planning Expedition"
                    className="w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-[#1a0a2e]/60 to-black/30" />
                <div className="absolute inset-0 img-vignette pointer-events-none" />
                
                <div className="absolute bottom-0 left-0 w-full z-20 px-6 md:px-12 pb-12">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="flex items-center gap-4 text-[#FF6B6B] mb-3 font-bold tracking-widest uppercase text-xs md:text-sm">
                            <span className="w-8 h-[2px] bg-gradient-to-r from-[#FF6B6B] to-[#7c3aed]"></span>
                            AI Expedition Planner
                        </div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none"
                        >
                            TRIP <span className="bg-gradient-to-r from-[#FF6B6B] via-[#f43f5e] to-[#a855f7] bg-clip-text text-transparent">PLANNING</span>
                        </motion.h1>
                    </div>
                </div>
                <WavyEdgeDivider fill="#0a0a1a" position="bottom" className="h-10 md:h-14" />
            </section>

            {/* ── INTERACTIVE AI MODULES ─────────────────── */}
            <div className="px-6 md:px-12 py-16 md:py-24 relative z-10">
                <div className="max-w-[1600px] mx-auto">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                        <ChatWidget destinationName="Global" country="World" className="w-full h-full min-h-[560px]" />
                        <ItineraryPanel destinationName="Global" country="World" className="w-full h-full min-h-[560px]" />
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
