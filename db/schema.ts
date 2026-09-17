import { bigint, index, integer, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

// Timestamps are epoch milliseconds (Date.now()), not timestamptz.
export const players = pgTable(
  "players",
  {
    id: text("id").primaryKey(),
    nickname: text("nickname").notNull(),
    tokenHash: text("token_hash").notNull(),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
  },
  (table) => [
    uniqueIndex("idx_players_nickname").on(table.nickname),
    uniqueIndex("idx_players_token_hash").on(table.tokenHash),
  ],
);

export const runs = pgTable(
  "runs",
  {
    id: text("id").primaryKey(),
    playerId: text("player_id")
      .notNull()
      .references(() => players.id),
    startedAt: bigint("started_at", { mode: "number" }).notNull(),
    completedAt: bigint("completed_at", { mode: "number" }),
    score: integer("score"),
  },
  (table) => [
    index("idx_runs_player_started").on(table.playerId, table.startedAt),
    index("idx_runs_completed_score").on(table.completedAt, table.score),
  ],
);
