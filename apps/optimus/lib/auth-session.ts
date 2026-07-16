import { cookies } from "next/headers"

export type UserRole = "premium-vm-ia" | "pc-dev-access" | "standard"

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
}
