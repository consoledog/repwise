import type { ReactNode } from 'react'
import { AppShell } from '@/components/layout'
import { requireUser } from '@/lib/auth/guards'

type ProtectedAppLayoutProps = {
  children: ReactNode
}

export default async function ProtectedAppLayout({ children }: ProtectedAppLayoutProps) {
  await requireUser()

  return <AppShell>{children}</AppShell>
}
