"use client"

import Link from "next/link"
import { ArrowLeft, Github, GitBranch, LockKeyhole, TerminalSquare, Users } from "lucide-react"

export function LoginGate({ error }: { error?: string | null }) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#08090c] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(circle_at_50%_20%,black,transparent_72%)]" />
      <div className="pointer-events-none absolute -right-32 top-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-16 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />

      <header className="relative z-10 flex h-16 items-center justify-between border-b border-white/10 px-5 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>
        <div className="flex items-center gap-2 font-mono text-xs text-white/50">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Optimus workspaces
        </div>
      </header>

      <main className="relative z-10 grid min-h-[calc(100vh-4rem)] items-center gap-10 px-6 py-12 lg:grid-cols-[1.05fr_.95fr] lg:px-16">
        <section className="mx-auto max-w-2xl lg:mx-0">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.03] px-3 py-1 font-mono text-xs text-white/60">
            <TerminalSquare className="h-3.5 w-3.5" />
            Coder-inspired cloud development
          </div>
          <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-7xl">
            Lance ton environnement de code sécurisé.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">
            Connecte-toi avec Google pour accéder à la plateforme, ou avec GitHub pour éditer le
            dépôt, créer des branches et ouvrir des pull requests depuis le navigateur.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              [LockKeyhole, "SSO ready", "OAuth Google et GitHub"],
              [GitBranch, "Git native", "PR réelles sur ton dépôt"],
              [Users, "Teams", "Workspaces partagés"],
            ].map(([Icon, title, text]) => (
              <div key={String(title)} className="rounded-2xl border border-white/10 bg-white/[.03] p-4">
                <Icon className="h-5 w-5 text-blue-300" />
                <p className="mt-3 text-sm font-medium">{String(title)}</p>
                <p className="mt-1 text-xs leading-5 text-white/45">{String(text)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-[#0d0f14]/90 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="rounded-[1.25rem] border border-white/10 bg-white/[.03] p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">Sign in</p>
                <h2 className="mt-2 text-2xl font-semibold">Optimus IDE</h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black">
                <Github className="h-5 w-5" />
              </div>
            </div>

            {error && (
              <p className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-200">
                Échec de connexion : {error}
              </p>
            )}

            <div className="space-y-3">
              <a
                href="/api/auth/github"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-black transition-transform hover:-translate-y-0.5"
              >
                <Github className="h-4 w-4" />
                Continuer avec GitHub
              </a>
              <a
                href="/api/auth/google"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-4 text-sm font-medium text-white transition-colors hover:bg-white/[.08]"
              >
                <span className="font-semibold">G</span>
                Continuer avec Google
              </a>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 font-mono text-xs leading-6 text-white/50">
              <p className="text-white/70">$ optimus workspace start</p>
              <p>Provisionnement instantané · terminal · éditeur · pull request</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
