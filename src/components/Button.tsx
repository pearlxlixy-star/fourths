import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

const VARIANTS: Record<Variant, string> = {
  primary: 'px px-press bg-sun text-ink hover:brightness-105 disabled:bg-sand disabled:text-mute',
  secondary: 'px px-press bg-card text-ink hover:bg-sand',
  ghost: 'text-ink underline underline-offset-4 hover:bg-sand',
}

const cls = (variant: Variant, extra = '') =>
  `flex min-h-14 w-full items-center justify-center gap-2 px-4 py-2 text-center font-pixel text-[13px] leading-snug ${VARIANTS[variant]} ${extra}`

/** Chunky pixel button, at least 56px tall. One `primary` per screen. */
export function Button({ variant = 'primary', className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type="button" className={cls(variant, className)} {...rest} />
}

/** Same look, but a link. `to` is an app path like "/home". */
export function ButtonLink({ to, variant = 'primary', className, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; variant?: Variant }) {
  return <a href={'#' + to} className={cls(variant, className)} {...rest} />
}
