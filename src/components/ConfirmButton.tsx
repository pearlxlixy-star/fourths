import { useState } from 'react'
import { Button } from './Button'

/** A quiet button for things that can't be undone: the first tap asks, the second tap does it. */
export function ConfirmButton({ label, confirmLabel, onConfirm }: { label: string; confirmLabel: string; onConfirm: () => void }) {
  const [asking, setAsking] = useState(false)
  return (
    <Button
      variant={asking ? 'secondary' : 'ghost'}
      aria-live="polite"
      onClick={() => (asking ? (setAsking(false), onConfirm()) : setAsking(true))}
      onBlur={() => setAsking(false)}
    >
      {asking ? confirmLabel : label}
    </Button>
  )
}
