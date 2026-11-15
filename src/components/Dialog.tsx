import type { ReactNode } from 'react'
import type { Hero, Mood } from '../types'
import { HeroSprite } from './HeroSprite'

/** A game-style speech panel: the character on the left, text on the right. */
export function Dialog({ hero, mood, children }: { hero: Hero; mood?: Mood; children: ReactNode }) {
  return (
    <div className="px flex items-center gap-4 bg-card p-4">
      <HeroSprite hero={hero} mood={mood} px={4} />
      <div className="min-w-0 flex-1 text-[24px] leading-tight">{children}</div>
    </div>
  )
}
