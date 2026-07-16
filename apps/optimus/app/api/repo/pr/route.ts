import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-session";

export async function POST(request: Request) {
  const session = await getSession();
  const apiKey = request.headers.get("X-Optimus-API-Key");

  if (!session && !apiKey) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = await request.json();
  const { title, branch, changes, workspaceId } = body;

  if (!title || !changes || !workspaceId) {
    return NextResponse.json({ error: "Missing required PR fields" }, { status: 400 });
  }

  const prId = `opt_pr_${Math.random().toString(36).substring(7)}`;

  console.log(`[Optimus Security] New PR created by agent ${request.headers.get("X-Optimus-Agent-ID") || "human"}`);

  return NextResponse.json({
    success: true,
    prId,
    status: "awaiting_human_validation",
    reviewUrl: `/review/${prId}`,
    message: "Your changes have been staged. A human developer will now review and validate your code before merge."
  });
}
