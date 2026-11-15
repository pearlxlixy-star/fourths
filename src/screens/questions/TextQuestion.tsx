import { useState } from 'react'
import { Button } from '../../components/Button'
import { Screen } from '../../components/Screen'

interface Props {
  title: string
  hint?: string
  step?: [number, number]
  backTo: string
  cta?: string
  initial: string
  placeholder: string
  /** One-tap answers, so most people never open the keyboard. */
  suggestions: string[]
  onSubmit: (value: string) => void
}

/** One question answered with a short piece of text. */
export function TextQuestion({ title, hint, step, backTo, cta = 'Continue', initial, placeholder, suggestions, onSubmit }: Props) {
  const [value, setValue] = useState(initial)
  const ok = value.trim().length > 0
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (ok) onSubmit(value.trim())
      }}
    >
      <Screen title={title} hint={hint} step={step} backTo={backTo} footer={<Button type="submit" disabled={!ok}>{cta}</Button>}>
        <input
          autoFocus
          aria-label={title}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          maxLength={40}
          autoComplete="off"
          className="h-16 w-full rounded-2xl bg-mist px-4 text-2xl font-semibold placeholder:font-normal placeholder:text-mute"
        />
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Quick picks">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => onSubmit(s)}
                className="h-11 rounded-full bg-mist px-4 font-medium hover:bg-line"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      </Screen>
    </form>
  )
}
