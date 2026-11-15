import { shortDate, todayISO } from '../lib/dates'
import { go } from '../state/router'
import { useStore } from '../state/store'
import { AmountQuestion } from './questions/AmountQuestion'

/** The only thing we need to know about the user's money. */
export function Balance() {
  const { state, update } = useStore()
  const today = todayISO()
  return (
    <AmountQuestion
      title="How much is in your checking account?"
      hint={`As of today, ${shortDate(today)}.`}
      backTo="/timeline"
      cta="Save balance"
      allowZero
      initialCents={state.balanceCents}
      onSubmit={(balanceCents) => {
        update((s) => ({ ...s, balanceCents, balanceDate: today }))
        go('/timeline')
      }}
    />
  )
}
