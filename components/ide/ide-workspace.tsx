"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, PanelBottom, Play } from "lucide-react"
import { FileExplorer } from "./file-explorer"
import { CodeEditor } from "./code-editor"
import { Terminal } from "./terminal"
import { findFile, initialTree, updateFileContent, type TreeNode } from "./file-system"

export function IdeWorkspace() {
  const [tree, setTree] = useState<TreeNode[]>(initialTree)
  const [openTabs, setOpenTabs] = useState<string[]>(["src/index.ts"])
  const [activePath, setActivePath] = useState<string | null>("src/index.ts")
  const [showTerminal, setShowTerminal] = useState(true)

  const activeFile = activePath ? findFile(tree, activePath) : null

  const openFile = (path: string) => {
    setOpenTabs((tabs) => (tabs.includes(path) ? tabs : [...tabs, path]))
    setActivePath(path)
  }

  const closeTab = (path: string) => {
    setOpenTabs((tabs) => {
      const next = tabs.filter((t) => t !== path)
      if (activePath === path) {
        setActivePath(next[next.length - 1] ?? null)
      }
      return next
    })
  }

  const handleChange = (value: string) => {
    if (!activePath) return
    setTree((prev) => updateFileContent(prev, activePath, value))
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      {/* Top bar */}
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-card px-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-mono text-xs">Back</span>
          </Link>
          <span className="h-4 w-px bg-border" />
          <span className="font-display text-base">Optimus</span>
          <span className="font-mono text-[10px] text-muted-foreground">IDE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="hidden font-mono text-xs text-muted-foreground sm:inline">optimus-app</span>
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
            className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-background transition-opacity hover:opacity-90"
          >
            <Play className="h-3.5 w-3.5" />
            <span className="font-mono text-xs">Run</span>
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        <div className="w-52 shrink-0">
          <FileExplorer tree={tree} activePath={activePath} onSelect={openFile} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1">
            <CodeEditor
              openTabs={openTabs}
              activePath={activePath}
              content={activeFile?.content ?? ""}
              onSelectTab={setActivePath}
              onCloseTab={closeTab}
              onChange={handleChange}
            />
          </div>
          {showTerminal && (
            <div className="h-56 shrink-0">
              <Terminal tree={tree} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
