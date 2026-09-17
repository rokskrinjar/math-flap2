import { eq, sql } from "drizzle-orm";
import { getDb } from "./index";
import { players } from "./schema";

const COOKIE_NAME = "skysum_player";
const ADJECTIVES = [
  "Azure", "Brave", "Bright", "Calm", "Clever", "Cosmic", "Daring", "Golden",
  "Happy", "Jolly", "Kind", "Lucky", "Mighty", "Nimble", "Quick", "Silver",
  "Smart", "Sunny", "Swift", "Wise",
];
const ANIMALS = [
  "Badger", "Bear", "Dolphin", "Falcon", "Fox", "Hare", "Koala", "Lynx",
  "Otter", "Owl", "Panda", "Raven", "Seal", "Tiger", "Turtle", "Wolf",
];

export type AnonymousPlayer = {
  id: string;
  nickname: string;
  setCookie: string | null;
};

export type LeaderboardEntry = {
  rank: number;
  nickname: string;
  score: number;
  isYou: boolean;
};

function parseCookie(request: Request, name: string) {
  const cookie = request.headers.get("cookie") ?? "";
  for (const part of cookie.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return null;
}

function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashToken(token: string) {
  const data = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function nicknameCandidate() {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const number = Math.floor(Math.random() * 90) + 10;
  return `${adjective}${animal}${number}`;
}

export async function getOrCreatePlayer(request: Request): Promise<AnonymousPlayer> {
  const db = getDb();
  const existingToken = parseCookie(request, COOKIE_NAME);
  if (existingToken && /^[a-f0-9]{64}$/.test(existingToken)) {
    const tokenHash = await hashToken(existingToken);
    const [existing] = await db
      .select({ id: players.id, nickname: players.nickname })
      .from(players)
      .where(eq(players.tokenHash, tokenHash))
      .limit(1);
    if (existing) return { ...existing, setCookie: null };
  }

  const token = randomToken();
  const tokenHash = await hashToken(token);
  const id = crypto.randomUUID();
  const createdAt = Date.now();

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const nickname = nicknameCandidate();
    // A unique-constraint collision inserts nothing and returns no row; try another nickname.
    const inserted = await db
      .insert(players)
      .values({ id, nickname, tokenHash, createdAt })
      .onConflictDoNothing()
      .returning({ id: players.id });
    if (inserted.length) {
      return {
        id,
        nickname,
        setCookie: `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=31536000; HttpOnly${new URL(request.url).protocol === "https:" ? "; Secure" : ""}; SameSite=Lax`,
      };
    }
  }
  throw new Error("Could not allocate a unique anonymous nickname.");
}

export function jsonForPlayer(player: AnonymousPlayer, body: unknown, status = 200) {
  const headers = new Headers({ "content-type": "application/json; charset=utf-8" });
  if (player.setCookie) headers.set("set-cookie", player.setCookie);
  return new Response(JSON.stringify(body), { status, headers });
}

export function utcDayStart(now = Date.now()) {
  const date = new Date(now);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export async function getDailyLeaderboard(playerId: string) {
  const dayStart = utcDayStart();
  const dayEnd = dayStart + 86_400_000;
  // DISTINCT ON keeps each player's best score today, and the earliest run that achieved it.
  const { rows } = await getDb().execute<{
    player_id: string;
    nickname: string;
    score: number;
    rank: string | number;
  }>(sql`
    WITH best AS (
      SELECT DISTINCT ON (r.player_id)
             r.player_id, r.score, r.completed_at AS achieved_at
      FROM runs r
      WHERE r.completed_at >= ${dayStart} AND r.completed_at < ${dayEnd} AND r.score IS NOT NULL
      ORDER BY r.player_id, r.score DESC, r.completed_at ASC
    ), ranked AS (
      SELECT b.player_id, p.nickname, b.score,
             ROW_NUMBER() OVER (ORDER BY b.score DESC, b.achieved_at ASC) AS rank
      FROM best b
      JOIN players p ON p.id = b.player_id
    )
    SELECT player_id, nickname, score, rank
    FROM ranked
    WHERE rank <= 10 OR player_id = ${playerId}
    ORDER BY rank ASC
  `);

  const entries: LeaderboardEntry[] = rows.map((row) => ({
    rank: Number(row.rank),
    nickname: row.nickname,
    score: Number(row.score),
    isYou: row.player_id === playerId,
  }));
  return {
    entries: entries.filter((entry) => entry.rank <= 10),
    you: entries.find((entry) => entry.isYou) ?? null,
    resetsAt: dayEnd,
  };
}
