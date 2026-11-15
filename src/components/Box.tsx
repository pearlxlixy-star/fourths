import type { HTMLAttributes } from 'react'

/** A pixel-outlined panel. */
export function Box({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`px bg-card p-4 ${className}`} {...rest} />
}
