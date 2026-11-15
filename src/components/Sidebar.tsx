import { APP_NAME } from '../config'
import { ICONS } from '../lib/sprite'
import { PixelSprite } from './PixelSprite'
import { TABS, isActive } from './nav'

/** Replaces the bottom tabs at desktop widths. */
export function Sidebar({ path }: { path: string }) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r-4 border-ink bg-card p-6 lg:flex">
      <p className="font-pixel text-lg">{APP_NAME}</p>
      <nav aria-label="Main" className="mt-8">
        <ul className="space-y-3">
          {TABS.map((t) => {
            const on = isActive(t.path, path)
            return (
              <li key={t.path}>
                <a
                  href={'#' + t.path}
                  aria-current={on ? 'page' : undefined}
                  className={`flex h-12 items-center gap-3 px-3 font-pixel text-[12px] ${on ? 'px bg-sun' : 'hover:bg-sand'}`}
                >
                  <PixelSprite grid={ICONS[t.icon]} colors={{ o: '#3b2a1e' }} px={3} />
                  {t.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
