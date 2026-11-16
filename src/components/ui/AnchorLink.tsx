import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { scrollToId } from '../../lib/scroll'

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string }

/** In-page link: a real #anchor for accessibility, upgraded to smooth scrolling. */
export function AnchorLink({ to, onClick, children, ...rest }: Props) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return
    e.preventDefault()
    scrollToId(to)
  }
  return (
    <a href={`#${to}`} onClick={handle} {...rest}>
      {children}
    </a>
  )
}
