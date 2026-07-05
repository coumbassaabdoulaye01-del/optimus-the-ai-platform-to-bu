export type FileNode = {
  type: "file"
  name: string
  content: string
  language: string
}

export type FolderNode = {
  type: "folder"
  name: string
  children: TreeNode[]
}

export type TreeNode = FileNode | FolderNode

export function detectLanguage(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase()
  switch (ext) {
    case "ts":
    case "tsx":
      return "typescript"
    case "js":
    case "jsx":
      return "javascript"
    case "json":
      return "json"
    case "css":
      return "css"
    case "md":
      return "markdown"
    case "html":
      return "html"
    default:
      return "plaintext"
  }
}

export const initialTree: TreeNode[] = [
  {
    type: "folder",
    name: "src",
    children: [
      {
        type: "file",
        name: "index.ts",
        language: "typescript",
        content: `import { greet } from "./utils"

// Entry point for the Optimus runtime
function main() {
  const message = greet("developer")
  console.log(message)
}

main()
`,
      },
      {
        type: "file",
        name: "utils.ts",
        language: "typescript",
        content: `export function greet(name: string): string {
  return \`Hello, \${name}! Welcome to Optimus IDE.\`
}

export function sum(numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0)
}
`,
      },
    ],
  },
  {
    type: "folder",
    name: "public",
    children: [
      {
        type: "file",
        name: "styles.css",
        language: "css",
        content: `:root {
  --brand: #111111;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
`,
      },
    ],
  },
  {
    type: "file",
    name: "package.json",
    language: "json",
    content: `{
  "name": "optimus-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "optimus dev",
    "build": "optimus build"
  }
}
`,
  },
  {
    type: "file",
    name: "README.md",
    language: "markdown",
    content: `# Optimus App

A project scaffolded in the Optimus web IDE.

## Getting started

Run the dev server:

\`\`\`
npm run dev
\`\`\`
`,
  },
]

export function findFile(nodes: TreeNode[], path: string): FileNode | null {
  const parts = path.split("/").filter(Boolean)
  let current: TreeNode[] = nodes
  for (let i = 0; i < parts.length; i++) {
    const node = current.find((n) => n.name === parts[i])
    if (!node) return null
    if (i === parts.length - 1) {
      return node.type === "file" ? node : null
    }
    if (node.type !== "folder") return null
    current = node.children
  }
  return null
}

export function updateFileContent(nodes: TreeNode[], path: string, content: string): TreeNode[] {
  const parts = path.split("/").filter(Boolean)
  const walk = (list: TreeNode[], depth: number): TreeNode[] =>
    list.map((node) => {
      if (node.name !== parts[depth]) return node
      if (depth === parts.length - 1 && node.type === "file") {
        return { ...node, content }
      }
      if (node.type === "folder") {
        return { ...node, children: walk(node.children, depth + 1) }
      }
      return node
    })
  return walk(nodes, 0)
}

export function listPaths(nodes: TreeNode[], prefix = ""): string[] {
  const paths: string[] = []
  for (const node of nodes) {
    const full = prefix ? `${prefix}/${node.name}` : node.name
    if (node.type === "folder") {
      paths.push(`${full}/`)
      paths.push(...listPaths(node.children, full))
    } else {
      paths.push(full)
    }
  }
  return paths
}
