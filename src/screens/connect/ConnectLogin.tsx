import { useEffect } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { Screen } from '../../components/Screen'
import { go } from '../../state/router'
import { useStore } from '../../state/store'
import { CONNECT_STEPS } from './ConnectBank'

const field = 'mt-1 h-14 w-full rounded-2xl bg-mist px-4 text-lg placeholder:text-mute'

/** Step 2: a pretend login. Nothing typed here is read, stored or sent. */
export function ConnectLogin() {
  const { connect } = useStore()
  useEffect(() => {
    if (!connect) go('/connect', { replace: true })
  }, [connect])
  if (!connect) return null

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        go('/connect/loading')
      }}
    >
      <Screen
        title={`Log in to ${connect.bankName}`}
        step={[2, CONNECT_STEPS]}
        backTo="/connect"
        footer={<Button type="submit">Log in</Button>}
      >
        <p className="flex items-start gap-3 rounded-2xl bg-mist p-4">
          <Icon name="lock" />
          <span>This is a demo bank. Type anything, or nothing. It never leaves this device.</span>
        </p>
        <label className="mt-5 block font-semibold">
          Username
          <input autoFocus name="demo-user" autoComplete="off" placeholder="demo" className={field} />
        </label>
        <label className="mt-4 block font-semibold">
          Password
          <input name="demo-pass" type="password" autoComplete="off" placeholder="demo" className={field} />
        </label>
      </Screen>
    </form>
  )
}
