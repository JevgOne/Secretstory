import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-helpers'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// GET - List all users (Admin only)
export async function GET(request: NextRequest) {
  const user = await requireAuth(['admin'])
  if (user instanceof NextResponse) return user

  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')

    let sql = 'SELECT id, email, role, girl_id, created_at, updated_at FROM users WHERE 1=1'
    const args: any[] = []

    if (role) {
      sql += ' AND role = ?'
      args.push(role)
    }

    sql += ' ORDER BY created_at DESC'

    const result = await db.execute({ sql, args })

    return NextResponse.json({
      success: true,
      users: result.rows
    })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST - Create new user (Admin only)
export async function POST(request: NextRequest) {
  const user = await requireAuth(['admin'])
  if (user instanceof NextResponse) return user

  try {
    const body = await request.json()
    const { email, password, role, girl_id } = body

    // Validate required fields
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, role' },
        { status: 400 }
      )
    }

    // Validate role
    if (!['admin', 'manager', 'girl'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be: admin, manager, or girl' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existing = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email]
    })

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10)

    // Insert user
    const result = await db.execute({
      sql: `INSERT INTO users (email, password_hash, role, girl_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      args: [email, password_hash, role, girl_id || null]
    })

    return NextResponse.json({
      success: true,
      user_id: Number(result.lastInsertRowid),
      message: 'User created successfully'
    })
  } catch (error: any) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    )
  }
}
