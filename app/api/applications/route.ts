import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Get all applications (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = 'SELECT * FROM girl_applications';
    const args: any[] = [];

    if (status && status !== 'all') {
      query += ' WHERE status = ?';
      args.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.execute({ sql: query, args });

    return NextResponse.json({
      success: true,
      applications: result.rows
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba při načítání žádostí' },
      { status: 500 }
    );
  }
}

// POST - Submit new application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      age,
      height,
      weight,
      bust,
      hair,
      eyes,
      tattoo,
      tattoo_description,
      piercing,
      waist,
      hips,
      email,
      phone,
      telegram,
      experience,
      languages,
      availability,
      bio_cs,
      bio_en,
      photo_main,
      photo_gallery,
      services
    } = body;

    // Validation
    if (!name || !age || !phone) {
      return NextResponse.json(
        { success: false, error: 'Jméno, věk a telefon jsou povinné' },
        { status: 400 }
      );
    }

    if (age < 18) {
      return NextResponse.json(
        { success: false, error: 'Musíte být starší 18 let' },
        { status: 400 }
      );
    }

    const result = await db.execute({
      sql: `INSERT INTO girl_applications (
        name, age, height, weight, bust, hair, eyes, tattoo, tattoo_description, piercing, waist, hips,
        email, phone, telegram,
        experience, languages, availability,
        bio_cs, bio_en,
        photo_main, photo_gallery,
        services,
        status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)`,
      args: [
        name,
        age,
        height || null,
        weight || null,
        bust || null,
        hair || null,
        eyes || null,
        tattoo ? 1 : 0,
        tattoo_description || null,
        piercing ? 1 : 0,
        waist || null,
        hips || null,
        email || null,
        phone,
        telegram || null,
        experience || 'beginner',
        JSON.stringify(languages || []),
        JSON.stringify(availability || []),
        bio_cs || '',
        bio_en || '',
        photo_main || null,
        JSON.stringify(photo_gallery || []),
        JSON.stringify(services || [])
      ]
    });

    return NextResponse.json({
      success: true,
      id: result.lastInsertRowid,
      message: 'Žádost úspěšně odeslána! Brzy se vám ozveme.'
    });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba při odesílání žádosti' },
      { status: 500 }
    );
  }
}

// PUT - Update application (review/approve/reject)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, reviewed_by, rejection_reason, notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID je povinné' },
        { status: 400 }
      );
    }

    const updates: string[] = [];
    const args: any[] = [];

    if (status) {
      updates.push('status = ?');
      args.push(status);
    }

    if (reviewed_by) {
      updates.push('reviewed_by = ?', 'reviewed_at = CURRENT_TIMESTAMP');
      args.push(reviewed_by);
    }

    if (rejection_reason !== undefined) {
      updates.push('rejection_reason = ?');
      args.push(rejection_reason);
    }

    if (notes !== undefined) {
      updates.push('notes = ?');
      args.push(notes);
    }

    args.push(id);

    const result = await db.execute({
      sql: `UPDATE girl_applications SET ${updates.join(', ')} WHERE id = ?`,
      args
    });

    return NextResponse.json({
      success: true,
      message: 'Žádost aktualizována'
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba při aktualizaci žádosti' },
      { status: 500 }
    );
  }
}

// DELETE - Delete application
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID je povinné' },
        { status: 400 }
      );
    }

    await db.execute({
      sql: 'DELETE FROM girl_applications WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({
      success: true,
      message: 'Žádost smazána'
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      { success: false, error: 'Chyba při mazání žádosti' },
      { status: 500 }
    );
  }
}
