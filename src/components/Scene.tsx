import { HOMES, HOME_COLORS, TREE, TREE_COLORS } from '../lib/sprite'
import type { Hero, Mood } from '../types'
import { HeroSprite } from './HeroSprite'
import { PixelSprite } from './PixelSprite'

/** The character's little plot of land. The home grows with the level. */
export function Scene({ hero, mood, level }: { hero: Hero; mood: Mood; level: number }) {
  const home = [...HOMES].reverse().find((h) => level >= h.minLevel) ?? HOMES[0]
  return (
    <div className="px relative h-56 overflow-hidden bg-sky" role="img" aria-label={`${hero.name} standing outside ${home.label}, looking ${mood === 'ok' ? 'okay' : mood}`}>
      <span aria-hidden="true" className="absolute left-6 top-5 h-3 w-14 bg-white" />
      <span aria-hidden="true" className="absolute left-10 top-2 h-3 w-8 bg-white" />
      <span aria-hidden="true" className="absolute right-10 top-8 h-3 w-12 bg-white" />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-16 border-t-4 border-ink bg-grass" />
      <PixelSprite grid={home.grid} colors={HOME_COLORS} px={7} className="absolute bottom-12 left-4" />
      <PixelSprite grid={TREE} colors={TREE_COLORS} px={7} className="absolute bottom-12 right-4" />
      <div className="absolute inset-x-0 bottom-6 flex justify-center">
        <HeroSprite hero={hero} mood={mood} px={6} bob />
      </div>
    </div>
  )
}
