'use client'

import Link from 'next/link'
import { Activity, Camera, Dumbbell, Home, Library } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/exercises', label: 'Library', icon: Library },
  { href: '/workouts', label: 'Workouts', icon: Dumbbell },
  { href: '/mesocycles', label: 'Cycles', icon: Activity },
  { href: '/progress', label: 'Photos', icon: Camera },
] as const

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgb(17_19_16_/_0.08)] backdrop-blur md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg px-1 text-xs font-semibold text-zinc-500',
                active && 'bg-emerald-50 text-[var(--brand-strong)]'
              )}
            >
              <Icon size={20} aria-hidden="true" />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
