import { NextResponse } from "next/server";

const SPAWN_COSTS = { pod: 50.0, vm: 150.0 };
const MOCK_API_KEYS: Record<string, { credits: number, ownerId: string }> = {
  "opt_live_test_789456123": { credits: 5000, ownerId: "enterprise_client_01" }
};

export async function POST(request: Request) {
  const apiKey = request.headers.get("X-Optimus-API-Key");
  if (!apiKey || !MOCK_API_KEYS[apiKey]) return NextResponse.json({ error: "Invalid API Key" }, { status: 401 });

  const client = MOCK_API_KEYS[apiKey];
  const body = await request.json();
  const { type = "pod", template = "default" } = body;
  const cost = type === "vm" ? SPAWN_COSTS.vm : SPAWN_COSTS.pod;

  if (client.credits < cost) return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });

  const resourceId = `${type}-optimus-${Math.random().toString(36).substring(7)}`;
  client.credits -= cost;

  return NextResponse.json({
    success: true,
    id: resourceId,
    type,
    access: {
      endpoint: `${resourceId}.optimus.run`,
      ssh: `ssh optimus@${resourceId}.run`,
      http: `https://${resourceId}.ide.optimus.com`
    },
    remainingCredits: client.credits,
    ttl: "2h"
  });
}
