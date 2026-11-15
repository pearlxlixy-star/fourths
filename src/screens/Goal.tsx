import { ButtonLink } from '../components/Button'
import { ConfirmButton } from '../components/ConfirmButton'
import { ProgressBar } from '../components/ProgressBar'
import { longDate, shortDate, todayISO } from '../lib/dates'
import { usd } from '../lib/money'
import { goalFinishDate, goalLeft, neededPerTwoWeeks } from '../lib/schedule'
import { useStore } from '../state/store'

/** One goal. One bar. One button. */
export function Goal() {
  const { state, update } = useStore()
  const g = state.goal
  const today = todayISO()

  if (!g || g.targetCents === 0)
    return (
      <>
        <h1 tabIndex={-1} className="text-[28px] font-bold leading-tight tracking-tight md:text-[32px]">
          Pick one thing to save for.
        </h1>
        <p className="mt-2 text-mute">When a plan ends, you can send that same payment here instead.</p>
        <ButtonLink to="/goal/name" className="mt-6">Set a goal</ButtonLink>
      </>
    )

  const left = goalLeft(g)
  const finish = goalFinishDate(g, today)
  const needed = neededPerTwoWeeks(g, today)
  const onTrack = !!g.needBy && !!finish && finish <= g.needBy
  return (
    <>
      <h1 tabIndex={-1} className="text-[28px] font-bold leading-tight tracking-tight md:text-[32px]">
        {g.name}
      </h1>
      <a href="#/goal/name" className="inline-flex min-h-11 items-center font-semibold text-mute underline underline-offset-4">
        Change goal
      </a>

      <div className="mt-4 rounded-2xl bg-mist p-5 md:p-8">
        <p className="text-[56px] font-bold leading-none tracking-tight tabular-nums md:text-[72px]">{usd(g.savedCents)}</p>
        <p className="mt-2 text-mute">
          saved of <span className="font-semibold text-ink tabular-nums">{usd(g.targetCents)}</span>, as of {shortDate(today)}
        </p>
        <div className="mt-6">
          <ProgressBar tall value={g.savedCents} max={g.targetCents} label={`${g.name} progress`} />
        </div>
        <div className="mt-3 flex justify-between gap-4 font-semibold tabular-nums">
          <span className="text-green-ink">{usd(g.savedCents)} saved</span>
          <span>{usd(left)} left</span>
        </div>
      </div>

      {left === 0 ? (
        <p className="mt-6 text-xl font-semibold leading-snug">
          You reached it. {usd(g.targetCents)} saved as of {shortDate(today)}.
        </p>
      ) : (
        <>
          {/* When the money is needed, and a one-tap way to change it. */}
          <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-mist py-3 pl-5 pr-3">
            <p>
              <span className="block text-mute">Need it by</span>
              <span className="block text-lg font-bold">{g.needBy ? longDate(g.needBy) : 'No date set'}</span>
            </p>
            <a href="#/goal/date/edit" className="flex h-11 shrink-0 items-center rounded-full bg-white px-4 font-semibold hover:bg-line">
              {g.needBy ? 'Change date' : 'Set a date'}
            </a>
          </div>

          <p className="mt-6 text-xl font-semibold leading-snug">
            {finish ? (
              <>
                At <span className="tabular-nums">{usd(g.perTwoWeeksCents)}</span> every 2 weeks, you’ll get there by{' '}
                <span className="whitespace-nowrap">{longDate(finish)}</span>.
              </>
            ) : (
              <>Finish a plan and send its payment here to see your finish date.</>
            )}
          </p>
          {g.needBy && (
            <p className="mt-2 flex items-start gap-2 text-mute">
              <span aria-hidden="true" className={`mt-[7px] size-2.5 shrink-0 rounded-full ${onTrack ? 'bg-green' : 'bg-amber'}`} />
              {onTrack ? (
                <span>That’s in time for {shortDate(g.needBy)}.</span>
              ) : needed ? (
                <span>
                  To make {shortDate(g.needBy)}, you need <strong className="font-bold text-ink tabular-nums">{usd(needed)}</strong> every 2 weeks.
                </span>
              ) : (
                <span>{shortDate(g.needBy)} has passed. Pick a new date.</span>
              )}
            </p>
          )}
        </>
      )}

      {left > 0 && <ButtonLink to="/goal/add" className="mt-6">Add money</ButtonLink>}
      <div className="mt-2">
        <ConfirmButton
          label="Clear this goal"
          confirmLabel={`Tap again to delete “${g.name}” and its ${usd(g.savedCents)}`}
          onConfirm={() => update((s) => ({ ...s, goal: null }))}
        />
      </div>
    </>
  )
}
