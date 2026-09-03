import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Camera, MapPin } from 'lucide-react';

export function PhotoLightbox({ isOpen, onClose, photos = [], initialIndex = 0 }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [prevInitialIndex, setPrevInitialIndex] = useState(initialIndex);

    if (prevInitialIndex !== initialIndex) {
        setPrevInitialIndex(initialIndex);
        setCurrentIndex(initialIndex);
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);


    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
    }, [photos.length]);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
    }, [photos.length]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, handlePrev, handleNext]);

    if (!isOpen || photos.length === 0) return null;

    const currentPhoto = photos[currentIndex] || photos[0];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[10000] flex flex-col justify-between bg-black/95 backdrop-blur-2xl text-white select-none"
                role="dialog"
                aria-modal="true"
                aria-label="Photo Gallery Lightbox"
            >
                {/* Top Control Bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md relative z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#FF6B6B]">
                            <Camera size={16} />
                        </div>
                        <div>
                            <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">
                                Gallery · {currentIndex + 1} of {photos.length}
                            </span>
                            <h3 className="text-sm font-bold text-white truncate max-w-xs md:max-w-md">
                                {currentPhoto.name}
                            </h3>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close Lightbox"
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Main Image Stage */}
                <div className="relative flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden">
                    {/* Left Navigation Button */}
                    <button
                        type="button"
                        onClick={handlePrev}
                        aria-label="Previous Photo"
                        className="absolute left-4 md:left-8 z-30 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center hover:scale-110 active:scale-90 transition-all backdrop-blur-md shadow-2xl"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {/* Active Photo Container */}
                    <div className="relative max-w-6xl max-h-full flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={currentPhoto.imageUrl || currentPhoto.id}
                                src={currentPhoto.imageUrl}
                                alt={currentPhoto.name}
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                                className="max-h-[70vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = '/destinations/kyoto.jpg';
                                }}
                            />
                        </AnimatePresence>
                    </div>

                    {/* Right Navigation Button */}
                    <button
                        type="button"
                        onClick={handleNext}
                        aria-label="Next Photo"
                        className="absolute right-4 md:right-8 z-30 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center hover:scale-110 active:scale-90 transition-all backdrop-blur-md shadow-2xl"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Bottom Details & Thumbnail Ribbon */}
                <div className="border-t border-white/10 bg-black/60 backdrop-blur-xl px-6 py-4 relative z-20">
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 text-[#FF6B6B] text-xs font-bold uppercase tracking-wider mb-1">
                                <MapPin size={12} />
                                <span>{currentPhoto.name}</span>
                            </div>
                            <p className="text-xs md:text-sm text-neutral-300 line-clamp-2 max-w-xl">
                                {currentPhoto.description || 'Iconic landmark capturing the raw essence and culture of the expedition.'}
                            </p>
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
                            {photos.map((photo, idx) => (
                                <button
                                    key={photo.id || idx}
                                    type="button"
                                    onClick={() => setCurrentIndex(idx)}
                                    aria-label={`View photo ${idx + 1}: ${photo.name}`}
                                    className={`relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                                        currentIndex === idx
                                            ? 'border-[#FF6B6B] scale-105 shadow-md shadow-[#FF6B6B]/40'
                                            : 'border-white/20 opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <img
                                        src={photo.imageUrl}
                                        alt={photo.name}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
