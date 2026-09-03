type LoadingStateProps = {
  title?: string
  description?: string
}

export function LoadingState({
  title = 'Loading',
  description = 'Preparing the latest data.',
}: LoadingStateProps) {
  return (
    <div className="mobile-panel flex min-h-40 items-center gap-4 p-5">
      <div className="size-10 shrink-0 animate-pulse rounded-full bg-emerald-100" />
      <div>
        <p className="text-base font-semibold text-zinc-950">{title}</p>
        <p className="mt-1 text-sm leading-6 text-zinc-600">{description}</p>
      </div>
    </div>
  )
}
