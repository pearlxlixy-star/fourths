import { addDays, shortDate, todayISO } from '../lib/dates'
import { usd } from '../lib/money'
import { goalLeft } from '../lib/schedule'
import { go } from '../state/router'
import { useStore } from '../state/store'
import type { Goal } from '../types'
import { AmountQuestion } from './questions/AmountQuestion'
import { DateQuestion } from './questions/DateQuestion'
import { TextQuestion } from './questions/TextQuestion'

const blank: Goal = { name: '', targetCents: 0, savedCents: 0, perTwoWeeksCents: 0 }

/** Goal, step 1 of 3: what is it for? */
export function GoalName() {
  const { state, update } = useStore()
  return (
    <TextQuestion
      title="What are you saving for?"
      step={[1, 3]}
      backTo="/goal"
      initial={state.goal?.name ?? ''}
      placeholder="Name your goal"
      suggestions={['Rainy day fund', 'A trip', 'New phone', 'Moving out', 'Gifts']}
      onSubmit={(name) => {
        update((s) => ({ ...s, goal: { ...(s.goal ?? blank), name } }))
        go('/goal/target')
      }}
    />
  )
}

/** Goal, step 2 of 3: how much? */
export function GoalTarget() {
  const { state, update } = useStore()
  return (
    <AmountQuestion
      title="How much do you need?"
      hint={state.goal?.name ? `For “${state.goal.name}”.` : undefined}
      step={[2, 3]}
      backTo="/goal/name"
      initialCents={state.goal?.targetCents}
      onSubmit={(targetCents) => {
        update((s) => ({ ...s, goal: { ...(s.goal ?? blank), targetCents } }))
        go('/goal/date')
      }}
    />
  )
}

/**
 * When do you need it by? Step 3 of 3 when setting up, or on its own
 * (`solo`) when the user taps "Change date" on the Goal screen.
 */
export function GoalDate({ solo }: { solo?: boolean }) {
  const { state, update } = useStore()
  const today = todayISO()
  const g = state.goal
  const save = (needBy: string | undefined) => {
    update((s) => ({ ...s, goal: { ...(s.goal ?? blank), needBy } }))
    go('/goal')
  }
  return (
    <DateQuestion
      title="When do you need it by?"
      hint={g?.targetCents ? `${usd(goalLeft(g))} left to save for “${g.name}” as of ${shortDate(today)}.` : undefined}
      step={solo ? undefined : [3, 3]}
      backTo={solo ? '/goal' : '/goal/target'}
      initial={g?.needBy && g.needBy > today ? g.needBy : addDays(today, 84)}
      min={addDays(today, 1)}
      cta={(d) => `Save for ${shortDate(d)}`}
      secondary={{ label: 'No date, just save', onClick: () => save(undefined) }}
      onSubmit={save}
    />
  )
}

/** The Goal screen's one button. */
export function GoalAddMoney() {
  const { state, update } = useStore()
  const g = state.goal
  return (
    <AmountQuestion
      title="How much are you adding?"
      hint={g ? `${usd(goalLeft(g))} left to reach “${g.name}” as of ${shortDate(todayISO())}.` : undefined}
      backTo="/goal"
      cta="Add to goal"
      onSubmit={(cents) => {
        update((s) => (s.goal ? { ...s, goal: { ...s.goal, savedCents: s.goal.savedCents + cents } } : s))
        go('/goal')
      }}
    />
  )
}
