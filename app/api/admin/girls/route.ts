import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';

// POST /api/admin/girls - Create new girl profile (admin only)
export async function POST(request: NextRequest) {
  // Only admin can create girls
  const user = await requireAuth(['admin']);
  if (user instanceof NextResponse) return user;

  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      age,
      nationality,
      height,
      weight,
      bust,
      hair,
      eyes,
      color,
      services,
      bio,
      tattoo_percentage,
      tattoo_description,
      piercing,
      piercing_description,
      languages
    } = body;

    // Validate required fields
    if (!name || !age) {
      return NextResponse.json(
        { error: 'Chybí povinné údaje (jméno, věk)' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if slug already exists
    const existingGirl = await db.execute({
      sql: 'SELECT id FROM girls WHERE slug = ?',
      args: [slug]
    });

    if (existingGirl.rows.length > 0) {
      return NextResponse.json(
        { error: 'Dívka s tímto jménem již existuje' },
        { status: 400 }
      );
    }

    // Insert new girl
    const result = await db.execute({
      sql: `
        INSERT INTO girls (
          name, slug, email, phone, age, nationality, height, weight,
          bust, hair, eyes, color, status, services, bio,
          tattoo_percentage, tattoo_description, piercing, piercing_description, languages
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        name,
        slug,
        email || null,
        phone || null,
        age,
        nationality || null,
        height || null,
        weight || null,
        bust || null,
        hair || null,
        eyes || null,
        color || 'rose',
        services ? JSON.stringify(services) : null,
        bio || null,
        tattoo_percentage || 0,
        tattoo_description || null,
        piercing ? 1 : 0,
        piercing_description || null,
        languages ? JSON.stringify(languages) : JSON.stringify(['cs'])
      ]
    });

    return NextResponse.json({
      success: true,
      girl_id: result.lastInsertRowid,
      slug,
      message: 'Profil dívky vytvořen'
    });
  } catch (error) {
    console.error('Create girl error:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření profilu' },
      { status: 500 }
    );
  }
}

// GET /api/admin/girls - Get all girls (admin only, including pending)
export async function GET(request: NextRequest) {
  // Only admin can view all girls
  const user = await requireAuth(['admin']);
  if (user instanceof NextResponse) return user;

  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    let sql = 'SELECT * FROM girls WHERE 1=1';
    const args: any[] = [];

    if (status) {
      sql += ' AND status = ?';
      args.push(status);
    }

    sql += ' ORDER BY created_at DESC';

    const result = await db.execute({ sql, args });

    return NextResponse.json({
      success: true,
      girls: result.rows.map(row => ({
        ...row,
        services: row.services ? JSON.parse(row.services as string) : [],
        languages: row.languages ? JSON.parse(row.languages as string) : ['cs'],
        verified: Boolean(row.verified),
        online: Boolean(row.online),
        piercing: Boolean(row.piercing)
      }))
    });
  } catch (error) {
    console.error('Get girls error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání dívek' },
      { status: 500 }
    );
  }
}
