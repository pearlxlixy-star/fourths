import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { freshState } from '../lib/game'
import { clearState, loadState, saveState } from '../lib/storage'
import type { GameState } from '../types'
import { go } from './router'

interface Store {
  state: GameState
  update: (fn: (s: GameState) => GameState) => void
  /** Wipe everything and go back to the title screen. */
  reset: () => void
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => loadState() ?? freshState())
  useEffect(() => saveState(state), [state])

  const update = useCallback((fn: (s: GameState) => GameState) => setState(fn), [])
  const reset = useCallback(() => {
    clearState()
    setState(freshState())
    go('/welcome')
  }, [])

  const value = useMemo(() => ({ state, update, reset }), [state, update, reset])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore must be used inside StoreProvider')
  return s
}
