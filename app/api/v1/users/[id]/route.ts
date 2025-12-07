import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-helpers'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// PATCH - Update user (Admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth(['admin'])
  if (user instanceof NextResponse) return user

  try {
    const { id } = await params
    const body = await request.json()

    const updates: string[] = []
    const args: any[] = []

    // Update email
    if (body.email !== undefined) {
      updates.push('email = ?')
      args.push(body.email)
    }

    // Update password (hash it first)
    if (body.password) {
      const password_hash = await bcrypt.hash(body.password, 10)
      updates.push('password_hash = ?')
      args.push(password_hash)
    }

    // Update role
    if (body.role !== undefined) {
      if (!['admin', 'manager', 'girl'].includes(body.role)) {
        return NextResponse.json(
          { error: 'Invalid role' },
          { status: 400 }
        )
      }
      updates.push('role = ?')
      args.push(body.role)
    }

    // Update girl_id
    if (body.girl_id !== undefined) {
      updates.push('girl_id = ?')
      args.push(body.girl_id)
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    updates.push('updated_at = CURRENT_TIMESTAMP')
    args.push(parseInt(id))

    await db.execute({
      sql: `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      args
    })

    return NextResponse.json({
      success: true,
      message: 'User updated successfully'
    })
  } catch (error: any) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE - Delete user (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth(['admin'])
  if (user instanceof NextResponse) return user

  try {
    const { id } = await params

    await db.execute({
      sql: 'DELETE FROM users WHERE id = ?',
      args: [parseInt(id)]
    })

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    )
  }
}
