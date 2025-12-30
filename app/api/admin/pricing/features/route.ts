import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/auth';

// POST /api/admin/pricing/features - Add feature to plan
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { plan_id, feature_cs, feature_en, feature_de, feature_uk, display_order } = body;

    const result = await db.execute({
      sql: `INSERT INTO pricing_plan_features
        (plan_id, display_order, feature_cs, feature_en, feature_de, feature_uk)
        VALUES (?, ?, ?, ?, ?, ?)`,
      args: [plan_id, display_order || 0, feature_cs, feature_en, feature_de, feature_uk]
    });

    return NextResponse.json({
      success: true,
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Add feature error:', error);
    return NextResponse.json(
      { error: 'Failed to add feature' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/pricing/features - Update feature
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, feature_cs, feature_en, feature_de, feature_uk, display_order } = body;

    await db.execute({
      sql: `UPDATE pricing_plan_features SET
        feature_cs = ?, feature_en = ?, feature_de = ?, feature_uk = ?, display_order = ?
        WHERE id = ?`,
      args: [feature_cs, feature_en, feature_de, feature_uk, display_order || 0, id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update feature error:', error);
    return NextResponse.json(
      { error: 'Failed to update feature' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/pricing/features - Delete feature
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    await db.execute({
      sql: 'DELETE FROM pricing_plan_features WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete feature error:', error);
    return NextResponse.json(
      { error: 'Failed to delete feature' },
      { status: 500 }
    );
  }
}
