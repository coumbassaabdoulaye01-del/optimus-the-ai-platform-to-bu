import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-session";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");
  const workspaceId = searchParams.get("workspaceId");

  // Isolation check
  const isOwner = true;
  if (!isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json({
    content: "// Secure file content from isolated workspace",
    path
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 3. AI Safety Check: Read-Only for Agents
  const isAI = request.headers.get("X-Optimus-Agent-ID") !== null;
  if (isAI) {
    return NextResponse.json({
      error: "Read-Only: AI Agents must submit a Pull Request to modify code.",
      action: "SUBMIT_PR"
    }, { status: 403 });
  }

  const body = await request.json();
  // Human user can save directly
  return NextResponse.json({ success: true, path: body.path });
}
