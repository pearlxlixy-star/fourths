import { ButtonLink } from '../components/Button'
import { DevReset } from '../components/DevReset'
import { APP_NAME } from '../config'

export function Welcome() {
  return (
    <div className="min-h-dvh bg-white md:flex md:items-center md:justify-center md:bg-mist md:p-8">
      <main className="screen-in mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6 md:min-h-[700px] md:rounded-3xl md:bg-white md:p-8 md:shadow-lift">
        <p className="text-2xl font-bold tracking-tight">{APP_NAME}</p>
        <div className="flex flex-1 flex-col justify-center py-10">
          {/* Four payments, one done: the whole idea in one mark. */}
          <div aria-hidden="true" className="mb-8 flex gap-2">
            <span className="h-3 flex-1 rounded-full bg-green" />
            <span className="h-3 flex-1 rounded-full bg-ink" />
            <span className="h-3 flex-1 rounded-full bg-ink" />
            <span className="h-3 flex-1 rounded-full bg-line" />
          </div>
          <h1 tabIndex={-1} className="text-[34px] font-bold leading-[1.1] tracking-tight md:text-[40px]">
            See every pay-later payment before it leaves your account.
          </h1>
        </div>
        <ButtonLink to="/choose">Get started</ButtonLink>
        <div className="mt-2 flex min-h-11 justify-center">
          <DevReset />
        </div>
      </main>
    </div>
  )
}
