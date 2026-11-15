import { SEED_DEMO_DATA } from '../config'
import type { AppState, ISODate } from '../types'
import { addDays, addMonths, todayISO } from './dates'

/**
 * Demo data, dated relative to today so the demo always shows every state:
 *  - Klarna/Nike: one payment left, in 2 days  -> "plan finished" screen
 *  - Afterpay/Sephora: $45 in 4 days, checking is $12 short -> amber warning
 *  - Affirm/Best Buy: monthly, plenty left
 *  - a savings goal exactly half filled
 */
export function seedState(today: ISODate = todayISO()): AppState {
  const base: AppState = {
    version: 1,
    onboarded: false,
    balanceCents: 0,
    balanceDate: today,
    plans: [],
    goal: null,
  }
  if (!SEED_DEMO_DATA) return base
  return {
    ...base,
    balanceCents: 71_00,
    plans: [
      { id: 'seed-klarna', store: 'Nike', provider: 'Klarna', totalCents: 152_00, count: 4, intervalDays: 14, firstDate: addDays(today, 2 - 42), paidCount: 3 },
      { id: 'seed-afterpay', store: 'Sephora', provider: 'Afterpay', totalCents: 180_00, count: 4, intervalDays: 14, firstDate: addDays(today, 4 - 14), paidCount: 1 },
      { id: 'seed-affirm', store: 'Best Buy', provider: 'Affirm', totalCents: 396_00, count: 6, intervalDays: 30, firstDate: addMonths(addDays(today, 11), -2), paidCount: 2 },
    ],
    goal: { name: 'Rainy day fund', targetCents: 600_00, savedCents: 300_00, perTwoWeeksCents: 25_00, needBy: addDays(today, 196) },
  }
}
