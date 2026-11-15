import type { Accessory, Hero, Mood, Species } from '../types'

/**
 * Original pixel villagers. Every character is a 16x20 grid of letters:
 *   . empty   o outline   f fur   d dark fur   l light fur   c pink
 *   e eye     n nose      w white s shirt      u sweat       k bow   h cap
 * A species is the shared body plus its own ears (rows 0-4) and a few face rows.
 */
export const W = 16
export const H = 20

const BODY: Record<number, string> = {
  5: '.offffffffffffo.',
  6: '.offffffffffffo.',
  7: '.offffffffffffo.',
  8: '.offeffffffeffo.',
  9: '.offeffffffeffo.',
  10: '.ofcfflnnlffcfo.',
  11: '.offffllllffffo.',
  12: '..offffffffffo..',
  13: '...oooooooooo...',
  14: '....osssssso....',
  15: '...ofssssssfo...',
  16: '...ofssssssfo...',
  17: '....osssssso....',
  18: '....offooffo....',
  19: '....ooo..ooo....',
}

interface SpeciesDef {
  label: string
  ears: [string, string, string, string, string]
  rows?: Record<number, string>
  /** Eyes live somewhere other than rows 8-9. */
  ownEyes?: boolean
}

export const SPECIES: Record<Species, SpeciesDef> = {
  cat: {
    label: 'Cat',
    ears: ['..o..........o..', '.ofo........ofo.', '.offo......offo.', '.offfoooooofffo.', '.offffffffffffo.'],
  },
  bunny: {
    label: 'Bunny',
    ears: ['...oo......oo...', '..ofco....ocfo..', '..ofco....ocfo..', '..offooooooffo..', '.offffffffffffo.'],
  },
  bear: {
    label: 'Bear',
    ears: ['................', '.ooo........ooo.', 'ofcfo......ofcfo', 'offfoooooooofffo', '.offffffffffffo.'],
  },
  frog: {
    label: 'Frog',
    ears: ['................', '..ooo......ooo..', '.owwwo....owwwo.', '.owewoooooowewo.', '.offffffffffffo.'],
    ownEyes: true,
    rows: { 8: '.offffffffffffo.', 9: '.offffffffffffo.', 10: '.ofcffffffffcfo.', 11: '.offfoooooofffo.' },
  },
  fox: {
    label: 'Fox',
    ears: ['..o..........o..', '.ofo........ofo.', '.offo......offo.', '.offfoooooofffo.', '.offffffffffffo.'],
    rows: { 10: '.olllflnnlflllo.', 11: '.ollllllllllllo.', 12: '..ollllllllllo..' },
  },
  dog: {
    label: 'Dog',
    ears: ['................', '................', '................', '..oooooooooooo..', '.odffffffffffdo.'],
    rows: { 5: '.oddffffffffddo.', 6: '.oddffffffffddo.', 7: '.odffffffffffdo.' },
  },
}

type Px = [row: number, col: number, code: string]
const span = (row: number, from: number, to: number, code: string): Px[] =>
  Array.from({ length: to - from + 1 }, (_, i) => [row, from + i, code] as Px)

const ACCESSORIES: Record<Accessory, Px[]> = {
  none: [],
  glasses: [
    ...span(7, 3, 5, 'o'), ...span(7, 10, 12, 'o'), ...span(8, 6, 9, 'o'),
    [8, 3, 'o'], [8, 5, 'o'], [9, 3, 'o'], [9, 5, 'o'], [8, 10, 'o'], [8, 12, 'o'], [9, 10, 'o'], [9, 12, 'o'],
  ],
  bow: [...span(3, 9, 10, 'k'), ...span(3, 12, 13, 'k'), ...span(4, 9, 13, 'k'), [4, 11, 'o'], ...span(5, 9, 10, 'k'), ...span(5, 12, 13, 'k')],
  cap: [...span(2, 4, 11, 'o'), [3, 3, 'o'], ...span(3, 4, 11, 'h'), [3, 12, 'o'], [4, 2, 'o'], ...span(4, 3, 12, 'h'), [4, 13, 'o'], ...span(5, 2, 15, 'o')],
}

export const ACCESSORY_LABELS: Record<Accessory, string> = { none: 'Nothing', glasses: 'Glasses', bow: 'Bow', cap: 'Cap' }

