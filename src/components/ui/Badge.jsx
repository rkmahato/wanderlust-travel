import { cn } from '@/utils/motion';
export function Badge({ label, variant = 'default', onClick, className }) {
    const isInteractive = Boolean(onClick);
    const base = cn('inline-flex items-center rounded-pill px-3 h-7 text-xs font-medium select-none', 'transition-colors duration-150', {
        'bg-neutral-100 text-neutral-600 hover:bg-neutral-200': variant === 'default' && isInteractive,
        'bg-neutral-100 text-neutral-600': variant === 'default' && !isInteractive,
        'bg-teal text-white': variant === 'active',
        'bg-sand-light text-sand-dark': variant === 'subtle',
    }, isInteractive && 'cursor-pointer focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-1', className);
    if (isInteractive) {
        return (<button onClick={onClick} className={base} type="button">
        {label}
      </button>);
    }
    return <span className={base}>{label}</span>;
}
