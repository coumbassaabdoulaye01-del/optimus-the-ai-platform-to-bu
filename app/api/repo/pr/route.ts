import { NextResponse, type NextRequest } from "next/server"
import { getSessionToken } from "@/lib/github-session"
import { createPullRequest, getCentralRepo, type FileChange } from "@/lib/github"

export async function POST(request: NextRequest) {
  const token = await getSessionToken()
  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  let payload: { title?: string; body?: string; changes?: FileChange[] }
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  const changes = (payload.changes ?? []).filter(
    (c) => c && typeof c.path === "string" && typeof c.content === "string",
  )
  if (changes.length === 0) {
    return NextResponse.json({ error: "no_changes" }, { status: 400 })
  }
  const title = payload.title?.trim() || "Update from Optimus IDE"

  try {
    const central = getCentralRepo()
    const pr = await createPullRequest(token, central, {
      title,
      body:
        payload.body?.trim() ||
        "This pull request was created from the Optimus collaborative web IDE.",
      changes,
    })
    return NextResponse.json({ ok: true, url: pr.url, number: pr.number })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "failed" },
      { status: 500 },
    )
  }
}
