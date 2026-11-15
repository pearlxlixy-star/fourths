/** Exactly three tabs. Used by the bottom bar and the sidebar. */
export const TABS = [
  { path: '/home', label: 'Home', icon: 'home' },
  { path: '/story', label: 'Story', icon: 'story' },
  { path: '/habits', label: 'Habits', icon: 'habits' },
] as const

export const isActive = (tab: string, path: string) => path === tab || path.startsWith(tab + '/')
