import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, ArrowRight } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
export function NotFoundPage() {
    return (<PageWrapper>
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md space-y-8">
          {/* Brand mark */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, type: 'spring', stiffness: 200 }} className="w-24 h-24 rounded-card bg-teal/10 flex items-center justify-center mx-auto">
            <Compass size={40} className="text-teal" aria-hidden="true"/>
          </motion.div>

          {/* 404 */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest text-sand">
              Error 404
            </p>
            <h1 className="font-display text-2xl font-semibold text-ink">
              You've wandered off the map
            </h1>
            <p className="text-neutral-600 leading-relaxed">
              The destination you're looking for doesn't exist — or it may have moved. 
              Let's get you back on track.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/">
              <Button variant="primary" size="md">
                Back to Home
              </Button>
            </Link>
            <Link to="/explore">
              <Button variant="secondary" size="md">
                Explore Destinations
                <ArrowRight size={15} aria-hidden="true"/>
              </Button>
            </Link>
          </motion.div>

          {/* Decorative */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-xs text-neutral-400 font-display italic">
            "Not all those who wander are lost — but you definitely are right now."
          </motion.p>
        </div>
      </div>
    </PageWrapper>);
}
