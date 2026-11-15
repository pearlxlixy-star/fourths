import { useCallback, useEffect, useState } from 'react'
import { Button } from '../../components/Button'
import { NumberPad, type PadKey } from '../../components/NumberPad'
import { Screen } from '../../components/Screen'

interface Props {
  title: string
  hint?: string
  step?: [number, number]
  backTo: string
  cta?: string
  initialCents?: number
  allowZero?: boolean
  onSubmit: (cents: number) => void
}

const toText = (cents: number) => (cents % 100 === 0 ? String(cents / 100) : (cents / 100).toFixed(2))

function apply(text: string, k: PadKey) {
  if (k === 'back') return text.slice(0, -1)
  if (k === '.') return text.includes('.') ? text : (text || '0') + '.'
  const [whole, cents] = text.split('.')
  if (cents !== undefined) return cents.length >= 2 ? text : text + k
  if (whole.length >= 6) return text
  return text === '0' ? k : text + k
}

/** One question answered with a dollar amount, entered on a tap pad. */
export function AmountQuestion({ title, hint, step, backTo, cta = 'Continue', initialCents = 0, allowZero, onSubmit }: Props) {
  const [text, setText] = useState(initialCents ? toText(initialCents) : '')
  const cents = Math.round(parseFloat(text || '0') * 100)
  const ok = allowZero ? text !== '' : cents > 0
  const press = useCallback((k: PadKey) => setText((t) => apply(t, k)), [])

  // A real keyboard works too: digits, ".", Backspace, Enter.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (/^[0-9.]$/.test(e.key)) press(e.key as PadKey)
      else if (e.key === 'Backspace') press('back')
      else if (e.key === 'Enter' && ok && !(e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement)) onSubmit(cents)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [press, ok, cents, onSubmit])

  return (
    <Screen
      title={title}
      hint={hint}
      step={step}
      backTo={backTo}
      footer={<Button disabled={!ok} onClick={() => onSubmit(cents)}>{cta}</Button>}
    >
      <p aria-live="polite" className={`flex flex-1 items-center justify-center py-4 text-[64px] font-bold leading-none tracking-tight tabular-nums ${text ? '' : 'text-mute'}`}>
        ${text || '0'}
      </p>
      <NumberPad onKey={press} />
    </Screen>
  )
}
