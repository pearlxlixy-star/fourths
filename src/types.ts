/** A calendar day as 'YYYY-MM-DD' in the user's local time. */
export type ISODate = string

export interface Plan {
  id: string
  store: string
  /** Klarna, Affirm… Unknown for plans typed in by hand. */
  provider?: string
  totalCents: number
  count: number
  /** 14 = every 2 weeks, 30 = every month. */
  intervalDays: number
  firstDate: ISODate
  /** Payments are paid in order, so a count is enough. */
  paidCount: number
  /** Payment index -> new date, when the user got a date moved. */
  moved?: Record<number, ISODate>
  finishedOn?: ISODate
  /** The user already answered the "keep paying yourself?" question. */
  askedToSave?: boolean
}

/** What the add-plan questions and the bank scan both produce. */
export interface PlanDraft {
  store: string
  provider?: string
  totalCents: number
  count: number
  firstDate: ISODate
  intervalDays?: number
  paidCount?: number
}

/** One installment, derived from a Plan. Never stored. */
export interface Payment {
  plan: Plan
  index: number
  cents: number
  date: ISODate
  paid: boolean
}

export interface Goal {
  name: string
  targetCents: number
  savedCents: number
  /** How much the user has said they'll put in every 2 weeks. */
  perTwoWeeksCents: number
  /** The day the user needs the money by. Optional. */
  needBy?: ISODate
}

export interface AppState {
  version: 1
  onboarded: boolean
  balanceCents: number
  balanceDate: ISODate
  bankName?: string
  plans: Plan[]
  goal: Goal | null
}
