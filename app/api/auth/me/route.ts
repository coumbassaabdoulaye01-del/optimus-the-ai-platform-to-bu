import { NextResponse } from "next/server"
import { getSessionToken } from "@/lib/github-session"
import { getCentralRepo, getUser } from "@/lib/github"

export async function GET() {
  const token = await getSessionToken()
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 })
  }

  try {
    const user = await getUser(token)
    let repo: string | null = null
    try {
      const central = getCentralRepo()
      repo = `${central.owner}/${central.repo}`
    } catch {
      repo = null
    }
    return NextResponse.json({
      authenticated: true,
      user: {
        login: user.login,
        name: user.name,
        avatarUrl: user.avatar_url,
        htmlUrl: user.html_url,
      },
      repo,
    })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 })
  }
}
