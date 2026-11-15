/**
 * The ONLY file that knows where bank data comes from.
 *
 * Screens call `bank.listBanks()`, `bank.connect()` and `bank.scan()` and nothing
 * else. To go live with Plaid: fill in `plaidProvider` below and set
 * USE_MOCK_BANK = false in src/config.ts. No screen needs to change.
 */
import { USE_MOCK_BANK } from '../config'
import { addDays } from '../lib/dates'
import type { ISODate, PlanDraft } from '../types'

export interface BankInstitution {
  id: string
  name: string
}

export interface BankScan {
  /** Checking balance right now, in cents. */
  balanceCents: number
  /** Pay-later plans spotted in recent transactions. */
  detected: PlanDraft[]
}

export interface BankProvider {
  listBanks(): Promise<BankInstitution[]>
  /** Resolves once the user is logged in to the bank. */
  connect(bankId: string): Promise<void>
  scan(bankId: string, today: ISODate): Promise<BankScan>
}

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

// Made-up banks on purpose: a fake login should never look like a real bank's.
const MOCK_BANKS: BankInstitution[] = [
  { id: 'northwind', name: 'Northwind Bank' },
  { id: 'harbor', name: 'Harbor Credit Union' },
  { id: 'meridian', name: 'First Meridian' },
  { id: 'bluebird', name: 'Bluebird Bank' },
  { id: 'summit', name: 'Summit Federal' },
  { id: 'cedar', name: 'Cedar & Pine Savings' },
]

const mockProvider: BankProvider = {
  async listBanks() {
    return MOCK_BANKS
  },
  async connect() {
    await wait(900)
  },
  async scan(_bankId, today) {
    await wait(1500)
    return {
      balanceCents: 71_00,
      detected: [
        { store: 'Target', provider: 'Zip', totalCents: 120_00, count: 4, intervalDays: 14, firstDate: addDays(today, -14), paidCount: 2 },
        { store: 'Etsy', provider: 'PayPal Pay in 4', totalCents: 88_00, count: 4, intervalDays: 14, firstDate: addDays(today, -22), paidCount: 2 },
        { store: 'ASOS', provider: 'Klarna', totalCents: 64_00, count: 4, intervalDays: 14, firstDate: addDays(today, 11), paidCount: 0 },
      ],
    }
  },
}

/**
 * Real Plaid goes here later. Rough shape:
 *  - listBanks: not needed, Plaid Link shows its own list (return []).
 *  - connect:   open Plaid Link with a link_token from your server, then send
 *               the public_token back to your server to exchange.
 *  - scan:      ask your server for /accounts/balance/get and
 *               /transactions/recurring/get, keep the pay-later merchants and
 *               map each stream to a PlanDraft.
 */
const plaidProvider: BankProvider = {
  async listBanks() {
    throw new Error('Plaid is not wired up yet. Set USE_MOCK_BANK = true.')
  },
  async connect() {
    throw new Error('Plaid is not wired up yet. Set USE_MOCK_BANK = true.')
  },
  async scan() {
    throw new Error('Plaid is not wired up yet. Set USE_MOCK_BANK = true.')
  },
}

export const bank: BankProvider = USE_MOCK_BANK ? mockProvider : plaidProvider
