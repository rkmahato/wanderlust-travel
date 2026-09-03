import React from 'react';

/**
 * VectorMountainLine
 * Minimalist geometric mountain outline accent motif matching the Red Bull guide.
 */
export function VectorMountainLine({ className = 'w-28 h-10 text-blue-400/80' }) {
    return (
        <svg
            viewBox="0 0 160 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`inline-block ${className}`}
            aria-hidden="true"
        >
            {/* Left peak */}
            <path
                d="M10,42 L45,18 L70,36 L85,28 L105,42"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Right main peak with ridge cut */}
            <path
                d="M60,42 L105,10 L150,42"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M105,10 L108,24 L102,32 L105,42"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

/**
 * VectorWaveLine
 * Triple-wave graphic motif seen in Red Bull guide's surf & ocean sections.
 */
export function VectorWaveLine({ className = 'w-20 h-6 text-blue-300/80' }) {
    return (
        <svg
            viewBox="0 0 90 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`inline-block ${className}`}
            aria-hidden="true"
        >
            <path
                d="M4,10 Q11,3 18,10 T32,10 T46,10 T60,10 T74,10 T88,10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default VectorMountainLine;
