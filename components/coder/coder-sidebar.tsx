import { Boxes, GitBranch, Home, Plug, Settings, ShieldCheck, TerminalSquare, Users } from "lucide-react"

const navItems = [
  [Home, "Dashboard", true],
  [TerminalSquare, "Workspaces", false],
  [Boxes, "Templates", false],
  [GitBranch, "Repositories", false],
  [Plug, "Integrations", false],
  [Users, "Members", false],
  [ShieldCheck, "Security", false],
  [Settings, "Settings", false],
] as const

export function CoderSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#0b0d12]/70 p-3 lg:block">
      <div className="space-y-1">
        {navItems.map(([Icon, label, active]) => (
          <div
            key={label}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
              active ? "bg-white text-black" : "text-white/55 hover:bg-white/[.06] hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[.04] p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">Status</p>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Tous les systèmes prêts
        </div>
      </div>
    </aside>
  )
}
