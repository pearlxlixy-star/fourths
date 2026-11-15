import { ButtonLink } from '../components/Button'
import { HeroSprite } from '../components/HeroSprite'
import { APP_NAME } from '../config'
import { FURS, SHIRTS } from '../lib/sprite'
import type { Hero } from '../types'

const CAST: Hero[] = [
  { name: '', species: 'bunny', fur: FURS[3], shirt: SHIRTS[1], accessory: 'bow' },
  { name: '', species: 'fox', fur: FURS[1], shirt: SHIRTS[2], accessory: 'none' },
  { name: '', species: 'frog', fur: FURS[4], shirt: SHIRTS[3], accessory: 'cap' },
]

export function Welcome() {
  return (
    <div className="min-h-dvh bg-paper md:flex md:items-center md:justify-center md:bg-sky md:p-8">
      <main className="screen-in mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-paper px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6 md:min-h-[720px] md:border-4 md:border-ink md:p-8 md:shadow-[8px_8px_0_var(--color-ink)]">
        <p className="font-pixel text-lg">{APP_NAME}</p>
        <div className="flex flex-1 flex-col justify-center gap-8 py-8">
          <div className="px flex items-end justify-around bg-sky px-2 pt-6" aria-hidden="true">
            {CAST.map((h, i) => (
              <div key={i} className="border-b-0">
                <HeroSprite hero={h} px={i === 1 ? 6 : 5} mood={i === 1 ? 'happy' : 'ok'} />
              </div>
            ))}
          </div>
          <h1 tabIndex={-1} className="font-pixel text-[20px] leading-[1.6] md:text-[22px]">
            Make a character. See what your money choices turn them into.
          </h1>
        </div>
        <ButtonLink to="/create/1">Start</ButtonLink>
      </main>
    </div>
  )
}
