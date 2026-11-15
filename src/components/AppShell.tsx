import type { ReactNode } from 'react'
import { APP_NAME } from '../config'
import { Sidebar } from './Sidebar'
import { TabBar } from './TabBar'

/** Frame for the three tab screens: bottom tabs on mobile/tablet, sidebar on desktop. */
export function AppShell({ path, wide, children }: { path: string; wide?: boolean; children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-paper lg:pl-64">
      <Sidebar path={path} />
      <main className={`screen-in mx-auto w-full px-4 pb-28 pt-4 md:px-8 md:pt-8 lg:mx-0 lg:px-12 lg:pb-12 lg:pt-12 ${wide ? 'max-w-[600px] lg:max-w-[1016px]' : 'max-w-[600px] lg:max-w-[696px]'}`}>
        <p className="mb-4 font-pixel text-[12px] lg:hidden">{APP_NAME}</p>
        {children}
      </main>
      <TabBar path={path} />
    </div>
  )
}
