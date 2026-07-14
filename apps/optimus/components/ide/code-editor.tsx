"use client"

import { useMemo } from "react"
import { X } from "lucide-react"

export function CodeEditor({
  openTabs,
  activePath,
  content,
  onSelectTab,
  onCloseTab,
  onChange,
}: {
  openTabs: string[]
  activePath: string | null
  content: string
  onSelectTab: (path: string) => void
  onCloseTab: (path: string) => void
  onChange: (value: string) => void
}) {
  const lineCount = useMemo(() => Math.max(content.split("\n").length, 1), [content])

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      {/* Tabs */}
      <div className="flex h-9 shrink-0 items-stretch overflow-x-auto border-b border-border bg-card">
        {openTabs.length === 0 && (
          <div className="flex items-center px-4">
            <span className="font-mono text-xs text-muted-foreground">No file open</span>
          </div>
        )}
        {openTabs.map((path) => {
          const name = path.split("/").pop()
          const isActive = path === activePath
          return (
            <div
              key={path}
              className={`group flex items-center gap-2 border-r border-border px-3 ${
                isActive ? "bg-background text-foreground" : "text-muted-foreground hover:bg-accent/50"
              }`}
            >
              <button type="button" onClick={() => onSelectTab(path)} className="font-mono text-xs">
                {name}
              </button>
              <button
                type="button"
                onClick={() => onCloseTab(path)}
                aria-label={`Close ${name}`}
                className="rounded p-0.5 opacity-40 hover:bg-foreground/10 hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )
        })}
      </div>

      {/* Editor */}
      {activePath ? (
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div
            aria-hidden
            className="select-none overflow-hidden border-r border-border bg-card px-3 py-3 text-right font-mono text-xs leading-6 text-muted-foreground/50"
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            wrap="off"
            className="min-h-0 flex-1 resize-none bg-background px-4 py-3 font-mono text-xs leading-6 text-foreground outline-none"
          />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="font-mono text-sm text-muted-foreground">Select a file to start editing</p>
        </div>
      )}
    </div>
  )
}
