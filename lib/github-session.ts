export {
  clearSessionToken,
  getSessionToken,
  githubCallbackUrl as callbackUrl,
  setSessionToken as setProviderSessionToken,
} from "./auth-session"

import { setSessionToken as setProviderSessionToken } from "./auth-session"

export async function setSessionToken(token: string) {
  await setProviderSessionToken("github", token)
}
