import { STORY } from '../data/story'
import { useStore } from '../state/store'
import type { Hero } from '../types'
import { StoryEnding } from './StoryEnding'
import { StoryOutcome } from './StoryOutcome'
import { StoryScene } from './StoryScene'

/** Shows whichever part of the story the player is in: a scene, its outcome, or the ending. */
export function Story({ hero }: { hero: Hero }) {
  const { state } = useStore()
  if (state.outcome) return <StoryOutcome hero={hero} step={state.outcome} />
  const node = STORY[state.nodeId]
  if (!node) return <StoryEnding hero={hero} />
  return <StoryScene hero={hero} node={node} />
}
