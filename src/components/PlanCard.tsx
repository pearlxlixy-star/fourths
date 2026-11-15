import { shortDate } from '../lib/dates'
import { usd } from '../lib/money'
import { everyText, isDone, paymentCents, sum, unpaid } from '../lib/schedule'
import type { Plan } from '../types'

/** A plan at a glance: how much is left and when it ends. */
export function PlanCard({ plan: p }: { plan: Plan }) {
  const left = unpaid(p)
  const done = isDone(p)
  return (
    <a href={`#/plans/${p.id}`} className="block rounded-2xl bg-mist p-5 hover:bg-line">
      <span className="flex items-start justify-between gap-3">
        <span className="min-w-0">
          <span className="block truncate text-xl font-bold">{p.store}</span>
          <span className="block text-mute">
            {p.provider ? `${p.provider} · ` : ''}
            {usd(paymentCents(p, 0))} {everyText(p.intervalDays)}
          </span>
        </span>
        <span className="text-right">
          <span className="block text-2xl font-bold tabular-nums">{usd(sum(left))}</span>
          <span className="block text-mute">left</span>
        </span>
      </span>
      <span aria-hidden="true" className="mt-4 flex gap-1.5">
        {Array.from({ length: p.count }, (_, i) => (
          <span key={i} className={`h-2 flex-1 rounded-full ${i < p.paidCount ? 'bg-green' : 'bg-ink/15'}`} />
        ))}
      </span>
      <span className="mt-2 block text-mute">
        {p.paidCount} of {p.count} paid ·{' '}
        {done ? `finished ${shortDate(p.finishedOn ?? left[0]?.date ?? p.firstDate)}` : `last one ${shortDate(left[left.length - 1].date)}`}
      </span>
    </a>
  )
}
