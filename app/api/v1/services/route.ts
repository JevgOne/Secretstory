import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth-helpers'

// GET /api/v1/services - List all services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let sql = 'SELECT * FROM services ORDER BY category, name'
    let args: any[] = []

    if (category) {
      sql = 'SELECT * FROM services WHERE category = ? ORDER BY name'
      args = [category]
    }

    const result = await db.execute({ sql, args })

    return NextResponse.json({
      success: true,
      services: result.rows
    })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// POST /api/v1/services - Create new service (Admin only)
export async function POST(request: NextRequest) {
  const user = await requireAuth(['admin'])
  if (user instanceof NextResponse) return user

  try {
    const body = await request.json()
    const { name, category, base_price, description } = body

    // Validation
    if (!name || !category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      )
    }

    const validCategories = ['massage', 'escort', 'special', 'duo']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      )
    }

    // Check if service name already exists
    const existing = await db.execute({
      sql: 'SELECT id FROM services WHERE name = ?',
      args: [name]
    })

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Service with this name already exists' },
        { status: 409 }
      )
    }

    const result = await db.execute({
      sql: `
        INSERT INTO services (name, category, base_price, description, created_at, updated_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
      args: [name, category, base_price || null, description || null]
    })

    return NextResponse.json({
      success: true,
      service_id: result.lastInsertRowid,
      message: 'Service created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
