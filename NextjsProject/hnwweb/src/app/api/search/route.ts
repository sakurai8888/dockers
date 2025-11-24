import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Server route: /api/search?q=...  (GET)
// Reads DATABASE_URL and SEARCH_TABLE env vars.

const databaseUrl = process.env.DATABASE_URL;
const searchTable = process.env.SEARCH_TABLE || 'items';

if (!databaseUrl) {
  // Will throw at runtime if not configured; Next will surface this error.
  console.warn('DATABASE_URL is not set; /api/search will fail until configured.');
}

const pool = new Pool({ connectionString: databaseUrl });

async function getTextColumns(client: Pool, table: string) {
  // Return the list of ordinary columns for the given table in the current schema
  const res = await client.query(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_name = $1
       AND table_schema = current_schema()
       AND data_type NOT IN ('bytea')
     ORDER BY ordinal_position`,
    [table]
  );
  return res.rows.map((r: any) => r.column_name);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') || '').trim();

  if (!q || q.length < 4) {
    return NextResponse.json({ results: [], warning: 'Query must be at least 4 characters.' });
  }

  const client = await pool.connect();
  try {
    const cols = await getTextColumns(client, searchTable);
    if (!cols.length) {
      return NextResponse.json({ results: [], warning: `Table ${searchTable} has no columns or cannot be read.` });
    }

    // Build a tsvector over concatenated columns. Use parameterized query for the search term.
    // We build a SQL expression: to_tsvector('simple', coalesce(col1,'') || ' ' || coalesce(col2,'') ...)
    const concat = cols.map((c) => `coalesce("${c}",'')`).join(" || ' ' || ");
    const sql = `SELECT * FROM "${searchTable}" WHERE to_tsvector('simple', ${concat}) @@ plainto_tsquery('simple', $1) LIMIT 200`;

    const res = await client.query(sql, [q]);
    return NextResponse.json({ results: res.rows });
  } catch (err: any) {
    console.error('/api/search error', err);
    return NextResponse.json({ results: [], error: String(err) }, { status: 500 });
  } finally {
    client.release();
  }
}
