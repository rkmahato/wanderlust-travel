import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { VectorMountainLine } from '@/components/common/VectorMountainLine';


export function Footer() {
    return (
        <footer className="bg-[#04060a] border-t border-white/10 text-neutral-400 text-xs mt-auto relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 left-1/4 w-96 h-40 bg-blue-900/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-40 bg-[#FF6B6B]/5 blur-[100px] pointer-events-none" />

            <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-16 pb-12 relative z-10">
                {/* Main 4-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-white/10">
                    
                    {/* Brand Column (Col 1-5) */}
                    <div className="lg:col-span-5 flex flex-col items-start gap-4">
                        <Link to="/" className="group flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/15 flex items-center justify-center group-hover:border-[#FF6B6B]/60 transition-colors">
                                <svg viewBox="0 0 36 36" fill="none" className="w-5 h-5 text-white transition-transform duration-500 group-hover:rotate-45">
                                    <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.25" strokeDasharray="3 3" />
                                    <polygon points="18,4 21,15 32,18 21,21 18,32 15,21 4,18 15,15" fill="none" stroke="currentColor" strokeWidth="1.4" />
                                    <polygon points="18,4 21,15 18,18 15,15" fill="#FF6B6B" opacity="0.9" />
                                    <polygon points="18,32 21,21 18,18 15,21" fill="currentColor" opacity="0.3" />
                                    <circle cx="18" cy="18" r="2" fill="#FFFFFF" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-display text-xl tracking-[0.2em] text-white leading-none">
                                        VOYAGER
                                    </span>
                                    <span className="text-[#FF6B6B] font-mono text-xs opacity-75">//</span>
                                </div>
                                <span className="text-[8.5px] uppercase tracking-[0.28em] text-neutral-400 font-mono font-medium mt-1 leading-none">
                                    DESIGNESTHETICS ARCHIVE
                                </span>
                            </div>
                        </Link>

                        <p className="text-neutral-400 text-sm leading-relaxed max-w-sm font-medium mt-1">
                            Curating the planet's most formidable alpine summits, volcanic frontiers, and architectural sanctums. Built for explorers who value uncompromising design and raw topography.
                        </p>

                        <div className="flex items-center gap-3 mt-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono text-neutral-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>GLOBAL FIELD RELAY: <strong className="text-white">ONLINE</strong></span>
                        </div>
                    </div>

                    {/* Column 2: Marquee Expeditions (Col 6-7) */}
                    <div className="lg:col-span-2 flex flex-col gap-3">
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FF6B6B] font-semibold">
                            Expeditions
                        </span>
                        <ul className="space-y-2.5 text-[13px]">
                            <li>
                                <Link to="/destination/patagonia" className="hover:text-white transition-colors flex items-center gap-1 group">
                                    <span>Patagonia Traverse</span>
                                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#FF6B6B]" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/destination/swiss-alps" className="hover:text-white transition-colors flex items-center gap-1 group">
                                    <span>Swiss Alps Peaks</span>
                                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#FF6B6B]" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/destination/kyoto" className="hover:text-white transition-colors flex items-center gap-1 group">
                                    <span>Kyoto Shrines</span>
                                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#FF6B6B]" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/destination/santorini" className="hover:text-white transition-colors flex items-center gap-1 group">
                                    <span>Santorini Caldera</span>
                                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#FF6B6B]" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/explore" className="text-white font-semibold hover:text-[#FF6B6B] transition-colors flex items-center gap-1 pt-1">
                                    <span>All 20 Destinations →</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Platform & AI (Col 8-9) */}
                    <div className="lg:col-span-3 flex flex-col gap-3">
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blue-400 font-semibold">
                            Platform
                        </span>
                        <ul className="space-y-2.5 text-[13px]">
                            <li>
                                <Link to="/plan" className="hover:text-white transition-colors flex items-center gap-1 group">
                                    <span>Gemini AI Trip Planner</span>
                                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/book" className="hover:text-white transition-colors flex items-center gap-1 group">
                                    <span>Backcountry Reservations</span>
                                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/explore" className="hover:text-white transition-colors">
                                    <span>Live Weather Telemetry</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-white transition-colors">
                                    <span>Expedition Dispatch & Support</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Telemetry & Technology (Col 10-12) */}
                    <div className="lg:col-span-2 flex flex-col gap-3">
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 font-semibold">
                            Telemetry Engine
                        </span>
                        <div className="space-y-2 text-[12px] font-mono text-neutral-400">
                            <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                                <span>Weather API:</span>
                                <span className="text-white font-semibold">Open-Meteo</span>
                            </div>
                            <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                                <span>Imagery:</span>
                                <span className="text-white font-semibold">Unsplash Curated</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Neural Engine:</span>
                                <span className="text-white font-semibold">Google Gemini</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar: Copyright, Coordinates, Github */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-500">
                    <div className="flex items-center gap-3">
                        <VectorMountainLine className="w-10 h-3 text-[#FF6B6B]/70" />
                        <p className="tracking-widest uppercase">
                            © {new Date().getFullYear()} VOYAGER // DESIGNESTHETICS ARCHIVE. ALL RIGHTS RESERVED.
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <span className="hidden sm:inline text-neutral-500">
                            COORD: 45°58'N, 7°44'E // LAT-LON GRID
                        </span>
                        <a 
                            href="https://github.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            aria-label="GitHub Repository" 
                            className="text-neutral-500 hover:text-white transition-colors p-1"
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                            </svg>
                        </a>

                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
