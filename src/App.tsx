import { useEffect } from 'react'
import { AppShell } from './components/AppShell'
import { AddPlan } from './screens/AddPlan'
import { Balance } from './screens/Balance'
import { ChooseMethod } from './screens/ChooseMethod'
import { ConnectBank } from './screens/connect/ConnectBank'
import { ConnectEdit } from './screens/connect/ConnectEdit'
import { ConnectFound } from './screens/connect/ConnectFound'
import { ConnectLoading } from './screens/connect/ConnectLoading'
import { ConnectLogin } from './screens/connect/ConnectLogin'
import { Goal } from './screens/Goal'
import { GoalAddMoney, GoalDate, GoalName, GoalTarget } from './screens/GoalFlows'
import { MoveDate } from './screens/MoveDate'
import { PlanDetail } from './screens/PlanDetail'
import { PlanFinished } from './screens/PlanFinished'
import { Plans } from './screens/Plans'
import { RiskOptions } from './screens/RiskOptions'
import { Timeline } from './screens/Timeline'
import { Welcome } from './screens/Welcome'
import { go, usePath } from './state/router'
import { useStore } from './state/store'

function Redirect({ to }: { to: string }) {
  useEffect(() => go(to, { replace: true }), [to])
  return null
}

function route(path: string, onboarded: boolean) {
  const [a, b, c, d] = path.split('/').filter(Boolean)
  const shell = (node: React.ReactNode, wide = false) => <AppShell path={path} wide={wide}>{node}</AppShell>

  switch (a) {
    case 'welcome': return <Welcome />
    case 'choose': return <ChooseMethod />
    case 'add': return <AddPlan step={Number(b)} />
    case 'connect':
      if (b === 'login') return <ConnectLogin />
      if (b === 'loading') return <ConnectLoading />
      if (b === 'found') return <ConnectFound />
      if (b === 'edit') return <ConnectEdit index={Number(c)} field={d} />
      return <ConnectBank />
    case 'timeline': return shell(<Timeline />, true)
    case 'balance': return <Balance />
    case 'risk': return <RiskOptions />
    case 'move': return <MoveDate planId={b ?? ''} index={Number(c)} />
    case 'done': return <PlanFinished planId={b ?? ''} />
    case 'goal':
      if (b === 'name') return <GoalName />
      if (b === 'target') return <GoalTarget />
      if (b === 'date') return <GoalDate solo={c === 'edit'} />
      if (b === 'add') return <GoalAddMoney />
      return shell(<Goal />)
    case 'plans': return b ? shell(<PlanDetail planId={b} />) : shell(<Plans />, true)
    // Returning users land straight on the timeline.
    default: return <Redirect to={onboarded ? '/timeline' : '/welcome'} />
  }
}

export function App() {
  const path = usePath()
  const { state } = useStore()

  // New screen: start at the top and put keyboard / screen-reader focus on its headline.
  useEffect(() => {
    window.scrollTo(0, 0)
    if (document.activeElement instanceof HTMLInputElement) return
    document.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true })
  }, [path])

  // `key` restarts each screen cleanly so one question's answer never leaks into the next.
  return <div key={path}>{route(path, state.onboarded)}</div>
}
