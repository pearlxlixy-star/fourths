import { useState } from 'react'
import { addMonths, longDate, parseISO, toISO } from '../lib/dates'
import type { ISODate } from '../types'
import { Icon } from './Icon'

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

/** One-tap month grid. Every day is a 44px+ button. */
export function Calendar({ value, onChange, today, min }: { value: ISODate; onChange: (d: ISODate) => void; today: ISODate; min?: ISODate }) {
  const [month, setMonth] = useState(value.slice(0, 7) + '-01')
  const first = parseISO(month)
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  const cells: (ISODate | null)[] = [
    ...Array<null>(first.getDay()).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => toISO(new Date(first.getFullYear(), first.getMonth(), i + 1))),
  ]
  const nav = 'grid size-11 place-items-center rounded-full hover:bg-mist'

  return (
    <div>
      <div className="flex items-center justify-between">
        <button type="button" className={nav} aria-label="Previous month" onClick={() => setMonth(addMonths(month, -1))}>
          <Icon name="back" />
        </button>
        <p className="text-lg font-bold" aria-live="polite">
          {first.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
        <button type="button" className={nav} aria-label="Next month" onClick={() => setMonth(addMonths(month, 1))}>
          <Icon name="chevron" />
        </button>
      </div>
      <div className="mt-2 grid grid-cols-7 text-center text-sm font-semibold text-mute" aria-hidden="true">
        {DAYS.map((d, i) => (
          <span key={i} className="py-1">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((d, i) =>
          d ? (
            <button
              key={d}
              type="button"
              onClick={() => onChange(d)}
              disabled={!!min && d < min}
              aria-label={longDate(d)}
              aria-pressed={d === value}
              className={`mx-auto grid size-11 place-items-center rounded-full text-[17px] tabular-nums disabled:text-line disabled:hover:bg-transparent ${
                d === value ? 'bg-ink font-bold text-white' : d === today ? 'font-bold underline underline-offset-4 hover:bg-mist' : 'hover:bg-mist'
              }`}
            >
              {Number(d.slice(8))}
            </button>
          ) : (
            <span key={`blank-${i}`} />
          ),
        )}
      </div>
    </div>
  )
}
