import React from 'react';
import { Link } from 'react-router-dom';
import { useDestinationImage } from '@/hooks/useImages';
import { useLocation } from '@/context/LocationContext';
import { cn } from '@/utils/motion';
import { MapPin } from 'lucide-react';
import { SquircleBadge } from '@/components/common/SquircleBadge';

/**
 * Determine a relevant adventure icon based on destination tags or metadata
 */
function getDestinationIcon(tags = [], name = '') {
    const combined = `${tags.join(' ')} ${name}`.toLowerCase();
    if (combined.includes('surf') || combined.includes('ocean') || combined.includes('sea') || combined.includes('water') || combined.includes('island')) {
        return 'surf';
    }
    if (combined.includes('bike') || combined.includes('cycle') || combined.includes('road')) {
        return 'bike';
    }
    if (combined.includes('trail') || combined.includes('run') || combined.includes('forest') || combined.includes('walk')) {
        return 'trail';
    }
    if (combined.includes('wind') || combined.includes('air') || combined.includes('sky') || combined.includes('fly')) {
        return 'wind';
    }
    return 'mountain';
}

export function DestinationCard({ destination, className, aspect = "aspect-[3/4]" }) {
    const { image, status } = useDestinationImage(destination.unsplashQuery, destination.imageUrl);
    const { calculateDistanceTo } = useLocation();
    const distanceInfo = destination.coordinates 
        ? calculateDistanceTo(destination.coordinates.lat, destination.coordinates.lon) 
        : null;
    const adventureIcon = getDestinationIcon(destination.tags, destination.name);


    return (
        <article 
            className={cn(
                'relative group w-full block cursor-pointer overflow-hidden rounded-3xl bg-[#0f0c29] border border-white/15 hover:border-[#0048aa]/60 transition-all duration-500 shadow-2xl hover:shadow-[#0048aa]/30 focus-within:ring-2 focus-within:ring-[#FF6B6B]', 
                aspect, 
                className
            )}
        >
            <Link 
                to={`/destination/${destination.id}`} 
                className="block w-full h-full focus:outline-none"
                aria-label={`Expedition to ${destination.name}, ${destination.country}${distanceInfo ? `, ${distanceInfo.formattedKm || `${distanceInfo.km} km`} away` : ''}`}
            >
                
                {/* Background Image with smooth zoom */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${image?.url || destination.imageUrl || `/destinations/${destination.id}.jpg`})` }}
                >
                    {status === 'loading' && <div className="absolute inset-0 bg-neutral-900 animate-pulse" />}
                </div>
                
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10 pointer-events-none transition-opacity duration-500 group-hover:opacity-85" />

                {/* Content */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end pointer-events-none z-10">
                    <div className="flex items-center gap-2 text-blue-300 font-bold tracking-widest uppercase text-[10px] mb-2 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <MapPin size={12} className="text-[#FF6B6B]" /> {destination.country}
                        {distanceInfo && (
                            <span className="text-white/80 font-mono text-[9px] bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
                                {distanceInfo.formattedKm || `${distanceInfo.km} km`}
                            </span>
                        )}
                    </div>
                    <h3 className="text-white text-3xl md:text-4xl font-display uppercase tracking-wider transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                        {destination.name}
                    </h3>
                </div>

                {/* Top Corner Elements: Clean Tag + Distance Pill (Left) & Squircle Badge (Right) */}
                <div className="absolute top-5 left-5 right-5 z-10 flex items-center justify-between pointer-events-none gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-black/60 backdrop-blur-md border border-white/20 text-white font-bold tracking-widest uppercase text-[9px] px-3.5 py-1.5 rounded-full shadow-md">
                            {destination.continent}
                        </span>
                        {distanceInfo && (
                            <span 
                                className="bg-blue-950/70 backdrop-blur-md border border-blue-400/30 text-blue-200 font-mono font-semibold text-[9px] px-2.5 py-1.5 rounded-full shadow-md inline-flex items-center gap-1"
                                title={`Distance from origin: ${distanceInfo.formattedKm || `${distanceInfo.km} km`}`}
                            >
                                <span className="text-[#FF6B6B]">📍</span>
                                <span>{distanceInfo.formattedKm || `${distanceInfo.km} km`} away</span>
                            </span>
                        )}
                    </div>
                    <div className="transform group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                        <SquircleBadge 
                            icon={adventureIcon} 
                            size="sm" 
                            variant="blue" 
                        />
                    </div>
                </div>
            </Link>
        </article>
    );
}

export default DestinationCard;
