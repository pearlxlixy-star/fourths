import type { ReactNode } from 'react'
import { ButtonLink } from '../components/Button'
import { Icon, type IconName } from '../components/Icon'
import { paymentName } from '../components/RiskBanner'
import { Screen } from '../components/Screen'
import { addDays, diffDays, shortDate, todayISO } from '../lib/dates'
import { usd } from '../lib/money'
import { findShortfall, markNextPaid, payee } from '../lib/schedule'
import { go } from '../state/router'
import { useStore } from '../state/store'

const optionClass = 'flex min-h-[96px] w-full items-center gap-4 rounded-2xl bg-mist p-4 text-left hover:bg-line'

function OptionBody({ icon, title, children }: { icon: IconName; title: string; children: ReactNode }) {
  return (
    <>
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-amber text-ink">
        <Icon name={icon} />
      </span>
      <span className="flex-1">
        <span className="block text-lg font-bold leading-snug">{title}</span>
        <span className="block text-mute">{children}</span>
      </span>
      <Icon name="chevron" />
    </>
  )
}

/** What to do about a payment that won't clear. Options only. */
export function RiskOptions() {
  const { state, update } = useStore()
  const today = todayISO()
  const s = findShortfall(state.plans, state.balanceCents, today)

  if (!s)
    return (
      <Screen
        title="You’re covered this week."
        hint={`Every payment through ${shortDate(addDays(today, 6))} fits in your ${usd(state.balanceCents)}.`}
        footer={<ButtonLink to="/timeline">Back to timeline</ButtonLink>}
      />
    )

  const { payment: x, shortCents } = s
  const who = payee(x.plan)
  const dueToday = diffDays(x.date, today) <= 0
  const payEarly = () => {
    const finishes = x.plan.paidCount === x.plan.count - 1
    // Paid some other way, so checking stays as it is.
    update((st) => markNextPaid(st, x.plan.id, today, false))
    go(finishes ? `/done/${x.plan.id}` : '/timeline')
  }

  return (
    <Screen
      title={<>{paymentName(s, today)} is about <span className="tabular-nums">{usd(shortCents)}</span> short.</>}
      hint={`${usd(x.cents)} to ${who} leaves your account ${shortDate(x.date)}. You’ll have ${usd(s.beforeCents)} by then.`}
      backTo="/timeline"
    >
      <ul className="grid gap-3">
        <li>
          <a href="#/balance" className={optionClass}>
            <OptionBody icon="swap" title={`Move ${usd(shortCents)} into checking`}>
              {dueToday ? 'Do it today' : `Before ${shortDate(x.date)}`}, then update your balance here.
            </OptionBody>
          </a>
        </li>
        <li>
          <button type="button" onClick={payEarly} className={optionClass}>
            <OptionBody icon="clock" title={`Pay the ${usd(x.cents)} early another way`}>
              Use a different card in the {who} app today, then tap here to mark it paid.
            </OptionBody>
          </button>
        </li>
        <li>
          <a href={`#/move/${x.plan.id}/${x.index}`} className={optionClass}>
            <OptionBody icon="chat" title={`Ask ${who} for a later date`}>
              Message them in the {who} app, then set the new date here.
            </OptionBody>
          </a>
        </li>
      </ul>
    </Screen>
  )
}
