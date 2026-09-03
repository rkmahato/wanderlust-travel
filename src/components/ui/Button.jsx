import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/motion';
import { Loader2 } from 'lucide-react';
const variantStyles = {
    primary: 'bg-teal text-white hover:bg-teal-dark active:bg-teal-dark focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2',
    secondary: 'bg-transparent border border-teal text-teal hover:bg-teal/8 active:bg-teal/12',
    ghost: 'bg-transparent text-neutral-600 hover:text-ink hover:bg-neutral-100 active:bg-neutral-200',
    danger: 'bg-transparent border border-red-400 text-red-600 hover:bg-red-50 active:bg-red-100',
};
const sizeStyles = {
    sm: 'h-9 px-4 text-sm gap-2',
    md: 'h-11 px-6 text-base gap-2',
    lg: 'h-12 px-8 text-lg gap-3',
};
export const Button = forwardRef(({ variant = 'primary', size = 'md', isLoading = false, disabled, className, children, ...props }, ref) => {
    return (<motion.button ref={ref} whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.01 }} transition={{ duration: 0.12 }} disabled={disabled || isLoading} aria-busy={isLoading} className={cn('inline-flex items-center justify-center font-body font-medium rounded-button', 'transition-colors duration-150 select-none cursor-pointer', 'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none', 
        // Minimum 44px touch target for accessibility
        'min-h-[44px] min-w-[44px]', variantStyles[variant], sizeStyles[size], className)} {...props}>
        {isLoading ? (<>
            <Loader2 className="animate-spin" size={16} aria-hidden="true"/>
            <span>Loading…</span>
          </>) : (children)}
      </motion.button>);
});
Button.displayName = 'Button';
