import { useEffect } from 'react'
import { Button } from '../components/Button'
import { ConfirmButton } from '../components/ConfirmButton'
import { Icon } from '../components/Icon'
import { daysLeft, shortDate, todayISO } from '../lib/dates'
import { usd } from '../lib/money'
import { everyText, isDone, markNextPaid, planPayments } from '../lib/schedule'
import { go } from '../state/router'
import { useStore } from '../state/store'

/** One plan: every payment, and the button to tick the next one off. */
export function PlanDetail({ planId }: { planId: string }) {
  const { state, update } = useStore()
  const plan = state.plans.find((p) => p.id === planId)
  useEffect(() => {
    if (!plan) go('/plans', { replace: true })
  }, [plan])
  if (!plan) return null

  const today = todayISO()
  const payments = planPayments(plan)
  const next = payments.find((x) => !x.paid)
  const pay = () => {
    update((s) => markNextPaid(s, plan.id, today))
    if (plan.paidCount === plan.count - 1) go(`/done/${plan.id}`)
  }
  const remove = () => {
    update((s) => ({ ...s, plans: s.plans.filter((p) => p.id !== plan.id) }))
    go('/plans')
  }

  return (
    <>
      <a href="#/plans" className="-ml-2 inline-flex min-h-11 items-center gap-1 rounded-xl pr-3 font-semibold hover:bg-mist">
        <Icon name="back" /> Plans
      </a>
      <h1 tabIndex={-1} className="mt-2 text-[28px] font-bold leading-tight tracking-tight md:text-[32px]">
        {plan.store}
      </h1>
      <p className="mt-1 text-mute">
        {plan.provider ? `${plan.provider} · ` : ''}
        {usd(plan.totalCents)} in {plan.count} payments, {everyText(plan.intervalDays)}
      </p>

      <ol className="mt-6 divide-y divide-white rounded-2xl bg-mist">
        {payments.map((x) => (
          <li key={x.index} className="flex min-h-[68px] items-center gap-3 px-4 py-3">
            <span
              aria-hidden="true"
              className={`grid size-8 shrink-0 place-items-center rounded-full ${x.paid ? 'bg-green text-ink' : 'border-2 border-line bg-white text-mute'}`}
            >
              {x.paid ? <Icon name="check" size={18} className="stroke-2" /> : <span className="text-sm font-bold">{x.index + 1}</span>}
            </span>
            <span className="flex-1">
              <span className="block font-semibold">{shortDate(x.date)}</span>
              <span className="block text-mute">{x.paid ? 'Paid' : daysLeft(x.date, today)}</span>
            </span>
            <span className={`text-xl font-bold tabular-nums ${x.paid ? 'text-mute' : ''}`}>{usd(x.cents)}</span>
          </li>
        ))}
      </ol>

      <div className="mt-6 space-y-2">
        {next && !isDone(plan) && (
          <Button onClick={pay}>Mark {usd(next.cents)} for {shortDate(next.date)} as paid</Button>
        )}
        <ConfirmButton label="Remove this plan" confirmLabel="Tap again to remove for good" onConfirm={remove} />
      </div>
    </>
  )
}
