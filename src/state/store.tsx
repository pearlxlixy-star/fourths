import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { todayISO } from '../lib/dates'
import { seedState } from '../lib/seed'
import { clearState, loadState, saveState } from '../lib/storage'
import type { AppState, PlanDraft } from '../types'
import { go } from './router'

/** In-progress bank connection. Lives in memory only. */
export interface ConnectDraft {
  bankId: string
  bankName: string
  balanceCents?: number
  found?: { draft: PlanDraft; checked: boolean }[]
}

export const emptyDraft = (): PlanDraft => ({ store: '', totalCents: 0, count: 4, firstDate: todayISO() })

interface Store {
  state: AppState
  update: (fn: (s: AppState) => AppState) => void
  reset: () => void
  addDraft: PlanDraft
  setAddDraft: (d: PlanDraft) => void
  connect: ConnectDraft | null
  setConnect: (c: ConnectDraft | null) => void
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState() ?? seedState())
  const [addDraft, setAddDraft] = useState<PlanDraft>(emptyDraft)
  const [connect, setConnect] = useState<ConnectDraft | null>(null)

  useEffect(() => saveState(state), [state])

  const update = useCallback((fn: (s: AppState) => AppState) => setState(fn), [])
  const reset = useCallback(() => {
    clearState()
    setState(seedState())
    setAddDraft(emptyDraft())
    setConnect(null)
    go('/welcome')
  }, [])

  const value = useMemo(
    () => ({ state, update, reset, addDraft, setAddDraft, connect, setConnect }),
    [state, update, reset, addDraft, connect],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore must be used inside StoreProvider')
  return s
}
