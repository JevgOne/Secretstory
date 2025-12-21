import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from database based on email
    const result = await db.execute({
      sql: 'SELECT id, email, role FROM users WHERE email = ?',
      args: [session.user.email]
    });

    const user = result.rows[0] as any;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Error getting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
