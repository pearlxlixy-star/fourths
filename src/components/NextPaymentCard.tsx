import { dayWord, daysLeft, shortDate } from '../lib/dates'
import { usd } from '../lib/money'
import { payee } from '../lib/schedule'
import type { ISODate, Payment } from '../types'
import { Button } from './Button'

/** The big black card: "Next: $38 to Klarna, Friday". */
export function NextPaymentCard({ payment: x, today, onPaid }: { payment: Payment; today: ISODate; onPaid: () => void }) {
  const last = x.index === x.plan.count - 1
  return (
    <section aria-label="Next payment" className="on-dark rounded-2xl bg-ink p-5 text-white">
      <p className="font-semibold text-white/75">Next</p>
      <p className="mt-1 text-[56px] font-bold leading-none tracking-tight tabular-nums">{usd(x.cents)}</p>
      <p className="mt-3 text-xl font-semibold leading-tight">
        to {payee(x.plan)}, {dayWord(x.date, today)}
      </p>
      <p className="mt-1 text-white/75">
        {shortDate(x.date)} · {daysLeft(x.date, today)}
        {last ? ' · last one' : ''}
      </p>
      <Button variant="inverse" className="mt-5" onClick={onPaid}>
        Mark as paid
      </Button>
    </section>
  )
}
