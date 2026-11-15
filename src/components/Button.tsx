import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'inverse' | 'ghost'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-ink text-white hover:bg-black active:opacity-90 disabled:bg-line disabled:text-mute',
  secondary: 'bg-mist text-ink hover:bg-line',
  inverse: 'bg-white text-ink hover:bg-mist',
  ghost: 'text-ink underline underline-offset-4 hover:bg-mist',
}

const cls = (variant: Variant, extra = '') =>
  `flex h-14 w-full items-center justify-center gap-2 rounded-2xl px-6 text-[17px] font-semibold ${VARIANTS[variant]} ${extra}`

/** Full-width, 56px tall. One `primary` per screen. */
export function Button({
  variant = 'primary',
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type="button" className={cls(variant, className)} {...rest} />
}

/** Same look, but a real link (for plain navigation). `to` is an app path like "/plans". */
export function ButtonLink({
  to,
  variant = 'primary',
  className,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; variant?: Variant }) {
  return <a href={'#' + to} className={cls(variant, className)} {...rest} />
}
