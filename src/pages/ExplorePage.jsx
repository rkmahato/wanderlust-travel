import { useState, useMemo, useCallback } from 'react';
import { 
    Search, MapPin, Filter, ArrowUpDown, X, RotateCcw, 
    Compass 
} from 'lucide-react';


import { PageWrapper } from '@/components/layout/PageWrapper';
import { DestinationCard } from '@/components/DestinationCard';
import { useDestinations } from '@/hooks/useDestinations';
import { useLocation } from '@/context/LocationContext';
import { CONTINENTS, ALL_TAGS } from '@/config';
import { cn } from '@/utils/motion';
import { WavyEdgeDivider } from '@/components/common/WavyEdgeDivider';
import { SquircleBadge } from '@/components/common/SquircleBadge';
import { VectorMountainLine } from '@/components/common/VectorMountainLine';
import { getAssetUrl } from '@/utils/assets';

const CONTINENT_OPTIONS = CONTINENTS.map((c) => ({ value: c, label: c }));

const SORT_OPTIONS = [
    { value: 'featured', label: 'Featured Missions' },
    { value: 'name-asc', label: 'Alphabetical (A–Z)' },
    { value: 'name-desc', label: 'Alphabetical (Z–A)' },
    { value: 'distance-asc', label: 'Nearest to You 📍' },
];

