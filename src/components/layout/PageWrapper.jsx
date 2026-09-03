import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function PageWrapper({ children, className }) {
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <motion.main
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -40 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.main>
    );
}
