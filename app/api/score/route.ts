import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { getDailyLeaderboard, getOrCreatePlayer, jsonForPlayer } from "@/db/leaderboard";
import { runs } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const player = await getOrCreatePlayer(request);
    const payload = (await request.json()) as { runId?: unknown; score?: unknown };
    const runId = typeof payload.runId === "string" ? payload.runId : "";
    const score = payload.score;
    if (!runId || typeof score !== "number" || !Number.isInteger(score) || score < 0 || score > 500) {
      return jsonForPlayer(player, { error: "Invalid score submission." }, 400);
    }

    const db = getDb();
    const activeRun = and(eq(runs.id, runId), eq(runs.playerId, player.id), isNull(runs.completedAt));
    const [run] = await db.select({ startedAt: runs.startedAt }).from(runs).where(activeRun).limit(1);
    if (!run) return jsonForPlayer(player, { error: "This run is no longer active." }, 409);

    const completedAt = Date.now();
    const elapsed = completedAt - run.startedAt;
    const minimumPlausibleMs = Math.max(500, score * 1200);
    if (elapsed < minimumPlausibleMs || elapsed > 7_200_000) {
      return jsonForPlayer(player, { error: "This run could not be verified." }, 422);
    }

    // The completed_at IS NULL guard makes this atomic: a racing double-submit updates 0 rows.
    const updated = await db
      .update(runs)
      .set({ completedAt, score })
      .where(activeRun)
      .returning({ id: runs.id });
    if (!updated.length) {
      return jsonForPlayer(player, { error: "This run was already submitted." }, 409);
    }

    const leaderboard = await getDailyLeaderboard(player.id);
    return jsonForPlayer(player, { nickname: player.nickname, ...leaderboard });
  } catch (error) {
    console.error("score submission failed", error);
    return Response.json({ error: "Your score could not be submitted." }, { status: 503 });
  }
}
