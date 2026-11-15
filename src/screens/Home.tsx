import { Bar } from '../components/Bar'
import { Box } from '../components/Box'
import { ButtonLink } from '../components/Button'
import { ConfirmButton } from '../components/ConfirmButton'
import { Scene } from '../components/Scene'
import { XP_PER_LEVEL } from '../config'
import { shortDate, todayISO } from '../lib/dates'
import { choiceNumber, doneOn, isEnded, level, levelProgress, levelTitle, money, mood, moodLine } from '../lib/game'
import { useStore } from '../state/store'
import type { Hero } from '../types'

/** The character, how they are doing, and the one next thing to do. */
export function Home({ hero }: { hero: Hero }) {
  const { state, reset } = useStore()
  const s = state.stats
  const m = mood(s)
  const lvl = level(state.xp)
  const today = todayISO()
  const done = doneOn(state, today).length
  const ended = isEnded(state)

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start lg:gap-10">
      <div>
        <div className="flex items-end justify-between gap-3">
          <h1 tabIndex={-1} className="font-pixel text-[20px] leading-tight">{hero.name}</h1>
          <p className="font-pixel text-[12px] text-mute">Lv {lvl} {levelTitle(state.xp)}</p>
        </div>
        <div className="mt-2">
          <Bar label="XP to next level" text={`${levelProgress(state.xp)}/${XP_PER_LEVEL}`} value={levelProgress(state.xp)} max={XP_PER_LEVEL} color="var(--color-sun)" />
        </div>
        <div className="mt-4">
          <Scene hero={hero} mood={m} level={lvl} />
        </div>
        <p className="mt-3 text-[24px]">{moodLine(hero.name, m)}</p>
        <ButtonLink to="/story" className="mt-3">
          {ended ? 'See how it ended' : state.path.length ? `Continue: choice ${choiceNumber(state)}` : 'Start the story'}
        </ButtonLink>
      </div>

      <div className="mt-6 space-y-4 lg:mt-0">
        <Box className="space-y-4">
          <h2 className="font-pixel text-[13px]">Money, as of {shortDate(today)}</h2>
          <Bar label={`Goal: ${state.goal.name}`} text={`${money(s.saved)}/${money(state.goal.target)}`} value={s.saved} max={state.goal.target} color="var(--color-leaf)" />
          <dl className="grid grid-cols-2 gap-3">
            <div className="px-in bg-paper p-3">
              <dt>In wallet</dt>
              <dd className="font-pixel text-[16px]">{money(s.wallet)}</dd>
            </div>
            <div className="px-in bg-paper p-3">
              <dt>Owed</dt>
              <dd className={`font-pixel text-[16px] ${s.debt > 0 ? 'text-[#b23a3a]' : ''}`}>{money(s.debt)}</dd>
            </div>
          </dl>
        </Box>
        <Box className="space-y-4">
          <h2 className="font-pixel text-[13px]">How {hero.name} feels</h2>
          <Bar label="Calm" text={`${s.calm}/100`} value={s.calm} max={100} color="var(--color-water)" />
          <Bar label="Joy" text={`${s.joy}/100`} value={s.joy} max={100} color="var(--color-sun)" />
        </Box>
        <a href="#/habits" className="px px-press flex min-h-16 items-center justify-between gap-3 bg-card px-4 hover:bg-sand">
          <span>Today’s habits</span>
          <span className="font-pixel text-[13px]">{done}/{state.habits.length} done</span>
        </a>
        <ConfirmButton label="Start over with a new character" confirmLabel="Tap again to erase everything" onConfirm={reset} />
      </div>
    </div>
  )
}
