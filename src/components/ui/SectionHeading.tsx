import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import { RevealText } from './RevealText'
import { cn } from '../../lib/cn'

type Props = {
  index: string
  label: string
  lines: ReactNode[]
  id?: string
  className?: string
}

/** Numbered eyebrow + large serif headline used at the top of each section. */
export function SectionHeading({ index, label, lines, id, className }: Props) {
  return (
    <div className={className}>
      <Reveal as="p" className="eyebrow flex items-center gap-4 text-gold">
        <span aria-hidden="true">{index}</span>
        <span aria-hidden="true" className="h-px w-10 bg-gold/50" />
        {label}
      </Reveal>
      <RevealText
        as="h2"
        lines={lines}
        className={cn(
          'mt-8 font-serif text-[clamp(2.5rem,5vw,5rem)] leading-[1.02] font-light tracking-[-0.01em] uppercase',
        )}
        id={id}
      />
    </div>
  )
}
