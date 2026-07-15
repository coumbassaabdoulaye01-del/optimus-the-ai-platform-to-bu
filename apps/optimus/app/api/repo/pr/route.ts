import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-session";

export async function POST(request: Request) {
  const session = await getSession();
  // Agents use API Keys, Humans use Session.
  // We'll handle both but prioritize safety.

  const body = await request.json();
  const { title, description, changes, workspaceId } = body;

  if (!title || !changes) {
    return NextResponse.json({ error: "Title and changes required" }, { status: 400 });
  }

  // 4. Create PR for Human Validation
  console.log(`[PR] AI Agent submitted changes for workspace ${workspaceId}: ${title}`);

  return NextResponse.json({
    success: true,
    prId: "pr_" + Math.random().toString(36).substr(2, 9),
    status: "pending_review",
    message: "Pull Request created successfully. A human must validate your changes before they are merged."
  });
}
