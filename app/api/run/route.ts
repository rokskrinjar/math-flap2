import { getDb } from "@/db";
import { getOrCreatePlayer, jsonForPlayer } from "@/db/leaderboard";
import { runs } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const player = await getOrCreatePlayer(request);
    const runId = crypto.randomUUID();
    await getDb().insert(runs).values({ id: runId, playerId: player.id, startedAt: Date.now() });
    return jsonForPlayer(player, { runId, nickname: player.nickname }, 201);
  } catch (error) {
    console.error("run creation failed", error);
    return Response.json({ error: "A new run could not be started." }, { status: 503 });
  }
}
