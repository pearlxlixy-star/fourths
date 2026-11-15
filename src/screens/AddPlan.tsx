import { useEffect } from 'react'
import { shortDate, todayISO } from '../lib/dates'
import { newPlan } from '../lib/schedule'
import { go } from '../state/router'
import { emptyDraft, useStore } from '../state/store'
import { AmountQuestion } from './questions/AmountQuestion'
import { CountQuestion } from './questions/CountQuestion'
import { DateQuestion } from './questions/DateQuestion'
import { TextQuestion } from './questions/TextQuestion'

export const STORES = ['Amazon', 'Target', 'Walmart', 'Nike', 'Sephora', 'Best Buy', 'Apple', 'SHEIN']

/** Add a plan by hand: store -> total -> number of payments -> first date. */
export function AddPlan({ step }: { step: number }) {
  const { addDraft: d, setAddDraft, update } = useStore()
  const missing = (step > 1 && !d.store) || (step > 2 && !d.totalCents) || !(step >= 1 && step <= 4)
  useEffect(() => {
    if (missing) go('/add/1', { replace: true })
  }, [missing])
  if (missing) return null

  const s: [number, number] = [step, 4]
  if (step === 1)
    return (
      <TextQuestion
        title="Which store was it?"
        step={s}
        backTo="/choose"
        initial={d.store}
        placeholder="Store name"
        suggestions={STORES}
        onSubmit={(store) => {
          setAddDraft({ ...d, store })
          go('/add/2')
        }}
      />
    )
  if (step === 2)
    return (
      <AmountQuestion
        title={`What was the total at ${d.store}?`}
        step={s}
        backTo="/add/1"
        initialCents={d.totalCents}
        onSubmit={(totalCents) => {
          setAddDraft({ ...d, totalCents })
          go('/add/3')
        }}
      />
    )
  if (step === 3)
    return (
      <CountQuestion
        title="How many payments?"
        step={s}
        backTo="/add/2"
        value={d.count}
        totalCents={d.totalCents}
        onSubmit={(count) => {
          setAddDraft({ ...d, count })
          go('/add/4')
        }}
      />
    )
  return (
    <DateQuestion
      title="When is the first payment?"
      hint="Already started? Pick the day the first one went out."
      step={s}
      backTo="/add/3"
      initial={d.firstDate}
      cta={(date) => `Add plan starting ${shortDate(date)}`}
      onSubmit={(firstDate) => {
        const plan = newPlan({ ...d, firstDate }, todayISO())
        update((st) => ({ ...st, onboarded: true, plans: [...st.plans, plan] }))
        setAddDraft(emptyDraft())
        go('/timeline')
      }}
    />
  )
}
