import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
/** Merge Tailwind classes without conflicts */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
/** Motion variants that respect prefers-reduced-motion */
export const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
};
export const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};
export const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};
export const pageVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
};
export const pageTransition = {
    duration: 0.24,
    ease: [0.4, 0, 0.2, 1],
};
