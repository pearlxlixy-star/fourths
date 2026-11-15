const PATHS = {
  back: 'M15 5l-7 7 7 7',
  chevron: 'M9 5l7 7-7 7',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  alert: 'M12 4l9 16H3L12 4z M12 10v4.5 M12 17v.5',
  calendar: 'M4 6.5h16V20H4z M4 10.5h16 M8 4v4 M16 4v4',
  target: 'M12 3a9 9 0 100 18 9 9 0 000-18z M12 8a4 4 0 100 8 4 4 0 000-8z M12 12v.01',
  cards: 'M3 6.5h18v11H3z M3 10.5h18 M7 14.5h3',
  bank: 'M3 10l9-6 9 6 M5 10v8 M9.7 10v8 M14.3 10v8 M19 10v8 M3 20h18',
  pencil: 'M4 20l4-1L19 8l-3-3L5 16l-1 4z',
  plus: 'M12 5v14 M5 12h14',
  backspace: 'M9 6h11v12H9l-6-6 6-6z M13 10l4 4 M17 10l-4 4',
  swap: 'M4 8h13 M14 5l3 3-3 3 M20 16H7 M10 13l-3 3 3 3',
  clock: 'M12 3a9 9 0 100 18 9 9 0 000-18z M12 7v5l3 2',
  chat: 'M4 5h16v11H9l-5 4V5z',
  lock: 'M6 11h12v9H6z M9 11V8a3 3 0 016 0v3',
} as const

export type IconName = keyof typeof PATHS

/** Thin-stroke inline SVG. Decorative by default; label the button, not the icon. */
export function Icon({ name, size = 24, className = '' }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
