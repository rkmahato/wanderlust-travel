import React from 'react';

/**
 * WavyEdgeDivider
 * Renders an organic, undulating SVG wave edge divider inspired by the Red Bull guide.
 * Used for transitioning smoothly between different section background colors.
 *
 * @param {string} fill - Hex or CSS color fill (e.g. '#0d0a21', '#0048aa', '#0a0a1a')
 * @param {string} position - 'top' | 'bottom'
 * @param {boolean} flipX - Flips wave horizontally
 * @param {boolean} flipY - Flips wave vertically
 * @param {string} className - Extra Tailwind classes for height, z-index, etc.
 */
export function WavyEdgeDivider({
    fill = '#0a0a1a',
    position = 'bottom',
    flipX = false,
    flipY = false,
    className = 'h-12 md:h-20 lg:h-28',
}) {
    const isTop = position === 'top';
    const transform = `${flipX ? 'scaleX(-1)' : ''} ${flipY ? 'scaleY(-1)' : ''}`.trim();

    return (
        <div
            className={`w-full overflow-hidden leading-none pointer-events-none ${
                isTop ? 'absolute top-0 left-0 right-0 z-10' : 'absolute bottom-0 left-0 right-0 z-10'
            }`}
            style={{
                lineHeight: 0,
                transform: transform || undefined,
            }}
            aria-hidden="true"
        >
            <svg
                viewBox="0 0 1440 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className={`w-full block ${className}`}
            >
                <path
                    d={
                        isTop
                            ? 'M0,0 C320,85 540,15 820,70 C1100,120 1280,30 1440,65 L1440,0 L0,0 Z'
                            : 'M0,60 C280,115 520,30 800,85 C1080,135 1260,20 1440,75 L1440,120 L0,120 Z'
                    }
                    fill={fill}
                />
            </svg>
        </div>
    );
}

export default WavyEdgeDivider;
