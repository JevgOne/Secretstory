import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

// POST - Create new girl (Admin/Manager only)
export async function POST(request: NextRequest) {
  const user = await requireAuth(['admin', 'manager'])
  if (user instanceof NextResponse) return user

  try {
    const body = await request.json()
    const {
      name, age, email, phone, nationality, bio, height, weight,
      bust, waist, hips, hair_color, eye_color, services, hourly_rate,
      tattoo_percentage, tattoo_description, piercing, piercing_description, languages,
      schedule, description_cs, description_en, description_de, description_uk, location,
      service_ids
    } = body

    // Validate required fields
    if (!name || !age || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: name, age, email' },
        { status: 400 }
      )
    }

    // Generate unique slug
    const baseSlug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    let slug = baseSlug
    let counter = 1
    while (true) {
      const existing = await db.execute({
        sql: 'SELECT id FROM girls WHERE slug = ?',
        args: [slug]
      })
      if (existing.rows.length === 0) break
      slug = `${baseSlug}-${counter++}`
    }

    // Assign random color
    const colors = ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#6366f1']
    const color = colors[Math.floor(Math.random() * colors.length)]

    // Insert girl
    const result = await db.execute({
      sql: `INSERT INTO girls (
        name, slug, age, email, phone, nationality, bio, height, weight,
        bust, waist, hips, hair_color, eye_color, services, hourly_rate,
        color, status, tattoo_percentage, tattoo_description, piercing,
        piercing_description, languages, schedule, description_cs, description_en,
        description_de, description_uk, location, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      args: [
        name, slug, age, email, phone || null, nationality || null, bio || null,
        height || null, weight || null, bust || null, waist || null, hips || null,
        hair_color || null, eye_color || null,
        services ? JSON.stringify(services) : null,
        hourly_rate || null, color, 'pending',
        tattoo_percentage || null, tattoo_description || null,
        piercing || null, piercing_description || null,
        languages ? JSON.stringify(languages) : null,
        schedule ? JSON.stringify(schedule) : null,
        description_cs || null, description_en || null,
        description_de || null, description_uk || null,
        location || null
      ]
    })

    const girlId = result.lastInsertRowid

    // Insert services if provided
    if (service_ids && Array.isArray(service_ids) && service_ids.length > 0) {
      for (const serviceId of service_ids) {
        try {
          await db.execute({
            sql: `INSERT INTO girl_services (girl_id, service_id) VALUES (?, ?)`,
            args: [girlId, serviceId]
          })
        } catch (error) {
          console.error(`Failed to insert service ${serviceId} for girl ${girlId}:`, error)
          // Continue with other services even if one fails
        }
      }
    }

    return NextResponse.json({
      success: true,
      girl_id: girlId,
      slug,
      message: 'Girl profile created successfully'
    })
  } catch (error: any) {
    console.error('Error creating girl:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create girl profile' },
      { status: 500 }
    )
  }
}
