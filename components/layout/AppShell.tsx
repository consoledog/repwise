import type { ReactNode } from 'react'
import { AppHeader } from './AppHeader'
import { BottomNavigation } from './BottomNavigation'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen pb-24">
      <AppHeader />
      <main className="app-page">{children}</main>
      <BottomNavigation />
    </div>
  )
}
