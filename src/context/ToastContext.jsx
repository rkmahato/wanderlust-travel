import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Bookmark, Copy, MapPin, X, Info } from 'lucide-react';
import { ToastContext } from './ToastContext.js';


export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback(({ title, message, type = 'success', duration = 3600 }) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const newToast = { id, title, message, type, duration };

        setToasts((prev) => [...prev.slice(-3), newToast]); // keep max 4 toasts

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, [removeToast]);

    const toast = {
        show: showToast,
        success: (title, message) => showToast({ title, message, type: 'success' }),
        bookmark: (title, message) => showToast({ title, message, type: 'bookmark' }),
        copy: (title, message) => showToast({ title, message, type: 'copy' }),
        info: (title, message) => showToast({ title, message, type: 'info' }),
        location: (title, message) => showToast({ title, message, type: 'location' }),
        dismiss: removeToast
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={removeToast} />
        </ToastContext.Provider>
    );
}


function getToastIcon(type) {
    switch (type) {
        case 'bookmark':
            return <Bookmark size={17} className="text-[#FF6B6B] fill-[#FF6B6B]/20" />;
        case 'copy':
            return <Copy size={17} className="text-emerald-400" />;
        case 'location':
            return <MapPin size={17} className="text-cyan-400" />;
        case 'info':
            return <Info size={17} className="text-purple-400" />;
        case 'success':
        default:
            return <CheckCircle2 size={17} className="text-[#FF6B6B]" />;
    }
}

function ToastContainer({ toasts, onDismiss }) {
    return (
        <aside
            aria-live="polite"
            aria-label="Notifications"
            className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2rem)] md:w-96 pointer-events-none"
        >
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        layout
                        initial={{ opacity: 0, y: 24, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 12, transition: { duration: 0.18 } }}
                        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                        className="pointer-events-auto group relative overflow-hidden rounded-2xl bg-[#0f0c24]/95 backdrop-blur-2xl border border-white/15 p-4 shadow-2xl shadow-black/80 hover:border-white/30 transition-colors"
                        role="alert"
                    >
                        {/* Subtle ambient accent glow */}
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-[#FF6B6B]/20 to-[#7c3aed]/20 rounded-full blur-xl pointer-events-none" />

                        <div className="flex items-start gap-3 relative z-10">
                            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-inner">
                                {getToastIcon(toast.type)}
                            </div>

                            <div className="flex-1 min-w-0 pr-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-white truncate">
                                    {toast.title}
                                </h4>
                                {toast.message && (
                                    <p className="text-xs text-neutral-300 font-medium mt-0.5 leading-relaxed break-words">
                                        {toast.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => onDismiss(toast.id)}
                                aria-label="Close notification"
                                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all flex-shrink-0"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {/* Progress countdown indicator */}
                        {toast.duration > 0 && (
                            <motion.div
                                initial={{ width: '100%' }}
                                animate={{ width: '0%' }}
                                transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#FF6B6B] to-[#7c3aed]"
                            />
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </aside>
    );
}
