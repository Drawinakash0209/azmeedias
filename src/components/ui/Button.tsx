import { cn } from '../../lib/cn'

/**
 * Shared look for the gold outline call-to-action.
 * Apply to an <a> or <button> and wrap the label in <span className="relative">.
 */
export const goldButton = (size: 'sm' | 'md' = 'md', className?: string) =>
  cn(
    'eyebrow group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden border border-gold/60 text-gold',
    'transition-colors duration-500 ease-lux hover:border-gold hover:text-ink focus-visible:text-ink',
    'before:absolute before:inset-0 before:translate-y-[101%] before:bg-gold before:transition-transform before:duration-500 before:ease-lux',
    'hover:before:translate-y-0 focus-visible:before:translate-y-0',
    'disabled:pointer-events-none disabled:opacity-50',
    size === 'sm' ? 'px-5 py-3' : 'px-8 py-4',
    className,
  )
