import { Box } from '../components/Box'
import { Button, ButtonLink } from '../components/Button'
import { HeroSprite } from '../components/HeroSprite'
import { STORY } from '../data/story'
import { ending, money, mood, replay } from '../lib/game'
import { useStore } from '../state/store'
import type { Hero } from '../types'

const arrow = (from: number, to: number) => (to > from ? 'up' : to < from ? 'down' : 'same')

/** The end of a run: who the character became, and the choices that did it. */
export function StoryEnding({ hero }: { hero: Hero }) {
  const { state, update } = useStore()
  const { start: a, stats: b } = state
  const end = ending(b)
  const rows = [
    { label: 'Saved for goal', from: money(a.saved), to: money(b.saved), dir: arrow(a.saved, b.saved), goodUp: true },
    { label: 'In wallet', from: money(a.wallet), to: money(b.wallet), dir: arrow(a.wallet, b.wallet), goodUp: true },
    { label: 'Owed', from: money(a.debt), to: money(b.debt), dir: arrow(a.debt, b.debt), goodUp: false },
    { label: 'Calm', from: `${a.calm}`, to: `${b.calm}`, dir: arrow(a.calm, b.calm), goodUp: true },
    { label: 'Joy', from: `${a.joy}`, to: `${b.joy}`, dir: arrow(a.joy, b.joy), goodUp: true },
  ]

  return (
    <>
      <p className="font-pixel text-[11px] text-mute">Three months of choices made {hero.name}</p>
      <div className="mt-3 flex items-center gap-4">
        <div className="px bg-sky px-3 pt-3">
          <HeroSprite hero={hero} mood={mood(b)} px={6} />
        </div>
        <h1 tabIndex={-1} className="font-pixel text-[20px] leading-[1.5]">{end.title}</h1>
      </div>
      <p className="mt-4 text-[24px] leading-tight">{end.text}</p>

      <Box className="mt-6">
        <h2 className="font-pixel text-[13px]">Start to finish</h2>
        <table className="mt-3 w-full">
          <tbody>
            {rows.map((r) => {
              const good = r.dir === 'same' ? null : (r.dir === 'up') === r.goodUp
              return (
                <tr key={r.label} className="border-t-2 border-sand">
                  <th scope="row" className="py-2 text-left font-normal">{r.label}</th>
                  <td className="py-2 text-right text-mute">{r.from}</td>
                  <td className="px-2 py-2 text-center" aria-label={r.dir === 'same' ? 'stayed at' : `went ${r.dir} to`}>
                    {r.dir === 'same' ? '=' : '>'}
                  </td>
                  <td className={`py-2 text-right font-pixel text-[13px] ${good === null ? '' : good ? 'text-[#2f7a26]' : 'text-[#b23a3a]'}`}>{r.to}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Box>

      <Box className="mt-4">
        <h2 className="font-pixel text-[13px]">The path you took</h2>
        <ol className="mt-3 space-y-2">
          {state.path.map((p, i) => (
            <li key={i} className="border-t-2 border-sand pt-2">
              <span className="block text-mute">{i + 1}. {STORY[p.nodeId].title}</span>
              <span className="block text-[24px] leading-tight">{STORY[p.nodeId].choices[p.choice].label}</span>
            </li>
          ))}
        </ol>
      </Box>

      <div className="mt-6 space-y-3">
        <Button onClick={() => update(replay)}>Play again, choose differently</Button>
        <ButtonLink to="/habits" variant="secondary">Build habits for the real goal</ButtonLink>
      </div>
    </>
  )
}
