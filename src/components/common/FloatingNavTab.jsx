import React, { useState } from 'react';
import { X, Compass, Mountain, Bike, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * FloatingNavTab
 * Bottom-anchored floating navigation tab inspired by Red Bull's article drawer.
 * Features rounded top corners (rounded-t-2xl) and a quick drawer jump list.
 */
export function FloatingNavTab({ onNavigate }) {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { id: 'hero', label: 'Top', icon: ArrowUp },
        { id: 'stats', label: 'Telemetry', icon: Compass },
        { id: 'editorial', label: 'Expeditions', icon: Mountain },
        { id: 'destinations', label: 'Destinations', icon: Bike },
    ];

    const handleItemClick = (id) => {
        setIsOpen(false);
        if (onNavigate) {
            onNavigate(id);
        } else {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            } else if (id === 'hero') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none">
            {/* Quick Drawer Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="mb-2 p-3 bg-[#0c1427]/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl pointer-events-auto flex items-center gap-2"
                    >
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleItemClick(item.id)}
                                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-[#0048aa] text-white/80 hover:text-white transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                                >
                                    <Icon size={14} />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Tab Handle with Red Bull signature rounded-t-2xl */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto bg-[#0a1428]/95 hover:bg-[#0048aa] text-white border-t border-x border-white/25 rounded-t-2xl px-6 py-2 shadow-2xl backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 group hover:pt-3 hover:-translate-y-0.5"
                title="Quick Navigation"
                aria-label="Toggle Navigation Drawer"
            >
                {isOpen ? (
                    <X size={18} className="text-white group-hover:rotate-90 transition-transform" />
                ) : (
                    <div className="flex flex-col gap-1 items-center justify-center py-0.5">
                        <span className="w-5 h-[2px] bg-white rounded-full transition-all group-hover:w-6" />
                        <span className="w-5 h-[2px] bg-white rounded-full transition-all group-hover:w-6" />
                        <span className="w-5 h-[2px] bg-white rounded-full transition-all group-hover:w-6" />
                    </div>
                )}
            </button>
        </div>
    );
}

export default FloatingNavTab;
