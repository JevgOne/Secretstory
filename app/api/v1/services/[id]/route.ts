import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth-helpers'

// GET /api/v1/services/:id - Get single service
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const result = await db.execute({
      sql: 'SELECT * FROM services WHERE id = ?',
      args: [parseInt(id)]
    })

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      service: result.rows[0]
    })
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}

// PATCH /api/v1/services/:id - Update service (Admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth(['admin'])
  if (user instanceof NextResponse) return user

  try {
    const { id } = await params
    const body = await request.json()

    // Check if service exists
    const existing = await db.execute({
      sql: 'SELECT id FROM services WHERE id = ?',
      args: [parseInt(id)]
    })

    if (existing.rows.length === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Build dynamic update query
    const allowedFields = ['name', 'category', 'base_price', 'description']
    const updates: string[] = []
    const args: any[] = []

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`)
        args.push(body[field])
      }
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Validate category if provided
    if (body.category) {
      const validCategories = ['massage', 'escort', 'special', 'duo']
      if (!validCategories.includes(body.category)) {
        return NextResponse.json(
          { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
          { status: 400 }
        )
      }
    }

    args.push(parseInt(id))

    await db.execute({
      sql: `UPDATE services SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args
    })

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully'
    })

  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

// DELETE /api/v1/services/:id - Delete service (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth(['admin'])
  if (user instanceof NextResponse) return user

  try {
    const { id } = await params

    // Check if service exists
    const existing = await db.execute({
      sql: 'SELECT id FROM services WHERE id = ?',
      args: [parseInt(id)]
    })

    if (existing.rows.length === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Hard delete (you could implement soft delete by adding a 'deleted' column)
    await db.execute({
      sql: 'DELETE FROM services WHERE id = ?',
      args: [parseInt(id)]
    })

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}
