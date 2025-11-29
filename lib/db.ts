import { createClient } from '@libsql/client';

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error('TURSO_DATABASE_URL is not defined');
}

if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error('TURSO_AUTH_TOKEN is not defined');
}

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Helper function to execute queries
export async function executeQuery(sql: string, args?: any[]) {
  try {
    const result = await db.execute({ sql, args: args || [] });
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function for transactions
export async function executeTransaction(queries: { sql: string; args?: any[] }[]) {
  try {
    const results = await db.batch(
      queries.map(q => ({ sql: q.sql, args: q.args || [] }))
    );
    return results;
  } catch (error) {
    console.error('Database transaction error:', error);
    throw error;
  }
}