export function ExplorePage() {
    const { results, filters, setSearch, setContinent, toggleTag, resetFilters } = useDestinations();
    const { userCity, userCoords, calculateDistanceTo, requestGeoLocation, status: geoStatus } = useLocation();

    // Multi-criteria sorting state
    const [sortBy, setSortBy] = useState('featured');

    // Calculate distance telemetry for each filtered destination
    const destinationsWithDistance = useMemo(() => {
        return results.map((destination) => {
            const distanceInfo = (destination.coordinates && userCoords)
                ? calculateDistanceTo(destination.coordinates.lat, destination.coordinates.lon)
                : null;
            return {
                ...destination,
                distanceInfo
            };
        });
    }, [results, userCoords, calculateDistanceTo]);

    // Apply sorting logic
    const sortedDestinations = useMemo(() => {
        const list = [...destinationsWithDistance];
        switch (sortBy) {
            case 'name-asc':
                return list.sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc':
                return list.sort((a, b) => b.name.localeCompare(a.name));
            case 'distance-asc':
                return list.sort((a, b) => {
                    const distA = a.distanceInfo?.distanceKm ?? a.distanceInfo?.km ?? Infinity;
                    const distB = b.distanceInfo?.distanceKm ?? b.distanceInfo?.km ?? Infinity;
                    return distA - distB;
                });
            case 'featured':
            default:
                return list;
        }
    }, [destinationsWithDistance, sortBy]);

    // Compute active filter metrics
    const activeFilterCount = 
        (filters.search.trim() ? 1 : 0) +
        (filters.continent !== 'All' ? 1 : 0) +
        filters.tags.length +
        (sortBy !== 'featured' ? 1 : 0);

    const handleResetAll = useCallback(() => {
        resetFilters();
        setSortBy('featured');
    }, [resetFilters]);

    // Handle sort change with geolocation nudge for "Nearest to You"
    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        if (newSort === 'distance-asc' && !userCoords && geoStatus !== 'granted') {
            requestGeoLocation();
        }
    };

    const isEmpty = sortedDestinations.length === 0;

    return (
        <PageWrapper className="bg-[#05070d] text-white min-h-screen">
            {/* Screen Reader Live Region for filter announcements */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
                Showing {sortedDestinations.length} expeditions matching your criteria.
            </div>

            {/* ── CINEMATIC RED BULL-INSPIRED HERO HEADER ──────────── */}
            <section className="relative w-full pt-36 md:pt-44 pb-20 md:pb-28 px-6 md:px-12 overflow-hidden bg-gradient-to-b from-[#081224] via-[#0b172e] to-[#05070d]">
                {/* Ambient backdrop image with dark overlay */}
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 pointer-events-none"
                    style={{ backgroundImage: `url('${getAssetUrl('/destinations/norway-fjords.jpg')}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#05070d]/95 via-[#081224]/85 to-[#05070d]/90 pointer-events-none" />
                <div className="absolute inset-0 img-vignette pointer-events-none" />

                <div className="max-w-[1600px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    {/* Left Column: Title & Metadata */}
                    <div className="lg:col-span-7">
                        <div className="flex flex-wrap items-center gap-3 mb-5">
                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-blue-300 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span>20 Missions Active</span>
                            </span>
                            <VectorMountainLine className="w-16 h-6 text-blue-400/70" />
                            <span className="text-xs font-mono text-neutral-400">ARCHIVE VOL. 2026</span>
                        </div>

                        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter leading-[0.88] uppercase mb-6">
                            Expedition <br />
                            <span className="bg-gradient-to-r from-[#FF6B6B] to-[#ee5a24] bg-clip-text text-transparent">
                                Directory.
                            </span>
                        </h1>

                        <p className="text-neutral-300 text-base md:text-lg font-medium max-w-xl mb-8 leading-relaxed">
                            Vetted alpine climbs, volcanic trails, and remote coastal adventures across 6 continents. Curated for authentic wilderness explorers.
                        </p>

                        {/* Quick Telemetry Metric Chips */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                                20 Global Routes
                            </span>
                            <span className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                                6 Continents
                            </span>
                            <span className="px-4 py-2 rounded-full bg-[#0048aa]/40 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                                100% Backcountry Vetted
                            </span>
                        </div>
                    </div>

                    {/* Right Column: Featured Expedition Card Preview */}
                    <div className="lg:col-span-5 hidden lg:block">
                        <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-[#091122] group aspect-[16/11]">
                            <img 
                                src={getAssetUrl('/destinations/patagonia.jpg')} 
                                alt="Patagonia Frontier" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                                <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest">
                                    Editor's Dispatch
                                </span>
                                <SquircleBadge icon="mountain" size="sm" variant="blue" />
                            </div>

                            <div className="absolute bottom-4 left-5 right-5 z-10 pointer-events-none">
                                <div className="flex items-center gap-2 text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-1">
                                    <MapPin size={12} className="text-[#FF6B6B]" /> Patagonia · Chile
                                </div>
                                <h3 className="font-display text-2xl text-white uppercase tracking-wider leading-tight">
                                    Granite Towers & Glacier Fjords
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Organic Wavy Transition into Directory Content */}
                <WavyEdgeDivider fill="#05070d" position="bottom" className="h-10 md:h-16 lg:h-20" />
            </section>

            {/* ── DIRECTORY CONTENT ────────────────────────────────── */}
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    
                    {/* Filters Sidebar */}
                    <aside className="lg:col-span-3" aria-label="Filters and Search">
                        <div className="sticky top-28 space-y-8 p-6 rounded-3xl bg-[#091120]/80 border border-white/10 backdrop-blur-md shadow-xl">
                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-300">
                                    <Filter size={14} className="text-[#FF6B6B]" />
                                    <span>Filter Missions</span>
                                </div>
                                {activeFilterCount > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-[#FF6B6B]/20 border border-[#FF6B6B]/40 text-[#FF6B6B] text-[10px] font-bold font-mono">
                                        {activeFilterCount} active
                                    </span>
                                )}
                            </div>

                            {/* Search Keywords */}
                            <div>
                                <label htmlFor="search-input" className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-2 font-bold">
                                    Search Keywords
                                </label>
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
                                    <input
                                        id="search-input"
                                        type="text"
                                        placeholder="e.g. volcanic, climb, surf..."
                                        value={filters.search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-9 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors text-sm"
                                        aria-label="Search destinations by keyword or country"
                                    />
                                    {filters.search && (
                                        <button 
                                            type="button"
                                            onClick={() => setSearch('')} 
                                            aria-label="Clear search keyword"
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white transition-colors rounded-full"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {/* Continent / Region Select */}
                            <div>
                                <label htmlFor="continent-select" className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-2 font-bold">
                                    Continent / Region
                                </label>
                                <select
                                    id="continent-select"
                                    value={filters.continent}
                                    onChange={(e) => setContinent(e.target.value)}
                                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors text-sm appearance-none cursor-pointer"
                                    aria-label="Filter expeditions by continent"
                                >
                                    <option value="All" className="bg-[#091120] text-white">All Continents</option>
                                    {CONTINENT_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value} className="bg-[#091120] text-white">{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort Order Selector in Sidebar for Convenience */}
                            <div>
                                <label htmlFor="sidebar-sort-select" className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-2 font-bold">
                                    Sort Expeditions
                                </label>
                                <div className="relative">
                                    <select
                                        id="sidebar-sort-select"
                                        value={sortBy}
                                        onChange={(e) => handleSortChange(e.target.value)}
                                        className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors text-sm appearance-none cursor-pointer"
                                        aria-label="Sort expeditions list"
                                    >
                                        {SORT_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value} className="bg-[#091120] text-white">
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Terrain & Activity Tags */}
                            <div>
                                <p className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-2 font-bold">
                                    Terrain & Activity
                                </p>
                                <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by terrain and activity">
                                    {ALL_TAGS.map((tag) => {
                                        const isActive = filters.tags.includes(tag);
                                        return (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => toggleTag(tag)}
                                                aria-pressed={isActive}
                                                className={cn(
                                                    "px-3.5 py-1.5 text-[10px] uppercase tracking-widest font-bold transition-all duration-300 rounded-full border focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#091120] focus:ring-[#FF6B6B]",
                                                    isActive 
                                                        ? "bg-gradient-to-r from-[#FF6B6B] to-[#ee5a24] border-[#FF6B6B] text-white shadow-md shadow-[#FF6B6B]/30" 
                                                        : "bg-white/5 border-white/15 text-neutral-300 hover:border-white/40 hover:text-white"
                                                )}
                                            >
                                                {tag}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Active Filter Chips & Reset All Button */}
                            {activeFilterCount > 0 && (
                                <div className="pt-5 border-t border-white/10 space-y-3">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-neutral-400 font-medium">
                                            Found <strong className="text-white">{sortedDestinations.length}</strong> matching
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleResetAll}
                                            className="text-[11px] uppercase tracking-wider font-bold text-[#FF6B6B] hover:text-white transition-colors flex items-center gap-1 focus:outline-none focus:underline"
                                        >
                                            <RotateCcw size={12} />
                                            <span>Reset All</span>
                                        </button>
                                    </div>

                                    {/* Interactive Active Filter Pills */}
                                    <div className="flex flex-wrap gap-1.5 pt-1" aria-label="Active filters">
                                        {filters.search && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-white text-[10px] border border-white/15 font-mono">
                                                <span>"{filters.search}"</span>
                                                <button 
                                                    type="button"
                                                    onClick={() => setSearch('')} 
                                                    aria-label={`Remove search filter ${filters.search}`}
                                                    className="hover:text-[#FF6B6B]"
                                                >
                                                    <X size={11} />
                                                </button>
                                            </span>
                                        )}
                                        {filters.continent !== 'All' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-white text-[10px] border border-white/15 font-mono">
                                                <span>{filters.continent}</span>
                                                <button 
                                                    type="button"
                                                    onClick={() => setContinent('All')} 
                                                    aria-label={`Remove continent filter ${filters.continent}`}
                                                    className="hover:text-[#FF6B6B]"
                                                >
                                                    <X size={11} />
                                                </button>
                                            </span>
                                        )}
                                        {filters.tags.map((tag) => (
                                            <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FF6B6B]/20 text-[#FF6B6B] text-[10px] border border-[#FF6B6B]/30 font-mono">
                                                <span>#{tag}</span>
                                                <button 
                                                    type="button"
                                                    onClick={() => toggleTag(tag)} 
                                                    aria-label={`Remove tag filter ${tag}`}
                                                    className="hover:text-white"
                                                >
                                                    <X size={11} />
                                                </button>
                                            </span>
                                        ))}
                                        {sortBy !== 'featured' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-900/40 text-blue-300 text-[10px] border border-blue-500/30 font-mono">
                                                <span>Sort: {SORT_OPTIONS.find(o => o.value === sortBy)?.label.split(' ')[0]}</span>
                                                <button 
                                                    type="button"
                                                    onClick={() => setSortBy('featured')} 
                                                    aria-label="Reset sorting to Featured"
                                                    className="hover:text-white"
                                                >
                                                    <X size={11} />
                                                </button>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Results Main Area */}
                    <main className="lg:col-span-9" aria-label="Expeditions List">
                        
                        {/* Interactive Toolbar Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#091120]/60 border border-white/10 mb-8 backdrop-blur-md">
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-sm font-bold text-white tracking-wide">
                                    Showing <strong className="text-white">{sortedDestinations.length}</strong> of 20 expeditions
                                </span>
                                {activeFilterCount > 0 && (
                                    <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B6B]/20 border border-[#FF6B6B]/40 text-[#FF6B6B] text-[11px] font-bold font-mono">
                                        {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied
                                    </span>
                                )}
                                {userCity && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                                        <MapPin size={10} className="text-[#FF6B6B]" />
                                        <span>From: <strong className="text-neutral-200">{userCity.split(',')[0]}</strong></span>
                                    </span>
                                )}
                            </div>

                            {/* Multi-Criteria Sort Controls */}
                            <div className="flex items-center gap-2">
                                <label htmlFor="grid-sort-select" className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 flex-shrink-0">
                                    <ArrowUpDown size={13} className="text-blue-400" />
                                    <span>Sort:</span>
                                </label>
                                <select
                                    id="grid-sort-select"
                                    value={sortBy}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="bg-black/50 border border-white/15 rounded-xl px-3 py-1.5 text-white text-xs font-medium focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors cursor-pointer"
                                    aria-label="Sort destinations grid"
                                >
                                    {SORT_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value} className="bg-[#091120] text-white">
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Results Grid / Empty State */}
                        {isEmpty ? (
                            <div 
                                className="h-[480px] flex flex-col items-center justify-center p-8 md:p-12 text-center border border-white/10 rounded-3xl bg-[#091120]/60 backdrop-blur-xl shadow-2xl relative overflow-hidden"
                                role="status"
                                aria-label="No matching expeditions found"
                            >
                                <div className="absolute w-72 h-72 bg-[#FF6B6B]/10 rounded-full blur-3xl pointer-events-none" />
                                
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center text-[#FF6B6B] mb-6 shadow-inner relative z-10">
                                    <Compass size={32} />
                                </div>

                                <h3 className="font-display text-3xl md:text-4xl text-white mb-3 font-bold tracking-tight uppercase">
                                    No Matching Expeditions
                                </h3>
                                <p className="text-neutral-400 text-sm md:text-base mb-6 max-w-md font-medium leading-relaxed">
                                    No routes match your current criteria. Try broadening your keywords, choosing another continent, or resetting your filters.
                                </p>

                                {/* Quick suggestion tags */}
                                <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-md">
                                    <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest mr-1">Try:</span>
                                    {['temples', 'mountains', 'hiking', 'nature'].map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            type="button"
                                            onClick={() => {
                                                resetFilters();
                                                toggleTag(suggestion);
                                            }}
                                            className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-xs text-neutral-300 hover:text-white transition-colors font-mono"
                                        >
                                            #{suggestion}
                                        </button>
                                    ))}
                                </div>

                                <button 
                                    type="button"
                                    onClick={handleResetAll} 
                                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#FF6B6B] to-[#ee5a24] hover:shadow-lg hover:shadow-[#FF6B6B]/30 border border-[#FF6B6B] text-xs uppercase tracking-widest font-bold text-white transition-all rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                                >
                                    <RotateCcw size={14} />
                                    <span>Reset All Filters</span>
                                </button>
                            </div>
                        ) : (
                            <div 
                                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
                                role="list"
                                aria-label="Expedition Destinations Grid"
                            >
                                {sortedDestinations.map((destination) => (
                                    <div key={destination.id} role="listitem">
                                        <DestinationCard
                                            destination={destination}
                                            aspect="aspect-[3/4]"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </PageWrapper>
    );
}

export default ExplorePage;
