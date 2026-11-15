import { useState } from 'react'
import { Button } from '../../components/Button'
import { Calendar } from '../../components/Calendar'
import { Screen } from '../../components/Screen'
import { shortDate, todayISO } from '../../lib/dates'
import type { ISODate } from '../../types'

interface Props {
  title: string
  hint?: string
  step?: [number, number]
  backTo: string
  /** Gets the picked date so the button can say it. */
  cta?: (d: ISODate) => string
  initial: ISODate
  /** Earliest day that can be picked. */
  min?: ISODate
  /** A quiet way out, e.g. "No date". */
  secondary?: { label: string; onClick: () => void }
  onSubmit: (date: ISODate) => void
}

/** One question answered with a single day. */
export function DateQuestion({ title, hint, step, backTo, cta, initial, min, secondary, onSubmit }: Props) {
  const [date, setDate] = useState(initial)
  return (
    <Screen
      title={title}
      hint={hint}
      step={step}
      backTo={backTo}
      footer={
        <>
          <Button onClick={() => onSubmit(date)}>{cta ? cta(date) : `Use ${shortDate(date)}`}</Button>
          {secondary && <Button variant="ghost" onClick={secondary.onClick}>{secondary.label}</Button>}
        </>
      }
    >
      <Calendar value={date} onChange={setDate} today={todayISO()} min={min} />
    </Screen>
  )
}
