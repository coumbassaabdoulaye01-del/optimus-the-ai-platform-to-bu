"use client"

import { useEffect, useRef, useState } from "react"
import { TerminalIcon, Trash2 } from "lucide-react"
import { findFile, listPaths, type TreeNode } from "./file-system"

type Line = { id: number; type: "input" | "output" | "error"; text: string }

let lineId = 0
const nextId = () => ++lineId

export function Terminal({ tree, onClear }: { tree: TreeNode[]; onClear?: () => void }) {
  const [lines, setLines] = useState<Line[]>([
    { id: nextId(), type: "output", text: "Optimus Terminal v1.0.0 — type 'help' to get started." },
  ])
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [lines])

  const push = (entries: Omit<Line, "id">[]) => setLines((prev) => [...prev, ...entries.map((e) => ({ ...e, id: nextId() }))])

  const run = (raw: string) => {
    const cmd = raw.trim()
    push([{ type: "input", text: cmd }])
    if (!cmd) return

    const [name, ...args] = cmd.split(/\s+/)

    switch (name) {
      case "help":
        push([
          { type: "output", text: "Available commands:" },
          { type: "output", text: "  help              Show this message" },
          { type: "output", text: "  ls                List files and folders" },
          { type: "output", text: "  cat <file>        Print a file's contents" },
          { type: "output", text: "  echo <text>       Print text" },
          { type: "output", text: "  date              Show the current date" },
          { type: "output", text: "  npm run dev       Start the dev server (simulated)" },
          { type: "output", text: "  clear             Clear the terminal" },
        ])
        break
      case "ls": {
        const paths = listPaths(tree)
        push(paths.map((p) => ({ type: "output" as const, text: p })))
        break
      }
      case "cat": {
        if (!args[0]) {
          push([{ type: "error", text: "cat: missing file operand" }])
          break
        }
        const file = findFile(tree, args[0])
        if (!file) {
          push([{ type: "error", text: `cat: ${args[0]}: No such file` }])
          break
        }
        push(file.content.split("\n").map((t) => ({ type: "output" as const, text: t })))
        break
      }
      case "echo":
        push([{ type: "output", text: args.join(" ") }])
        break
      case "date":
        push([{ type: "output", text: new Date().toString() }])
        break
      case "npm":
      case "pnpm":
      case "yarn":
        if (args[0] === "run" && args[1] === "dev") {
          push([
            { type: "output", text: "> optimus dev" },
            { type: "output", text: "" },
            { type: "output", text: "  ▲ Optimus  ready in 312ms" },
            { type: "output", text: "  ➜  Local:   http://localhost:3000" },
            { type: "output", text: "  ➜  Network: use --host to expose" },
          ])
        } else {
          push([{ type: "output", text: `${name} ${args.join(" ")}: done` }])
        }
        break
      case "clear":
        setLines([])
        onClear?.()
        break
      default:
        push([{ type: "error", text: `command not found: ${name}` }])
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    if (e.key === "Enter") {
      run(input)
      if (input.trim()) {
        setHistory((h) => [...h, input])
      }
      setHistoryIndex(-1)
      setInput("")
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (history.length === 0) return
      const idx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(idx)
      setInput(history[idx])
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex === -1) return
      const idx = historyIndex + 1
      if (idx >= history.length) {
        setHistoryIndex(-1)
        setInput("")
      } else {
        setHistoryIndex(idx)
        setInput(history[idx])
      }
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col border-t border-border bg-card">
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-border px-3">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Terminal</span>
        </div>
        <button
          type="button"
          onClick={() => setLines([])}
          aria-label="Clear terminal"
          className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="flex-1 overflow-auto px-3 py-2 font-mono text-xs leading-5"
      >
        {lines.map((line) => (
          <div
            key={line.id}
            className={
              line.type === "error"
                ? "text-destructive"
                : line.type === "input"
                  ? "text-foreground"
                  : "text-muted-foreground"
            }
          >
            {line.type === "input" ? (
              <span>
                <span className="text-foreground/50">$ </span>
                {line.text}
              </span>
            ) : (
              <span className="whitespace-pre-wrap">{line.text || "\u00A0"}</span>
            )}
          </div>
        ))}
        <div className="flex items-center text-foreground">
          <span className="text-foreground/50">$&nbsp;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal input"
            className="flex-1 bg-transparent font-mono text-xs text-foreground outline-none"
          />
        </div>
      </div>
    </div>
  )
}
