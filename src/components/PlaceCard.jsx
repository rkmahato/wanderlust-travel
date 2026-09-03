import { useState, useEffect, useCallback, useRef } from 'react';
import { usePlaceImage } from '@/hooks/useImages';
import { 
    MapPin, Bookmark, X, Clock, Camera, Sparkles, 
    Share2, Check, ArrowRight 
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getAssetUrl } from '@/utils/assets';

/**
 * Derives rich backcountry & photography intelligence for each notable landmark
 */
function getLandmarkMeta(place, destinationName = '') {
    const text = `${place.name} ${place.description} ${destinationName}`.toLowerCase();
    
    // Recommended Visiting Window
    let bestTime = 'Morning / Golden Hour (07:30 – 10:00)';
    if (text.includes('sunset') || text.includes('dusk') || text.includes('twilight') || text.includes('caldera') || text.includes('oia')) {
        bestTime = 'Late Afternoon · Golden Hour & Sunset (17:30 – 19:45)';
    } else if (text.includes('night') || text.includes('star') || text.includes('aurora') || text.includes('geisha') || text.includes('gion')) {
        bestTime = 'Blue Hour & Twilight (18:30 – 21:30)';
    } else if (text.includes('sunrise') || text.includes('dawn') || text.includes('torii') || text.includes('fushimi') || text.includes('peak') || text.includes('summit')) {
        bestTime = 'First Light / Dawn (06:00 – 08:00)';
    } else if (text.includes('midday') || text.includes('bazaar') || text.includes('market') || text.includes('palace') || text.includes('kinkaku')) {
        bestTime = 'Mid-Morning (09:00 – 11:30)';
    }

    // Insider Photography & Route Advice
    let photoTip = 'Use a 24-70mm lens with circular polarizer to preserve natural rock contrast against vivid atmospheric horizons.';
    if (text.includes('torii') || text.includes('fushimi') || text.includes('shrine')) {
        photoTip = 'Hike past the lower shrine gates to the upper mountain loop before 07:30 AM to capture mist rolling through the vermilion corridors without crowds.';
    } else if (text.includes('bamboo') || text.includes('arashiyama') || text.includes('grove')) {
        photoTip = 'Tilt upward at a 45° angle with a wide-angle prime; bracket exposures to balance shadow detail in the stalks against the bright canopy.';
    } else if (text.includes('kinkaku') || text.includes('golden') || text.includes('temple')) {
        photoTip = 'Position yourself at the Kyoko-chi mirror pond shoreline on a calm morning; still waters double the golden pavilion reflection.';
    } else if (text.includes('caldera') || text.includes('santorini') || text.includes('oia') || text.includes('cliff')) {
        photoTip = 'Scout the Byzantine Castle ridge 45 minutes before sunset; use an ND filter to smooth passing catamarans in the azure caldera below.';
    } else if (text.includes('geisha') || text.includes('gion') || text.includes('street') || text.includes('alley')) {
        photoTip = 'Use a fast 50mm f/1.8 prime lens at dusk to capture natural warm lantern glows reflecting off polished cobblestones.';
    } else if (text.includes('mountain') || text.includes('alps') || text.includes('matterhorn') || text.includes('patagonia') || text.includes('trail')) {
        photoTip = 'Monitor dawn alpine glow (Alpenglow) which illuminates summits in intense pink-amber light for roughly 12 minutes before sunrise.';
    } else if (text.includes('water') || text.includes('lake') || text.includes('fjord') || text.includes('falls')) {
        photoTip = 'Use a 1/2-second long exposure with a neutral density filter to render glacier runoff as silky ribbons against jagged cliffs.';
    }

    return { bestTime, photoTip };
}

