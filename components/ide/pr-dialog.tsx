"use client"

import { useState } from "react"
import { CheckCircle2, GitPullRequest, Loader2, X } from "lucide-react"

type DirtyFile = { path: string; content: string }

export function PrDialog({
  open,
  changes,
  onClose,
}: {
  open: boolean
  changes: DirtyFile[]
  onClose: () => void
}) {
  const [title, setTitle] = useState("Update from Optimus IDE")
  const [body, setBody] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle")
  const [prUrl, setPrUrl] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!open) return null

  const submit = async () => {
    setStatus("submitting")
    setErrorMsg(null)
    try {
      const res = await fetch("/api/repo/pr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, changes }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Request failed")
      setPrUrl(data.url)
      setStatus("done")
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to create pull request")
      setStatus("error")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <GitPullRequest className="h-4 w-4" />
            <h2 className="font-display text-base">Create pull request</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {status === "done" ? (
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <CheckCircle2 className="h-10 w-10 text-foreground" />
            <p className="mt-3 font-display text-lg">Pull request created</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your changes are now up for review on GitHub.
            </p>
            <a
              href={prUrl ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="mt-5 rounded-lg bg-foreground px-4 py-2 font-mono text-sm text-background hover:opacity-90"
            >
              View pull request
            </a>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 font-mono text-xs text-muted-foreground hover:text-foreground"
            >
              Back to editor
            </button>
          </div>
        ) : (
          <div className="px-4 py-4">
            <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
            />

            <label className="mt-4 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Description
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              placeholder="What did you change and why?"
              className="mt-1 w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
            />

            <div className="mt-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {changes.length} changed file{changes.length === 1 ? "" : "s"}
              </span>
              <ul className="mt-2 max-h-32 overflow-auto rounded-md border border-border bg-background">
                {changes.map((c) => (
                  <li
                    key={c.path}
                    className="border-b border-border px-3 py-1.5 font-mono text-xs text-foreground/80 last:border-b-0"
                  >
                    {c.path}
                  </li>
                ))}
              </ul>
            </div>

            {errorMsg && (
              <p className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive">
                {errorMsg}
              </p>
            )}

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 font-mono text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={status === "submitting" || changes.length === 0}
                className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 font-mono text-sm text-background hover:opacity-90 disabled:opacity-50"
              >
                {status === "submitting" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {status === "submitting" ? "Creating..." : "Create pull request"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
