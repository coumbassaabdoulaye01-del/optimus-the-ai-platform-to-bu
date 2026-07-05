import { NextResponse } from "next/server"
import { getSessionToken } from "@/lib/github-session"
import { getCentralRepo, getRepo, getTree } from "@/lib/github"

export async function GET() {
  const token = await getSessionToken()
  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  try {
    const central = getCentralRepo()
    const info = await getRepo(token, central)
    const entries = await getTree(token, central, info.default_branch)
    const files = entries
      .filter((e) => e.type === "blob" || e.type === "tree")
      .map((e) => ({ path: e.path, type: e.type }))
    return NextResponse.json({
      repo: `${central.owner}/${central.repo}`,
      defaultBranch: info.default_branch,
      canPush: Boolean(info.permissions?.push),
      files,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "failed" },
      { status: 500 },
    )
  }
}
