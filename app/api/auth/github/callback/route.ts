import { NextResponse, type NextRequest } from "next/server"
import { callbackUrl, setSessionToken } from "@/lib/github-session"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const storedState = request.cookies.get("gh_oauth_state")?.value

  const ideUrl = new URL("/ide", origin)

  if (!code) {
    ideUrl.searchParams.set("auth_error", "missing_code")
    return NextResponse.redirect(ideUrl)
  }
  if (!state || state !== storedState) {
    ideUrl.searchParams.set("auth_error", "state_mismatch")
    return NextResponse.redirect(ideUrl)
  }

  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    ideUrl.searchParams.set("auth_error", "server_config")
    return NextResponse.redirect(ideUrl)
  }

  // Exchange the code for an access token.
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: callbackUrl(origin),
    }),
  })

  const tokenData = (await tokenRes.json()) as {
    access_token?: string
    error?: string
  }

  if (!tokenData.access_token) {
    ideUrl.searchParams.set("auth_error", tokenData.error ?? "token_exchange_failed")
    return NextResponse.redirect(ideUrl)
  }

  await setSessionToken(tokenData.access_token)

  const res = NextResponse.redirect(ideUrl)
  res.cookies.delete("gh_oauth_state")
  return res
}
