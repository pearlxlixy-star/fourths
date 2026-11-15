import { useSyncExternalStore } from 'react'

/** Tiny hash router: works on any static host with no server rewrites. */
const read = () => window.location.hash.replace(/^#/, '') || '/'

const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

export const usePath = () => useSyncExternalStore(subscribe, read)

export function go(path: string, opts: { replace?: boolean } = {}) {
  if (opts.replace) window.location.replace('#' + path)
  else window.location.hash = path
}
