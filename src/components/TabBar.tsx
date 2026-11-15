import { ICONS } from '../lib/sprite'
import { PixelSprite } from './PixelSprite'
import { TABS, isActive } from './nav'

/** Bottom navigation for phones and tablets. */
export function TabBar({ path }: { path: string }) {
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-10 border-t-4 border-ink bg-card pb-[env(safe-area-inset-bottom)] lg:hidden">
      <ul className="mx-auto flex max-w-[600px]">
        {TABS.map((t) => {
          const on = isActive(t.path, path)
          return (
            <li key={t.path} className="flex-1">
              <a
                href={'#' + t.path}
                aria-current={on ? 'page' : undefined}
                className={`flex h-16 flex-col items-center justify-center gap-1 font-pixel text-[11px] ${on ? 'bg-sun text-ink' : 'text-mute hover:bg-sand'}`}
              >
                <PixelSprite grid={ICONS[t.icon]} colors={{ o: on ? '#3b2a1e' : '#6b5a4c' }} px={3} />
                {t.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
