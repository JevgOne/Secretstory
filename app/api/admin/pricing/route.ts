import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

// GET /api/admin/pricing - Get all pricing data
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all pricing plans with their features
    const plansResult = await db.execute(
      'SELECT * FROM pricing_plans WHERE is_active = 1 ORDER BY display_order ASC'
    );

    const plans = [];
    for (const plan of plansResult.rows) {
      const featuresResult = await db.execute({
        sql: 'SELECT * FROM pricing_plan_features WHERE plan_id = ? ORDER BY display_order ASC',
        args: [plan.id]
      });

      plans.push({
        ...plan,
        features: featuresResult.rows
      });
    }

    // Get all extras
    const extrasResult = await db.execute(
      'SELECT * FROM pricing_extras WHERE is_active = 1 ORDER BY display_order ASC'
    );

    return NextResponse.json({
      success: true,
      plans,
      extras: extrasResult.rows
    });
  } catch (error) {
    console.error('Get pricing error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing data' },
      { status: 500 }
    );
  }
}

// POST /api/admin/pricing - Create new pricing plan
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, data } = body;

    if (type === 'plan') {
      const result = await db.execute({
        sql: `INSERT INTO pricing_plans
          (duration, price, is_popular, display_order, title_cs, title_en, title_de, title_uk)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          data.duration,
          data.price,
          data.is_popular ? 1 : 0,
          data.display_order || 0,
          data.title_cs,
          data.title_en,
          data.title_de,
          data.title_uk
        ]
      });

      // Revalidate pricing page for all locales
      revalidatePath('/cs/cenik', 'page');
      revalidatePath('/en/cenik', 'page');
      revalidatePath('/de/cenik', 'page');
      revalidatePath('/uk/cenik', 'page');
      console.log('[Cache] Revalidated pricing pages after creating plan');

      return NextResponse.json({
        success: true,
        id: result.lastInsertRowid
      });
    } else if (type === 'extra') {
      const result = await db.execute({
        sql: `INSERT INTO pricing_extras
          (price, display_order, name_cs, name_en, name_de, name_uk)
          VALUES (?, ?, ?, ?, ?, ?)`,
        args: [
          data.price,
          data.display_order || 0,
          data.name_cs,
          data.name_en,
          data.name_de,
          data.name_uk
        ]
      });

      // Revalidate pricing page for all locales
      revalidatePath('/cs/cenik', 'page');
      revalidatePath('/en/cenik', 'page');
      revalidatePath('/de/cenik', 'page');
      revalidatePath('/uk/cenik', 'page');
      console.log('[Cache] Revalidated pricing pages after creating extra');

      return NextResponse.json({
        success: true,
        id: result.lastInsertRowid
      });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Create pricing error:', error);
    return NextResponse.json(
      { error: 'Failed to create pricing item' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/pricing - Update existing pricing item
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, id, data } = body;

    if (type === 'plan') {
      await db.execute({
        sql: `UPDATE pricing_plans SET
          duration = ?, price = ?, is_popular = ?, display_order = ?,
          title_cs = ?, title_en = ?, title_de = ?, title_uk = ?,
          updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
        args: [
          data.duration,
          data.price,
          data.is_popular ? 1 : 0,
          data.display_order || 0,
          data.title_cs,
          data.title_en,
          data.title_de,
          data.title_uk,
          id
        ]
      });
    } else if (type === 'extra') {
      await db.execute({
        sql: `UPDATE pricing_extras SET
          price = ?, display_order = ?,
          name_cs = ?, name_en = ?, name_de = ?, name_uk = ?,
          updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
        args: [
          data.price,
          data.display_order || 0,
          data.name_cs,
          data.name_en,
          data.name_de,
          data.name_uk,
          id
        ]
      });
    }

    // Revalidate pricing page for all locales
    revalidatePath('/cs/cenik', 'page');
    revalidatePath('/en/cenik', 'page');
    revalidatePath('/de/cenik', 'page');
    revalidatePath('/uk/cenik', 'page');
    console.log('[Cache] Revalidated pricing pages after update');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update pricing error:', error);
    return NextResponse.json(
      { error: 'Failed to update pricing item' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/pricing - Delete pricing item
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    if (type === 'plan') {
      // Soft delete
      await db.execute({
        sql: 'UPDATE pricing_plans SET is_active = 0 WHERE id = ?',
        args: [id]
      });
    } else if (type === 'extra') {
      // Soft delete
      await db.execute({
        sql: 'UPDATE pricing_extras SET is_active = 0 WHERE id = ?',
        args: [id]
      });
    }

    // Revalidate pricing page for all locales
    revalidatePath('/cs/cenik', 'page');
    revalidatePath('/en/cenik', 'page');
    revalidatePath('/de/cenik', 'page');
    revalidatePath('/uk/cenik', 'page');
    console.log('[Cache] Revalidated pricing pages after delete');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete pricing error:', error);
    return NextResponse.json(
      { error: 'Failed to delete pricing item' },
      { status: 500 }
    );
  }
}
