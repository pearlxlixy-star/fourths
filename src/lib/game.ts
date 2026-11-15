import { XP_PER_LEVEL } from '../config'
import { DEFAULT_HABITS, HABIT_XP } from '../data/habits'
import { STORY } from '../data/story'
import { BASE_STATS, ENTRY, GOALS, PLANS_FX, STYLE_FX } from '../data/survey'
import type { Fx, GameState, Hero, ISODate, Mood, Stats } from '../types'
import { addDays } from './dates'
import { FURS, SHIRTS } from './sprite'

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

/** Apply a change. Money never goes below $0; calm and joy stay within 0-100. */
export function applyFx(s: Stats, fx: Fx, sign = 1): Stats {
  return {
    wallet: Math.max(0, s.wallet + sign * (fx.wallet ?? 0)),
    saved: Math.max(0, s.saved + sign * (fx.saved ?? 0)),
    debt: Math.max(0, s.debt + sign * (fx.debt ?? 0)),
    calm: clamp(s.calm + sign * (fx.calm ?? 0), 0, 100),
    joy: clamp(s.joy + sign * (fx.joy ?? 0), 0, 100),
  }
}

export const newDraft = (): Hero => ({ name: '', species: 'cat', fur: FURS[0], shirt: SHIRTS[0], accessory: 'none' })

export function freshState(): GameState {
  return {
    v: 2,
    draft: newDraft(),
    hero: null,
    answers: {},
    surveyDone: false,
    goal: GOALS.trip,
    start: BASE_STATS,
    stats: BASE_STATS,
    xp: 0,
    entry: 'drop',
    nodeId: 'drop',
    outcome: null,
    path: [],
    runs: 0,
    habits: DEFAULT_HABITS,
    log: {},
  }
}

/** Turn the four survey answers into a goal, starting stats and an opening scene. */
export function finishSurvey(state: GameState, answers: Record<string, string>): GameState {
  let stats = applyFx(BASE_STATS, STYLE_FX[answers.style] ?? {})
  stats = applyFx(stats, PLANS_FX[answers.plans] ?? {})
  const entry = ENTRY[answers.trigger] ?? 'drop'
  return { ...state, answers, surveyDone: true, goal: GOALS[answers.goal] ?? GOALS.trip, start: stats, stats, entry, nodeId: entry, outcome: null, path: [] }
}

export function choose(state: GameState, index: number): GameState {
  const node = STORY[state.nodeId]
  const choice = node?.choices[index]
  if (!choice) return state
  const step = { nodeId: node.id, choice: index }
  return {
    ...state,
    stats: applyFx(state.stats, choice.fx),
    xp: state.xp + (choice.wise ? 30 : 20),
    nodeId: choice.next,
    outcome: step,
    path: [...state.path, step],
  }
}

/** Same character, same starting point, different choices. XP and habits are kept. */
export const replay = (state: GameState): GameState => ({
  ...state,
  stats: state.start,
  nodeId: state.entry,
  outcome: null,
  path: [],
  runs: state.runs + 1,
})

export const isEnded = (state: GameState) => state.nodeId === 'end' && !state.outcome
export const choiceNumber = (state: GameState) => state.path.length + 1

// ---- level ------------------------------------------------------------------

const TITLES = ['Sprout', 'Saver', 'Planner', 'Pathfinder', 'Legend']
export const level = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1
export const levelTitle = (xp: number) => TITLES[Math.min(level(xp), TITLES.length) - 1]
export const levelProgress = (xp: number) => xp % XP_PER_LEVEL

// ---- what the choices did ---------------------------------------------------

export function mood(s: Stats): Mood {
  if (s.calm < 40 || s.debt > s.wallet + s.saved + 100) return 'stressed'
  if (s.calm >= 60 && s.joy >= 55) return 'happy'
  return 'ok'
}

export const moodLine = (name: string, m: Mood) =>
  m === 'happy' ? `${name} feels good about things.` : m === 'stressed' ? `${name} is feeling stretched.` : `${name} is doing okay.`

export interface Ending {
  title: string
  text: string
}

export function ending(s: Stats): Ending {
  if (s.debt > s.wallet + s.saved && s.calm < 50)
    return { title: 'The Juggler', text: 'Lots of plans in the air. Each new one made the next week a little tighter, and most of your energy goes into keeping them up.' }
  if (s.saved >= 150 && s.calm >= 60)
    return { title: 'The Builder', text: 'Small boring choices, stacked. You owe little, your goal is growing, and surprises do not knock you over.' }
  if (s.joy >= 70 && s.saved < 120)
    return { title: 'The Free Spirit', text: 'You said yes to the good stuff and had a great time. The cushion is thin, so the next surprise will land hard.' }
  return { title: 'The Balancer', text: 'Some treats, some discipline. Nothing is on fire, and a few different choices would tip you either way.' }
}

// ---- habits -----------------------------------------------------------------

export const doneOn = (state: GameState, day: ISODate) => state.log[day] ?? []

/** Tick or untick a habit for a day. Unticking takes back what the tick gave. */
export function toggleHabit(state: GameState, id: string, day: ISODate): GameState {
  const habit = state.habits.find((h) => h.id === id)
  if (!habit) return state
  const done = doneOn(state, day)
  const was = done.includes(id)
  return {
    ...state,
    log: { ...state.log, [day]: was ? done.filter((x) => x !== id) : [...done, id] },
    xp: Math.max(0, state.xp + (was ? -HABIT_XP : HABIT_XP)),
    stats: applyFx(state.stats, habit.fx, was ? -1 : 1),
  }
}

/** Days in a row with at least one habit done, counting back from today (or yesterday). */
export function streak(state: GameState, today: ISODate) {
  let day = doneOn(state, today).length ? today : addDays(today, -1)
  let n = 0
  while (doneOn(state, day).length) {
    n++
    day = addDays(day, -1)
  }
  return n
}

export const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US')

/** "+$100 saved", "-6 calm" */
export function fxChips(fx: Fx): { text: string; good: boolean }[] {
  const out: { text: string; good: boolean }[] = []
  const sign = (n: number) => (n > 0 ? '+' : '-')
  if (fx.wallet) out.push({ text: `${sign(fx.wallet)}${money(Math.abs(fx.wallet))} wallet`, good: fx.wallet > 0 })
  if (fx.saved) out.push({ text: `${sign(fx.saved)}${money(Math.abs(fx.saved))} saved`, good: fx.saved > 0 })
  if (fx.debt) out.push({ text: `${sign(fx.debt)}${money(Math.abs(fx.debt))} owed`, good: fx.debt < 0 })
  if (fx.calm) out.push({ text: `${sign(fx.calm)}${Math.abs(fx.calm)} calm`, good: fx.calm > 0 })
  if (fx.joy) out.push({ text: `${sign(fx.joy)}${Math.abs(fx.joy)} joy`, good: fx.joy > 0 })
  return out
}
