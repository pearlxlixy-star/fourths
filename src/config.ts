/** Rename the app here. Nothing else hard-codes the name. */
export const APP_NAME = 'Fourths'

/** true = fake bank (offline). false = the real provider in src/data/bank.ts. */
export const USE_MOCK_BANK = true

/** Start with the sample plans, balance and goal so every state shows on first load. */
export const SEED_DEMO_DATA = true

/** Only warn about payments this many days ahead (we don't know when payday is). */
export const RISK_WINDOW_DAYS = 7

export const STORAGE_KEY = 'paylater-calendar:v1'

/** "Reset demo data" shows in `npm run dev`, or on a hosted build with ?dev in the URL. */
export const SHOW_DEV_TOOLS =
  import.meta.env.DEV || new URLSearchParams(window.location.search).has('dev')
