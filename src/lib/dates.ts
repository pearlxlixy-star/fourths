import type { ISODate } from '../types'

const pad = (n: number) => String(n).padStart(2, '0')

export const toISO = (d: Date): ISODate =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const parseISO = (s: ISODate) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const todayISO = () => toISO(new Date())

export const addDays = (s: ISODate, n: number) => {
  const d = parseISO(s)
  d.setDate(d.getDate() + n)
  return toISO(d)
}

export const addMonths = (s: ISODate, n: number) => {
  const d = parseISO(s)
  const day = d.getDate()
  d.setDate(1)
  d.setMonth(d.getMonth() + n)
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  d.setDate(Math.min(day, last))
  return toISO(d)
}

/** Whole days from b to a (positive when a is later). */
export const diffDays = (a: ISODate, b: ISODate) =>
  Math.round((parseISO(a).getTime() - parseISO(b).getTime()) / 864e5)

const fmt = (s: ISODate, o: Intl.DateTimeFormatOptions) => parseISO(s).toLocaleDateString('en-US', o)

export const weekday = (s: ISODate) => fmt(s, { weekday: 'long' })
/** "Thu, Nov 19" */
export const shortDate = (s: ISODate) => fmt(s, { weekday: 'short', month: 'short', day: 'numeric' })
/** "Nov 19" */
export const monthDay = (s: ISODate) => fmt(s, { month: 'short', day: 'numeric' })
/** "Nov 19, 2026" */
export const longDate = (s: ISODate) => fmt(s, { month: 'short', day: 'numeric', year: 'numeric' })
export const rangeText = (a: ISODate, b: ISODate) => `${monthDay(a)} – ${monthDay(b)}`

/** "today", "tomorrow", "Friday" (within a week), otherwise "Nov 29". */
export function dayWord(s: ISODate, today: ISODate) {
  const n = diffDays(s, today)
  if (n === 0) return 'today'
  if (n === 1) return 'tomorrow'
  if (n > 1 && n < 7) return weekday(s)
  return monthDay(s)
}

/** "in 4 days", "today", "2 days late". */
export function daysLeft(s: ISODate, today: ISODate) {
  const n = diffDays(s, today)
  if (n === 0) return 'today'
  if (n === 1) return 'tomorrow'
  if (n > 1) return `in ${n} days`
  return n === -1 ? '1 day late' : `${-n} days late`
}

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
