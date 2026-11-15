import { useEffect } from 'react'
import { Button, ButtonLink } from '../components/Button'
import { Icon } from '../components/Icon'
import { Screen } from '../components/Screen'
import { shortDate, todayISO } from '../lib/dates'
import { usd } from '../lib/money'
import { everyText, isDone, patchPlan, payee, paymentCents, toTwoWeeks } from '../lib/schedule'
import { go } from '../state/router'
import { useStore } from '../state/store'

/** Shown the moment the last payment of a plan is marked paid. */
export function PlanFinished({ planId }: { planId: string }) {
  const { state, update } = useStore()
  const plan = state.plans.find((p) => p.id === planId)
  const done = plan && isDone(plan)
  useEffect(() => {
    if (!done) go('/timeline', { replace: true })
  }, [done])
  if (!plan || !done) return null

  const each = paymentCents(plan, 0)
  const extra = toTwoWeeks(each, plan.intervalDays)
  const goal = state.goal

  const save = () => {
    update((s) => ({
      ...patchPlan(s, plan.id, { askedToSave: true }),
      goal: s.goal
        ? { ...s.goal, perTwoWeeksCents: s.goal.perTwoWeeksCents + extra }
        : { name: '', targetCents: 0, savedCents: 0, perTwoWeeksCents: extra },
    }))
    go(goal ? '/goal' : '/goal/name')
  }
  const skip = () => {
    update((s) => patchPlan(s, plan.id, { askedToSave: true }))
    go('/timeline')
  }

  return (
    <Screen
      title={`${payee(plan)} plan done.`}
      above={
        <span aria-hidden="true" className="mb-6 mt-8 grid size-16 place-items-center rounded-full bg-green text-ink">
          <Icon name="check" size={32} className="stroke-2" />
        </span>
      }
      footer={
        plan.askedToSave ? (
          <ButtonLink to="/timeline">Back to timeline</ButtonLink>
        ) : (
          <>
            <Button onClick={save}>Yes, save it</Button>
            <Button variant="secondary" onClick={skip}>Not now</Button>
          </>
        )
      }
    >
      <p className="text-xl leading-snug">
        You were paying <strong className="font-bold tabular-nums">{usd(each)}</strong> {everyText(plan.intervalDays)}
        {plan.provider ? ` for ${plan.store}` : ''}. Keep paying yourself instead?
      </p>
      {!plan.askedToSave && (
        <p className="mt-4 text-mute">
          {goal
            ? `That adds ${usd(extra)} every 2 weeks to “${goal.name}”, starting ${shortDate(todayISO())}.`
            : `That starts a savings goal with ${usd(extra)} every 2 weeks, from ${shortDate(todayISO())}.`}
        </p>
      )}
    </Screen>
  )
}
