import { cookies } from "next/headers"

export type UserRole = "premium-vm-ia" | "pc-dev-access" | "standard"
export type AuthProvider = "github" | "google"

export interface User {
  id: string
  email: string
  name?: string
  roles: UserRole[]
  githubToken?: string
}

export interface Session {
  user: User
  accessToken: string
}

const SESSION_COOKIE = "optimus_session"
const GITHUB_COOKIE = "gh_session"
const GOOGLE_COOKIE = "google_session"
const PROVIDER_COOKIE = "auth_provider"
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function setSession(session: Session) {
  const store = await cookies()
  store.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  })
}

export async function setSessionToken(provider: AuthProvider, token: string) {
  const store = await cookies()
  const cookieName = provider === "github" ? GITHUB_COOKIE : GOOGLE_COOKIE
  store.set(cookieName, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  })
}

export async function getProviderSessionToken(provider: AuthProvider): Promise<string | null> {
  const store = await cookies()
  return store.get(provider === "github" ? GITHUB_COOKIE : GOOGLE_COOKIE)?.value ?? null
}

export async function getSessionToken(): Promise<string | null> {
  const provider = await getCurrentAuthProvider()
  if (!provider) return null
  return getProviderSessionToken(provider)
}

export async function getCurrentAuthProvider(): Promise<AuthProvider | null> {
  const store = await cookies()
  return (store.get(PROVIDER_COOKIE)?.value as AuthProvider) ?? null
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies()
  const sessionStr = store.get(SESSION_COOKIE)?.value
  if (!sessionStr) return null
  try {
    return JSON.parse(sessionStr) as Session
  } catch {
    return null
  }
}

export async function clearSession() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
  store.delete(GITHUB_COOKIE)
  store.delete(GOOGLE_COOKIE)
}

export async function clearSessionToken() {
  await clearSession()
}

export function googleCallbackUrl(origin: string): string {
  return `${origin}/api/auth/google/callback`
}

export function githubCallbackUrl(origin: string): string {
  return `${origin}/api/auth/github/callback`
}
