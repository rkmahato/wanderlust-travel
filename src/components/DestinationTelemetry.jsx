import { useState, useMemo } from 'react';
import { Plane, Compass, Clock, MapPin, Gauge, Leaf, ArrowRightLeft, Navigation } from 'lucide-react';
import { useLocationContext, calculateDistanceKm } from '@/context/LocationContext.js';
import { useToast } from '@/context/ToastContext';

// Standard international hub coordinates for instant flight baseline
const POPULAR_HUBS = [
    { city: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
    { city: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060 },
    { city: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
    { city: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lon: 55.2708 },
    { city: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198 },
    { city: 'San Francisco', country: 'United States', lat: 37.7749, lon: -122.4194 },
    { city: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
    { city: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 }
];

export function DestinationTelemetry({ destination }) {
    const { city: userCity, coords: userCoords, status: geoStatus, detectLocation } = useLocationContext();
    const toast = useToast();

    // Unit toggle: 'km' | 'mi'
    const [unit, setUnit] = useState('km');
    const [selectedHub, setSelectedHub] = useState(null);

    // Active origin coords (either user's detected GPS or selected hub, or London fallback)
    const activeOrigin = useMemo(() => {
        if (selectedHub) {
            return {
                name: selectedHub.city,
                coords: { lat: selectedHub.lat, lon: selectedHub.lon }
            };
        }
        if (userCoords && userCoords.lat && userCoords.lon) {
            return {
                name: userCity || 'Your Location',
                coords: userCoords
            };
        }
        // Default to London Heathrow as standard international datum
        return {
            name: userCity || 'London (Ref Hub)',
            coords: { lat: 51.5074, lon: -0.1278 }
        };
    }, [selectedHub, userCoords, userCity]);

    // Distance calculation
    const distanceKm = useMemo(() => {
        if (!destination?.coordinates || !activeOrigin?.coords) return null;
        return calculateDistanceKm(
            activeOrigin.coords.lat,
            activeOrigin.coords.lon,
            destination.coordinates.lat,
            destination.coordinates.lon
        );
    }, [destination, activeOrigin]);

    // Flight time estimate: ~850 km/h average cruise + 40 mins turnaround/ascent/descent
    const flightEstimate = useMemo(() => {
        if (!distanceKm) return null;
        const totalHours = (distanceKm / 850) + 0.65;
        const hours = Math.floor(totalHours);
        const minutes = Math.round((totalHours - hours) * 60);
        const stops = distanceKm > 11500 ? '1 Layover' : 'Direct Non-stop';
        return {
            formatted: `${hours}h ${minutes.toString().padStart(2, '0')}m`,
            stops
        };
    }, [distanceKm]);

    // Timezone calculations based on longitude (15 deg = 1 hour)
    const timezoneTelemetry = useMemo(() => {
        if (!destination?.coordinates) return null;
        const destLon = destination.coordinates.lon;
        const originLon = activeOrigin?.coords?.lon ?? 0;

        const destOffsetHours = Math.round(destLon / 15);
        const originOffsetHours = Math.round(originLon / 15);
        const diffHours = destOffsetHours - originOffsetHours;

        // Current UTC time + destination offset
        const now = new Date();
        const utcHours = now.getUTCHours();
        const utcMinutes = now.getUTCMinutes();
        const destHour = (utcHours + destOffsetHours + 24) % 24;

        const timeStr = `${destHour.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}`;
        const offsetPrefix = diffHours > 0 ? `+${diffHours}` : `${diffHours}`;
        const relativeStr = diffHours === 0 ? 'Same time zone' : `${offsetPrefix} hrs ${diffHours > 0 ? 'ahead' : 'behind'}`;

        return {
            timeStr,
            relativeStr,
            destOffset: `UTC${destOffsetHours >= 0 ? '+' : ''}${destOffsetHours}`
        };
    }, [destination, activeOrigin]);

    // Eco estimate
    const carbonKg = useMemo(() => {
        if (!distanceKm) return null;
        return Math.round(distanceKm * 0.145);
    }, [distanceKm]);

    function toggleUnit() {
        const next = unit === 'km' ? 'mi' : 'km';
        setUnit(next);
        toast.info('Telemetry Readout Updated', `Distance converted to ${next === 'km' ? 'Kilometers' : 'Statute Miles'}`);
    }

    function handleDetectLocation() {
        setSelectedHub(null);
        detectLocation();
        toast.location('Locating Sensor…', 'Detecting your GPS departure point');
    }

    const displayDistance = useMemo(() => {
        if (distanceKm == null) return '—';
        if (unit === 'mi') {
            return `${Math.round(distanceKm * 0.621371).toLocaleString()} mi`;
        }
        return `${distanceKm.toLocaleString()} km`;
    }, [distanceKm, unit]);

    return (
        <section
            id="weather-telemetry"
            className="w-full bg-[#120e29]/70 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
        >
            {/* Subtle glow accent */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#7c3aed]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B6B] to-[#7c3aed] flex items-center justify-center text-white shadow-lg shadow-purple-900/40">
                        <Gauge size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B6B]">
                                Trajectory & Telemetry
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                Live Datum
                            </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-0.5">
                            Flight & Geo-Coordinates
                        </h3>
                    </div>
                </div>

                {/* Unit Switcher */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={toggleUnit}
                        className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-300 hover:text-white transition-all flex items-center gap-1.5 active:scale-95"
                        title="Toggle Kilometers / Miles"
                    >
                        <ArrowRightLeft size={12} />
                        <span>Units: {unit.toUpperCase()}</span>
                    </button>
                </div>
            </div>

            {/* Departure Origin Bar */}
            <div className="py-5 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 text-sm">
                <div className="flex items-center gap-2.5">
                    <Navigation size={16} className="text-[#FF6B6B]" />
                    <span className="text-neutral-400 font-medium">Origin Departure:</span>
                    <span className="font-bold text-white bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                        {activeOrigin.name}
                    </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        type="button"
                        onClick={handleDetectLocation}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-300 hover:text-white transition-all flex items-center gap-1.5 active:scale-95"
                    >
                        <MapPin size={13} className="text-[#FF6B6B]" />
                        {geoStatus === 'requesting' ? 'Locating…' : 'My GPS Location'}
                    </button>

                    {/* Quick hub presets */}
                    <div className="flex items-center gap-1">
                        <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-bold ml-1 hidden sm:inline">
                            Hubs:
                        </span>
                        {POPULAR_HUBS.slice(0, 4).map((hub) => (
                            <button
                                key={hub.city}
                                type="button"
                                onClick={() => {
                                    setSelectedHub(hub);
                                    toast.location('Departure Set', `Origin route calculated from ${hub.city}`);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                    selectedHub?.city === hub.city
                                        ? 'bg-[#FF6B6B] text-white'
                                        : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                {hub.city}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Flight Route Telemetry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6">
                {/* 1: Distance & Trajectory */}
                <div className="bg-black/30 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                        <div className="flex items-center gap-2">
                            <Compass size={15} className="text-cyan-400" />
                            <span>Great-Circle Distance</span>
                        </div>
                    </div>
                    <div className="my-2">
                        <span className="font-display text-3xl md:text-4xl text-white tracking-tight">
                            {displayDistance}
                        </span>
                    </div>
                    <div className="text-xs text-neutral-400 flex items-center gap-1.5 mt-1 font-medium">
                        <span>Direct geodesy route</span>
                        <span>·</span>
                        <span className="text-neutral-500 font-mono">
                            {destination.coordinates?.lat.toFixed(2)}°, {destination.coordinates?.lon.toFixed(2)}°
                        </span>
                    </div>
                </div>

                {/* 2: Flight Time & Routing */}
                <div className="bg-black/30 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                        <div className="flex items-center gap-2">
                            <Plane size={15} className="text-[#FF6B6B]" />
                            <span>Flight Telemetry</span>
                        </div>
                    </div>
                    <div className="my-2">
                        <span className="font-display text-3xl md:text-4xl text-white tracking-tight">
                            {flightEstimate ? flightEstimate.formatted : '—'}
                        </span>
                    </div>
                    <div className="text-xs text-neutral-400 flex items-center gap-2 mt-1">
                        <span className="text-emerald-400 font-semibold">{flightEstimate?.stops}</span>
                        <span>·</span>
                        <span>Cruise ~850 km/h</span>
                    </div>
                </div>

                {/* 3: Local Time & Chrono Telemetry */}
                <div className="bg-black/30 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                        <div className="flex items-center gap-2">
                            <Clock size={15} className="text-amber-400" />
                            <span>Local Chrono</span>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-400">
                            {timezoneTelemetry?.destOffset}
                        </span>
                    </div>
                    <div className="my-2 flex items-baseline gap-2">
                        <span className="font-display text-3xl md:text-4xl text-white tracking-tight">
                            {timezoneTelemetry ? timezoneTelemetry.timeStr : '—'}
                        </span>
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                            Local
                        </span>
                    </div>
                    <div className="text-xs text-neutral-400 flex items-center gap-1.5 mt-1 font-medium">
                        <span className="text-amber-300 font-semibold">{timezoneTelemetry?.relativeStr}</span>
                    </div>
                </div>
            </div>

            {/* Footer Footprint Note */}
            <div className="mt-5 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-2">
                <div className="flex items-center gap-2">
                    <Leaf size={14} className="text-emerald-400" />
                    <span>Estimated Flight Footprint: <strong className="text-white">{carbonKg ? `${carbonKg.toLocaleString()} kg CO₂` : '—'}</strong> per passenger</span>
                </div>
                <span className="text-[11px] text-neutral-500">
                    Real-time geodetic Haversine calculation
                </span>
            </div>
        </section>
    );
}
