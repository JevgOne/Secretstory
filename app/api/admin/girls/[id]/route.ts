import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';
import { cache } from '@/lib/cache';
import { revalidatePath, revalidateTag } from 'next/cache';

// PATCH /api/admin/girls/:id - Update girl profile (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Only admin can update girls
  const user = await requireAuth(['admin']);
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;
    const body = await request.json();
    const updates: string[] = [];
    const args: any[] = [];

    // If status is being changed from pending to active, automatically set is_new = true
    if (body.status === 'active') {
      const currentGirl = await db.execute({
        sql: 'SELECT status FROM girls WHERE id = ?',
        args: [parseInt(id)]
      });

      if (currentGirl.rows.length > 0 && currentGirl.rows[0].status === 'pending') {
        body.is_new = true;
      }
    }

    // Build dynamic update query
    const allowedFields = [
      'name', 'email', 'phone', 'age', 'nationality', 'height', 'weight',
      'bust', 'hair', 'eyes', 'color', 'status', 'verified', 'online',
      'bio', 'bio_cs', 'bio_de', 'bio_uk', 'tattoo_percentage', 'tattoo_description', 'piercing', 'piercing_description',
      'description_cs', 'description_en', 'description_de', 'description_uk', 'location',
      'is_new', 'is_top', 'is_featured', 'featured_section', 'badge_type',
      // Subtitle fields (H2 on profile page)
      'subtitle_cs', 'subtitle_en', 'subtitle_de', 'subtitle_uk',
      // Legacy single-language SEO fields
      'meta_title', 'meta_description', 'og_title', 'og_description', 'og_image',
      // Multi-language SEO fields
      'meta_title_cs', 'meta_title_en', 'meta_title_de', 'meta_title_uk',
      'meta_description_cs', 'meta_description_en', 'meta_description_de', 'meta_description_uk',
      'og_title_cs', 'og_title_en', 'og_title_de', 'og_title_uk',
      'og_description_cs', 'og_description_en', 'og_description_de', 'og_description_uk'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        if (field === 'verified' || field === 'online' || field === 'piercing' || field === 'is_new' || field === 'is_top' || field === 'is_featured') {
          args.push(body[field] ? 1 : 0);
        } else {
          args.push(body[field]);
        }
      }
    }

    // Handle JSON fields separately
    if (body.services !== undefined) {
      updates.push('services = ?');
      args.push(JSON.stringify(body.services));
    }

    if (body.hashtags !== undefined) {
      updates.push('hashtags = ?');
      args.push(JSON.stringify(body.hashtags));
    }

    if (body.languages !== undefined) {
      updates.push('languages = ?');
      args.push(JSON.stringify(body.languages));
    }

    if (body.schedule !== undefined) {
      updates.push('schedule = ?');
      args.push(JSON.stringify(body.schedule));
    }

    if (body.photos !== undefined) {
      updates.push('photos = ?');
      args.push(JSON.stringify(body.photos));
    }

    // If name changed, update slug
    if (body.name) {
      const newSlug = body.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      updates.push('slug = ?');
      args.push(newSlug);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'Žádná data k aktualizaci' },
        { status: 400 }
      );
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    args.push(parseInt(id));

    // Get girl slug for cache invalidation
    const girlResult = await db.execute({
      sql: 'SELECT slug FROM girls WHERE id = ?',
      args: [parseInt(id)]
    });

    await db.execute({
      sql: `UPDATE girls SET ${updates.join(', ')} WHERE id = ?`,
      args
    });

    // Clear cache for this girl's profile
    if (girlResult.rows.length > 0) {
      const slug = girlResult.rows[0].slug;
      cache.clear(`girl-profile-${slug}`);

      // Revalidate Next.js cache for all locales
      revalidatePath(`/cs/profily/${slug}`, 'page');
      revalidatePath(`/en/profily/${slug}`, 'page');
      revalidatePath(`/de/profily/${slug}`, 'page');
      revalidatePath(`/uk/profily/${slug}`, 'page');
      revalidatePath(`/api/girls/${slug}`, 'page');

      console.log(`[Cache] Cleared cache for girl profile: ${slug}`);
    }

    // Also clear homepage cache as it might include this girl
    cache.clear('homepage-data');
    revalidatePath('/', 'layout');
    revalidatePath('/cs', 'page');
    revalidatePath('/en', 'page');
    revalidatePath('/de', 'page');
    revalidatePath('/uk', 'page');
    console.log('[Cache] Cleared homepage cache');

    return NextResponse.json({
      success: true,
      message: 'Profil aktualizován'
    });
  } catch (error) {
    console.error('Update girl error:', error);
    return NextResponse.json(
      { error: 'Chyba při aktualizaci profilu' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/girls/:id - Delete girl profile (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Only admin can delete girls
  const user = await requireAuth(['admin']);
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;

    // Check if girl exists
    const girlResult = await db.execute({
      sql: 'SELECT id, slug FROM girls WHERE id = ?',
      args: [parseInt(id)]
    });

    if (girlResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Dívka nenalezena' },
        { status: 404 }
      );
    }

    const girlId = parseInt(id);
    const slug = girlResult.rows[0].slug;

    // Manually delete all related records (because some tables don't have CASCADE)
    // Order matters: delete child records first, then parent

    await db.execute({ sql: 'DELETE FROM girl_photos WHERE girl_id = ?', args: [girlId] });
    await db.execute({ sql: 'DELETE FROM girl_videos WHERE girl_id = ?', args: [girlId] });
    await db.execute({ sql: 'DELETE FROM stories WHERE girl_id = ?', args: [girlId] });
    await db.execute({ sql: 'DELETE FROM girl_schedules WHERE girl_id = ?', args: [girlId] });
    await db.execute({ sql: 'DELETE FROM girl_services WHERE girl_id = ?', args: [girlId] });
    await db.execute({ sql: 'DELETE FROM girl_seo_metadata WHERE girl_id = ?', args: [girlId] });
    await db.execute({ sql: 'DELETE FROM reviews WHERE girl_id = ?', args: [girlId] });
    await db.execute({ sql: 'DELETE FROM activity_log WHERE girl_id = ?', args: [girlId] });
    await db.execute({ sql: 'DELETE FROM bookings WHERE girl_id = ?', args: [girlId] });

    // Finally, delete the girl
    await db.execute({
      sql: 'DELETE FROM girls WHERE id = ?',
      args: [girlId]
    });

    // Clear cache
    cache.clear(`girl-profile-${slug}`);
    cache.clear('homepage-data');
    cache.clear('girls-status=active');

    return NextResponse.json({
      success: true,
      message: 'Profil smazán'
    });
  } catch (error) {
    console.error('Delete girl error:', error);
    return NextResponse.json(
      { error: 'Chyba při mazání profilu' },
      { status: 500 }
    );
  }
}

// GET /api/admin/girls/:id - Get single girl (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Only admin can view girl details
  const user = await requireAuth(['admin']);
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;
    const result = await db.execute({
      sql: 'SELECT * FROM girls WHERE id = ?',
      args: [parseInt(id)]
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Dívka nenalezena' },
        { status: 404 }
      );
    }

    const girl = result.rows[0];

    return NextResponse.json({
      success: true,
      girl: {
        ...girl,
        services: girl.services ? JSON.parse(girl.services as string) : [],
        hashtags: girl.hashtags ? JSON.parse(girl.hashtags as string) : [],
        languages: girl.languages ? JSON.parse(girl.languages as string) : ['cs'],
        verified: Boolean(girl.verified),
        online: Boolean(girl.online),
        piercing: Boolean(girl.piercing),
        is_new: Boolean(girl.is_new),
        is_top: Boolean(girl.is_top),
        is_featured: Boolean(girl.is_featured)
      }
    });
  } catch (error) {
    console.error('Get girl error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání profilu' },
      { status: 500 }
    );
  }
}
