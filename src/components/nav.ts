import type { IconName } from './Icon'

/** Exactly three tabs. Used by the bottom bar and the sidebar. */
export const TABS: { path: string; label: string; icon: IconName }[] = [
  { path: '/timeline', label: 'Timeline', icon: 'calendar' },
  { path: '/goal', label: 'Goal', icon: 'target' },
  { path: '/plans', label: 'Plans', icon: 'cards' },
]

export const isActive = (tab: string, path: string) => path === tab || path.startsWith(tab + '/')
