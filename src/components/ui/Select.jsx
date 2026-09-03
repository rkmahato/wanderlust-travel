import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils/motion';
import { AnimatePresence, motion } from 'framer-motion';
export function Select({ options, value, onChange, label, placeholder = 'Select…', className, }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const triggerRef = useRef(null);
    const selectedLabel = options.find((o) => o.value === value)?.label ?? placeholder;
    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    // Close on Escape, return focus to trigger
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'Escape' && open) {
                setOpen(false);
                triggerRef.current?.focus();
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open]);
    function handleSelect(optionValue) {
        onChange(optionValue);
        setOpen(false);
        triggerRef.current?.focus();
    }
    const id = label?.toLowerCase().replace(/\s+/g, '-');
    return (<div ref={containerRef} className={cn('relative', className)}>
      {label && (<label htmlFor={id} className="block text-sm font-medium text-neutral-600 mb-1">
          {label}
        </label>)}
      <button ref={triggerRef} id={id} type="button" role="combobox" aria-expanded={open} aria-haspopup="listbox" onClick={() => setOpen((prev) => !prev)} className={cn('w-full h-11 px-4 flex items-center justify-between gap-2', 'rounded-button border border-neutral-200 bg-white', 'text-base text-ink text-left', 'hover:border-neutral-400 transition-colors duration-150', 'focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal')}>
        <span className={value ? 'text-ink' : 'text-neutral-400'}>{selectedLabel}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.15 }} aria-hidden="true">
          <ChevronDown size={16} className="text-neutral-400"/>
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (<motion.ul role="listbox" aria-label={label} initial={{ opacity: 0, y: -4, scaleY: 0.95 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -4, scaleY: 0.95 }} transition={{ duration: 0.15 }} style={{ transformOrigin: 'top' }} className={cn('absolute z-50 top-full mt-1 w-full', 'bg-white rounded-card border border-neutral-200', 'shadow-card overflow-hidden max-h-60 overflow-y-auto')}>
            {options.map((option) => (<li key={option.value} role="option" aria-selected={option.value === value} onClick={() => handleSelect(option.value)} onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ')
                        handleSelect(option.value);
                }} tabIndex={0} className={cn('flex items-center justify-between px-4 py-2.5 cursor-pointer', 'text-base transition-colors duration-100', 'hover:bg-neutral-50 focus-visible:bg-neutral-50', option.value === value
                    ? 'text-teal font-medium bg-teal/5'
                    : 'text-ink')}>
                {option.label}
                {option.value === value && (<Check size={14} className="text-teal" aria-hidden="true"/>)}
              </li>))}
          </motion.ul>)}
      </AnimatePresence>
    </div>);
}
