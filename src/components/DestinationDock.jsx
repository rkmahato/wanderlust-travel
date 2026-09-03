import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, Gauge, Backpack, MapPin, Sparkles } from 'lucide-react';

const SECTIONS = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'weather-telemetry', label: 'Climate & Telemetry', icon: Gauge },
    { id: 'packing-guide', label: 'Gear Guide', icon: Backpack },
    { id: 'landmarks', label: 'Iconic Sights', icon: MapPin },
    { id: 'ai-planner', label: 'AI Specialist', icon: Sparkles }
];

export function DestinationDock() {
    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY + 220; // lookahead offset

            for (let i = SECTIONS.length - 1; i >= 0; i--) {
                const sec = SECTIONS[i];
                const el = document.getElementById(sec.id);
                if (el) {
                    const top = el.offsetTop;
                    if (scrollPos >= top) {
                        setActiveSection(sec.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const activeBtn = document.querySelector(`[data-dock-id="${activeSection}"]`);
        if (activeBtn) {
            activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [activeSection]);

    function scrollToSection(id) {
        setActiveSection(id);
        const el = document.getElementById(id);
        if (el) {
            const yOffset = -100; // Account for navbar/dock offset
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        }
    }

    return (
        <div className="sticky top-20 md:top-24 z-40 w-full flex justify-center px-4 py-2 pointer-events-none">
            <nav
                aria-label="Expedition Section Navigation"
                className="pointer-events-auto max-w-full overflow-x-auto no-scrollbar rounded-full p-1.5 bg-[#0f0c24]/90 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-purple-950/60 flex items-center gap-1.5 scroll-smooth"
            >
                {SECTIONS.map((sec) => {
                    const isActive = activeSection === sec.id;
                    const Icon = sec.icon;

                    return (
                        <button
                            key={sec.id}
                            data-dock-id={sec.id}
                            type="button"
                            onClick={() => scrollToSection(sec.id)}
                            aria-current={isActive ? 'true' : undefined}
                            className={`relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 whitespace-nowrap select-none active:scale-95 ${
                                isActive
                                    ? 'text-white shadow-lg'
                                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeDockPill"
                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#7c3aed]"
                                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                                />
                            )}
                            <Icon size={13} className="relative z-10" />
                            <span className="relative z-10">{sec.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
