import { SPECIES, heroColors, heroGrid } from '../lib/sprite'
import type { Hero, Mood } from '../types'
import { PixelSprite } from './PixelSprite'

/** The player's villager. Mood changes the face: squinting when happy, sweating when stretched. */
export function HeroSprite({ hero, mood = 'ok', px = 6, bob, className = '' }: { hero: Hero; mood?: Mood; px?: number; bob?: boolean; className?: string }) {
  const who = `${hero.name || 'Your character'}, a ${SPECIES[hero.species].label.toLowerCase()}`
  return (
    <PixelSprite
      grid={heroGrid(hero, mood)}
      colors={heroColors(hero)}
      px={px}
      label={mood === 'ok' ? who : `${who}, looking ${mood}`}
      className={`${bob ? 'bob' : ''} ${className}`}
    />
  )
}
