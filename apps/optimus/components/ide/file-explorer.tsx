"use client"

import { useState } from "react"
import { ChevronRight, File, FileCode, FileJson, FileText, Folder, FolderOpen } from "lucide-react"
import type { TreeNode } from "./file-system"

function FileIcon({ name }: { name: string }) {
  const ext = name.split(".").pop()?.toLowerCase()
  if (ext === "ts" || ext === "tsx" || ext === "js" || ext === "jsx") {
    return <FileCode className="h-4 w-4 shrink-0 text-muted-foreground" />
  }
  if (ext === "json") {
    return <FileJson className="h-4 w-4 shrink-0 text-muted-foreground" />
  }
  if (ext === "md") {
    return <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
  }
  return <File className="h-4 w-4 shrink-0 text-muted-foreground" />
}

function TreeItem({
  node,
  path,
  depth,
  activePath,
  onSelect,
}: {
  node: TreeNode
  path: string
  depth: number
  activePath: string | null
  onSelect: (path: string) => void
}) {
  const [open, setOpen] = useState(true)
  const fullPath = path ? `${path}/${node.name}` : node.name
  const pad = { paddingLeft: `${depth * 12 + 8}px` }

  if (node.type === "folder") {
    return (
      <li>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={pad}
          className="flex w-full items-center gap-1.5 py-1 pr-2 text-left text-sm text-foreground/80 hover:bg-accent"
        >
          <ChevronRight className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-90" : ""}`} />
          {open ? (
            <FolderOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <span className="truncate font-mono text-xs">{node.name}</span>
        </button>
        {open && (
          <ul>
            {node.children.map((child) => (
              <TreeItem
                key={child.name}
                node={child}
                path={fullPath}
                depth={depth + 1}
                activePath={activePath}
                onSelect={onSelect}
              />
            ))}
          </ul>
        )}
      </li>
    )
  }

  const isActive = activePath === fullPath
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(fullPath)}
        style={pad}
        className={`flex w-full items-center gap-1.5 py-1 pr-2 text-left text-sm hover:bg-accent ${
          isActive ? "bg-accent text-foreground" : "text-foreground/70"
        }`}
      >
        <span className="w-3.5 shrink-0" />
        <FileIcon name={node.name} />
        <span className="truncate font-mono text-xs">{node.name}</span>
      </button>
    </li>
  )
}

export function FileExplorer({
  tree,
  activePath,
  onSelect,
}: {
  tree: TreeNode[]
  activePath: string | null
  onSelect: (path: string) => void
}) {
  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-card">
      <div className="flex h-9 items-center px-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Explorer</span>
      </div>
      <div className="flex-1 overflow-auto pb-4">
        <ul>
          {tree.map((node) => (
            <TreeItem key={node.name} node={node} path="" depth={0} activePath={activePath} onSelect={onSelect} />
          ))}
        </ul>
      </div>
    </aside>
  )
}
