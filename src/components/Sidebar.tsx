import { APP_NAME } from '../config'
import { DevReset } from './DevReset'
import { Icon } from './Icon'
import { TABS, isActive } from './nav'

/** Replaces the bottom tabs at desktop widths. */
export function Sidebar({ path }: { path: string }) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-line bg-white p-6 lg:flex">
      <p className="px-3 text-2xl font-bold tracking-tight">{APP_NAME}</p>
      <nav aria-label="Main" className="mt-8">
        <ul className="space-y-1">
          {TABS.map((t) => {
            const on = isActive(t.path, path)
            return (
              <li key={t.path}>
                <a
                  href={'#' + t.path}
                  aria-current={on ? 'page' : undefined}
                  className={`flex h-12 items-center gap-3 rounded-xl px-3 text-[17px] ${on ? 'bg-ink font-semibold text-white' : 'font-medium text-ink hover:bg-mist'}`}
                >
                  <Icon name={t.icon} />
                  {t.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
      <DevReset className="mt-auto self-start" />
    </aside>
  )
}
