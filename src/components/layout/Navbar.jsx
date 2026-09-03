import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin } from 'lucide-react';
import { cn } from '@/utils/motion';

import { AnimatePresence, motion } from 'framer-motion';
import { useLocationContext } from '@/context/LocationContext.js';
import { LocationModal } from '@/components/layout/LocationBar';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [locationModalOpen, setLocationModalOpen] = useState(false);
    const { pathname } = useLocation();
    const { city, status } = useLocationContext();

    const [prevPathname, setPrevPathname] = useState(pathname);
    if (prevPathname !== pathname) {
        setPrevPathname(pathname);
        setMobileOpen(false);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);


    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Ultra-luxury transparent & frosted glass treatment:
    // At top: crystal-clear transparent with soft ambient gradient for maximum legibility over hero media
    // Scrolled: modern translucent frosted glass (backdrop-blur-2xl, bg-black/30) allowing page imagery to softly refract through
    const navBg = scrolled 
        ? 'bg-black/30 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.35)] py-4' 
        : 'bg-gradient-to-b from-black/50 via-black/15 to-transparent backdrop-blur-[1px] py-5 md:py-6';

    const links = [
        { name: 'Expeditions', href: '/explore' },
        { name: 'AI Planner', href: '/plan' },
        { name: 'Support', href: '/contact' }
    ];

    return (
        <>
            <header className={cn('fixed top-0 w-full z-50 transition-all duration-500 ease-out', navBg)}>
                <nav className="max-w-[1600px] mx-auto w-full flex items-center justify-between px-6 md:px-12">
                    
                    {/* Left: Luxury Brand Logo Mark */}
                    <Link 
                        to="/" 
                        className="group flex items-center gap-3.5 select-none focus:outline-none"
                    >
                        <div className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/15 group-hover:border-[#FF6B6B]/60 transition-colors">
                            <svg 
                                viewBox="0 0 36 36" 
                                fill="none" 
                                className="w-5 h-5 text-white transition-transform duration-500 group-hover:rotate-45"
                            >
                                <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.25" strokeDasharray="3 3" />
                                <polygon points="18,4 21,15 32,18 21,21 18,32 15,21 4,18 15,15" fill="none" stroke="currentColor" strokeWidth="1.4" />
                                <polygon points="18,4 21,15 18,18 15,15" fill="#FF6B6B" opacity="0.9" />
                                <polygon points="18,32 21,21 18,18 15,21" fill="currentColor" opacity="0.3" />
                                <circle cx="18" cy="18" r="2" fill="#FFFFFF" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className="font-display text-lg md:text-xl tracking-[0.2em] text-white leading-none">
                                    VOYAGER
                                </span>
                                <span className="text-[#FF6B6B] font-mono font-light text-xs opacity-75">//</span>
                            </div>
                            <span className="text-[8.5px] uppercase tracking-[0.28em] text-neutral-400 font-mono font-medium mt-1 leading-none">
                                DESIGNESTHETICS ARCHIVE
                            </span>
                        </div>
                    </Link>

                    {/* Center: Clarified Navigation Links (Visible on Laptop & Desktop) */}
                    <div className="hidden lg:flex items-center gap-8 xl:gap-10">
                        {links.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link 
                                    key={link.name}
                                    to={link.href} 
                                    className={cn(
                                        "relative text-[13px] uppercase tracking-[0.16em] font-semibold transition-all duration-200 py-1 px-1",
                                        isActive ? "text-white" : "text-neutral-400 hover:text-white"
                                    )}
                                >
                                    {link.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-active-indicator"
                                            className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF6B6B] to-amber-300 rounded-full"
                                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right: Location Pill & Book Now Pill (Responsive across Phone, Tablet, Laptop, Desktop) */}
                    <div className="flex items-center gap-2.5 md:gap-4">
                        {/* Location Pill (Visible on sm+ screens) */}
                        <button
                            type="button"
                            onClick={() => setLocationModalOpen(true)}
                            title={city ? `Exploring from: ${city}. Click to change origin or calibrate GPS.` : "Set your origin location"}
                            className="hidden sm:flex group items-center gap-2 px-3 md:px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 text-xs text-neutral-300 hover:text-white transition-all backdrop-blur-md cursor-pointer"
                        >
                            <span className="relative flex h-2 w-2">
                                {status === 'requesting' ? (
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                                ) : status === 'granted' ? (
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                                ) : null}
                                <span className={cn(
                                    "relative inline-flex rounded-full h-2 w-2",
                                    status === 'requesting' ? "bg-amber-400" :
                                    status === 'granted' ? "bg-emerald-400" :
                                    status === 'denied' ? "bg-rose-400" : "bg-[#FF6B6B]"
                                )} />
                            </span>
                            <MapPin size={12} className="text-[#FF6B6B] group-hover:scale-110 transition-transform" />
                            <span className="tracking-wide font-medium max-w-[100px] md:max-w-[130px] truncate text-[11px] uppercase">
                                {status === 'requesting' ? 'Locating...' : city ? city.split(',')[0] : 'Set Origin'}
                            </span>
                        </button>

                        {/* Book Now Pill */}
                        <Link 
                            to="/book" 
                            className="hidden md:inline-flex text-white text-[12px] uppercase font-semibold tracking-widest border border-white/30 hover:border-white px-5 py-2 rounded-full bg-white/5 hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm shadow-sm"
                        >
                            Book Now
                        </Link>

                        {/* Mobile & Tablet Drawer Toggle */}
                        <button 
                            type="button"
                            aria-label={mobileOpen ? "Close menu" : "Open menu"}
                            className="lg:hidden relative z-50 text-white p-2 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 transition-colors"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Fullscreen Drawer with Smooth Animations */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div 
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
                        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        transition={{ duration: 0.25 }}
                        className="md:hidden fixed inset-0 bg-[#050505]/95 z-40 flex flex-col justify-between px-8 pt-32 pb-12 overflow-y-auto"
                    >
                        {/* Mobile Links */}
                        <div className="flex flex-col gap-6">
                            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#FF6B6B]">
                                Navigation Index
                            </span>
                            {links.map((link, idx) => {
                                const isActive = pathname === link.href;
                                return (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * idx, duration: 0.3 }}
                                    >
                                        <Link 
                                            to={link.href} 
                                            onClick={() => setMobileOpen(false)}
                                            className={cn(
                                                "block font-display text-4xl uppercase tracking-wider transition-colors",
                                                isActive ? "text-[#FF6B6B]" : "text-white hover:text-white/70"
                                            )}
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Mobile Location Pill & CTAs */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                            className="flex flex-col gap-4 pt-8 border-t border-white/10"
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileOpen(false);
                                    setLocationModalOpen(true);
                                }}
                                className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.10] border border-white/15 text-xs text-neutral-200 transition-colors"
                            >
                                <MapPin size={14} className="text-[#FF6B6B]" />
                                <span className="uppercase tracking-widest font-mono text-[11px]">
                                    {status === 'requesting' ? 'Locating Origin...' : city ? `Origin: ${city}` : 'Set Origin Location'}
                                </span>
                            </button>

                            <Link 
                                to="/book" 
                                onClick={() => setMobileOpen(false)}
                                className="w-full text-center bg-white text-black font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full shadow-lg hover:bg-neutral-200 transition-colors"
                            >
                                Book Now
                            </Link>

                            <div className="text-center mt-2">
                                <span className="text-[9px] uppercase font-mono tracking-[0.25em] text-neutral-500">
                                    VOYAGER // DESIGNESTHETICS ARCHIVE
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Global Expedition Origin Modal */}
            <LocationModal
                isOpen={locationModalOpen}
                onClose={() => setLocationModalOpen(false)}
            />
        </>
    );
}

export default Navbar;

