"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { ArrowLeft, GitPullRequest, Loader2, LogOut, PanelBottom } from "lucide-react"
import { FileExplorer } from "./file-explorer"
import { CodeEditor } from "./code-editor"
import { Terminal } from "./terminal"
import { LoginGate } from "./login-gate"
import { PrDialog } from "./pr-dialog"
import {
  buildTreeFromPaths,
  collectDirtyFiles,
  findFile,
  setFileContent,
  type TreeNode,
} from "./file-system"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type MeResponse = {
  authenticated: boolean
  user?: { login: string; name: string | null; avatarUrl: string; htmlUrl: string }
  repo?: string | null
}

type TreeResponse = {
  repo: string
  defaultBranch: string
  canPush: boolean
  files: { path: string; type: "blob" | "tree" }[]
}

export function IdeWorkspace({ authError }: { authError?: string | null }) {
  const { data: me, isLoading: meLoading } = useSWR<MeResponse>("/api/auth/me", fetcher)

  if (meLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    )
  }

  if (!me?.authenticated) {
    return <LoginGate error={authError} />
  }

  return <AuthedWorkspace me={me} />
}

function AuthedWorkspace({ me }: { me: MeResponse }) {
  const { data: treeData, isLoading: treeLoading, error: treeError } = useSWR<TreeResponse>(
    "/api/repo/tree",
    fetcher,
  )

  const [tree, setTree] = useState<TreeNode[] | null>(null)
  const [openTabs, setOpenTabs] = useState<string[]>([])
  const [activePath, setActivePath] = useState<string | null>(null)
  const [loadingPaths, setLoadingPaths] = useState<Set<string>>(new Set())
  const [showTerminal, setShowTerminal] = useState(true)
  const [prOpen, setPrOpen] = useState(false)

  // Initialize the tree once the flat file list arrives.
  const builtTree = useMemo(() => {
    if (!treeData?.files) return null
    return buildTreeFromPaths(treeData.files)
  }, [treeData])

  const effectiveTree = tree ?? builtTree
  const activeFile = effectiveTree && activePath ? findFile(effectiveTree, activePath) : null
  const dirtyFiles = effectiveTree ? collectDirtyFiles(effectiveTree) : []

  const openFile = async (path: string) => {
    const current = tree ?? builtTree
    if (!current) return
    setOpenTabs((tabs) => (tabs.includes(path) ? tabs : [...tabs, path]))
    setActivePath(path)

    const file = findFile(current, path)
    if (file && !file.loaded) {
      setLoadingPaths((s) => new Set(s).add(path))
      try {
        const res = await fetch(`/api/repo/file?path=${encodeURIComponent(path)}`)
        const data = await res.json()
        const content = res.ok ? (data.content ?? "") : `// Failed to load file: ${data.error ?? ""}`
        setTree((prev) => setFileContent(prev ?? builtTree ?? [], path, content, { dirty: false }))
      } finally {
        setLoadingPaths((s) => {
          const next = new Set(s)
          next.delete(path)
          return next
        })
      }
    }
  }

  const closeTab = (path: string) => {
    setOpenTabs((tabs) => {
      const next = tabs.filter((t) => t !== path)
      if (activePath === path) setActivePath(next[next.length - 1] ?? null)
      return next
    })
  }

  const handleChange = (value: string) => {
    if (!activePath) return
    setTree((prev) => setFileContent(prev ?? builtTree ?? [], activePath, value, { dirty: true }))
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.reload()
  }

  const isLoadingActive = activePath ? loadingPaths.has(activePath) : false

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      {/* Top bar */}
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-card px-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden font-mono text-xs sm:inline">Back</span>
          </Link>
          <span className="h-4 w-px bg-border" />
          <span className="font-display text-base">Optimus</span>
          <span className="truncate font-mono text-[10px] text-muted-foreground">
            {treeData?.repo ?? me.repo ?? "loading..."}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {dirtyFiles.length > 0 && (
            <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">
              {dirtyFiles.length} unsaved
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowTerminal((v) => !v)}
            aria-pressed={showTerminal}
            aria-label="Toggle terminal"
            className={`rounded-md p-1.5 transition-colors ${
              showTerminal ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent"
            }`}
          >
            <PanelBottom className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setPrOpen(true)}
            disabled={dirtyFiles.length === 0}
            className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-background transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <GitPullRequest className="h-3.5 w-3.5" />
            <span className="font-mono text-xs">Pull request</span>
          </button>
          <span className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            {me.user?.avatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={me.user.avatarUrl || "/placeholder.svg"}
                alt={me.user.login}
                className="h-6 w-6 rounded-full border border-border"
              />
            )}
            <button
              type="button"
              onClick={logout}
              aria-label="Sign out"
              className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        <div className="w-52 shrink-0">
          {treeLoading ? (
            <div className="flex h-full items-center justify-center border-r border-border bg-card">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : treeError || !effectiveTree ? (
            <div className="flex h-full items-center justify-center border-r border-border bg-card p-4 text-center">
              <p className="font-mono text-[10px] text-muted-foreground">
                Could not load repository. Check that GITHUB_CENTRAL_REPO is set correctly.
              </p>
            </div>
          ) : (
            <FileExplorer tree={effectiveTree} activePath={activePath} onSelect={openFile} />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1">
            {isLoadingActive ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <CodeEditor
                openTabs={openTabs}
                activePath={activePath}
                content={activeFile?.content ?? ""}
                onSelectTab={setActivePath}
                onCloseTab={closeTab}
                onChange={handleChange}
              />
            )}
          </div>
          {showTerminal && (
            <div className="h-56 shrink-0">
              <Terminal tree={effectiveTree ?? []} />
            </div>
          )}
        </div>
      </div>

      <PrDialog open={prOpen} changes={dirtyFiles} onClose={() => setPrOpen(false)} />
    </div>
  )
}
