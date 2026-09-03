import { useState, useEffect, useRef } from 'react';
import { 
    MapPin, Navigation, Search, X, Check, Loader2, 
    Compass, Globe, AlertTriangle 
} from 'lucide-react';
import { useLocation, GATEWAY_CITIES } from '@/context/LocationContext.js';
import { useToast } from '@/context/ToastContext.js';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/utils/motion';

/**
 * Luxury Location Modal for selecting origin city or allowing GPS
 */
export function LocationModal({ isOpen, onClose }) {
    const { 
        userCity, 
        status, 
        isDefault, 
        setUserLocation, 
        requestGeoLocation 
    } = useLocation();

    const toast = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const searchTimeoutRef = useRef(null);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);
    if (prevSearchQuery !== searchQuery) {
        setPrevSearchQuery(searchQuery);
        if (!searchQuery.trim() || searchQuery.length < 2) {
            setSearchResults([]);
            setIsSearching(false);
            setSearchError('');
        }
    }

    // Debounced search using Open-Meteo Geocoding
    useEffect(() => {
        if (!searchQuery.trim() || searchQuery.length < 2) {
            return;
        }

        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        searchTimeoutRef.current = setTimeout(async () => {
            setIsSearching(true);
            setSearchError('');
            try {
                const res = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=en&format=json`
                );
                if (res.ok) {
                    const data = await res.json();
                    setSearchResults(data.results || []);
                } else {
                    setSearchError('Could not find locations.');
                }
            } catch {
                setSearchError('Network error searching locations.');
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        };
    }, [searchQuery]);

    const handleSelectResult = (result) => {
        const cityName = `${result.name}, ${result.country || ''}`;
        setUserLocation({
            city: cityName,
            coords: { lat: result.latitude ?? result.lat, lon: result.longitude ?? result.lon }
        });
        toast.location('Departure Point Updated', `${cityName} configured as expedition origin.`);
        setSearchQuery('');
        setSearchResults([]);
        onClose();
    };

    const handleSelectGateway = (city) => {
        const cityName = `${city.name}, ${city.country}`;
        setUserLocation({
            city: cityName,
            coords: { lat: city.lat, lon: city.lon }
        });
        toast.location('Departure Point Updated', `${cityName} configured as expedition origin.`);
        onClose();
    };

    const handleGPSClick = () => {
        requestGeoLocation();
        toast.location('Detecting GPS Sensor…', 'Requesting satellite coordinates from browser.');
    };

    // When GPS is granted while modal is open, auto close after brief confirmation
    useEffect(() => {
        if (status === 'granted' && isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 900);
            return () => clearTimeout(timer);
        }
    }, [status, isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                {/* Dark luxury backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.25 }}
                    className="relative w-full max-w-xl bg-[#0b0c16] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden text-white my-auto"
                >
                    {/* Ambient glow accent */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#FF6B6B]/15 via-[#7c3aed]/10 to-transparent blur-3xl pointer-events-none" />

                    {/* Header */}
                    <div className="flex items-start justify-between pb-6 mb-6 border-b border-white/10 relative">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF6B6B] mb-1">
                                <Compass size={14} /> Expedition Telemetry
                            </div>
                            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                Set Your Origin City
                            </h3>
                            <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-medium max-w-md">
                                Calculate Great-Circle flight distances and journey durations to every expedition destination.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Current Origin Status Pill */}
                    <div className="flex items-center justify-between p-3.5 mb-6 rounded-2xl bg-white/[0.04] border border-white/10">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-[#FF6B6B]/20 text-[#FF6B6B] flex items-center justify-center flex-shrink-0">
                                <MapPin size={16} />
                            </div>
                            <div className="min-w-0">
                                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                                    Current Origin
                                </span>
                                <span className="text-sm font-bold text-white truncate block">
                                    {userCity} {isDefault ? '(Default)' : ''}
                                </span>
                            </div>
                        </div>

                        {status === 'granted' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                GPS Active
                            </span>
                        )}
                    </div>

                    {/* GPS Request Button */}
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={handleGPSClick}
                            disabled={status === 'requesting'}
                            className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600/30 to-purple-600/30 hover:from-blue-600/40 hover:to-purple-600/40 border border-blue-400/30 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all shadow-lg hover:shadow-blue-500/20 disabled:opacity-50"
                        >
                            {status === 'requesting' ? (
                                <>
                                    <Loader2 size={16} className="animate-spin text-blue-400" />
                                    <span>Acquiring Geolocation Sensors…</span>
                                </>
                            ) : status === 'granted' ? (
                                <>
                                    <Check size={16} className="text-emerald-400" />
                                    <span>GPS Location Calibrated</span>
                                </>
                            ) : (
                                <>
                                    <Navigation size={15} className="text-blue-400" />
                                    <span>Calibrate via GPS / Browser Location</span>
                                </>
                            )}
                        </button>

                        {/* Graceful GPS Denial Notice */}
                        {status === 'denied' && (
                            <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start gap-2.5 text-xs">
                                <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold">Browser GPS unavailable: </span>
                                    Permission was denied or not supported. Choose your nearest world hub from the gateway list below for instant distance telemetry.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* City Search Bar */}
                    <div className="mb-6 relative">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 block">
                            Or Search Any Global City
                        </label>
                        <div className="relative">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="e.g., Tokyo, Oslo, San Francisco, Rome…"
                                className="w-full h-12 pl-11 pr-10 rounded-2xl bg-black/50 border border-white/15 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FF6B6B] transition-colors"
                            />
                            {isSearching && (
                                <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[#FF6B6B]" />
                            )}
                            {searchQuery && !isSearching && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Search Results Dropdown */}
                        {searchResults.length > 0 && (
                            <div className="mt-2 rounded-2xl bg-[#121422] border border-white/15 shadow-xl max-h-52 overflow-y-auto divide-y divide-white/5">
                                {searchResults.map((item, idx) => (
                                    <button
                                        key={item.id || idx}
                                        type="button"
                                        onClick={() => handleSelectResult(item)}
                                        className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between transition-colors group"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Globe size={14} className="text-[#FF6B6B]" />
                                            <div>
                                                <span className="font-bold text-white text-sm block">
                                                    {item.name}
                                                </span>
                                                <span className="text-xs text-neutral-400 font-medium">
                                                    {item.admin1 ? `${item.admin1}, ` : ''}{item.country || ''}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Select
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {searchError && (
                            <p className="text-xs text-neutral-400 mt-2 font-medium">
                                {searchError}
                            </p>
                        )}
                    </div>

                    {/* Curated Global Gateway Cities */}
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3 block">
                            Curated World Hubs (1-Click Selection)
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                            {GATEWAY_CITIES.map((c) => {
                                const isSelected = userCity.toLowerCase().includes(c.name.toLowerCase());
                                return (
                                    <button
                                        key={c.code}
                                        type="button"
                                        onClick={() => handleSelectGateway(c)}
                                        className={cn(
                                            'p-2.5 rounded-xl border text-left flex items-center justify-between transition-all',
                                            isSelected
                                                ? 'bg-[#FF6B6B]/15 border-[#FF6B6B]/60 text-white'
                                                : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 text-neutral-300 hover:text-white'
                                        )}
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="text-base flex-shrink-0">{c.flag}</span>
                                            <div className="min-w-0">
                                                <span className="text-xs font-bold truncate block">
                                                    {c.name}
                                                </span>
                                                <span className="text-[10px] font-mono text-neutral-400 block">
                                                    {c.code}
                                                </span>
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <Check size={14} className="text-[#FF6B6B] flex-shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

/**
 * Sleek, luxury status pill showing current location awareness
 */
export function LocationPill({ className }) {
    const { userCity, status } = useLocation();

    const [modalOpen, setModalOpen] = useState(false);

    // Clean display format (e.g. "London, UK")
    const shortCity = userCity.split(',')[0] || userCity;

    return (
        <>
            <button
                type="button"
                onClick={() => setModalOpen(true)}
                className={cn(
                    'group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-white/10 backdrop-blur-md border border-white/15 hover:border-white/30 transition-all text-xs font-medium text-white shadow-sm',
                    className
                )}
                title={`Current expedition origin: ${userCity}. Click to change or calibrate GPS.`}
            >
                <MapPin size={13} className="text-[#FF6B6B] group-hover:scale-110 transition-transform" />
                <span className="text-neutral-400 text-[11px] font-bold uppercase tracking-wider hidden sm:inline">
                    From:
                </span>
                <span className="font-bold text-white tracking-wide text-xs">
                    {shortCity}
                </span>
                {status === 'granted' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="GPS Active" />
                )}
                <span className="text-[10px] text-neutral-500 group-hover:text-neutral-300 transition-colors uppercase font-mono ml-0.5">
                    Change
                </span>
            </button>

            <LocationModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </>
    );
}

/**
 * Prominent luxury status bar showing location telemetry
 */
export function LocationBar({ className }) {
    const { userCity, status, isDefault, requestGeoLocation } = useLocation();
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <div className={cn('w-full bg-[#080914] border-b border-white/10 px-6 py-2 text-xs relative z-30', className)}>
                <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-neutral-300">
                        <MapPin size={14} className="text-[#FF6B6B]" />
                        <span className="font-semibold text-white">
                            📍 Exploring from {userCity}
                        </span>
                        {isDefault && (
                            <span className="text-neutral-500 hidden sm:inline">
                                • Default world hub
                            </span>
                        )}
                        {status === 'granted' && (
                            <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px] font-bold uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> GPS Calibrated
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setModalOpen(true)}
                            className="text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider text-[11px] underline underline-offset-4 decoration-blue-500/40 transition-colors"
                        >
                            Change Origin City
                        </button>
                        {status !== 'granted' && (
                            <button
                                type="button"
                                onClick={requestGeoLocation}
                                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-neutral-300 transition-colors"
                            >
                                <Navigation size={10} /> Allow GPS
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <LocationModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </>
    );
}
