import { Activity, Check, Clock3, Code2, Cpu, Database, GitPullRequest, LockKeyhole, TerminalSquare } from "lucide-react"
import { CoderPanel } from "./coder-shell"

const templates = [
  [Code2, "Next.js AI App", "Node 20 · pnpm · Vercel"],
  [Database, "Postgres Service", "Docker · migrations · backups"],
  [Cpu, "GPU Agent", "CUDA · Python · notebooks"],
] as const

const activity = ["OAuth Google prêt", "GitHub repo scope configuré", "Workspace browser provisionné"]

export function CoderDashboardPreview() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_.8fr]">
      <CoderPanel className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/35">Workspace</p>
            <h2 className="mt-2 text-2xl font-semibold">optimus-platform</h2>
          </div>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">Running</span>
        </div>
        <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4 font-mono text-xs leading-6 text-white/60">
          <p className="text-white">$ coder open optimus-platform</p>
          <p>✓ connected to browser IDE</p>
          <p>✓ repository mounted at /workspace</p>
          <p>✓ pull request automation enabled</p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            [TerminalSquare, "IDE", "Browser"],
            [GitPullRequest, "PR", "GitHub"],
            [LockKeyhole, "SSO", "Google"],
          ].map(([Icon, label, value]) => (
            <div key={String(label)} className="rounded-xl border border-white/10 bg-white/[.03] p-3">
              <Icon className="h-4 w-4 text-blue-300" />
              <p className="mt-3 text-xs text-white/40">{String(label)}</p>
              <p className="text-sm font-medium">{String(value)}</p>
            </div>
          ))}
        </div>
      </CoderPanel>

      <div className="grid gap-4">
        <CoderPanel className="p-5">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-300" />
            <h3 className="font-medium">Activité récente</h3>
          </div>
          <div className="mt-4 space-y-3">
            {activity.map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-white/60">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-400/10 text-emerald-200">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {item}
              </div>
            ))}
          </div>
        </CoderPanel>
        <CoderPanel className="p-5">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-violet-300" />
            <h3 className="font-medium">Templates</h3>
          </div>
          <div className="mt-4 space-y-2">
            {templates.map(([Icon, title, subtitle]) => (
              <div key={title} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.03] p-3">
                <Icon className="h-4 w-4 text-white/50" />
                <div>
                  <p className="text-sm">{title}</p>
                  <p className="text-xs text-white/40">{subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </CoderPanel>
      </div>
    </div>
  )
}
