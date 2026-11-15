import { fxChips } from '../lib/game'
import type { Fx } from '../types'

/** What a choice changed, as small tags: green for better, red for worse. */
export function Chips({ fx }: { fx: Fx }) {
  const chips = fxChips(fx)
  if (!chips.length) return <p className="text-mute">Nothing changed.</p>
  return (
    <ul className="flex flex-wrap gap-2" aria-label="What changed">
      {chips.map((c) => (
        <li key={c.text} className={`px-in px-2 py-1 font-pixel text-[11px] ${c.good ? 'bg-grass' : 'bg-[#f4a3a3]'}`}>
          {c.text}
        </li>
      ))}
    </ul>
  )
}