export function PlaceCard({ place, destinationName, onOpenLightbox }) {
    const { image, status } = usePlaceImage(place.imageQuery, place.imageUrl);
    const hasImage = Boolean(image?.url || place.imageUrl);
    const toast = useToast();
    const [modalOpen, setModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const closeBtnRef = useRef(null);

    const meta = getLandmarkMeta(place, destinationName);

    // Initial bookmark state hydrated synchronously without cascading effect
    const [isBookmarked, setIsBookmarked] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('voyager_bookmarks') || '[]');
            return saved.some((b) => b.id === place.id);
        } catch {
            return false;
        }
    });

    const toggleBookmark = useCallback((e) => {
        if (e) e.stopPropagation();
        try {
            const saved = JSON.parse(localStorage.getItem('voyager_bookmarks') || '[]');
            if (isBookmarked) {
                const next = saved.filter((b) => b.id !== place.id);
                localStorage.setItem('voyager_bookmarks', JSON.stringify(next));
                setIsBookmarked(false);
                toast.info('Landmark Removed', `${place.name} was removed from your saved itinerary.`);
            } else {
                const next = [
                    ...saved, 
                    { 
                        id: place.id, 
                        name: place.name, 
                        destination: destinationName, 
                        imageUrl: image?.url || place.imageUrl,
                        description: place.description,
                        savedAt: new Date().toISOString()
                    }
                ];
                localStorage.setItem('voyager_bookmarks', JSON.stringify(next));
                setIsBookmarked(true);
                toast.bookmark('Added to Itinerary', `${place.name} has been saved to your expedition landmarks.`);
            }
        } catch {
            // LocalStorage quota or privacy mode fallback
        }
    }, [isBookmarked, place, destinationName, image, toast]);

    // Keyboard handlers for modal dialog accessibility
    useEffect(() => {
        if (!modalOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setModalOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        // Auto-focus close button when modal opens
        if (closeBtnRef.current) {
            closeBtnRef.current.focus();
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [modalOpen]);

    const handleCopyDetails = async (e) => {
        e.stopPropagation();
        try {
            const textToCopy = `${place.name} (${destinationName || 'Expedition'})\n${place.description}\nRecommended Time: ${meta.bestTime}\nPhoto Tip: ${meta.photoTip}`;
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            toast.copy('Details Copied', `Coordinates & guide for ${place.name} copied to clipboard.`);
            setTimeout(() => setCopied(false), 2400);
        } catch {
            toast.info('Share Landmark', place.name);
        }
    };

    const resolvedImageUrl = hasImage 
        ? (image?.url || place.imageUrl) 
        : getAssetUrl(`/destinations/${place.id}.jpg`);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    return (
        <>
            {/* ── INTERACTIVE LANDMARK CARD ────────────────────────────── */}
            <article 
                className="group h-full flex flex-col w-full bg-[#120e29]/80 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-[#FF6B6B]/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-purple-950/40 cursor-pointer focus-within:ring-2 focus-within:ring-[#FF6B6B]"
                onClick={openModal}
                tabIndex={0}
                role="button"
                aria-haspopup="dialog"
                aria-label={`View landmark details for ${place.name}`}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openModal();
                    }
                }}
            >
                {/* Image Header with Landscape Aspect Ratio */}
                <div className="aspect-[16/10] overflow-hidden bg-neutral-900 relative">
                    {status === 'loading' ? (
                        <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
                    ) : (
                        <>
                            <img
                                src={resolvedImageUrl}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="100%" height="100%" fill="%23111" /></svg>';
                                }}
                                alt={place.name}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#120e29] via-transparent to-transparent opacity-60 pointer-events-none" />
                        </>
                    )}

                    {/* Bookmark Toggle Action Button */}
                    <button
                        type="button"
                        onClick={toggleBookmark}
                        aria-label={isBookmarked ? `Remove ${place.name} from itinerary` : `Save ${place.name} to itinerary`}
                        className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all border focus:outline-none focus:ring-2 focus:ring-white ${
                            isBookmarked
                                ? 'bg-[#FF6B6B] border-[#FF6B6B] text-white shadow-lg shadow-[#FF6B6B]/40'
                                : 'bg-black/50 border-white/20 text-white/80 hover:text-white hover:bg-black/70 hover:scale-105'
                        }`}
                    >
                        <Bookmark size={15} className={isBookmarked ? 'fill-white' : ''} />
                    </button>

                    {/* Best Visiting Time Chip */}
                    <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md border border-white/15 text-[10px] font-medium text-neutral-200">
                        <Clock size={11} className="text-[#FF6B6B]" />
                        <span className="truncate max-w-[180px]">{meta.bestTime.split('(')[0]}</span>
                    </div>
                </div>

                {/* Place Details */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-[#FF6B6B] text-[11px] font-bold uppercase tracking-widest mb-2.5">
                            <div className="flex items-center gap-1.5">
                                <MapPin size={12} />
                                <span>{destinationName ? `${destinationName} · Notable Sight` : 'Iconic Landmark'}</span>
                            </div>
                        </div>
                        <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white group-hover:text-[#FF6B6B] transition-colors duration-300 mb-3">
                            {place.name}
                        </h3>
                        <p className="text-neutral-300 text-sm leading-relaxed font-medium line-clamp-3">
                            {place.description}
                        </p>
                    </div>

                    {/* Interactive "Explore Landmark" action trigger */}
                    <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400 group-hover:text-white transition-colors">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400 group-hover:text-[#FF6B6B]">
                            {isBookmarked ? '★ Saved to Itinerary' : 'View Field Guide & Tips'}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-white/5 border border-white/15 flex items-center justify-center group-hover:bg-[#FF6B6B] group-hover:border-[#FF6B6B] group-hover:text-white transition-all">
                            <ArrowRight size={13} className="transform group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>
                </div>
            </article>

            {/* ── LANDMARK INTERACTIVE LIGHTBOX & DETAILS MODAL ────────── */}
            <AnimatePresence>
                {modalOpen && (
                    <div 
                        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-6 overflow-y-auto"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={`landmark-title-${place.id}`}
                        aria-describedby={`landmark-desc-${place.id}`}
                    >
                        {/* Backdrop with smooth blur */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="fixed inset-0 bg-black/85 backdrop-blur-xl"
                            aria-hidden="true"
                        />

                        {/* Modal Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94, y: 20 }}
                            transition={{ type: 'spring', damping: 26, stiffness: 340 }}
                            className="relative w-full max-w-2xl bg-[#0e0a22] border border-white/20 rounded-3xl overflow-hidden shadow-2xl z-10 my-auto text-white"
                        >
                            {/* High-Resolution Photo Hero Header */}
                            <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
                                <img
                                    src={resolvedImageUrl}
                                    alt={place.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = getAssetUrl('/destinations/kyoto.jpg');
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a22] via-[#0e0a22]/30 to-black/50" />

                                {/* Close Button */}
                                <button
                                    ref={closeBtnRef}
                                    type="button"
                                    onClick={closeModal}
                                    aria-label="Close landmark modal"
                                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center backdrop-blur-md hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                                >
                                    <X size={18} />
                                </button>

                                {/* Landmark Tag */}
                                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[#FF6B6B] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                                        <MapPin size={11} />
                                        <span>{destinationName || 'Notable Landmark'}</span>
                                    </span>
                                </div>

                                {/* Title on Image */}
                                <div className="absolute bottom-4 left-6 right-6 z-20">
                                    <h2 
                                        id={`landmark-title-${place.id}`}
                                        className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white drop-shadow-md leading-tight"
                                    >
                                        {place.name}
                                    </h2>
                                </div>
                            </div>

                            {/* Modal Content Details */}
                            <div className="p-6 md:p-8 space-y-6">
                                
                                {/* Full Description */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF6B6B] mb-2 flex items-center gap-1.5">
                                        <Sparkles size={12} />
                                        <span>About This Sight</span>
                                    </h4>
                                    <p 
                                        id={`landmark-desc-${place.id}`}
                                        className="text-neutral-200 text-sm md:text-base leading-relaxed font-normal"
                                    >
                                        {place.description}
                                    </p>
                                </div>

                                {/* Recommended Visiting Window */}
                                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-start gap-3.5">
                                    <div className="w-9 h-9 rounded-xl bg-[#FF6B6B]/15 border border-[#FF6B6B]/30 flex items-center justify-center text-[#FF6B6B] flex-shrink-0 mt-0.5">
                                        <Clock size={16} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-0.5 font-mono">
                                            Optimal Visiting Window
                                        </span>
                                        <p className="text-white font-semibold text-sm">
                                            {meta.bestTime}
                                        </p>
                                    </div>
                                </div>

                                {/* Insider Photography & Explorer Advice */}
                                <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/25 flex items-start gap-3.5">
                                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 flex-shrink-0 mt-0.5">
                                        <Camera size={16} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300 block mb-0.5 font-mono">
                                            Insider Photography Advice
                                        </span>
                                        <p className="text-neutral-200 text-xs md:text-sm leading-relaxed font-medium">
                                            {meta.photoTip}
                                        </p>
                                    </div>
                                </div>

                                {/* Interactive Action Buttons */}
                                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        {/* Save Landmark / Add to Itinerary Toggle */}
                                        <button
                                            type="button"
                                            onClick={toggleBookmark}
                                            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold transition-all shadow-md ${
                                                isBookmarked
                                                    ? 'bg-[#FF6B6B] text-white border border-[#FF6B6B] shadow-[#FF6B6B]/30'
                                                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                                            }`}
                                        >
                                            <Bookmark size={14} className={isBookmarked ? 'fill-white' : ''} />
                                            <span>{isBookmarked ? 'Saved to Itinerary' : 'Add to Itinerary'}</span>
                                        </button>

                                        {/* Copy / Share Button */}
                                        <button
                                            type="button"
                                            onClick={handleCopyDetails}
                                            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs uppercase tracking-widest font-bold text-neutral-300 hover:text-white transition-colors"
                                            title="Copy landmark details to clipboard"
                                        >
                                            {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                                            <span>{copied ? 'Copied' : 'Share'}</span>
                                        </button>
                                    </div>

                                    {/* Gallery Link if available */}
                                    {onOpenLightbox && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                closeModal();
                                                onOpenLightbox(place);
                                            }}
                                            className="text-xs text-blue-300 hover:text-white transition-colors font-semibold uppercase tracking-wider underline underline-offset-4"
                                        >
                                            View Fullscreen Photo →
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

export default PlaceCard;
