const GH_API = "https://api.github.com"

export type GitHubUser = {
  login: string
  name: string | null
  avatar_url: string
  html_url: string
}

export type RepoRef = { owner: string; repo: string }

/** Parse the "owner/repo" env var into a RepoRef. */
export function getCentralRepo(): RepoRef {
  const raw = process.env.GITHUB_CENTRAL_REPO ?? ""
  const [owner, repo] = raw.split("/")
  if (!owner || !repo) {
    throw new Error(
      "GITHUB_CENTRAL_REPO must be set in the format 'owner/repo'",
    )
  }
  return { owner, repo }
}

async function gh<T>(
  token: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${GH_API}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`GitHub API ${res.status}: ${body}`)
  }
  return res.json() as Promise<T>
}

export async function getUser(token: string): Promise<GitHubUser> {
  return gh<GitHubUser>(token, "/user")
}

export type RepoInfo = {
  default_branch: string
  full_name: string
  html_url: string
  permissions?: { push?: boolean }
}

export async function getRepo(
  token: string,
  { owner, repo }: RepoRef,
): Promise<RepoInfo> {
  return gh<RepoInfo>(token, `/repos/${owner}/${repo}`)
}

export type TreeEntry = {
  path: string
  mode: string
  type: "blob" | "tree" | "commit"
  sha: string
}

/** Recursive git tree for a branch. */
export async function getTree(
  token: string,
  { owner, repo }: RepoRef,
  branch: string,
): Promise<TreeEntry[]> {
  const data = await gh<{ tree: TreeEntry[]; truncated: boolean }>(
    token,
    `/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
  )
  return data.tree
}

/** Raw text content of a file at a given ref. */
export async function getFileContent(
  token: string,
  { owner, repo }: RepoRef,
  path: string,
  ref: string,
): Promise<{ content: string; sha: string }> {
  const data = await gh<{ content: string; encoding: string; sha: string }>(
    token,
    `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(ref)}`,
  )
  const content =
    data.encoding === "base64"
      ? Buffer.from(data.content, "base64").toString("utf-8")
      : data.content
  return { content, sha: data.sha }
}

/** Fork the central repo into the authenticated user's account (idempotent). */
export async function forkRepo(
  token: string,
  { owner, repo }: RepoRef,
): Promise<{ owner: string; repo: string }> {
  const data = await gh<{ owner: { login: string }; name: string }>(
    token,
    `/repos/${owner}/${repo}/forks`,
    { method: "POST", body: JSON.stringify({}) },
  )
  return { owner: data.owner.login, repo: data.name }
}

async function getRef(
  token: string,
  { owner, repo }: RepoRef,
  branch: string,
): Promise<string | null> {
  try {
    const data = await gh<{ object: { sha: string } }>(
      token,
      `/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(branch)}`,
    )
    return data.object.sha
  } catch {
    return null
  }
}

async function createBranch(
  token: string,
  fork: RepoRef,
  branch: string,
  sha: string,
): Promise<void> {
  await gh(token, `/repos/${fork.owner}/${fork.repo}/git/refs`, {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha }),
  })
}

async function getContentSha(
  token: string,
  { owner, repo }: RepoRef,
  path: string,
  branch: string,
): Promise<string | undefined> {
  try {
    const data = await gh<{ sha: string }>(
      token,
      `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`,
    )
    return data.sha
  } catch {
    return undefined
  }
}

export type FileChange = { path: string; content: string }

/**
 * Full contribution flow:
 * 1. Fork the central repo (if not already forked)
 * 2. Create a new branch on the fork from the central default branch
 * 3. Commit the changed files to that branch
 * 4. Open a pull request from the fork branch to the central repo
 */
export async function createPullRequest(
  token: string,
  central: RepoRef,
  opts: { title: string; body: string; changes: FileChange[] },
): Promise<{ url: string; number: number }> {
  const repoInfo = await getRepo(token, central)
  const baseBranch = repoInfo.default_branch

  const me = await getUser(token)
  const fork: RepoRef = { owner: me.login, repo: central.repo }

  // Ensure the fork exists (idempotent). If the user IS the owner, use central directly.
  const headOwnerIsCentral = me.login.toLowerCase() === central.owner.toLowerCase()
  const workRepo = headOwnerIsCentral ? central : fork
  if (!headOwnerIsCentral) {
    await forkRepo(token, central)
    // Give the fork a moment to be created; poll for its default branch ref.
    let ready = false
    for (let i = 0; i < 10; i++) {
      const sha = await getRef(token, workRepo, baseBranch)
      if (sha) {
        ready = true
        break
      }
      await new Promise((r) => setTimeout(r, 1500))
    }
    if (!ready) {
      throw new Error("Fork is not ready yet. Please try again in a few seconds.")
    }
  }

  // Base sha to branch from.
  const baseSha =
    (await getRef(token, workRepo, baseBranch)) ??
    (await getRef(token, central, baseBranch))
  if (!baseSha) throw new Error("Could not resolve base branch SHA")

  const branch = `optimus-edit-${Date.now()}`
  await createBranch(token, workRepo, branch, baseSha)

  // Commit each changed file to the new branch.
  for (const change of opts.changes) {
    const existingSha = await getContentSha(token, workRepo, change.path, branch)
    await gh(token, `/repos/${workRepo.owner}/${workRepo.repo}/contents/${encodeURIComponent(change.path)}`, {
      method: "PUT",
      body: JSON.stringify({
        message: `Update ${change.path}`,
        content: Buffer.from(change.content, "utf-8").toString("base64"),
        branch,
        ...(existingSha ? { sha: existingSha } : {}),
      }),
    })
  }

  // Open the pull request against the central repo.
  const head = headOwnerIsCentral ? branch : `${me.login}:${branch}`
  const pr = await gh<{ html_url: string; number: number }>(
    token,
    `/repos/${central.owner}/${central.repo}/pulls`,
    {
      method: "POST",
      body: JSON.stringify({
        title: opts.title,
        body: opts.body,
        head,
        base: baseBranch,
      }),
    },
  )
  return { url: pr.html_url, number: pr.number }
}
