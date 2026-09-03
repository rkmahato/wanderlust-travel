import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Asterisk, MapPin, Camera } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { WeatherWidget } from '@/components/WeatherWidget';
import { ChatWidget } from '@/components/ChatWidget';
import { ItineraryPanel } from '@/components/ItineraryPanel';
import { PlaceCard } from '@/components/PlaceCard';
import { DestinationDock } from '@/components/DestinationDock';
import { DestinationTelemetry } from '@/components/DestinationTelemetry';
import { PackingGuide } from '@/components/PackingGuide';
import { PhotoLightbox } from '@/components/PhotoLightbox';
import { useDestinationImage } from '@/hooks/useImages';
import { LocationModal } from '@/components/layout/LocationBar';
import { getDestinationById } from '@/hooks/useDestinations';
import { motion, useScroll, useTransform } from 'framer-motion';

export function DestinationPage() {
    const { id } = useParams();
    const destination = id ? getDestinationById(id) : undefined;
    
    // Modal state for changing origin location
    const [locationModalOpen, setLocationModalOpen] = useState(false);

    // Lightbox modal state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Destination Weather Source (ALWAYS destination coordinates)
    const destinationWeatherSource = useMemo(() => {
        if (!destination) return null;
        return { 
            type: 'coords', 
            lat: destination.coordinates.lat, 
            lon: destination.coordinates.lon,
            cityName: destination.name,
            country: destination.country
        };
    }, [destination]);
    
    const { image: heroImage } = useDestinationImage(destination?.heroQuery ?? '', destination?.heroImageUrl ?? destination?.imageUrl);

    // Compiled gallery photos for full-screen lightbox
    const galleryPhotos = useMemo(() => {
        if (!destination) return [];
        const photos = [];
        const heroUrl = heroImage?.url || destination.imageUrl || `/destinations/${destination.id}.jpg`;
        photos.push({
            id: 'hero-photo',
            name: `${destination.name} Panoramas`,
            description: destination.tagline || destination.description,
            imageUrl: heroUrl
        });

        if (destination.famousPlaces) {
            destination.famousPlaces.forEach((p) => {
                photos.push({
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    imageUrl: p.imageUrl || `/destinations/${p.id}.jpg`
                });
            });
        }
        return photos;
    }, [destination, heroImage]);

    /* ── Hero parallax ───────────────────────────────────────── */
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!destination) return <Navigate to="/404" replace />;

    function handleOpenLightbox(targetPlace) {
        if (!targetPlace) {
            setLightboxIndex(0);
        } else {
            const idx = galleryPhotos.findIndex((p) => p.id === targetPlace.id);
            setLightboxIndex(idx >= 0 ? idx : 0);
        }
        setLightboxOpen(true);
    }

    return (
        <PageWrapper className="bg-genz-1 text-white min-h-screen relative overflow-hidden pb-20">
            {/* Ambient Gen-Z glow orbs */}
            <div className="genz-glow genz-glow-purple w-[600px] h-[600px] -top-20 -right-40" />
            <div className="genz-glow genz-glow-coral w-[400px] h-[400px] top-1/3 -left-40" />
            <div className="genz-glow genz-glow-teal w-[500px] h-[500px] top-2/3 right-10" />

            {/* ── HERO BANNER ────────────────────────────────────────── */}
            <section
                id="overview"
                ref={heroRef}
                className="relative w-full h-[75vh] min-h-[620px] border-b border-white/10 overflow-hidden"
            >
                <motion.div 
                    className="absolute inset-0 will-change-transform"
                    style={{ y: heroY, scale: heroScale }}
                >
                    <img
                        src={heroImage?.url || destination.imageUrl || `/destinations/${destination.id}.jpg`}
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `/destinations/${destination.id}.jpg`;
                        }}
                        alt={destination.name}
                        className="w-full h-full object-cover"
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-[#1a0a2e]/60 to-black/40 z-[1]" />
                <div className="absolute inset-0 z-[2] img-vignette pointer-events-none" />

                {/* Top Action Controls */}
                <div className="absolute top-28 left-6 md:left-12 right-6 md:right-12 z-20 flex items-center justify-between">
                    <Link
                        to="/explore"
                        className="flex items-center gap-2.5 text-white/80 hover:text-white transition-colors uppercase tracking-widest text-[11px] font-bold bg-black/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/15 hover:border-white/30 active:scale-95 shadow-xl"
                    >
                        <ArrowLeft size={14} /> Back to Directory
                    </Link>

                    <button
                        type="button"
                        onClick={() => handleOpenLightbox(null)}
                        className="flex items-center gap-2 text-white/90 hover:text-white transition-all uppercase tracking-widest text-[11px] font-bold bg-black/50 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/15 hover:border-[#FF6B6B]/60 hover:bg-[#FF6B6B]/20 active:scale-95 shadow-xl"
                    >
                        <Camera size={14} className="text-[#FF6B6B]" />
                        <span>View Gallery ({galleryPhotos.length})</span>
                    </button>
                </div>

                {/* Hero Title & Information */}
                <div className="absolute bottom-0 left-0 w-full z-20 px-6 md:px-12 pb-14">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="flex items-center gap-4 text-[#FF6B6B] mb-4 font-bold tracking-widest uppercase text-sm">
                            <span className="w-8 h-[2px] bg-gradient-to-r from-[#FF6B6B] to-[#7c3aed]"></span>
                            <MapPin size={16} /> {destination.continent} · {destination.country}
                        </div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.8 }}
                            className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white leading-none mb-4"
                        >
                            {destination.name}
                        </motion.h1>
                        <p className="text-neutral-300 text-lg md:text-2xl font-medium max-w-3xl leading-relaxed">
                            {destination.tagline}
                        </p>
                    </div>
                </div>
            </section>

            {/* ── STICKY FLOATING TELEMETRY DOCK / SECTION ANCHORS ────── */}
            <DestinationDock />

            {/* ── SECTION 1: EXPERIENCE OVERVIEW ────────────────────── */}
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-8 pb-12 relative z-10">
                <div className="bg-[#120e29]/70 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#FF6B6B]">
                            <Asterisk size={14} /> 
                            <span className="uppercase tracking-widest text-xs font-bold">The Experience & Cultural Depth</span>
                        </div>
                        <span className="text-xs font-mono text-neutral-400">
                            Geodetic Ref: {destination.coordinates.lat.toFixed(4)}°N, {destination.coordinates.lon.toFixed(4)}°E
                        </span>
                    </div>

                    <p className="text-lg md:text-2xl text-neutral-200 leading-[1.7] font-medium max-w-5xl">
                        {destination.description}
                    </p>

                    <div className="flex flex-wrap gap-2.5 pt-8">
                        {destination.tags.map((tag) => (
                            <span 
                                key={tag} 
                                className="px-5 py-2 rounded-full border border-white/15 text-[11px] uppercase tracking-widest font-bold text-white bg-white/5 hover:border-[#FF6B6B]/50 transition-colors"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── SECTION 2: WEATHER & TRAJECTORY TELEMETRY ───────────── */}
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-6 relative z-10 space-y-8">
                {/* Distance, Flight & Chrono Telemetry Card */}
                <DestinationTelemetry destination={destination} />

                {/* Live Weather Widget */}
                <div className="bg-[#120e29]/70 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#FF6B6B]">
                            <Asterisk size={14} /> 
                            <span className="uppercase tracking-widest text-xs font-bold">
                                Live Meteorological Telemetry · {destination.name}
                            </span>
                        </div>
                        <span className="text-xs font-semibold text-neutral-400">
                            Sensor Satellite Feed
                        </span>
                    </div>

                    <WeatherWidget 
                        source={destinationWeatherSource} 
                        destinationCoords={destination.coordinates}
                        destinationName={destination.name}
                        destinationCountry={destination.country}
                    />
                </div>
            </div>

            {/* ── SECTION 3: EXPEDITION GEAR & PACKING ESSENTIALS ──────── */}
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-6 relative z-10">
                <PackingGuide destination={destination} />
            </div>

            {/* ── SECTION 4: ICONIC SIGHTS & LANDMARKS GRID ───────────── */}
            <section 
                id="landmarks" 
                className="w-full py-12 px-6 md:px-12 max-w-[1600px] mx-auto relative z-10"
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 pb-6 border-b border-white/10">
                    <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#FF6B6B] mb-3">
                            <Asterisk size={16} /> <span className="uppercase tracking-widest text-xs font-bold">Landmarks & Points of Interest</span>
                        </div>
                        <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tighter text-white">
                            ICONIC PLACES
                        </h2>
                    </div>
                    <p className="text-neutral-400 text-sm max-w-md font-medium">
                        Curated sights, historic monuments, and must-see places in {destination.name}. Click any landmark photo to preview in high resolution.
                    </p>
                </div>

                {/* Elegant Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {destination.famousPlaces.map((place) => (
                        <PlaceCard 
                            key={place.id} 
                            place={place} 
                            destinationName={destination.name}
                            onOpenLightbox={handleOpenLightbox}
                        />
                    ))}
                </div>
            </section>

            {/* ── SECTION 5: AI SPECIALIST & INTELLIGENT ITINERARY ─────── */}
            <section 
                id="ai-planner" 
                className="w-full py-12 px-6 md:px-12 max-w-[1600px] mx-auto relative z-10 pb-20"
            >
                <div className="flex items-center gap-2 text-sm font-semibold text-[#FF6B6B] mb-4">
                    <Asterisk size={16} /> <span className="uppercase tracking-widest text-xs font-bold">AI Travel Planning & Day-By-Day</span>
                </div>
                <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tighter text-white mb-10">
                    INTELLIGENT ITINERARY
                </h2>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                    <ChatWidget 
                        destinationName={destination.name} 
                        country={destination.country} 
                        className="w-full h-full min-h-[580px]" 
                    />
                    <ItineraryPanel 
                        destinationName={destination.name} 
                        country={destination.country} 
                        className="w-full h-full min-h-[580px]" 
                    />
                </div>
            </section>

            {/* Fullscreen Photo Lightbox Modal */}
            <PhotoLightbox
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                photos={galleryPhotos}
                initialIndex={lightboxIndex}
            />

            {/* Location modal for changing origin */}
            <LocationModal
                isOpen={locationModalOpen}
                onClose={() => setLocationModalOpen(false)}
            />
        </PageWrapper>
    );
}
