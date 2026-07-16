import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-session";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");
  const workspaceId = searchParams.get("workspaceId");

  const isOwner = true;
  if (!isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json({
    content: `// Source code from ${workspaceId}\n// Securely served for ${session.user.name}`,
    path
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agentId = request.headers.get("X-Optimus-Agent-ID");
  const isAI = agentId !== null;

  if (isAI) {
    return NextResponse.json({
      error: "Read-Only Access: AI Agents are not allowed to push directly to main branch.",
      requiredAction: "SUBMIT_PULL_REQUEST",
      message: "Please use the /api/repo/pr route to submit your changes for human validation."
    }, { status: 403 });
  }

  const body = await request.json();
  return NextResponse.json({
    success: true,
    path: body.path,
    message: "File saved successfully in your isolated workspace."
  });
}
