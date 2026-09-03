/**
 * Design System — Single source of truth for all design tokens.
 * All values here are mirrored in the Tailwind CSS theme via @theme in index.css.
 */
export const colors = {
    sand: {
        light: '#E8D5B0',
        DEFAULT: '#C9A96E',
        dark: '#A67C45',
    },
    teal: {
        light: '#2D8A98',
        DEFAULT: '#1B6B77',
        dark: '#134F59',
    },
    neutral: {
        50: '#F5F3F0',
        100: '#E8E4DE',
        200: '#D4CEC6',
        400: '#B5AFA7',
        600: '#6B6560',
        900: '#2A2521',
    },
    ink: '#1A1714',
    white: '#FDFCFA',
};
export const fontFamily = {
    display: "'Fraunces', Georgia, serif",
    body: "'DM Sans', system-ui, sans-serif",
};
export const fontSize = {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.25rem', // 20px
    xl: '1.625rem', // 26px
    '2xl': '2.25rem', // 36px
    '3xl': '3.5rem', // 56px
};
export const spacing = {
    // 4px base unit — all values are multiples of 4px
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
};
export const borderRadius = {
    card: '12px',
    button: '6px',
    pill: '9999px',
    sm: '4px',
};
export const shadow = {
    card: '0 2px 8px rgba(26, 23, 20, 0.08), 0 8px 24px rgba(26, 23, 20, 0.06)',
    cardHover: '0 4px 16px rgba(26, 23, 20, 0.12), 0 16px 40px rgba(26, 23, 20, 0.10)',
    subtle: '0 1px 3px rgba(26, 23, 20, 0.06)',
};
/**
 * Duration in ms — keep transitions under 300ms per spec.
 * Framer-motion variants use these (converted to seconds).
 */
export const duration = {
    fast: 0.15,
    normal: 0.24,
    slow: 0.35,
};
export const easing = {
    standard: [0.4, 0, 0.2, 1],
    enter: [0, 0, 0.2, 1],
    exit: [0.4, 0, 1, 1],
};
