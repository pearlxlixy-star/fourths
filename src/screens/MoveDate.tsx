import { useEffect } from 'react'
import { addDays, shortDate } from '../lib/dates'
import { usd } from '../lib/money'
import { patchPlan, payee, paymentCents, paymentDate } from '../lib/schedule'
import { go } from '../state/router'
import { useStore } from '../state/store'
import { DateQuestion } from './questions/DateQuestion'

/** The provider agreed to a later date: record it. */
export function MoveDate({ planId, index }: { planId: string; index: number }) {
  const { state, update } = useStore()
  const plan = state.plans.find((p) => p.id === planId)
  const valid = plan && index >= plan.paidCount && index < plan.count
  useEffect(() => {
    if (!valid) go('/timeline', { replace: true })
  }, [valid])
  if (!plan || !valid) return null

  const was = paymentDate(plan, index)
  return (
    <DateQuestion
      title="What’s the new date?"
      hint={`${usd(paymentCents(plan, index))} to ${payee(plan)} was set for ${shortDate(was)}.`}
      backTo="/risk"
      initial={addDays(was, 7)}
      cta={(d) => `Move it to ${shortDate(d)}`}
      onSubmit={(date) => {
        update((s) => patchPlan(s, plan.id, { moved: { ...plan.moved, [index]: date } }))
        go('/timeline')
      }}
    />
  )
}
