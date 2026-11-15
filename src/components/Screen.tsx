import type { ReactNode } from 'react'

interface Props {
  title: ReactNode
  /** [current, total] -> "Step 2 of 5" */
  step?: [number, number]
  stepLabel?: string
  backTo?: string
  /** Sits above the headline (the character preview). */
  above?: ReactNode
  children?: ReactNode
  footer?: ReactNode
}

/** Layout for every focused, one-question screen. A full page on phones, a framed panel on larger screens. */
export function Screen({ title, step, stepLabel = 'Step', backTo, above, children, footer }: Props) {
  return (
    <div className="min-h-dvh bg-paper md:flex md:items-center md:justify-center md:bg-sky md:p-8">
      <div className="screen-in mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-paper px-4 md:min-h-[720px] md:border-4 md:border-ink md:px-8 md:py-4 md:shadow-[8px_8px_0_var(--color-ink)]">
        <header className="flex h-14 items-center justify-between">
          {backTo ? (
            <a href={'#' + backTo} aria-label="Back" className="-ml-2 grid size-11 place-items-center font-pixel text-base hover:bg-sand">
              &lt;
            </a>
          ) : (
            <span />
          )}
          {step && (
            <p className="font-pixel text-[11px] text-mute">
              {stepLabel} {step[0]} of {step[1]}
            </p>
          )}
        </header>
        {step && (
          <div aria-hidden="true" className="flex gap-1">
            {Array.from({ length: step[1] }, (_, i) => (
              <span key={i} className={`h-2 flex-1 border-2 border-ink ${i < step[0] ? 'bg-leaf' : 'bg-card'}`} />
            ))}
          </div>
        )}
        <main className="flex flex-1 flex-col pt-5">
          {above}
          <h1 tabIndex={-1} className="font-pixel text-[18px] leading-[1.5] md:text-[20px]">
            {title}
          </h1>
          <div className="mt-5 flex flex-1 flex-col">{children}</div>
        </main>
        {footer && <footer className="sticky bottom-0 space-y-3 bg-paper pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">{footer}</footer>}
      </div>
    </div>
  )
}
