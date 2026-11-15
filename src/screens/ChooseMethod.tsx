import { Icon, type IconName } from '../components/Icon'
import { Screen } from '../components/Screen'
import { go } from '../state/router'
import { useStore } from '../state/store'

function Choice({ to, icon, title, tag, text }: { to: string; icon: IconName; title: string; tag?: string; text: string }) {
  return (
    <a href={'#' + to} className="flex min-h-[132px] items-center gap-4 rounded-2xl bg-mist p-5 hover:bg-line">
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ink text-white">
        <Icon name={icon} />
      </span>
      <span className="flex-1">
        <span className="flex flex-wrap items-center gap-2 text-xl font-bold leading-tight">
          {title}
          {tag && <span className="rounded-full bg-green px-2.5 py-0.5 text-sm font-bold text-ink">{tag}</span>}
        </span>
        <span className="mt-1 block text-mute">{text}</span>
      </span>
      <Icon name="chevron" />
    </a>
  )
}

export function ChooseMethod() {
  const { state, update } = useStore()
  const skip = () => {
    update((s) => ({ ...s, onboarded: true }))
    go('/timeline')
  }
  return (
    <Screen title="How do you want to add your plans?" backTo={state.onboarded ? '/plans' : '/welcome'}>
      <div className="grid gap-3">
        <Choice to="/connect" icon="bank" title="Connect my bank" tag="Fastest" text="We find your payments for you." />
        <Choice to="/add/1" icon="pencil" title="Add them myself" text="Four quick questions per plan." />
      </div>
      {!state.onboarded && state.plans.length > 0 && (
        <button type="button" onClick={skip} className="mx-auto mt-4 min-h-11 rounded-xl px-4 text-mute underline underline-offset-4 hover:bg-mist">
          Just look around with sample plans
        </button>
      )}
    </Screen>
  )
}
