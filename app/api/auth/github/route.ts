import { NextResponse, type NextRequest } from "next/server"
import { callbackUrl } from "@/lib/github-session"

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: "GITHUB_CLIENT_ID is not set" }, { status: 500 })
  }

  const origin = request.nextUrl.origin
  const state = crypto.randomUUID()

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl(origin),
    scope: "read:user repo",
    state,
    allow_signup: "true",
  })

  const res = NextResponse.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`)
  // Store state to validate against CSRF on callback.
  res.cookies.set("gh_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  })
  return res
}
