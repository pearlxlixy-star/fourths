import { ButtonLink } from '../components/Button'
import { NextPaymentCard } from '../components/NextPaymentCard'
import { RiskBanner } from '../components/RiskBanner'
import { WeekSection } from '../components/WeekSection'
import { diffDays, shortDate, todayISO } from '../lib/dates'
import { usd } from '../lib/money'
import { findShortfall, groupByWeek, markNextPaid, thisWeekCents, upcomingPayments } from '../lib/schedule'
import { go } from '../state/router'
import { useStore } from '../state/store'

/** Home. What leaves the account, and when. */
export function Timeline() {
  const { state, update } = useStore()
  const today = todayISO()
  const upcoming = upcomingPayments(state.plans)
  const next = upcoming[0]
  const weekCents = thisWeekCents(upcoming, today)
  const shortfall = findShortfall(state.plans, state.balanceCents, today)
  // Only mention the date when the balance is stale.
  const balanceDay = diffDays(state.balanceDate, today) === 0 ? '' : ` as of ${shortDate(state.balanceDate)}`

  const payNext = () => {
    const finishes = next.index === next.plan.count - 1
    update((s) => markNextPaid(s, next.plan.id, today))
    if (finishes) go(`/done/${next.plan.id}`)
  }

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:items-start lg:gap-12">
      <div className="lg:sticky lg:top-12">
        <h1 tabIndex={-1} className="sr-only">Timeline</h1>

        {/* 1. Quiet context line. Numbers are the only bold thing in it. */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-[17px] leading-snug text-mute">
            You have <strong className="font-bold text-ink tabular-nums">{usd(state.balanceCents)}</strong> in checking{balanceDay}.{' '}
            {weekCents > 0 ? (
              <>This week takes <strong className="font-bold text-ink tabular-nums">{usd(weekCents)}</strong>.</>
            ) : (
              <>Nothing leaves this week.</>
            )}
          </p>
          <a href="#/balance" className="flex h-11 shrink-0 items-center rounded-full bg-mist px-4 font-semibold hover:bg-line">
            Update
          </a>
        </div>

        {/* 2. The one thing to look at. */}
        {next && (
          <div className="mt-4">
            <NextPaymentCard payment={next} today={today} onPaid={payNext} />
          </div>
        )}

        {/* 3. Warning, only when there is one. */}
        {shortfall && (
          <div className="mt-4">
            <RiskBanner shortfall={shortfall} today={today} />
          </div>
        )}
      </div>

      <div className="mt-8 space-y-8 lg:mt-0">
        {groupByWeek(upcoming, today).map((g) => (
          <WeekSection key={g.key} group={g} today={today} atRisk={shortfall?.atRisk} />
        ))}
        {!next && (
          <div className="rounded-2xl bg-mist p-6">
            <p className="text-xl font-bold">No payments coming up.</p>
            <p className="mt-1 text-mute">Add a pay-later plan and it shows up here.</p>
            <ButtonLink to="/choose" className="mt-5">Add a plan</ButtonLink>
          </div>
        )}
      </div>
    </div>
  )
}
