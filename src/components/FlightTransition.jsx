import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FlightContext } from '@/context/FlightContext';


export function FlightProvider({ children }) {
    const navigate = useNavigate();
    const [flight, setFlight] = useState(null);

    const startFlight = useCallback((to, coords) => {
        if (flight) return;

        const x = coords?.x ?? window.innerWidth * 0.5;
        const y = coords?.y ?? window.innerHeight * 0.5;

        setFlight({
            to,
            startX: x,
            startY: y
        });

        // Fast, smooth, non-blocking navigation (~380ms)
        setTimeout(() => {
            navigate(to);
            window.scrollTo({ top: 0, behavior: 'instant' });
        }, 380);

        setTimeout(() => {
            setFlight(null);
        }, 650);
    }, [flight, navigate]);

    useEffect(() => {
        const handleGlobalClick = (e) => {
            const clickable = e.target.closest('a[href], button[data-fly]');
            if (!clickable) return;

            if (clickable.target === '_blank' || clickable.hasAttribute('download')) return;
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

            const href = clickable.getAttribute('href');
            if (href && href.startsWith('/') && !href.startsWith('//')) {
                e.preventDefault();
                e.stopPropagation();
                startFlight(href, { x: e.clientX, y: e.clientY });
            }
        };

        document.addEventListener('click', handleGlobalClick, { capture: true });
        return () => document.removeEventListener('click', handleGlobalClick, { capture: true });
    }, [startFlight]);

    return (
        <FlightContext.Provider value={{ startFlight }}>
            {children}
            <FlightOverlay flight={flight} />
        </FlightContext.Provider>
    );
}

function FlightOverlay({ flight }) {
    if (!flight) return null;

    const startX = flight.startX;
    const startY = flight.startY;
    const targetX = window.innerWidth + 350;
    const targetY = -150;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
                {/* Sleek, Non-blocking Sonic Jet that shoots smoothly across the screen */}
                <motion.div
                    initial={{
                        x: startX - 25,
                        y: startY - 25,
                        scale: 0.7,
                        opacity: 0.9,
                        rotate: -35
                    }}
                    animate={{
                        x: targetX,
                        y: targetY,
                        scale: 1.3,
                        opacity: [0.9, 1, 1, 0],
                        rotate: -45
                    }}
                    transition={{
                        duration: 0.6,
                        ease: [0.12, 0.8, 0.32, 1]
                    }}
                    className="absolute top-0 left-0 will-change-transform flex items-center"
                >
                    {/* Glowing Jet Engine Vapor Stream */}
                    <div className="absolute right-[85%] top-1/2 -translate-y-1/2 w-72 md:w-96 h-3 bg-gradient-to-l from-[#FF6B6B] via-[#a855f7] to-transparent rounded-full blur-[2px] opacity-90 origin-right" />
                    <div className="absolute right-[90%] top-1/2 -translate-y-1/2 w-48 md:w-64 h-1 bg-white rounded-full blur-[1px] opacity-95 origin-right" />

                    {/* Supersonic Jet Icon */}
                    <div className="relative w-16 h-16 md:w-20 md:h-20 drop-shadow-[0_0_20px_rgba(255,107,107,0.9)]">
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-45">
                            <path 
                                d="M50 8 L58 35 L88 52 L58 58 L55 85 L50 78 L45 85 L42 58 L12 52 L42 35 Z" 
                                fill="#ffffff" 
                                stroke="#FF6B6B"
                                strokeWidth="2"
                                strokeLinejoin="round"
                            />
                            <polygon points="50,22 53,36 47,36" fill="#7c3aed" />
                            <circle cx="50" cy="80" r="4" fill="#FF6B6B" className="animate-ping" />
                        </svg>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
