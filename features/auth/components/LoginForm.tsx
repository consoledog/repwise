import { LogIn } from 'lucide-react'
import { loginAction } from '@/features/auth/actions'

type LoginFormProps = {
  errorMessage?: string
}

export function LoginForm({ errorMessage }: LoginFormProps) {
  return (
    <form action={loginAction} className="mobile-panel space-y-5 p-5">
      <div className="space-y-2">
        <label htmlFor="email" className="field-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="field-input"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="field-label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          className="field-input"
          placeholder="Your password"
        />
      </div>

      {errorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <button type="submit" className="control-button control-button-primary w-full">
        <LogIn size={18} aria-hidden="true" />
        <span>Sign in</span>
      </button>
    </form>
  )
}
