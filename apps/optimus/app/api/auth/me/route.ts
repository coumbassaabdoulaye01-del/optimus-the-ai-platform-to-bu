import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-session";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized", authenticated: false }, { status: 401 });
  }

  // 5. Fetch Credit Balance & Active Workspaces from Optimus Engine
  // (Mocking the connection to Keycloak/Coder database)
  const userStats = {
    creditBalance: 2450.75, // $24.50 equivalent
    activeWorkspaces: [
      {
        id: "ws-optimus-01",
        name: "Dev-Environment-Main",
        status: "running",
        provider: "optimus-ide",
        uptime: "4h 12m"
      },
      {
        id: "ws-optimus-02",
        name: "AI-Agent-Sandbox",
        status: "stopped",
        provider: "optimus-ide",
        uptime: "0s"
      }
    ]
  };

  return NextResponse.json({
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      roles: session.user.roles,
    },
    credits: userStats.creditBalance,
    workspaces: userStats.activeWorkspaces,
    authenticated: true
  });
}
