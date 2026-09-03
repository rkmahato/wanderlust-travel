import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LocationProvider } from '@/context/LocationContext';
import { ToastProvider } from '@/context/ToastContext';
import { DevKeysBanner } from '@/components/DevKeysBanner';
import { LandingPage } from '@/pages/LandingPage';
import { ExplorePage } from '@/pages/ExplorePage';
import { DestinationPage } from '@/pages/DestinationPage';
import { PlanningPage } from '@/pages/PlanningPage';
import { ContactPage } from '@/pages/ContactPage';
import { BookPage } from '@/pages/BookPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { FlightProvider } from '@/components/FlightTransition';

function ScrollProgressBar() {
    const { scrollYProgress } = useScroll();
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const prefersReduced = useReducedMotion();
    if (prefersReduced) return null;
    return (
        <motion.div
            className="scroll-progress-bar"
            style={{ scaleX }}
        />
    );
}

function GrainOverlay() {
    const prefersReduced = useReducedMotion();
    if (prefersReduced) return null;
    return <div className="grain-overlay" aria-hidden="true" />;
}

function AnimatedRoutes() {
    const location = useLocation();
    
    return (
        <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/plan" element={<PlanningPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/book" element={<BookPage />} />
                <Route path="/destination/:id" element={<DestinationPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </AnimatePresence>
    );
}

function AppLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-[#050505] font-body text-white">
            <ScrollProgressBar />
            <GrainOverlay />
            <DevKeysBanner />
            <Navbar />
            <AnimatedRoutes />
            <Footer />
        </div>
    );
}

export function App() {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <FlightProvider>
                <LocationProvider>
                    <ToastProvider>
                        <AppLayout />
                    </ToastProvider>
                </LocationProvider>
            </FlightProvider>
        </BrowserRouter>
    );
}
