import { NextResponse } from "next/server";
import { setSession, UserRole } from "@/lib/auth-session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", request.url));
  }

  try {
    // 1. Exchange GitHub code for access token
    const ghResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const ghData = await ghResponse.json();
    if (ghData.error) throw new Error(ghData.error_description);

    // 2. Get GitHub user info
    const userResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${ghData.access_token}` },
    });
    const ghUser = await userResponse.json();

    // 3. Keycloak Role Integration (Mock logic as requested)
    // In a real system, we'd sync this with a Keycloak instance.
    const roles: UserRole[] = ["pc-dev-access"];
    if (ghUser.plan === "pro" || ghUser.followers > 100) {
      roles.push("premium-vm-ia");
    }

    // 4. Secure Session Management (GitHub-Only, no passwords)
    await setSession({
      user: {
        id: ghUser.id.toString(),
        email: ghUser.email || `${ghUser.login}@github.optimus`,
        name: ghUser.name || ghUser.login,
        roles: roles,
        githubToken: ghData.access_token, // Used for isolated repo cloning
      },
      accessToken: "opt_internal_" + Math.random().toString(36).substring(7),
    });

    // Redirect to IDE dashboard
    return NextResponse.redirect(new URL("/ide", request.url));
  } catch (error) {
    console.error("Critical Auth Error:", error);
    return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
  }
}
