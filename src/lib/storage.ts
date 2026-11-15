import { STORAGE_KEY } from '../config'
import type { AppState } from '../types'

/** localStorage can throw (private mode, blocked, full). The app must still run. */
export function loadState(): AppState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AppState
    return parsed && parsed.version === 1 && Array.isArray(parsed.plans) ? parsed : null
  } catch {
    return null
  }
}

export function saveState(state: AppState) {
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
