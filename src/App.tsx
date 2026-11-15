import { useEffect, type ReactNode } from 'react'
import { AppShell } from './components/AppShell'
import { Create } from './screens/Create'
import { Habits } from './screens/Habits'
import { Home } from './screens/Home'
import { Story } from './screens/Story'
import { Survey } from './screens/Survey'
import { Welcome } from './screens/Welcome'
import { go, usePath } from './state/router'
import { useStore } from './state/store'
import type { GameState } from './types'

function Redirect({ to }: { to: string }) {
  useEffect(() => go(to, { replace: true }), [to])
  return null
}

function route(path: string, state: GameState) {
  const [a, b] = path.split('/').filter(Boolean)
  const hero = state.hero
  const ready = hero && state.surveyDone
  const shell = (node: ReactNode, wide = false) => <AppShell path={path} wide={wide}>{node}</AppShell>

  switch (a) {
    case 'welcome': return <Welcome />
    case 'create': return <Create step={Number(b)} />
    case 'survey': return <Survey step={Number(b)} />
    // The three tabs need a finished character.
    case 'home': return ready ? shell(<Home hero={hero} />, true) : <Redirect to="/" />
    case 'story': return ready ? shell(<Story hero={hero} />) : <Redirect to="/" />
    case 'habits': return ready ? shell(<Habits />) : <Redirect to="/" />
    // Returning players land straight on their character.
    default: return <Redirect to={ready ? '/home' : hero ? '/survey/1' : '/welcome'} />
  }
}

export function App() {
  const path = usePath()
  const { state } = useStore()
  // The story changes screens without changing the address, so follow it too.
  const view = `${path}|${state.nodeId}|${state.outcome ? 'o' : ''}`

  // New screen: start at the top and put keyboard / screen-reader focus on its headline.
  useEffect(() => {
    window.scrollTo(0, 0)
    if (document.activeElement instanceof HTMLInputElement) return
    document.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true })
  }, [view])

  return <div key={path}>{route(path, state)}</div>
}
