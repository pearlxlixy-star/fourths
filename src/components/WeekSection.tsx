import { usd } from '../lib/money'
import { payKey, type WeekGroup } from '../lib/schedule'
import type { ISODate } from '../types'
import { PaymentRow } from './PaymentRow'

/** One week of the timeline: heading, dates, total, then its payments. */
export function WeekSection({ group, today, atRisk }: { group: WeekGroup; today: ISODate; atRisk?: Set<string> }) {
  return (
    <section>
      <div className="flex items-end justify-between gap-3 px-1">
        <div>
          <h2 className="text-xl font-bold">{group.label}</h2>
          {group.range && <p className="text-mute">{group.range}</p>}
        </div>
        <p className="text-mute">
          <span className="text-xl font-bold text-ink tabular-nums">{usd(group.totalCents)}</span> total
        </p>
      </div>
      <ul className="mt-2 divide-y divide-white rounded-2xl bg-mist">
        {group.payments.map((x) => (
          <li key={payKey(x)}>
            <PaymentRow payment={x} today={today} atRisk={atRisk?.has(payKey(x))} />
          </li>
        ))}
      </ul>
    </section>
  )
}
