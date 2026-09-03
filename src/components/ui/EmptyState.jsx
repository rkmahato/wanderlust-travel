import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils/motion';
export function EmptyState({ title = 'No destinations found', description = 'Try adjusting your search or filters to find what you\'re looking for.', onReset, resetLabel = 'Reset filters', className, }) {
    return (<div className={cn('flex flex-col items-center text-center py-20 px-8 gap-6', className)}>
      {/* Illustration */}
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full bg-neutral-100"/>
        <div className="absolute inset-0 flex items-center justify-center">
          <Search size={32} className="text-neutral-400" aria-hidden="true"/>
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-sand-light flex items-center justify-center">
          <SlidersHorizontal size={14} className="text-sand-dark" aria-hidden="true"/>
        </div>
      </div>

      <div className="max-w-xs space-y-2">
        <h3 className="text-xl font-display text-ink font-semibold">{title}</h3>
        <p className="text-sm text-neutral-600 leading-relaxed">{description}</p>
      </div>

      {onReset && (<Button variant="secondary" size="md" onClick={onReset}>
          {resetLabel}
        </Button>)}
    </div>);
}
