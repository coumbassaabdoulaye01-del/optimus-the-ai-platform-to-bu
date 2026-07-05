import type { ReactNode } from "react"

export function CoderShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#0b0d12] text-[#f5f7fb]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(91,141,239,.22),transparent_32%),radial-gradient(circle_at_86%_18%,rgba(132,91,239,.16),transparent_30%),linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] bg-[auto,auto,44px_44px,44px_44px]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[.06] to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export function CoderPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-[#11141b]/90 shadow-2xl shadow-black/30 backdrop-blur-xl ${className}`}>
      {children}
    </div>
  )
}
