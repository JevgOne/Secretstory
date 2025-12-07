import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/health - Health check endpoint
export async function GET() {
  try {
    const timestamp = new Date().toISOString();

    // Check database connection by running a simple query
    let dbStatus = 'disconnected';
    try {
      await db.execute({
        sql: 'SELECT 1 as health_check',
        args: []
      });
      dbStatus = 'connected';
    } catch (dbError) {
      console.error('Database health check failed:', dbError);
      dbStatus = 'error';
    }

    // Overall status - ok if DB is connected
    const overallStatus = dbStatus === 'connected' ? 'ok' : 'degraded';

    return NextResponse.json({
      status: overallStatus,
      timestamp,
      database: dbStatus,
      service: 'lovelygirls-design',
      version: '1.0.0'
    }, {
      status: overallStatus === 'ok' ? 200 : 503
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'unknown',
      error: 'Health check failed'
    }, {
      status: 500
    });
  }
}
