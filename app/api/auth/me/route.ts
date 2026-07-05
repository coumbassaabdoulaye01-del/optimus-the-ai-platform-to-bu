import { NextResponse } from "next/server"
import { getCurrentAuthProvider, getProviderSessionToken } from "@/lib/auth-session"
import { getCentralRepo, getUser } from "@/lib/github"
import { getGoogleUser } from "@/lib/google"

export async function GET() {
  const provider = await getCurrentAuthProvider()
  if (!provider) {
    return NextResponse.json({ authenticated: false }, { status: 200 })
  }

  const token = await getProviderSessionToken(provider)
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 })
  }

  try {
    let repo: string | null = null
    try {
      const central = getCentralRepo()
      repo = `${central.owner}/${central.repo}`
    } catch {
      repo = null
    }

    if (provider === "google") {
      const user = await getGoogleUser(token)
      return NextResponse.json({
        authenticated: true,
        provider,
        canUseRepository: false,
        user: {
          login: user.email,
          name: user.name,
          avatarUrl: user.picture ?? "",
          htmlUrl: user.profile ?? "",
        },
        repo,
      })
    }

    const user = await getUser(token)
    return NextResponse.json({
      authenticated: true,
      provider,
      canUseRepository: true,
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
