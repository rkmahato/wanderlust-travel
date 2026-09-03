import { cn } from '@/utils/motion';
export function SkeletonCard({ className }) {
    return (<div className={cn('rounded-card overflow-hidden bg-white shadow-card', className)} aria-hidden="true">
      {/* Image area — matches actual card image aspect ratio */}
      <div className="skeleton aspect-[4/3] w-full"/>

      {/* Content area */}
      <div className="p-6 space-y-3">
        {/* Title line */}
        <div className="skeleton h-6 w-3/4 rounded-sm"/>
        {/* Subtitle line */}
        <div className="skeleton h-4 w-1/2 rounded-sm"/>
        {/* Description lines */}
        <div className="space-y-2 pt-1">
          <div className="skeleton h-3 w-full rounded-sm"/>
          <div className="skeleton h-3 w-5/6 rounded-sm"/>
          <div className="skeleton h-3 w-4/5 rounded-sm"/>
        </div>
        {/* Tag placeholders */}
        <div className="flex gap-2 pt-2">
          <div className="skeleton h-7 w-16 rounded-pill"/>
          <div className="skeleton h-7 w-20 rounded-pill"/>
          <div className="skeleton h-7 w-14 rounded-pill"/>
        </div>
      </div>
    </div>);
}
export function SkeletonText({ lines = 3, className }) {
    const widths = ['w-full', 'w-5/6', 'w-4/5', 'w-3/4', 'w-2/3'];
    return (<div className={cn('space-y-2', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (<div key={i} className={cn('skeleton h-4 rounded-sm', widths[i % widths.length])}/>))}
    </div>);
}
