import type { HTMLAttributes } from 'react'

/** Grey 16px-radius surface. Add `lift` only when it has to float above the page. */
export function Card({ lift, className = '', ...rest }: HTMLAttributes<HTMLDivElement> & { lift?: boolean }) {
  return <div className={`rounded-2xl ${lift ? 'bg-white shadow-lift' : 'bg-mist'} ${className}`} {...rest} />
}
