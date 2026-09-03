import { useState, useEffect } from 'react';
import { 
    MapPin, Droplets, Wind, Sunrise, Sunset, 
    Sparkles, AlertCircle, RefreshCw 
} from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import { formatTime, getWindDirection } from '@/utils/formatters';
import { getWeatherIconUrl, getWeatherAdvisory } from '@/services/weather';
import { cn } from '@/utils/motion';


export function WeatherWidget({ 
    source, 
    className, 
    destinationCoords,
    destinationName,
    destinationCountry
}) {
    // ALWAYS prioritize destination coordinates if provided, ensuring destination weather is never overridden
    const effectiveSource = source ??
        (destinationCoords
            ? { 
                type: 'coords', 
                lat: destinationCoords.lat, 
                lon: destinationCoords.lon,
                cityName: destinationName,
                country: destinationCountry
              }
            : null);

    const { data, status, error, retry } = useWeather(effectiveSource);

    // Celsius / Fahrenheit toggle with localStorage persistence
    const [unit, setUnit] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('wanderlust_temp_unit') || 'C';
        }
        return 'C';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('wanderlust_temp_unit', unit);
        }
    }, [unit]);

    const toF = (c) => Math.round((c * 9) / 5 + 32);
    const formatDisplayTemp = (celsius) => {
        if (celsius == null) return '--';
        return unit === 'F' ? `${toF(celsius)}°F` : `${celsius}°C`;
    };

    const formatWindSpeed = (kmh) => {
        if (kmh == null) return '--';
        return unit === 'F' 
            ? `${Math.round(kmh * 0.621371)} mph` 
            : `${kmh} km/h`;
    };

    const advisory = data ? getWeatherAdvisory(data) : null;

    const getAdvisoryBadgeStyle = (tone) => {
        switch (tone) {
            case 'optimal':
                return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';
            case 'warm':
                return 'bg-amber-500/15 border-amber-500/30 text-amber-300';
            case 'cold':
                return 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300';
            case 'rain':
                return 'bg-blue-500/15 border-blue-500/30 text-blue-300';
            case 'warning':
                return 'bg-rose-500/15 border-rose-500/30 text-rose-300';
            case 'hot':
                return 'bg-orange-500/15 border-orange-500/30 text-orange-300';
            default:
                return 'bg-purple-500/15 border-purple-500/30 text-purple-300';
        }
    };

    return (
        <div className={cn('w-full flex flex-col', className)} aria-label="Live expedition weather conditions" aria-live="polite">
            
            {/* Header / Telemetry Bar */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                        Live Atmospheric Telemetry
                    </span>
                </div>

                {/* Celsius / Fahrenheit Unit Switcher */}
                <div className="flex items-center bg-black/50 border border-white/15 rounded-full p-0.5">
                    <button
                        type="button"
                        onClick={() => setUnit('C')}
                        className={cn(
                            'px-2.5 py-1 text-[11px] font-bold rounded-full transition-all tracking-wider',
                            unit === 'C'
                                ? 'bg-gradient-to-r from-[#FF6B6B] to-[#7c3aed] text-white shadow-sm'
                                : 'text-neutral-400 hover:text-white'
                        )}
                        aria-label="Switch to Celsius"
                    >
                        °C
                    </button>
                    <button
                        type="button"
                        onClick={() => setUnit('F')}
                        className={cn(
                            'px-2.5 py-1 text-[11px] font-bold rounded-full transition-all tracking-wider',
                            unit === 'F'
                                ? 'bg-gradient-to-r from-[#FF6B6B] to-[#7c3aed] text-white shadow-sm'
                                : 'text-neutral-400 hover:text-white'
                        )}
                        aria-label="Switch to Fahrenheit"
                    >
                        °F
                    </button>
                </div>
            </div>

            {/* Loading State Skeleton */}
            {status === 'loading' && (
                <div className="space-y-6 animate-pulse py-2">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-white/10" />
                        <div className="space-y-2 flex-1">
                            <div className="h-9 w-28 bg-white/10 rounded-lg" />
                            <div className="h-4 w-44 bg-white/10 rounded" />
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                        <div className="h-4 w-32 bg-white/10 rounded" />
                        <div className="h-3 w-full bg-white/10 rounded" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-16 rounded-xl bg-white/5 border border-white/5" />
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 rounded-xl bg-white/5 border border-white/5" />
                        ))}
                    </div>
                </div>
            )}

            {/* Error State */}
            {status === 'error' && (
                <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-center space-y-4">
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                        <AlertCircle size={20} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm">Weather Station Disconnected</h4>
                        <p className="text-neutral-400 text-xs mt-1">
                            {error ?? 'Unable to retrieve meteorological telemetry.'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={retry}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold uppercase tracking-wider text-white transition-colors"
                    >
                        <RefreshCw size={12} /> Retry Connection
                    </button>
                </div>
            )}

            {/* Success State */}
            {status === 'success' && data && (
                <div className="space-y-6">
                    
                    {/* Primary Temp & Condition Banner */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-2xl bg-black/40 border border-white/15 shadow-inner">
                                <img
                                    src={getWeatherIconUrl(data.icon)}
                                    alt={data.description}
                                    className="w-14 h-14 object-contain drop-shadow-md"
                                />
                            </div>
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight">
                                        {formatDisplayTemp(data.temperature)}
                                    </span>
                                    <span className="text-xs text-neutral-400 font-medium">
                                        Feels {formatDisplayTemp(data.feelsLike)}
                                    </span>
                                </div>
                                <p className="text-sm text-neutral-300 capitalize font-medium tracking-wide mt-1">
                                    {data.description}
                                </p>
                            </div>
                        </div>

                        {/* Location Tag */}
                        <div className="text-right">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/15 text-[11px] font-bold text-neutral-200">
                                <MapPin size={12} className="text-[#FF6B6B]" />
                                <span>{data.city}{data.country ? `, ${data.country}` : ''}</span>
                            </div>
                        </div>
                    </div>

                    {/* Travel Weather Advisory Badge */}
                    {advisory && (
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-black/60 to-black/30 border border-white/10 relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles size={14} className="text-amber-400 flex-shrink-0" />
                                <span className={cn(
                                    'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border',
                                    getAdvisoryBadgeStyle(advisory.tone)
                                )}>
                                    {advisory.badge}
                                </span>
                                <span className="text-xs font-bold text-white/90 ml-auto truncate">
                                    {advisory.title}
                                </span>
                            </div>
                            <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                                {advisory.tip}
                            </p>
                        </div>
                    )}

                    {/* Meteorological Metric Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                        <MetricPill
                            icon={<Droplets size={14} className="text-blue-400" />}
                            label="Humidity"
                            value={`${data.humidity}%`}
                        />
                        <MetricPill
                            icon={<Wind size={14} className="text-teal-400" />}
                            label="Wind"
                            value={`${formatWindSpeed(data.windSpeed)} ${getWindDirection(data.windDirection)}`}
                        />
                        <MetricPill
                            icon={<Sunrise size={14} className="text-amber-400" />}
                            label="Sunrise"
                            value={formatTime(data.sunrise)}
                        />
                        <MetricPill
                            icon={<Sunset size={14} className="text-rose-400" />}
                            label="Sunset"
                            value={formatTime(data.sunset)}
                        />
                    </div>

                    {/* 3-Day Forecast Outlook */}
                    {data.forecast && data.forecast.length > 0 && (
                        <div className="pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                                    3-Day Expedition Outlook
                                </span>
                                <span className="text-[10px] text-neutral-500 font-mono">
                                    HIGH / LOW
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2.5">
                                {data.forecast.slice(0, 3).map((f, idx) => (
                                    <div 
                                        key={idx} 
                                        className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors flex flex-col items-center text-center"
                                    >
                                        <span className="text-[11px] font-bold text-white tracking-wide">
                                            {f.day}
                                        </span>
                                        <span className="text-[10px] text-neutral-500 font-medium mb-1">
                                            {f.date}
                                        </span>
                                        <img
                                            src={getWeatherIconUrl(f.icon)}
                                            alt={f.description}
                                            className="w-9 h-9 object-contain my-1 drop-shadow-sm"
                                        />
                                        <div className="text-xs font-bold text-white">
                                            {unit === 'F' ? `${toF(f.tempMax)}°` : `${f.tempMax}°`}
                                            <span className="text-neutral-500 font-normal ml-1">
                                                {unit === 'F' ? `${toF(f.tempMin)}°` : `${f.tempMin}°`}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-neutral-400 truncate max-w-full mt-1 capitalize">
                                            {f.description}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function MetricPill({ icon, label, value }) {
    return (
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-neutral-400">
                {icon}
                <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">{label}</span>
            </div>
            <span className="font-bold text-white text-xs tracking-tight truncate mt-0.5">
                {value}
            </span>
        </div>
    );
}