export const FURS = ['#f2c28b', '#e39a52', '#b9b9c9', '#f7ead0', '#8fce6b', '#a9795b', '#f4a6b8', '#8cc7e8']
export const SHIRTS = ['#e85d5d', '#4f8fe6', '#3fa34d', '#f5c542', '#9b6fd6', '#f5f1e6']

/** The character as a grid of letter codes, with mood and accessory applied. */
export function heroGrid(hero: Hero, mood: Mood = 'ok'): string[][] {
  const def = SPECIES[hero.species]
  const rows: string[] = []
  for (let r = 0; r < H; r++) rows.push(r < 5 ? def.ears[r] : (def.rows?.[r] ?? BODY[r]))
  const grid = rows.map((r) => r.padEnd(W, '.').slice(0, W).split(''))
  const put = ([r, c, code]: Px) => {
    if (grid[r]?.[c] !== undefined) grid[r][c] = code
  }
  // Happy: eyes squint into little arcs. Stressed: a sweat drop on the brow.
  if (mood === 'happy' && !def.ownEyes) {
    ;[4, 11].forEach((c) => put([9, c, 'f']))
    ;[3, 5, 10, 12].forEach((c) => put([9, c, 'e']))
  }
  if (mood === 'stressed') {
    put([6, 13, 'u'])
    put([7, 13, 'u'])
  }
  ACCESSORIES[hero.accessory].forEach(put)
  return grid
}

/** Darken a #rrggbb colour by a factor (0-1). */
export function shade(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16)
  const ch = (s: number) => Math.round(((n >> s) & 255) * k).toString(16).padStart(2, '0')
  return `#${ch(16)}${ch(8)}${ch(0)}`
}

export const heroColors = (hero: Hero): Record<string, string> => ({
  o: '#3b2a1e',
  f: hero.fur,
  d: shade(hero.fur, 0.72),
  l: '#fff6e0',
  c: '#f29bb0',
  e: '#3b2a1e',
  n: '#3b2a1e',
  w: '#ffffff',
  s: hero.shirt,
  u: '#5aa9e6',
  k: '#e85d5d',
  h: '#4f8fe6',
})

// ---- small scenery sprites --------------------------------------------------

export const HOMES: { minLevel: number; label: string; grid: string[] }[] = [
  {
    minLevel: 1,
    label: 'a tent',
    grid: ['......oo......', '.....oyyo.....', '....oyyyyo....', '...oyyddyyo...', '..oyyyddyyyo..', '.oyyyyddyyyyo.', 'oooooooooooooo'],
  },
  {
    minLevel: 2,
    label: 'a cabin',
    grid: ['......rr......', '....rrrrrr....', '..rrrrrrrrrr..', 'rrrrrrrrrrrrrr', '.obbbbbbbbbbo.', '.obwwbbbbddbo.', '.obwwbbbbddbo.', '.obbbbbbbddbo.', '.oooooooooooo.'],
  },
  {
    minLevel: 4,
    label: 'a house',
    grid: ['..........oo..', '......rr..oo..', '....rrrrrroo..', '..rrrrrrrrrr..', 'rrrrrrrrrrrrrr', 'occcccccccccco', 'ocwwccddccwwco', 'ocwwccddccwwco', 'occcccddccccco', 'oooooooooooooo'],
  },
]
export const HOME_COLORS: Record<string, string> = { o: '#3b2a1e', y: '#f5c542', d: '#6b4a32', r: '#e86a6a', b: '#b98a5e', w: '#bfe6f5', c: '#fff6e0' }

export const TREE = ['...gggg...', '..gggggg..', '.gggggggg.', '.gggggggg.', '..gggggg..', '....tt....', '....tt....', '....tt....']
export const TREE_COLORS: Record<string, string> = { g: '#4f9d3a', t: '#8a5a3c' }

export const ICONS: Record<string, string[]> = {
  home: ['...oo...', '..oooo..', '.oooooo.', 'oooooooo', '.oooooo.', '.oo..oo.', '.oo..oo.', '........'],
  story: ['...oo...', '...oo...', 'oooooooo', '.oooooo.', '..oooo..', '.oooooo.', '.oo..oo.', 'o......o'],
  habits: ['........', '.......o', '......oo', 'o....oo.', 'oo..oo..', '.oooo...', '..oo....', '........'],
}
