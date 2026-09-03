import React from 'react';
import { 
    Compass, 
    Mountain, 
    Waves, 
    Bike, 
    Footprints, 
    Wind, 
    Flame, 
    Sparkles 
} from 'lucide-react';

const ICON_MAP = {
    mountain: Mountain,
    hike: Mountain,
    wave: Waves,
    surf: Waves,
    bike: Bike,
    cycling: Bike,
    run: Footprints,
    trail: Footprints,
    wind: Wind,
    paraglide: Wind,
    flame: Flame,
    compass: Compass,
    sparkle: Sparkles,
};

/**
 * SquircleBadge
 * Red Bull-inspired squircle activity badge with rounded corners and high contrast.
 *
 * @param {string} icon - Icon name ('mountain', 'surf', 'bike', 'trail', 'wind', etc.)
 * @param {string} label - Optional text label
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} variant - 'blue' | 'accent' | 'glass' | 'dark'
 * @param {string} className - Additional CSS classes
 */
export function SquircleBadge({
    icon = 'compass',
    label,
    size = 'md',
    variant = 'blue',
    className = '',
}) {
    const IconComponent = ICON_MAP[icon.toLowerCase()] || Compass;

    const sizeClasses = {
        sm: 'w-8 h-8 rounded-xl text-xs',
        md: 'w-11 h-11 rounded-2xl text-sm',
        lg: 'w-14 h-14 rounded-[20px] text-base',
    }[size] || 'w-11 h-11 rounded-2xl';

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 24,
    }[size] || 20;

    const variantClasses = {
        blue: 'bg-[#0048aa] text-white border border-blue-400/30 shadow-lg shadow-blue-900/40',
        accent: 'bg-gradient-to-tr from-[#FF6B6B] to-[#ee5a24] text-white border border-orange-400/30 shadow-lg shadow-orange-900/40',
        glass: 'bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20 shadow-md',
        dark: 'bg-[#12122b] text-white border border-white/10 shadow-lg',
    }[variant] || 'bg-[#0048aa] text-white';

    return (
        <div className={`inline-flex items-center gap-2.5 ${className}`}>
            <div
                className={`flex items-center justify-center transition-transform duration-300 hover:scale-110 ${sizeClasses} ${variantClasses}`}
                title={label || icon}
            >
                <IconComponent size={iconSizes} strokeWidth={2.2} />
            </div>
            {label && (
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-200">
                    {label}
                </span>
            )}
        </div>
    );
}

export default SquircleBadge;
