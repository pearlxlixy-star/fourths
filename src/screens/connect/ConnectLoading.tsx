import { useEffect, useState } from 'react'
import { Screen } from '../../components/Screen'
import { bank } from '../../data/bank'
import { todayISO } from '../../lib/dates'
import { go } from '../../state/router'
import { useStore } from '../../state/store'
import { CONNECT_STEPS } from './ConnectBank'

/** Step 3: talk to the bank, then move on by itself. */
export function ConnectLoading() {
  const { connect, setConnect } = useStore()
  const [message, setMessage] = useState('Logging in…')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!connect) {
      go('/connect', { replace: true })
      return
    }
    let stale = false
    ;(async () => {
      try {
        await bank.connect(connect.bankId)
        if (stale) return
        setMessage('Looking for pay-later payments…')
        const scan = await bank.scan(connect.bankId, todayISO())
        if (stale) return
        setConnect({ ...connect, balanceCents: scan.balanceCents, found: scan.detected.map((draft) => ({ draft, checked: true })) })
        go('/connect/found', { replace: true })
      } catch {
        if (!stale) setFailed(true)
      }
    })()
    return () => {
      stale = true
    }
    // Run once per visit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!connect) return null
  return (
    <Screen title={`Connecting to ${connect.bankName}`} step={[3, CONNECT_STEPS]} backTo={failed ? '/choose' : undefined}>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 pb-16 text-center">
        {failed ? (
          <p role="alert" className="text-lg">That didn’t work. Go back and add your plans yourself instead.</p>
        ) : (
          <>
            <span aria-hidden="true" className="spinner size-14 rounded-full border-4 border-line border-t-ink" />
            <p role="status" className="text-lg font-semibold">{message}</p>
          </>
        )}
      </div>
    </Screen>
  )
}
