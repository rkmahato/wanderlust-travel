import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils/motion';
export function ErrorCard({ title = 'Something went wrong', message, onRetry, className, compact = false, }) {
    return (<div role="alert" className={cn('flex flex-col items-center text-center rounded-card border border-red-200 bg-red-50', compact ? 'p-4 gap-2' : 'p-8 gap-4', className)}>
      <AlertTriangle size={compact ? 20 : 32} className="text-red-400 flex-shrink-0" aria-hidden="true"/>
      <div className={cn('space-y-1', compact ? 'text-sm' : 'text-base')}>
        <p className="font-medium text-red-700">{title}</p>
        <p className="text-red-600 text-sm">{message}</p>
      </div>
      {onRetry && (<Button variant="danger" size="sm" onClick={onRetry} className="mt-1">
          <RefreshCw size={14} aria-hidden="true"/>
          Try again
        </Button>)}
    </div>);
}
