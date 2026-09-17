import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set.");
  return drizzle(neon(url), { schema });
}

let db: ReturnType<typeof createDb> | undefined;

// Created lazily so `next build` doesn't need database credentials.
export function getDb() {
  db ??= createDb();
  return db;
}
