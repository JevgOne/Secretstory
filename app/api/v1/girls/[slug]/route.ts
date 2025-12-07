import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

// PATCH - Update girl profile (Admin/Manager only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = await requireAuth(['admin', 'manager'])
  if (user instanceof NextResponse) return user

  try {
    const { slug } = await params
    const body = await request.json()

    const updates: string[] = []
    const args: any[] = []
    const allowedFields = [
      'name', 'age', 'email', 'phone', 'nationality', 'bio',
      'height', 'weight', 'bust', 'waist', 'hips',
      'hair_color', 'eye_color', 'services', 'hourly_rate',
      'status', 'online', 'verified', 'rating', 'reviews_count',
      'tattoo_percentage', 'tattoo_description', 'piercing',
      'piercing_description', 'languages'
    ]

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'services' || field === 'languages') {
          updates.push(`${field} = ?`)
          args.push(JSON.stringify(body[field]))
        } else if (field === 'online' || field === 'verified') {
          updates.push(`${field} = ?`)
          args.push(body[field] ? 1 : 0)
        } else {
          updates.push(`${field} = ?`)
          args.push(body[field])
        }
      }
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    updates.push('updated_at = CURRENT_TIMESTAMP')
    args.push(slug)

    await db.execute({
      sql: `UPDATE girls SET ${updates.join(', ')} WHERE slug = ?`,
      args
    })

    return NextResponse.json({
      success: true,
      message: 'Girl profile updated successfully'
    })
  } catch (error: any) {
    console.error('Error updating girl:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update girl profile' },
      { status: 500 }
    )
  }
}

// DELETE - Soft delete girl (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = await requireAuth(['admin'])
  if (user instanceof NextResponse) return user

  try {
    const { slug } = await params

    // Soft delete by setting status to inactive
    await db.execute({
      sql: "UPDATE girls SET status = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE slug = ?",
      args: [slug]
    })

    return NextResponse.json({
      success: true,
      message: 'Girl profile deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting girl:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete girl profile' },
      { status: 500 }
    )
  }
}
