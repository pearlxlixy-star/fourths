import type { ISODate } from '../types'

const pad = (n: number) => String(n).padStart(2, '0')
export const toISO = (d: Date): ISODate => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
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
/** "Sun, Nov 15" */
export const shortDate = (s: ISODate) =>
  parseISO(s).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
/** "S", "M"… */
export const dayLetter = (s: ISODate) => parseISO(s).toLocaleDateString('en-US', { weekday: 'narrow' })
/** The 7 days ending today, oldest first. */
export const lastWeek = (today: ISODate) => Array.from({ length: 7 }, (_, i) => addDays(today, i - 6))
