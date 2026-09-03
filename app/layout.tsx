import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Repwise',
    template: '%s | Repwise',
  },
  description: 'Private workout tracking for exercises, workouts, and mesocycles.',
  applicationName: 'Repwise',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
