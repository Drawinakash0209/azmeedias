import { cn } from '../../lib/cn'

type Variant = 'dark' | 'light' | 'outline' | 'outline-light'

const variants: Record<Variant, string> = {
  dark: 'bg-ink text-paper hover:bg-gold-deep',
  light: 'bg-ivory text-ink hover:bg-gold',
  outline: 'border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-paper',
  'outline-light': 'border border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory hover:text-ink',
}

/**
 * Rectangular button. Apply to an <a> or <button>.
 * It sets `inline-flex`, so control visibility on a wrapper rather than with `hidden`.
 */
export const button = (variant: Variant = 'dark', size: 'sm' | 'md' = 'md', className?: string) =>
  cn(
    'inline-flex items-center justify-center gap-2.5 text-[0.875rem] whitespace-nowrap',
    'transition-[background-color,color,border-color] duration-500 ease-lux',
    'disabled:pointer-events-none disabled:opacity-50',
    size === 'sm' ? 'h-10 px-5' : 'h-12 px-7',
    variants[variant],
    className,
  )

/** Circular outline button, e.g. "Book now". */
export const circle = (dark = false, className?: string) =>
  cn(
    'inline-flex size-28 shrink-0 items-center justify-center rounded-full border text-center text-[0.95rem] leading-tight md:size-36 md:text-[1.05rem]',
    'transition-[background-color,color,border-color,transform] duration-700 ease-lux hover:scale-[1.04]',
    dark
      ? 'border-ivory/60 text-ivory hover:border-ivory hover:bg-ivory hover:text-ink'
      : 'border-ink/40 text-ink hover:border-ink hover:bg-ink hover:text-paper',
    className,
  )
