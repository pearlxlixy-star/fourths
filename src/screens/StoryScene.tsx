import { Dialog } from '../components/Dialog'
import { choiceNumber, choose, mood } from '../lib/game'
import { useStore } from '../state/store'
import type { Hero, StoryNode } from '../types'

/** One moment in the story: what is happening, and two or three things to do about it. */
export function StoryScene({ hero, node }: { hero: Hero; node: StoryNode }) {
  const { state, update } = useStore()
  return (
    <>
      <p className="font-pixel text-[11px] text-mute">Choice {choiceNumber(state)}</p>
      <h1 tabIndex={-1} className="mt-2 font-pixel text-[18px] leading-[1.5]">{node.title}</h1>
      <div className="mt-4">
        <Dialog hero={hero} mood={mood(state.stats)}>{node.text}</Dialog>
      </div>
      <h2 className="mt-6 font-pixel text-[13px]">What does {hero.name} do?</h2>
      <div className="mt-3 grid gap-3">
        {node.choices.map((c, i) => (
          <button
            key={c.label}
            type="button"
            onClick={() => update((s) => choose(s, i))}
            className="px px-press min-h-16 bg-card px-4 py-3 text-left text-[26px] leading-tight hover:bg-sun"
          >
            {c.label}
          </button>
        ))}
      </div>
    </>
  )
}
