import { useState } from 'react'
import { Box } from '../components/Box'
import { Button } from '../components/Button'
import { HABIT_XP } from '../data/habits'
import { dayLetter, lastWeek, shortDate, todayISO } from '../lib/dates'
import { doneOn, money, streak, toggleHabit } from '../lib/game'
import { useStore } from '../state/store'

/** Daily habits that move the character toward the goal. Each tick earns XP. */
export function Habits() {
  const { state, update } = useStore()
  const [text, setText] = useState('')
  const today = todayISO()
  const week = lastWeek(today)
  const done = doneOn(state, today)
  const run = streak(state, today)
  const left = Math.max(0, state.goal.target - state.stats.saved)

  const add = () => {
    const label = text.trim()
    if (!label) return
    update((s) => ({ ...s, habits: [...s.habits, { id: `c${Date.now()}`, label, fx: { calm: 1 }, custom: true }] }))
    setText('')
  }
  const remove = (id: string) => update((s) => ({ ...s, habits: s.habits.filter((h) => h.id !== id) }))

  return (
    <>
      <h1 tabIndex={-1} className="font-pixel text-[20px] leading-[1.5]">Habits</h1>
      <p className="mt-2 text-[24px] leading-tight">
        {money(left)} to go for “{state.goal.name}”. {run > 0 ? `${run}-day streak as of ${shortDate(today)}.` : `Tick one today, ${shortDate(today)}, to start a streak.`}
      </p>

      <ul className="mt-5 space-y-3">
        {state.habits.map((h) => {
          const on = done.includes(h.id)
          return (
            <li key={h.id} className="px bg-card">
              <div className="flex items-stretch">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  onClick={() => update((s) => toggleHabit(s, h.id, today))}
                  className={`flex min-h-16 flex-1 items-center gap-3 px-3 py-2 text-left ${on ? 'bg-grass' : 'hover:bg-sand'}`}
                >
                  <span aria-hidden="true" className="px-in grid size-8 shrink-0 place-items-center bg-card font-pixel text-[14px]">{on ? 'x' : ''}</span>
                  <span className="text-[24px] leading-tight">{h.label}</span>
                </button>
                {h.custom && (
                  <button type="button" aria-label={`Remove ${h.label}`} onClick={() => remove(h.id)} className="grid min-w-11 place-items-center border-l-4 border-ink font-pixel text-[12px] hover:bg-[#f4a3a3]">
                    X
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 border-t-4 border-ink px-3 py-2">
                <ul className="flex gap-1" aria-label={`${h.label}, last 7 days`}>
                  {week.map((d) => {
                    const hit = doneOn(state, d).includes(h.id)
                    return (
                      <li key={d} aria-label={`${shortDate(d)}: ${hit ? 'done' : 'not done'}`} className={`grid size-7 place-items-center border-2 border-ink text-[18px] leading-none ${hit ? 'bg-leaf text-white' : d === today ? 'bg-sun' : 'bg-paper text-mute'}`}>
                        {dayLetter(d)}
                      </li>
                    )
                  })}
                </ul>
                <span className="font-pixel text-[11px] text-mute">+{HABIT_XP} XP{h.fx.saved ? `, +${money(h.fx.saved)} saved` : ''}</span>
              </div>
            </li>
          )
        })}
      </ul>

      <Box className="mt-5">
        <h2 className="font-pixel text-[13px]">Add your own</h2>
        <form
          className="mt-3 space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            add()
          }}
        >
          <input
            id="new-habit"
            aria-label="New habit"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Walk past the coffee shop"
            maxLength={40}
            autoComplete="off"
            className="px-in h-14 w-full bg-paper px-3 text-[24px] placeholder:text-mute"
          />
          <Button type="submit" variant="secondary" disabled={!text.trim()}>Add habit</Button>
        </form>
      </Box>

    </>
  )
}
