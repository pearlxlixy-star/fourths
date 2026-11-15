import { RISK_WINDOW_DAYS } from '../config'
import type { AppState, Goal, ISODate, Payment, Plan, PlanDraft } from '../types'
import { addDays, addMonths, diffDays, monthDay, rangeText } from './dates'

// ---- plans -> payments ------------------------------------------------------

export function paymentCents(p: Plan, i: number) {
  const base = Math.floor(p.totalCents / p.count)
  return i === p.count - 1 ? p.totalCents - base * (p.count - 1) : base
}

export const paymentDate = (p: Plan, i: number): ISODate =>
  p.moved?.[i] ?? (p.intervalDays === 30 ? addMonths(p.firstDate, i) : addDays(p.firstDate, i * p.intervalDays))

export const planPayments = (p: Plan): Payment[] =>
  Array.from({ length: p.count }, (_, i) => ({
    plan: p,
    index: i,
    cents: paymentCents(p, i),
    date: paymentDate(p, i),
    paid: i < p.paidCount,
  }))

export const isDone = (p: Plan) => p.paidCount >= p.count
export const payee = (p: Plan) => p.provider || p.store
export const payKey = (x: Payment) => `${x.plan.id}:${x.index}`
export const sum = (xs: Payment[]) => xs.reduce((t, x) => t + x.cents, 0)
export const unpaid = (p: Plan) => planPayments(p).filter((x) => !x.paid)

export const everyText = (days: number) =>
  days === 30 ? 'every month' : days === 7 ? 'every week' : 'every 2 weeks'

export const upcomingPayments = (plans: Plan[]) =>
  plans
    .flatMap(unpaid)
    .sort((a, b) => a.date.localeCompare(b.date) || a.plan.store.localeCompare(b.plan.store))

export function newPlan(d: PlanDraft, today: ISODate): Plan {
  const plan: Plan = {
    id: globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2),
    store: d.store.trim(),
    provider: d.provider,
    totalCents: d.totalCents,
    count: d.count,
    intervalDays: d.intervalDays ?? 14,
    firstDate: d.firstDate,
    paidCount: 0,
  }
  // Dates already behind us count as paid, but always leave one to show.
  const behind = planPayments(plan).filter((x) => x.date < today).length
  plan.paidCount = Math.min(d.paidCount ?? behind, d.count - 1)
  return plan
}

// ---- timeline ---------------------------------------------------------------

export interface WeekGroup {
  key: number
  label: string
  range: string
  totalCents: number
  payments: Payment[]
}

/** Weeks are rolling 7-day blocks starting today, so "this week" is never empty by accident. */
export function groupByWeek(payments: Payment[], today: ISODate): WeekGroup[] {
  const groups = new Map<number, Payment[]>()
  for (const x of payments) {
    const n = diffDays(x.date, today)
    const w = n < 0 ? -1 : Math.floor(n / 7)
    groups.set(w, [...(groups.get(w) ?? []), x])
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a - b)
    .map(([w, list]) => {
      const start = addDays(today, w * 7)
      return {
        key: w,
        // Near weeks get a name plus their dates; later weeks are just their dates.
        label: w === -1 ? 'Late' : w === 0 ? 'This week' : w === 1 ? 'Next week' : rangeText(start, addDays(start, 6)),
        range: w === -1 ? `before ${monthDay(today)}` : w < 2 ? rangeText(start, addDays(start, 6)) : '',
        totalCents: sum(list),
        payments: list,
      }
    })
}

/** Everything due in the next 7 days, plus anything late. */
export const thisWeekCents = (payments: Payment[], today: ISODate) =>
  sum(payments.filter((x) => diffDays(x.date, today) < 7))

export interface Shortfall {
  payment: Payment
  shortCents: number
  /** Balance left just before this payment. */
  beforeCents: number
  atRisk: Set<string>
}

/** Walk the payments in date order, subtracting from checking. First one that goes below $0 wins. */
export function findShortfall(plans: Plan[], balanceCents: number, today: ISODate): Shortfall | null {
  let running = balanceCents
  let first: Shortfall | null = null
  const atRisk = new Set<string>()
  for (const x of upcomingPayments(plans)) {
    if (diffDays(x.date, today) >= RISK_WINDOW_DAYS) break
    const before = running
    running -= x.cents
    if (running < 0) {
      atRisk.add(payKey(x))
      first ??= { payment: x, shortCents: -running, beforeCents: Math.max(before, 0), atRisk }
    }
  }
  return first
}

// ---- state changes ----------------------------------------------------------

/** `fromChecking: false` when the user paid some other way, so the balance stays put. */
export function markNextPaid(state: AppState, planId: string, today: ISODate, fromChecking = true): AppState {
  const plan = state.plans.find((p) => p.id === planId)
  if (!plan || isDone(plan)) return state
  const cents = paymentCents(plan, plan.paidCount)
  const paidCount = plan.paidCount + 1
  const next: Plan = { ...plan, paidCount, finishedOn: paidCount >= plan.count ? today : undefined }
  return {
    ...state,
    balanceCents: fromChecking ? Math.max(0, state.balanceCents - cents) : state.balanceCents,
    balanceDate: fromChecking ? today : state.balanceDate,
    plans: state.plans.map((p) => (p.id === planId ? next : p)),
  }
}

export const patchPlan = (state: AppState, id: string, patch: Partial<Plan>): AppState => ({
  ...state,
  plans: state.plans.map((p) => (p.id === id ? { ...p, ...patch } : p)),
})

// ---- goal -------------------------------------------------------------------

export const toTwoWeeks = (cents: number, intervalDays: number) => Math.round((cents * 14) / intervalDays)

export const goalLeft = (g: Goal) => Math.max(0, g.targetCents - g.savedCents)

/** How much to put in every 2 weeks to hit the goal by its date, rounded up to a whole dollar. */
export function neededPerTwoWeeks(g: Goal, today: ISODate): number | null {
  if (!g.needBy) return null
  const days = diffDays(g.needBy, today)
  if (days <= 0) return null
  return Math.ceil((goalLeft(g) * 14) / Math.max(days, 14) / 100) * 100
}

/** The day the goal is reached if the user keeps adding at their current rate. */
export function goalFinishDate(g: Goal, today: ISODate): ISODate | null {
  const left = goalLeft(g)
  if (left <= 0 || g.perTwoWeeksCents <= 0) return null
  return addDays(today, Math.ceil(left / g.perTwoWeeksCents) * 14)
}
