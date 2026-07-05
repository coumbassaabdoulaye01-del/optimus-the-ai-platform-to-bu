"use client"

import Link from "next/link"
import { ArrowLeft, Github, GitPullRequest, Users } from "lucide-react"

export function LoginGate({ error }: { error?: string | null }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="flex h-11 shrink-0 items-center gap-3 border-b border-border bg-card px-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-mono text-xs">Back</span>
        </Link>
        <span className="h-4 w-px bg-border" />
        <span className="font-display text-base">Optimus</span>
        <span className="font-mono text-[10px] text-muted-foreground">Collab IDE</span>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-border bg-card p-8">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-foreground text-background">
              <Github className="h-6 w-6" />
            </div>
            <h1 className="text-balance font-display text-2xl">Collaborate on the code</h1>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
              Sign in with GitHub to browse the project, edit files right in your browser, and open
              pull requests without leaving the page.
            </p>

            {error && (
              <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive">
                Sign-in failed: {error}
              </p>
            )}

            <a
              href="/api/auth/github"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-background transition-opacity hover:opacity-90"
            >
              <Github className="h-4 w-4" />
              <span className="font-mono text-sm">Continue with GitHub</span>
            </a>

            <ul className="mt-6 space-y-3 border-t border-border pt-6">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Users className="h-4 w-4 shrink-0" />
                Everyone works on the same central repository
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <GitPullRequest className="h-4 w-4 shrink-0" />
                Your edits become a real pull request
              </li>
            </ul>
          </div>
          <p className="mt-4 text-center font-mono text-[10px] text-muted-foreground">
            We request the <span className="text-foreground/70">repo</span> scope so we can commit
            and open pull requests on your behalf.
          </p>
        </div>
      </main>
    </div>
  )
}
