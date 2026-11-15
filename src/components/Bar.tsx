/** A chunky meter. `value` out of `max`, announced to screen readers with its label. */
export function Bar({ label, text, value, max, color }: { label: string; text: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span>{label}</span>
        <span className="font-pixel text-[13px]">{text}</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="px-in mt-1 h-6 bg-sand"
      >
        <div className="h-full transition-[width] duration-200" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}
