import { ButtonLink } from '../components/Button'
import { ConfirmButton } from '../components/ConfirmButton'
import { PlanCard } from '../components/PlanCard'
import { shortDate, todayISO } from '../lib/dates'
import { usd } from '../lib/money'
import { isDone, sum, upcomingPayments } from '../lib/schedule'
import { useStore } from '../state/store'

/** Every plan, active first. */
export function Plans() {
  const { state, update } = useStore()
  const active = state.plans.filter((p) => !isDone(p))
  const finished = state.plans.filter(isDone)
  const upcoming = upcomingPayments(state.plans)
  const lastDate = upcoming[upcoming.length - 1]?.date

  return (
    <>
      <h1 tabIndex={-1} className="text-[28px] font-bold leading-tight tracking-tight md:text-[32px]">
        {active.length === 0 ? 'No plans right now.' : `${active.length} plan${active.length === 1 ? '' : 's'}, ${usd(sum(upcoming))} left to pay.`}
      </h1>
      <p className="mt-2 text-mute">
        {lastDate ? `All paid off by ${shortDate(lastDate)} if nothing new is added.` : `Nothing is leaving your account as of ${shortDate(todayISO())}.`}
      </p>

      <ul className="mt-6 grid gap-3 lg:grid-cols-2">
        {active.map((p) => (
          <li key={p.id}><PlanCard plan={p} /></li>
        ))}
      </ul>

      <ButtonLink to="/choose" className="mt-6 lg:max-w-[320px]">Add a plan</ButtonLink>

      {finished.length > 0 && (
        <section className="mt-10">
          <h2 className="px-1 text-xl font-bold">Finished</h2>
          <ul className="mt-2 grid gap-3 lg:grid-cols-2">
            {finished.map((p) => (
              <li key={p.id}><PlanCard plan={p} /></li>
            ))}
          </ul>
        </section>
      )}

      {state.plans.length > 0 && (
        <div className="mt-10 lg:max-w-[320px]">
          <ConfirmButton
            label="Clear all plans"
            confirmLabel={`Tap again to delete all ${state.plans.length} plans`}
            onConfirm={() => update((s) => ({ ...s, plans: [] }))}
          />
        </div>
      )}
    </>
  )
}
