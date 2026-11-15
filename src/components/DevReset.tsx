import { SHOW_DEV_TOOLS } from '../config'
import { useStore } from '../state/store'

/** Dev only: wipe localStorage and reload the sample data. */
export function DevReset({ className = '' }: { className?: string }) {
  const { reset } = useStore()
  if (!SHOW_DEV_TOOLS) return null
  return (
    <button
      type="button"
      onClick={reset}
      className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-mute underline underline-offset-4 hover:bg-mist ${className}`}
    >
      <span className="rounded bg-ink px-1.5 py-0.5 text-sm font-semibold text-white no-underline">DEV</span>
      Reset demo data
    </button>
  )
}
