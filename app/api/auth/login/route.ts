import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email a heslo jsou povinné' },
        { status: 400 }
      );
    }

    // Find user by email
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email]
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Neplatný email nebo heslo' },
        { status: 401 }
      );
    }

    const user = result.rows[0] as any;

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Neplatný email nebo heslo' },
        { status: 401 }
      );
    }

    // Get girl data if user is a girl
    let girlData = null;
    if (user.role === 'girl' && user.girl_id) {
      const girlResult = await db.execute({
        sql: 'SELECT * FROM girls WHERE id = ?',
        args: [user.girl_id]
      });
      if (girlResult.rows.length > 0) {
        girlData = girlResult.rows[0];
      }
    }

    // Return user data (without password hash)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        girl_id: user.girl_id,
        girl: girlData,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Chyba při přihlašování' },
      { status: 500 }
    );
  }
}
