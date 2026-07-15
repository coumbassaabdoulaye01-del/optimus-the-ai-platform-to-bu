import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-session";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 1. Ownership & Isolation Check
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId");

  if (!workspaceId) return NextResponse.json({ error: "workspaceId required" }, { status: 400 });

  // Mock: Verify workspace ownership via Coder API
  const isOwner = true; // In prod: await verifyWorkspaceOwner(workspaceId, session.user.id);
  if (!isOwner) return NextResponse.json({ error: "Access Denied: Workspace isolation enforced" }, { status: 403 });

  // 2. Return tree structure
  return NextResponse.json({
    tree: [
      { name: "src", type: "directory", path: "src" },
      { name: "package.json", type: "file", path: "package.json" }
    ]
  });
}
