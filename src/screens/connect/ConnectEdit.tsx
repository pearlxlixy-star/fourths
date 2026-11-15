import { useEffect } from 'react'
import { ButtonLink } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { Screen } from '../../components/Screen'
import { shortDate } from '../../lib/dates'
import { usd } from '../../lib/money'
import { go } from '../../state/router'
import { useStore } from '../../state/store'
import type { PlanDraft } from '../../types'
import { STORES } from '../AddPlan'
import { AmountQuestion } from '../questions/AmountQuestion'
import { CountQuestion } from '../questions/CountQuestion'
import { DateQuestion } from '../questions/DateQuestion'
import { TextQuestion } from '../questions/TextQuestion'

/** Fix a payment the bank scan got wrong. Each row opens its one question. */
export function ConnectEdit({ index, field }: { index: number; field?: string }) {
  const { connect, setConnect } = useStore()
  const item = connect?.found?.[index]
  useEffect(() => {
    if (!item) go('/connect', { replace: true })
  }, [item])
  if (!connect?.found || !item) return null

  const d = item.draft
  const here = `/connect/edit/${index}`
  const save = (patch: Partial<PlanDraft>) => {
    // If the dates or count change, let the app work out again how many are already paid.
    const draft = { ...d, ...patch, ...('firstDate' in patch || 'count' in patch ? { paidCount: undefined } : {}) }
    setConnect({ ...connect, found: connect.found!.map((f, j) => (j === index ? { ...f, draft } : f)) })
    go(here)
  }

  if (field === 'store')
    return <TextQuestion title="Which store was it?" backTo={here} cta="Save" initial={d.store} placeholder="Store name" suggestions={STORES} onSubmit={(store) => save({ store })} />
  if (field === 'total')
    return <AmountQuestion title={`What was the total at ${d.store}?`} backTo={here} cta="Save" initialCents={d.totalCents} onSubmit={(totalCents) => save({ totalCents })} />
  if (field === 'count')
    return <CountQuestion title="How many payments?" backTo={here} value={d.count} totalCents={d.totalCents} onSubmit={(count) => save({ count })} />
  if (field === 'date')
    return <DateQuestion title="When was the first payment?" backTo={here} initial={d.firstDate} onSubmit={(firstDate) => save({ firstDate })} />

  const rows = [
    { key: 'store', label: 'Store', value: d.store },
    { key: 'total', label: 'Total', value: usd(d.totalCents) },
    { key: 'count', label: 'Payments', value: `${d.count} × ${usd(Math.floor(d.totalCents / d.count))}` },
    { key: 'date', label: 'First payment', value: shortDate(d.firstDate) },
  ]
  return (
    <Screen title="What did we get wrong?" hint="Tap a line to change it." backTo="/connect/found" footer={<ButtonLink to="/connect/found">Looks right</ButtonLink>}>
      <ul className="divide-y divide-white rounded-2xl bg-mist">
        {rows.map((r) => (
          <li key={r.key}>
            <a href={`#${here}/${r.key}`} className="flex min-h-[72px] items-center gap-3 rounded-2xl px-4 hover:bg-line">
              <span className="flex-1">
                <span className="block text-mute">{r.label}</span>
                <span className="block text-lg font-semibold tabular-nums">{r.value}</span>
              </span>
              <Icon name="chevron" />
            </a>
          </li>
        ))}
      </ul>
    </Screen>
  )
}
