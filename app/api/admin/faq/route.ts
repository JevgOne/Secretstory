import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

// GET - Fetch all FAQ items for admin
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const faqsResult = await db.execute(
      'SELECT * FROM faq_items WHERE is_active = 1 ORDER BY category ASC, display_order ASC'
    );

    return NextResponse.json({
      success: true,
      faqs: faqsResult.rows
    });
  } catch (error) {
    console.error('Error fetching FAQ items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch FAQ items' },
      { status: 500 }
    );
  }
}

// POST - Create new FAQ item
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      category,
      display_order,
      question_cs,
      question_en,
      question_de,
      question_uk,
      answer_cs,
      answer_en,
      answer_de,
      answer_uk
    } = await request.json();

    const result = await db.execute({
      sql: `INSERT INTO faq_items
        (category, display_order, question_cs, question_en, question_de, question_uk,
         answer_cs, answer_en, answer_de, answer_uk)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        category,
        display_order || 0,
        question_cs,
        question_en,
        question_de,
        question_uk,
        answer_cs,
        answer_en,
        answer_de,
        answer_uk
      ]
    });

    return NextResponse.json({
      success: true,
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error creating FAQ item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create FAQ item' },
      { status: 500 }
    );
  }
}

// PUT - Update FAQ item
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      id,
      category,
      display_order,
      question_cs,
      question_en,
      question_de,
      question_uk,
      answer_cs,
      answer_en,
      answer_de,
      answer_uk
    } = await request.json();

    await db.execute({
      sql: `UPDATE faq_items SET
        category = ?,
        display_order = ?,
        question_cs = ?,
        question_en = ?,
        question_de = ?,
        question_uk = ?,
        answer_cs = ?,
        answer_en = ?,
        answer_de = ?,
        answer_uk = ?,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
      args: [
        category,
        display_order,
        question_cs,
        question_en,
        question_de,
        question_uk,
        answer_cs,
        answer_en,
        answer_de,
        answer_uk,
        id
      ]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating FAQ item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update FAQ item' },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete FAQ item
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    await db.execute({
      sql: 'UPDATE faq_items SET is_active = 0 WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting FAQ item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete FAQ item' },
      { status: 500 }
    );
  }
}
