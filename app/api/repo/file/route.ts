import { NextResponse, type NextRequest } from "next/server"
import { getSessionToken } from "@/lib/github-session"
import { getCentralRepo, getFileContent, getRepo } from "@/lib/github"

export async function GET(request: NextRequest) {
  const token = await getSessionToken()
  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const path = request.nextUrl.searchParams.get("path")
  if (!path) {
    return NextResponse.json({ error: "missing path" }, { status: 400 })
  }

  try {
    const central = getCentralRepo()
    const info = await getRepo(token, central)
    const { content, sha } = await getFileContent(token, central, path, info.default_branch)
    return NextResponse.json({ path, content, sha })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "failed" },
      { status: 500 },
    )
  }
}
