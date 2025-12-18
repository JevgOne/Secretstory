import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createNotification } from '@/lib/notifications';

// GET /api/reviews - Get all reviews (with filters)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const girlId = searchParams.get('girl_id');
    const status = searchParams.get('status');

    let sql = `
      SELECT
        r.*,
        g.name as girl_name,
        g.color as girl_color
      FROM reviews r
      LEFT JOIN girls g ON r.girl_id = g.id
      WHERE 1=1
    `;
    const args: any[] = [];

    if (girlId) {
      sql += ' AND r.girl_id = ?';
      args.push(parseInt(girlId));
    }

    if (status) {
      sql += ' AND r.status = ?';
      args.push(status);
    }

    sql += ' ORDER BY r.created_at DESC';

    const result = await db.execute({ sql, args });

    return NextResponse.json({
      success: true,
      reviews: result.rows
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání recenzí' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      girl_id,
      booking_id,
      author_name,
      rating,
      title,
      content
    } = body;

    // Validate required fields
    if (!girl_id || !author_name || !rating || !content) {
      return NextResponse.json(
        { error: 'Chybí povinné údaje' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Hodnocení musí být 1-5' },
        { status: 400 }
      );
    }

    // Get IP address from request headers
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

    // Insert review with status 'pending' (needs admin approval)
    const result = await db.execute({
      sql: `
        INSERT INTO reviews (
          girl_id, booking_id, author_name,
          rating, title, content, status, ip_address
        ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
      `,
      args: [
        girl_id,
        booking_id || null,
        author_name,
        rating,
        title || null,
        content,
        ip
      ]
    });

    const reviewId = Number(result.lastInsertRowid);

    // Create notification for all admin users
    const adminUsers = await db.execute({
      sql: 'SELECT id, email FROM users WHERE role = ?',
      args: ['admin']
    });

    // Create in-app notification for each admin
    for (const admin of adminUsers.rows) {
      await createNotification({
        userId: (admin as any).id,
        type: 'review_new',
        title: 'Nová recenze čeká na schválení',
        message: `Nová recenze od ${author_name} čeká na schválení.`,
        link: `/admin/reviews`
      });
    }

    // Send email notifications ONLY to admins (non-blocking, runs in background)
    Promise.all([
      // Get girl's name for email template
      db.execute({
        sql: 'SELECT name FROM girls WHERE id = ?',
        args: [girl_id]
      })
    ]).then(([girlResult]) => {
      const girl = girlResult.rows[0];
      const adminEmails = adminUsers.rows
        .map(admin => (admin as any).email)
        .filter(Boolean);

      if (girl && adminEmails.length > 0) {
        // Send email ONLY to admins, NOT to the girl
        const adminHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8B1538;">Nová recenze čeká na schválení</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Dívka:</strong> ${girl.name}</p>
              <p><strong>Autor:</strong> ${author_name}</p>
              <p><strong>Hodnocení:</strong> ${'⭐'.repeat(rating)} (${rating}/5)</p>
              <p><strong>Recenze:</strong></p>
              <p style="font-style: italic;">"${content}"</p>
            </div>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/reviews"
               style="display: inline-block; background: #8B1538; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
              Schválit/Zamítnout
            </a>
          </div>
        `;

        // Import sendEmail directly for admin-only emails
        import('@/lib/email').then(({ sendEmail }) => {
          Promise.all(
            adminEmails.map(adminEmail =>
              sendEmail({
                to: adminEmail,
                subject: `Nová recenze čeká na schválení - ${girl.name}`,
                html: adminHtml
              })
            )
          ).catch(error => {
            console.error('Failed to send review emails to admins:', error);
          });
        });
      }
    }).catch(error => {
      console.error('Failed to fetch girl data for review:', error);
    });

    return NextResponse.json({
      success: true,
      review_id: reviewId,
      message: 'Recenze vytvořena a čeká na schválení'
    });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření recenze' },
      { status: 500 }
    );
  }
}
