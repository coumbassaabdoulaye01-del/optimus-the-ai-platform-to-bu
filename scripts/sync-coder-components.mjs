import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import { execFileSync } from "node:child_process"

const sourceRepo = process.env.CODER_REPO_PATH ?? join(process.cwd(), "..", "coder")
const worktree = existsSync(join(sourceRepo, "site", "src", "components"))
  ? sourceRepo
  : join(process.cwd(), ".vendor-cache", "coder")
const componentsSource = join(worktree, "site", "src", "components")
const targetRoot = join(process.cwd(), "vendor", "coder", "site", "src", "components")
const manifestPath = join(process.cwd(), "vendor", "coder", "components-manifest.json")

if (!existsSync(componentsSource)) {
  mkdirSync(dirname(worktree), { recursive: true })
  execFileSync("git", ["clone", "--depth", "1", "https://github.com/coder/coder", worktree], {
    stdio: "inherit",
  })
}

rmSync(targetRoot, { force: true, recursive: true })
mkdirSync(targetRoot, { recursive: true })

const manifest = []
function copyTree(from, to) {
  mkdirSync(to, { recursive: true })
  for (const entry of readdirSync(from)) {
    const src = join(from, entry)
    const dest = join(to, entry)
    const stat = statSync(src)
    if (stat.isDirectory()) {
      copyTree(src, dest)
      continue
    }
    copyFileSync(src, dest)
    manifest.push(relative(targetRoot, dest))
  }
}

copyTree(componentsSource, targetRoot)
writeFileSync(
  manifestPath,
  `${JSON.stringify(
    {
      source: "https://github.com/coder/coder/tree/main/site/src/components",
      syncedAt: new Date().toISOString(),
      files: manifest.sort(),
    },
    null,
    2,
  )}\n`,
)

console.log(`Synced ${manifest.length} Coder component files to ${targetRoot}`)
