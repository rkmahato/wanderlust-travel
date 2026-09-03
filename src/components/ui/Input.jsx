import { forwardRef } from 'react';
import { cn } from '@/utils/motion';
export const Input = forwardRef(({ label, error, leftIcon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (<div className="flex flex-col gap-1">
        {label && (<label htmlFor={inputId} className="text-sm font-medium text-neutral-600">
            {label}
          </label>)}
        <div className="relative flex items-center">
          {leftIcon && (<span className="absolute left-3 text-neutral-400 pointer-events-none" aria-hidden="true">
              {leftIcon}
            </span>)}
          <input ref={ref} id={inputId} className={cn('w-full h-11 rounded-button bg-white border border-neutral-200', 'text-base text-ink placeholder:text-neutral-400', 'transition-colors duration-150', 'hover:border-neutral-400', 'focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal', leftIcon ? 'pl-10 pr-4' : 'px-4', error && 'border-red-400 focus:border-red-500 focus:ring-red-500', className)} {...props}/>
        </div>
        {error && (<p role="alert" className="text-sm text-red-600">
            {error}
          </p>)}
      </div>);
});
Input.displayName = 'Input';
