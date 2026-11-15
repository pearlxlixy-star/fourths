import type { Fx } from '../types'

export interface Question {
  id: 'goal' | 'style' | 'plans' | 'trigger'
  text: string
  options: { value: string; label: string; hint?: string }[]
}

/** Four taps. Each answer shapes where the story starts. */
export const QUESTIONS: Question[] = [
  {
    id: 'goal',
    text: 'What do you want most right now?',
    options: [
      { value: 'trip', label: 'A trip', hint: '$600' },
      { value: 'cushion', label: 'A safety cushion', hint: '$500' },
      { value: 'tech', label: 'New tech', hint: '$800' },
      { value: 'place', label: 'My own place', hint: '$1,000' },
    ],
  },
  {
    id: 'style',
    text: 'Money just landed. What happens first?',
    options: [
      { value: 'spend', label: 'I get something for me' },
      { value: 'save', label: 'I move some to savings' },
      { value: 'owe', label: 'I pay what I owe' },
    ],
  },
  {
    id: 'plans',
    text: 'How many pay-later plans do you have?',
    options: [
      { value: 'none', label: 'None' },
      { value: 'some', label: '1 or 2' },
      { value: 'many', label: '3 or more' },
    ],
  },
  {
    id: 'trigger',
    text: 'What trips you up most?',
    options: [
      { value: 'sales', label: 'Sales and drops' },
      { value: 'friends', label: 'Plans with friends' },
      { value: 'dates', label: 'Forgetting payment dates' },
    ],
  },
]

export const GOALS: Record<string, { name: string; target: number }> = {
  trip: { name: 'A trip', target: 600 },
  cushion: { name: 'Safety cushion', target: 500 },
  tech: { name: 'New tech', target: 800 },
  place: { name: 'My own place', target: 1000 },
}

export const BASE_STATS = { wallet: 150, saved: 50, debt: 0, calm: 60, joy: 55 }

export const STYLE_FX: Record<string, Fx> = {
  spend: { joy: 10, saved: -30 },
  save: { saved: 70, joy: -5 },
  owe: { calm: 8 },
}
export const PLANS_FX: Record<string, Fx> = {
  none: {},
  some: { debt: 90, calm: -4 },
  many: { debt: 240, calm: -14 },
}
/** Which scene opens the story. */
export const ENTRY: Record<string, string> = { sales: 'drop', friends: 'invite', dates: 'forgot' }
