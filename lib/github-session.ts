import { cookies } from "next/headers"

const COOKIE_NAME = "gh_session"
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

/**
 * The GitHub OAuth access token is stored in an httpOnly, secure cookie.
 * It is never exposed to client JavaScript.
 */
export async function setSessionToken(token: string) {
  const store = await cookies()
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  })
}

export async function getSessionToken(): Promise<string | null> {
  const store = await cookies()
  return store.get(COOKIE_NAME)?.value ?? null
}

export async function clearSessionToken() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

/** Build the OAuth callback URL from the incoming request origin. */
export function callbackUrl(origin: string): string {
  return `${origin}/api/auth/github/callback`
}
