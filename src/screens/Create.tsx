import { useEffect } from 'react'
import { Button } from '../components/Button'
import { HeroSprite } from '../components/HeroSprite'
import { Screen } from '../components/Screen'
import { ACCESSORY_LABELS, FURS, SHIRTS, SPECIES } from '../lib/sprite'
import { go } from '../state/router'
import { useStore } from '../state/store'
import type { Accessory, Hero, Species } from '../types'

const STEPS = 5
const TITLES = ['Pick your animal', 'Pick a fur colour', 'Pick a shirt', 'Add something extra?', 'What’s their name?']
const COLOR_NAMES: Record<string, string> = {
  '#f2c28b': 'Tan', '#e39a52': 'Orange', '#b9b9c9': 'Grey', '#f7ead0': 'Cream', '#8fce6b': 'Green', '#a9795b': 'Brown', '#f4a6b8': 'Pink', '#8cc7e8': 'Blue',
  '#e85d5d': 'Red', '#4f8fe6': 'Blue', '#3fa34d': 'Green', '#f5c542': 'Yellow', '#9b6fd6': 'Purple', '#f5f1e6': 'White',
}

const tile = (on: boolean) => `px px-press flex min-h-[88px] flex-col items-center justify-center gap-1 p-2 ${on ? 'bg-sun' : 'bg-card hover:bg-sand'}`

/** Character creator: one choice per screen, with the character always in view. */
export function Create({ step }: { step: number }) {
  const { state, update } = useStore()
  const d = state.draft
  const valid = step >= 1 && step <= STEPS
  useEffect(() => {
    if (!valid) go('/create/1', { replace: true })
  }, [valid])
  if (!valid) return null

  const set = (patch: Partial<Hero>) => update((s) => ({ ...s, draft: { ...s.draft, ...patch } }))
  const name = d.name.trim()
  const last = step === STEPS
  const next = () => {
    if (!last) return go(`/create/${step + 1}`)
    update((s) => ({ ...s, hero: { ...s.draft, name } }))
    go('/survey/1')
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!last || name) next()
      }}
    >
      <Screen
        title={TITLES[step - 1]}
        step={[step, STEPS]}
        backTo={step === 1 ? '/welcome' : `/create/${step - 1}`}
        above={
          <div className="px mb-5 flex justify-center bg-sky pt-4">
            <HeroSprite hero={d} px={7} mood="happy" />
          </div>
        }
        footer={
          <Button type="submit" disabled={last && !name}>
            {last ? (name ? `Meet ${name}` : 'Type a name') : 'Next'}
          </Button>
        }
      >
        {step === 1 && (
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(SPECIES) as Species[]).map((sp) => (
              <button key={sp} type="button" aria-pressed={d.species === sp} onClick={() => set({ species: sp })} className={tile(d.species === sp)}>
                <HeroSprite hero={{ ...d, species: sp, accessory: 'none' }} px={3} />
                {SPECIES[sp].label}
              </button>
            ))}
          </div>
        )}
        {(step === 2 || step === 3) && (
          <div className="grid grid-cols-4 gap-3">
            {(step === 2 ? FURS : SHIRTS).map((c) => {
              const on = (step === 2 ? d.fur : d.shirt) === c
              return (
                <button key={c} type="button" aria-pressed={on} aria-label={COLOR_NAMES[c]} onClick={() => set(step === 2 ? { fur: c } : { shirt: c })} className={tile(on)}>
                  <span className="px-in block size-10" style={{ background: c }} />
                </button>
              )
            })}
          </div>
        )}
        {step === 4 && (
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(ACCESSORY_LABELS) as Accessory[]).map((a) => (
              <button key={a} type="button" aria-pressed={d.accessory === a} onClick={() => set({ accessory: a })} className={tile(d.accessory === a)}>
                {ACCESSORY_LABELS[a]}
              </button>
            ))}
          </div>
        )}
        {step === 5 && (
          <input
            id="hero-name"
            autoFocus
            aria-label="Character name"
            value={d.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="Name"
            maxLength={12}
            autoComplete="off"
            className="px-in h-16 w-full bg-card px-4 text-[32px] placeholder:text-mute"
          />
        )}
      </Screen>
    </form>
  )
}
