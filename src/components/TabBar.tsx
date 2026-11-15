import { Icon } from './Icon'
import { TABS, isActive } from './nav'

/** Bottom navigation for phones and tablets. */
export function TabBar({ path }: { path: string }) {
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
      <ul className="mx-auto flex max-w-[600px]">
        {TABS.map((t) => {
          const on = isActive(t.path, path)
          return (
            <li key={t.path} className="flex-1">
              <a
                href={'#' + t.path}
                aria-current={on ? 'page' : undefined}
                className={`flex h-16 flex-col items-center justify-center gap-0.5 text-sm ${on ? 'font-bold text-ink' : 'font-medium text-mute hover:text-ink'}`}
              >
                <Icon name={t.icon} className={on ? 'stroke-2' : ''} />
                {t.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
