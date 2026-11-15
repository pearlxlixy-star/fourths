export type ISODate = string

export type Species = 'cat' | 'bunny' | 'bear' | 'frog' | 'fox' | 'dog'
export type Accessory = 'none' | 'glasses' | 'bow' | 'cap'
export type Mood = 'happy' | 'ok' | 'stressed'

export interface Hero {
  name: string
  species: Species
  fur: string
  shirt: string
  accessory: Accessory
}

/** What choices change. Money in dollars; calm and joy run 0-100. */
export interface Stats {
  wallet: number
  saved: number
  debt: number
  calm: number
  joy: number
}
export type Fx = Partial<Stats>

export interface Choice {
  label: string
  /** What happened because of it. */
  result: string
  fx: Fx
  /** Id of the next story node, or 'end'. */
  next: string
  /** A choice that protects future-you earns bonus XP. */
  wise?: boolean
}

export interface StoryNode {
  id: string
  title: string
  text: string
  choices: Choice[]
}

export interface Step {
  nodeId: string
  choice: number
}

export interface Habit {
  id: string
  label: string
  fx: Fx
  custom?: boolean
}

export interface GameState {
  v: 2
  /** Character being built; becomes `hero` on the last step. */
  draft: Hero
  hero: Hero | null
  answers: Record<string, string>
  surveyDone: boolean
  goal: { name: string; target: number }
  /** Stats right after the survey, to compare with at the end. */
  start: Stats
  stats: Stats
  xp: number
  entry: string
  nodeId: string
  /** The choice just made, waiting to be shown as an outcome. */
  outcome: Step | null
  path: Step[]
  runs: number
  habits: Habit[]
  /** Day -> ids of habits done that day. */
  log: Record<ISODate, string[]>
}
