import { useEffect } from 'react'
import { Dialog } from '../components/Dialog'
import { Screen } from '../components/Screen'
import { QUESTIONS } from '../data/survey'
import { finishSurvey } from '../lib/game'
import { go } from '../state/router'
import { useStore } from '../state/store'

/** Four quick questions about the player. Tapping an answer moves on. */
export function Survey({ step }: { step: number }) {
  const { state, update } = useStore()
  const q = QUESTIONS[step - 1]
  const hero = state.hero
  const ok = !!q && !!hero
  useEffect(() => {
    if (!hero) go('/welcome', { replace: true })
    else if (!q) go('/survey/1', { replace: true })
  }, [hero, q])
  if (!ok || !hero) return null

  const answer = (value: string) => {
    const answers = { ...state.answers, [q.id]: value }
    if (step < QUESTIONS.length) {
      update((s) => ({ ...s, answers }))
      go(`/survey/${step + 1}`)
    } else {
      update((s) => finishSurvey(s, answers))
      go('/home')
    }
  }

  return (
    <Screen
      title={q.text}
      step={[step, QUESTIONS.length]}
      stepLabel="Question"
      backTo={step === 1 ? '/create/5' : `/survey/${step - 1}`}
      above={
        <div className="mb-5">
          <Dialog hero={hero} mood="happy">
            {step === 1 ? `Hi! I’m ${hero.name}. Tell me about you, so I can live it.` : 'Got it. Next one.'}
          </Dialog>
        </div>
      }
    >
      <div className="grid gap-3">
        {q.options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={state.answers[q.id] === o.value}
            onClick={() => answer(o.value)}
            className={`px px-press flex min-h-16 items-center justify-between gap-3 px-4 py-2 text-left text-[26px] leading-tight ${state.answers[q.id] === o.value ? 'bg-sun' : 'bg-card hover:bg-sand'}`}
          >
            {o.label}
            {o.hint && <span className="font-pixel text-[12px] text-mute">{o.hint}</span>}
          </button>
        ))}
      </div>
    </Screen>
  )
}
