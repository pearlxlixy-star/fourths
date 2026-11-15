import { Screen } from '../../components/Screen'
import { usd } from '../../lib/money'

interface Props {
  title: string
  step?: [number, number]
  backTo: string
  value?: number
  totalCents: number
  onSubmit: (count: number) => void
}

/** 2, 4 or 6. Tapping an answer moves on, so there is no extra button. */
export function CountQuestion({ title, step, backTo, value, totalCents, onSubmit }: Props) {
  return (
    <Screen title={title} hint={`Splitting ${usd(totalCents)}, one payment every 2 weeks.`} step={step} backTo={backTo}>
      <div className="grid gap-3">
        {[2, 4, 6].map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={value === n}
            onClick={() => onSubmit(n)}
            className={`flex h-24 items-center justify-between rounded-2xl px-6 text-left hover:bg-line ${value === n ? 'bg-mist ring-2 ring-ink' : 'bg-mist'}`}
          >
            <span className="flex items-baseline gap-2">
              <span className="text-[40px] font-bold leading-none tabular-nums">{n}</span>
              <span className="text-lg font-semibold">payments</span>
            </span>
            <span className="text-lg text-mute tabular-nums">{usd(Math.floor(totalCents / n))} each</span>
          </button>
        ))}
      </div>
    </Screen>
  )
}
