import { cookies } from "next/headers"

export type AuthProvider = "github" | "google"

const GITHUB_COOKIE = "gh_session"
const GOOGLE_COOKIE = "google_session"
const PROVIDER_COOKIE = "auth_provider"
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

const providerCookie = (provider: AuthProvider) =>
  provider === "github" ? GITHUB_COOKIE : GOOGLE_COOKIE

export async function setSessionToken(provider: AuthProvider, token: string) {
  const store = await cookies()
  store.set(providerCookie(provider), token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  })
  store.set(PROVIDER_COOKIE, provider, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  })
}

export async function getProviderSessionToken(provider: AuthProvider): Promise<string | null> {
  const store = await cookies()
  return store.get(providerCookie(provider))?.value ?? null
}

export async function getSessionToken(): Promise<string | null> {
  return getProviderSessionToken("github")
}

export async function getCurrentAuthProvider(): Promise<AuthProvider | null> {
  const store = await cookies()
  const provider = store.get(PROVIDER_COOKIE)?.value
  if (provider === "github" || provider === "google") return provider
  if (store.get(GITHUB_COOKIE)?.value) return "github"
  if (store.get(GOOGLE_COOKIE)?.value) return "google"
  return null
}

export async function clearSessionToken() {
  const store = await cookies()
  store.delete(GITHUB_COOKIE)
  store.delete(GOOGLE_COOKIE)
  store.delete(PROVIDER_COOKIE)
}

export function githubCallbackUrl(origin: string): string {
  return `${origin}/api/auth/github/callback`
}

export function googleCallbackUrl(origin: string): string {
  return `${origin}/api/auth/google/callback`
}
