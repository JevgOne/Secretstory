import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/admin/discounts - Get all discounts and loyalty tiers
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all discounts
    const discountsResult = await db.execute(
      'SELECT * FROM discounts WHERE is_active = 1 ORDER BY display_order ASC'
    );

    // Get all loyalty tiers
    const loyaltyResult = await db.execute(
      'SELECT * FROM loyalty_tiers ORDER BY display_order ASC'
    );

    return NextResponse.json({
      success: true,
      discounts: discountsResult.rows,
      loyalty_tiers: loyaltyResult.rows
    });
  } catch (error) {
    console.error('Get discounts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch discounts data' },
      { status: 500 }
    );
  }
}

// POST /api/admin/discounts - Create new discount or loyalty tier
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, data } = body;

    if (type === 'discount') {
      const result = await db.execute({
        sql: `INSERT INTO discounts
          (icon, discount_type, discount_value, display_order, is_featured,
           name_cs, name_en, name_de, name_uk,
           description_cs, description_en, description_de, description_uk)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          data.icon || '🎁',
          data.discount_type,
          data.discount_value || 0,
          data.display_order || 0,
          data.is_featured ? 1 : 0,
          data.name_cs,
          data.name_en,
          data.name_de,
          data.name_uk,
          data.description_cs,
          data.description_en,
          data.description_de,
          data.description_uk
        ]
      });

      return NextResponse.json({
        success: true,
        id: result.lastInsertRowid
      });
    } else if (type === 'loyalty') {
      const result = await db.execute({
        sql: `INSERT INTO loyalty_tiers
          (visits_required, discount_percentage, tier_level, display_order,
           title_cs, title_en, title_de, title_uk,
           description_cs, description_en, description_de, description_uk)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          data.visits_required,
          data.discount_percentage,
          data.tier_level,
          data.display_order || 0,
          data.title_cs,
          data.title_en,
          data.title_de,
          data.title_uk,
          data.description_cs,
          data.description_en,
          data.description_de,
          data.description_uk
        ]
      });

      return NextResponse.json({
        success: true,
        id: result.lastInsertRowid
      });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Create discount error:', error);
    return NextResponse.json(
      { error: 'Failed to create discount/loyalty tier' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/discounts - Update existing discount or loyalty tier
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, id, data } = body;

    if (type === 'discount') {
      await db.execute({
        sql: `UPDATE discounts SET
          icon = ?, discount_type = ?, discount_value = ?, display_order = ?, is_featured = ?,
          name_cs = ?, name_en = ?, name_de = ?, name_uk = ?,
          description_cs = ?, description_en = ?, description_de = ?, description_uk = ?,
          updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
        args: [
          data.icon || '🎁',
          data.discount_type,
          data.discount_value || 0,
          data.display_order || 0,
          data.is_featured ? 1 : 0,
          data.name_cs,
          data.name_en,
          data.name_de,
          data.name_uk,
          data.description_cs,
          data.description_en,
          data.description_de,
          data.description_uk,
          id
        ]
      });
    } else if (type === 'loyalty') {
      await db.execute({
        sql: `UPDATE loyalty_tiers SET
          visits_required = ?, discount_percentage = ?, tier_level = ?, display_order = ?,
          title_cs = ?, title_en = ?, title_de = ?, title_uk = ?,
          description_cs = ?, description_en = ?, description_de = ?, description_uk = ?,
          updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
        args: [
          data.visits_required,
          data.discount_percentage,
          data.tier_level,
          data.display_order || 0,
          data.title_cs,
          data.title_en,
          data.title_de,
          data.title_uk,
          data.description_cs,
          data.description_en,
          data.description_de,
          data.description_uk,
          id
        ]
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update discount error:', error);
    return NextResponse.json(
      { error: 'Failed to update discount/loyalty tier' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/discounts - Delete discount or loyalty tier
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    if (type === 'discount') {
      // Soft delete
      await db.execute({
        sql: 'UPDATE discounts SET is_active = 0 WHERE id = ?',
        args: [id]
      });
    } else if (type === 'loyalty') {
      // Hard delete for loyalty tiers
      await db.execute({
        sql: 'DELETE FROM loyalty_tiers WHERE id = ?',
        args: [id]
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete discount error:', error);
    return NextResponse.json(
      { error: 'Failed to delete discount/loyalty tier' },
      { status: 500 }
    );
  }
}
