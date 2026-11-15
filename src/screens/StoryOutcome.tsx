import { Button } from '../components/Button'
import { Chips } from '../components/Chips'
import { Dialog } from '../components/Dialog'
import { STORY } from '../data/story'
import { mood } from '../lib/game'
import { useStore } from '../state/store'
import type { Hero, Step } from '../types'

/** Right after a choice: what happened, and what it did to the character. */
export function StoryOutcome({ hero, step }: { hero: Hero; step: Step }) {
  const { state, update } = useStore()
  const choice = STORY[step.nodeId].choices[step.choice]
  return (
    <>
      <p className="font-pixel text-[11px] text-mute">You chose</p>
      <h1 tabIndex={-1} className="mt-2 font-pixel text-[18px] leading-[1.5]">{choice.label}</h1>
      <div className="mt-4">
        <Dialog hero={hero} mood={mood(state.stats)}>{choice.result}</Dialog>
      </div>
      <h2 className="mt-6 font-pixel text-[13px]">What it did to {hero.name}</h2>
      <div className="mt-3">
        <Chips fx={choice.fx} />
      </div>
      <p className="mt-3 text-mute">+{choice.wise ? 30 : 20} XP{choice.wise ? ' (future-you says thanks)' : ''}</p>
      <Button className="mt-6" onClick={() => update((s) => ({ ...s, outcome: null }))}>
        {state.nodeId === 'end' ? 'See who you became' : 'Keep going'}
      </Button>
    </>
  )
}
