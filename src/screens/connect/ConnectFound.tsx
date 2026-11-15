import { useEffect } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { Screen } from '../../components/Screen'
import { shortDate, todayISO } from '../../lib/dates'
import { usd } from '../../lib/money'
import { everyText, newPlan } from '../../lib/schedule'
import { go } from '../../state/router'
import { useStore } from '../../state/store'
import { CONNECT_STEPS } from './ConnectBank'

/** Step 4: "We found 3 payments". Untick what's wrong, edit what's close. */
export function ConnectFound() {
  const { connect, setConnect, update } = useStore()
  const found = connect?.found
  useEffect(() => {
    if (!found) go('/connect', { replace: true })
  }, [found])
  if (!connect || !found) return null

  const picked = found.filter((f) => f.checked)
  const toggle = (i: number) =>
    setConnect({ ...connect, found: found.map((f, j) => (j === i ? { ...f, checked: !f.checked } : f)) })
  const confirm = () => {
    const today = todayISO()
    const plans = picked.map((f) => newPlan(f.draft, today))
    update((s) => ({
      ...s,
      onboarded: true,
      bankName: connect.bankName,
      balanceCents: connect.balanceCents ?? s.balanceCents,
      balanceDate: today,
      plans: [...s.plans, ...plans],
    }))
    setConnect(null)
    go('/timeline')
  }

  return (
    <Screen
      title={`We found ${found.length} payment${found.length === 1 ? '' : 's'}`}
      hint="Untick any that aren’t yours."
      step={[CONNECT_STEPS, CONNECT_STEPS]}
      backTo="/connect"
      footer={
        <Button disabled={picked.length === 0} onClick={confirm}>
          {picked.length === 0 ? 'Tick at least one' : `Add ${picked.length} to my timeline`}
        </Button>
      }
    >
      <ul className="grid gap-2">
        {found.map(({ draft: d, checked }, i) => (
          <li key={i} className="flex items-stretch rounded-2xl bg-mist">
            <label className="flex min-h-[88px] flex-1 cursor-pointer items-center gap-3 rounded-2xl py-3 pl-4 hover:bg-line has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-ink">
              <input type="checkbox" checked={checked} onChange={() => toggle(i)} className="peer sr-only" />
              <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-lg border-2 border-ink text-transparent peer-checked:bg-ink peer-checked:text-white">
                <Icon name="check" size={18} className="stroke-[2.5]" />
              </span>
              <span className="min-w-0">
                <span className="block text-[17px] font-semibold">
                  <span className="tabular-nums">{usd(Math.floor(d.totalCents / d.count))}</span> to {d.provider ?? d.store}
                </span>
                <span className="block text-mute">
                  {d.provider ? `${d.store} · ` : ''}
                  {d.count} payments, {everyText(d.intervalDays ?? 14)}
                </span>
                <span className="block text-mute">First one {shortDate(d.firstDate)}</span>
              </span>
            </label>
            <a
              href={`#/connect/edit/${i}`}
              aria-label={`Edit ${d.store}`}
              className="flex min-w-16 items-center justify-center rounded-2xl px-3 font-semibold underline underline-offset-4 hover:bg-line"
            >
              Edit
            </a>
          </li>
        ))}
      </ul>
    </Screen>
  )
}
