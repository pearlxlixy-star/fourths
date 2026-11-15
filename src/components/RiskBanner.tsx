import { capitalize, dayWord, diffDays } from '../lib/dates'
import { usd } from '../lib/money'
import type { Shortfall } from '../lib/schedule'
import type { ISODate } from '../types'
import { Icon } from './Icon'

/** "Thursday's $45 payment" / "Today's $45 payment" / "The late $45 payment" */
export function paymentName(s: Shortfall, today: ISODate) {
  const late = diffDays(s.payment.date, today) < 0
  const amount = usd(s.payment.cents)
  return late ? `The late ${amount} payment` : `${capitalize(dayWord(s.payment.date, today))}’s ${amount} payment`
}

/** Full-width amber warning. Tapping it opens the "what you can do" screen. */
export function RiskBanner({ shortfall, today }: { shortfall: Shortfall; today: ISODate }) {
  return (
    <a href="#/risk" className="-mx-4 flex min-h-16 items-center gap-3 bg-amber px-4 py-3 text-ink hover:brightness-95 md:mx-0 md:rounded-2xl">
      <Icon name="alert" />
      <span className="flex-1 leading-snug">
        <strong className="font-bold">{paymentName(shortfall, today)} may not clear.</strong> You’ll be about{' '}
        <strong className="font-bold">{usd(shortfall.shortCents)}</strong> short.
      </span>
      <Icon name="chevron" />
    </a>
  )
}
