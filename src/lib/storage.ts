import { STORAGE_KEY } from '../config'
import type { GameState } from '../types'

/** localStorage can throw (private mode, blocked, full). The game must still run. */
export function loadState(): GameState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as GameState
    return s && s.v === 2 && s.stats && Array.isArray(s.habits) ? s : null
  } catch {
    return null
  }
}

export function saveState(state: GameState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* keep going in memory */
  }
}

export function clearState() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* nothing to clear */
  }
}
