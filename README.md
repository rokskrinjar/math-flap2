# SkySum

A one-tap, Flappy-Bird-style browser game: fly the owl through the gap showing the right answer to an arithmetic question. There's a daily top-10 leaderboard that resets at midnight UTC. Players are anonymous and identified by an HttpOnly cookie. There's no login.

Stack: Next.js (App Router, TypeScript) on Vercel, Postgres on Neon, Drizzle ORM.

## Layout

| Path | Purpose |
| --- | --- |
| `public/game.html` | The entire game (canvas, physics, questions, UI). Copied verbatim from v1; don't edit. |
| `public/math-owl.png` | Owl sprite |
| `app/page.tsx` | Full-screen iframe that loads `/game.html` |
| `app/api/player/route.ts` | `POST`: get or create the anonymous player |
| `app/api/run/route.ts` | `POST`: start a server-tracked run |
| `app/api/score/route.ts` | `POST`: validate and record a finished run |
| `app/api/leaderboard/route.ts` | `GET`: today's leaderboard |
| `db/schema.ts` | Drizzle schema (`players`, `runs`) |
| `db/leaderboard.ts` | Cookie identity, nicknames, and the leaderboard query |
| `drizzle/` | SQL migrations |

## Local setup

Requires Node.js 20.9+ and pnpm (`corepack enable` provides the version pinned in `package.json`).

```bash
pnpm install
```

Create `.env.local` with a Postgres connection string:

```
DATABASE_URL=postgresql://user:password@host/db?sslmode=require
```

Copy the value from the database page in Vercel (Storage → the Neon database → Quickstart → `.env.local`). `vercel env pull` doesn't work for this: the Neon integration stores the variable as sensitive, so it downloads empty.

Apply the migrations, then start the dev server:

```bash
pnpm db:migrate
pnpm dev
```

Open http://localhost:3000.

If you change `db/schema.ts`, run `pnpm db:generate` to create a new migration in `drizzle/`. Commit the migration, then run `pnpm db:migrate`.

## Deploy to Vercel

1. Import the GitHub repo in Vercel. It detects Next.js on its own, so no build settings are needed.
2. In the project, open **Storage → Create → Neon** and connect it. This sets `DATABASE_URL` for Preview and Production.
3. Deploys don't run migrations. With the production `DATABASE_URL` in `.env.local` (see above), run them once, and again after each schema change:

   ```bash
   pnpm db:migrate
   ```

After that, every push to `main` deploys.
