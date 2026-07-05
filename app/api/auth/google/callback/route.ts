import { NextResponse, type NextRequest } from "next/server"
import { googleCallbackUrl, setSessionToken } from "@/lib/auth-session"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const storedState = request.cookies.get("google_oauth_state")?.value
  const ideUrl = new URL("/ide", origin)

  if (!code) {
    ideUrl.searchParams.set("auth_error", "missing_code")
    return NextResponse.redirect(ideUrl)
  }
  if (!state || state !== storedState) {
    ideUrl.searchParams.set("auth_error", "state_mismatch")
    return NextResponse.redirect(ideUrl)
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    ideUrl.searchParams.set("auth_error", "server_config")
    return NextResponse.redirect(ideUrl)
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: googleCallbackUrl(origin),
    }),
  })

  const tokenData = (await tokenRes.json()) as { access_token?: string; error?: string }
  if (!tokenData.access_token) {
    ideUrl.searchParams.set("auth_error", tokenData.error ?? "token_exchange_failed")
    return NextResponse.redirect(ideUrl)
  }

  await setSessionToken("google", tokenData.access_token)
  const res = NextResponse.redirect(ideUrl)
  res.cookies.delete("google_oauth_state")
  return res
}
