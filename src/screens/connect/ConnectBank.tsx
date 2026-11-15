import { useEffect, useState } from 'react'
import { Icon } from '../../components/Icon'
import { Screen } from '../../components/Screen'
import { bank, type BankInstitution } from '../../data/bank'
import { go } from '../../state/router'
import { useStore } from '../../state/store'

export const CONNECT_STEPS = 4

/** Step 1: pick a bank. */
export function ConnectBank() {
  const { setConnect } = useStore()
  const [banks, setBanks] = useState<BankInstitution[] | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    bank.listBanks().then(setBanks, () => setFailed(true))
  }, [])

  return (
    <Screen title="Pick your bank" step={[1, CONNECT_STEPS]} backTo="/choose">
      {failed && <p role="alert">We couldn’t load the bank list. Go back and add your plans yourself instead.</p>}
      {!banks && !failed && <p className="text-mute">Loading banks…</p>}
      <ul className="grid gap-2">
        {banks?.map((b) => (
          <li key={b.id}>
            <button
              type="button"
              onClick={() => {
                setConnect({ bankId: b.id, bankName: b.name })
                go('/connect/login')
              }}
              className="flex min-h-16 w-full items-center gap-3 rounded-2xl bg-mist px-4 text-left hover:bg-line"
            >
              <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-ink font-bold text-white">
                {b.name.charAt(0)}
              </span>
              <span className="flex-1 text-[17px] font-semibold">{b.name}</span>
              <Icon name="chevron" />
            </button>
          </li>
        ))}
      </ul>
    </Screen>
  )
}
