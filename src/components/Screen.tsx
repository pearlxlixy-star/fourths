import type { ReactNode } from 'react'
import { Icon } from './Icon'

interface Props {
  title: ReactNode
  hint?: ReactNode
  /** Sits above the headline (e.g. the success tick). */
  above?: ReactNode
  /** [current, total] -> "Step 2 of 4" */
  step?: [number, number]
  backTo?: string
  children?: ReactNode
  /** Pinned to the bottom: the one primary action. */
  footer?: ReactNode
}

/** Layout for every focused, one-question screen. A full page on phones, a centered sheet on larger screens. */
export function Screen({ title, hint, above, step, backTo, children, footer }: Props) {
  return (
    <div className="min-h-dvh bg-white md:flex md:items-center md:justify-center md:bg-mist md:p-8">
      <div className="screen-in mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-4 md:min-h-[700px] md:rounded-3xl md:bg-white md:px-8 md:py-4 md:shadow-lift">
        <header className="flex h-14 items-center justify-between">
          {backTo ? (
            <a href={'#' + backTo} aria-label="Back" className="-ml-2.5 grid size-11 place-items-center rounded-full hover:bg-mist">
              <Icon name="back" />
            </a>
          ) : (
            <span />
          )}
          {step && (
            <p className="font-semibold text-mute">
              Step {step[0]} of {step[1]}
            </p>
          )}
        </header>
        {step && (
          <div aria-hidden="true" className="flex gap-1.5">
            {Array.from({ length: step[1] }, (_, i) => (
              <span key={i} className={`h-1 flex-1 rounded-full ${i < step[0] ? 'bg-ink' : 'bg-line'}`} />
            ))}
          </div>
        )}
        <main className="flex flex-1 flex-col pt-6">
          {above}
          <h1 tabIndex={-1} className="text-[28px] font-bold leading-[1.15] tracking-tight md:text-[32px]">
            {title}
          </h1>
          {hint && <p className="mt-2 text-mute">{hint}</p>}
          <div className="mt-6 flex flex-1 flex-col">{children}</div>
        </main>
        {footer && (
          <footer className="sticky bottom-0 space-y-2 bg-white pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">{footer}</footer>
        )}
      </div>
    </div>
  )
}
