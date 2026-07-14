import { NextResponse } from "next/server";

// 1. Mock Database for API Keys and Credits
const MOCK_API_KEYS: Record<string, { credits: number, ownerId: string }> = {
  "opt_live_test_789456123": { credits: 5000, ownerId: "enterprise_client_01" }
};

export async function POST(request: Request) {
  // 2. Security: Validate X-Optimus-API-Key
  const apiKey = request.headers.get("X-Optimus-API-Key");
  if (!apiKey || !MOCK_API_KEYS[apiKey]) {
    return NextResponse.json({ error: "Invalid or missing Optimus API Key" }, { status: 401 });
  }

  const client = MOCK_API_KEYS[apiKey];
  const SPAWN_COST = 50.0; // 50 credits per spawn

  // 3. Credit Check & Deduction
  if (client.credits < SPAWN_COST) {
    return NextResponse.json({ error: "Insufficient credits to spawn new agent environment" }, { status: 402 });
  }

  try {
    const body = await request.json();
    const { template = "docker-workspaces" } = body;

    // Simulate successful provisioning latency
    await new Promise(resolve => setTimeout(resolve, 800));

    const workspaceId = `agent-ws-${Math.random().toString(36).substring(7)}`;
    client.credits -= SPAWN_COST; // Deduct credits

    // 5. Return Secure Access Details for the AI Agent
    return NextResponse.json({
      success: true,
      workspaceId,
      access: {
        ssh: `ssh agent@${workspaceId}.optimus.run`,
        http: `https://${workspaceId}.ide.optimus.com`,
        token: "opt_agent_session_" + Math.random().toString(36).substring(10)
      },
      remainingCredits: client.credits,
      message: "Isolated AI environment provisioned successfully via Optimus-IDE Engine."
    });

  } catch (error) {
    console.error("Provisioning Failure:", error);
    return NextResponse.json({ error: "Failed to provision environment", details: (error as Error).message }, { status: 500 });
  }
}
