import "server-only";

import { Pool } from "pg";

// Direct Postgres access to the same `Article` table the dashboard writes to,
// bypassing Supabase's PostgREST/Storage/Auth layer entirely.
//
// Added 23 Sep 2026: Supabase froze the whole project's REST API with a 402
// "exceed_egress_quota" after a query bug (fixed the same day, see
// lib/content/index.ts) pushed free-tier DB egress to 340% of the 5GB
// monthly cap. That block only covers PostgREST/Storage/Auth — the raw
// Postgres connection through Supabase's own pgbouncer pooler kept working
// throughout the outage (verified directly). Reading over this connection
// instead of `@supabase/supabase-js` keeps the whole site's reads off the
// layer Supabase actually throttles, so a future egress spike degrades the
// listing pages' freshness at worst, not the whole site.
//
// Pooler, transaction mode, matches the dashboard's DATABASE_URL. `max: 1`
// because pgbouncer already pools connections server-side; a serverless
// function holding more than one of its own defeats that.
let pool: Pool | null = null;

export function pgPool(): Pool {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set — required for direct Postgres reads.");
  }

  pool = new Pool({
    connectionString,
    max: 1,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 15_000,
  });
  pool.on("error", (err) => {
    // A dropped idle connection must not crash the process; the next query
    // opens a fresh one from the pool.
    console.error("[pg] idle client error:", err.message);
  });
  return pool;
}
