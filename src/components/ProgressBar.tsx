/** Green fill on a grey track. `label` is read out by screen readers. */
export function ProgressBar({ value, max, label, tall }: { value: number; max: number; label: string; tall?: boolean }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className={`w-full overflow-hidden rounded-full bg-line ${tall ? 'h-6' : 'h-2'}`}
    >
      <div className="h-full rounded-full bg-green transition-[width] duration-200" style={{ width: `${pct}%` }} />
    </div>
  )
}
