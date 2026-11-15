import type { Habit } from '../types'

/** Small daily actions that move the character toward the goal. */
export const DEFAULT_HABITS: Habit[] = [
  { id: 'balance', label: 'Check my balance', fx: { calm: 2 } },
  { id: 'aside', label: 'Put $5 toward my goal', fx: { saved: 5 } },
  { id: 'week', label: 'Look at this week’s payments', fx: { calm: 2 } },
  { id: 'nospend', label: 'No-spend day', fx: { wallet: 10 } },
  { id: 'cook', label: 'Cook instead of ordering', fx: { wallet: 8, joy: 1 } },
]

export const HABIT_XP = 10
