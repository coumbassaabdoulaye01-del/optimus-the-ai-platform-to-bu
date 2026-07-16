export type GoogleUser = {
  sub: string
  name: string
  email: string
  picture?: string
  profile?: string
}

export async function getGoogleUser(token: string): Promise<GoogleUser> {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Google userinfo ${res.status}: ${body}`)
  }
  return res.json() as Promise<GoogleUser>
}
