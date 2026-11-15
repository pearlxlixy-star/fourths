import { daysLeft, diffDays, shortDate } from '../lib/dates'
import { usd } from '../lib/money'
import type { ISODate, Payment } from '../types'

/** One line on the timeline: store, amount, date, days remaining. */
export function PaymentRow({ payment: x, today, atRisk }: { payment: Payment; today: ISODate; atRisk?: boolean }) {
  const late = diffDays(x.date, today) < 0
  return (
    <a href={`#/plans/${x.plan.id}`} className="flex min-h-[76px] items-center gap-3 rounded-2xl px-4 py-3 hover:bg-line">
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[17px] font-semibold">{x.plan.store}</span>
        <span className="block truncate text-mute">
          {x.plan.provider ? `${x.plan.provider} · ` : ''}
          {shortDate(x.date)}
        </span>
        {(atRisk || late) && (
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-amber px-2.5 py-0.5 text-sm font-semibold text-ink">
            {late ? 'Late' : 'May not clear'}
          </span>
        )}
      </span>
      <span className="text-right">
        <span className="block text-xl font-bold tabular-nums">{usd(x.cents)}</span>
        <span className="block text-mute">{daysLeft(x.date, today)}</span>
      </span>
    </a>
  )
}
