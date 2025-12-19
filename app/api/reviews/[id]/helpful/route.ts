import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateFingerprint } from '@/lib/review-constants';

// POST /api/reviews/[id]/helpful - Vote review as helpful
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reviewId = parseInt(id);

    if (isNaN(reviewId)) {
      return NextResponse.json(
        { error: 'Neplatné ID recenze' },
        { status: 400 }
      );
    }

    // Check if review exists
    const reviewCheck = await db.execute({
      sql: 'SELECT id FROM reviews WHERE id = ?',
      args: [reviewId]
    });

    if (reviewCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Recenze nenalezena' },
        { status: 404 }
      );
    }

    // Get IP and user agent for fingerprinting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';

    const fingerprint = generateFingerprint(ip, userAgent);

    // Check if already voted
    const voteCheck = await db.execute({
      sql: 'SELECT id FROM review_helpful_votes WHERE review_id = ? AND voter_fingerprint = ?',
      args: [reviewId, fingerprint]
    });

    if (voteCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'Již jste hlasovali pro tuto recenzi' },
        { status: 400 }
      );
    }

    // Insert vote
    await db.execute({
      sql: 'INSERT INTO review_helpful_votes (review_id, voter_fingerprint) VALUES (?, ?)',
      args: [reviewId, fingerprint]
    });

    // Increment helpful_count
    await db.execute({
      sql: 'UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = ?',
      args: [reviewId]
    });

    // Get updated count
    const countResult = await db.execute({
      sql: 'SELECT helpful_count FROM reviews WHERE id = ?',
      args: [reviewId]
    });

    const newCount = (countResult.rows[0] as any)?.helpful_count || 0;

    return NextResponse.json({
      success: true,
      helpful_count: newCount,
      message: 'Děkujeme za váš hlas!'
    });
  } catch (error) {
    console.error('Vote helpful error:', error);
    return NextResponse.json(
      { error: 'Chyba při hlasování' },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/[id]/helpful - Remove helpful vote (optional)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reviewId = parseInt(id);

    if (isNaN(reviewId)) {
      return NextResponse.json(
        { error: 'Neplatné ID recenze' },
        { status: 400 }
      );
    }

    // Get IP and user agent for fingerprinting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';

    const fingerprint = generateFingerprint(ip, userAgent);

    // Delete vote
    const result = await db.execute({
      sql: 'DELETE FROM review_helpful_votes WHERE review_id = ? AND voter_fingerprint = ?',
      args: [reviewId, fingerprint]
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json(
        { error: 'Hlas nenalezen' },
        { status: 404 }
      );
    }

    // Decrement helpful_count
    await db.execute({
      sql: 'UPDATE reviews SET helpful_count = GREATEST(0, helpful_count - 1) WHERE id = ?',
      args: [reviewId]
    });

    // Get updated count
    const countResult = await db.execute({
      sql: 'SELECT helpful_count FROM reviews WHERE id = ?',
      args: [reviewId]
    });

    const newCount = (countResult.rows[0] as any)?.helpful_count || 0;

    return NextResponse.json({
      success: true,
      helpful_count: newCount,
      message: 'Hlas odebrán'
    });
  } catch (error) {
    console.error('Remove helpful vote error:', error);
    return NextResponse.json(
      { error: 'Chyba při odebírání hlasu' },
      { status: 500 }
    );
  }
}
