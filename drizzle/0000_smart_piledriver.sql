CREATE TABLE "players" (
	"id" text PRIMARY KEY NOT NULL,
	"nickname" text NOT NULL,
	"token_hash" text NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "runs" (
	"id" text PRIMARY KEY NOT NULL,
	"player_id" text NOT NULL,
	"started_at" bigint NOT NULL,
	"completed_at" bigint,
	"score" integer
);
--> statement-breakpoint
ALTER TABLE "runs" ADD CONSTRAINT "runs_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_players_nickname" ON "players" USING btree ("nickname");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_players_token_hash" ON "players" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "idx_runs_player_started" ON "runs" USING btree ("player_id","started_at");--> statement-breakpoint
CREATE INDEX "idx_runs_completed_score" ON "runs" USING btree ("completed_at","score");