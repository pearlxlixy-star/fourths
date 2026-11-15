import { Icon } from './Icon'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'back'] as const
export type PadKey = (typeof KEYS)[number]

/** Tap-to-enter number pad, so amounts never need the phone keyboard. */
export function NumberPad({ onKey }: { onKey: (k: PadKey) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {KEYS.map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onKey(k)}
          aria-label={k === 'back' ? 'Delete last digit' : k === '.' ? 'Decimal point' : k}
          className="grid h-14 place-items-center rounded-2xl bg-mist text-2xl font-semibold tabular-nums hover:bg-line active:bg-line"
        >
          {k === 'back' ? <Icon name="backspace" /> : k}
        </button>
      ))}
    </div>
  )
}
