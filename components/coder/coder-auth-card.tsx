import { Github, KeyRound } from "lucide-react"
import { CoderPanel } from "./coder-shell"

export function CoderAuthCard({ error }: { error?: string | null }) {
  return (
    <CoderPanel className="p-2">
      <div className="rounded-[1rem] border border-white/10 bg-white/[.03] p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/35">Authentification</p>
            <h2 className="mt-2 text-2xl font-semibold">Choisis ton provider</h2>
            <p className="mt-2 text-sm leading-6 text-white/50">Google pour l’accès SSO. GitHub pour coder, committer et ouvrir des PR.</p>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-black">
            <KeyRound className="h-5 w-5" />
          </span>
        </div>

        {error && (
          <p className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-200">
            Échec de connexion : {error}
          </p>
        )}

        <div className="space-y-3">
          <a href="/api/auth/github" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-black hover:bg-white/90">
            <Github className="h-4 w-4" />
            Continuer avec GitHub
          </a>
          <a href="/api/auth/google" className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-4 text-sm font-semibold text-white hover:bg-white/[.08]">
            <span className="font-bold">G</span>
            Continuer avec Google
          </a>
        </div>
      </div>
    </CoderPanel>
  )
}
