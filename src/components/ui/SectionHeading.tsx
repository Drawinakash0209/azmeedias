import type { ReactNode } from 'react'
import { site } from '../../config/site'
import { Reveal } from './Reveal'
import { RevealText } from './RevealText'
import { cn } from '../../lib/cn'

/** A heading line: a phrase, or two phrases joined with a space. */
export type HeadingLine = string | readonly [string, string]

/** Full-width dark strip that opens a section: brand · section name · (number). */
export function SectionBar({ index, label, light = false }: { index: string; label: string; light?: boolean }) {
  return (
    <div className={cn(light ? 'bg-ivory text-ink' : 'bg-ink text-ivory')}>
      <div className="mx-auto grid h-12 max-w-[1600px] grid-cols-3 items-center px-5 text-[0.8125rem] md:h-14 md:px-10">
        <span className="font-serif tracking-[0.18em]">{site.name}</span>
        <span className="text-center">{label}</span>
        <span className="text-right tabular-nums">({index})</span>
      </div>
    </div>
  )
}

type Props = {
  lines: readonly HeadingLine[]
  id?: string
  /** Optional plain sentence shown beside the title on wide screens */
  text?: ReactNode
  /** Extra controls on the right (tabs, arrows) */
  aside?: ReactNode
  className?: string
  dark?: boolean
  /** md: for headings that sit in a half-width column */
  size?: 'lg' | 'md'
}

/** Large light grotesk title, one line per entry, left aligned. */
export function SectionHeading({ lines, id, text, aside, className, dark = false, size = 'lg' }: Props) {
  return (
    <div className={cn('grid gap-8 md:grid-cols-12 md:items-end md:gap-10', className)}>
      <RevealText
        as="h2"
        id={id}
        className={cn(
          'display',
          size === 'lg' ? 'text-[clamp(2.5rem,6vw,5.6rem)]' : 'text-[clamp(2.3rem,3.9vw,3.8rem)]',
          text || aside ? 'md:col-span-8' : 'md:col-span-12',
        )}
        lines={lines.map((l) => (typeof l === 'string' ? l : `${l[0]} ${l[1]}`))}
      />
      {(text || aside) && (
        <div className="flex flex-col gap-6 md:col-span-4 md:items-end">
          {text && (
            <Reveal as="p" className={cn('max-w-xs text-[0.95rem] leading-[1.6] md:text-right', dark ? 'text-ivory/70' : 'text-stone')}>
              {text}
            </Reveal>
          )}
          {aside && <Reveal>{aside}</Reveal>}
        </div>
      )}
    </div>
  )
}
