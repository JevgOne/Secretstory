import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/auth';

export const runtime = 'nodejs';

// POST /api/admin/girls/reassign-colors - Reassign unique colors to all girls
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // High contrast color palette - 15 visually distinct colors
    // Selected for maximum visual distinction between adjacent colors
    const allColors = [
      '#e91e63', // růžová (pink)
      '#2196f3', // modrá (blue)
      '#ff9800', // oranžová (orange)
      '#4caf50', // zelená (green)
      '#9c27b0', // fialová (purple)
      '#00bcd4', // tyrkysová (cyan)
      '#f44336', // červená (red)
      '#ffeb3b', // žlutá (yellow)
      '#673ab7', // tmavě fialová (deep purple)
      '#009688', // teal
      '#ff5722', // tmavě oranžová (deep orange)
      '#3f51b5', // indigo
      '#8bc34a', // světle zelená (light green)
      '#795548', // hnědá (brown)
      '#607d8b', // šedá (blue grey)
    ];

    // Get all girls
    const result = await db.execute({
      sql: 'SELECT id, name FROM girls ORDER BY id ASC',
      args: []
    });

    const girls = result.rows;
    let updated = 0;

    // Assign unique color to each girl
    for (let i = 0; i < girls.length; i++) {
      const girl = girls[i] as any;
      const color = allColors[i % allColors.length];

      await db.execute({
        sql: 'UPDATE girls SET color = ? WHERE id = ?',
        args: [color, girl.id]
      });
      updated++;
    }

    return NextResponse.json({
      success: true,
      message: `Barvy přiřazeny ${updated} dívkám`,
      updated
    });
  } catch (error) {
    console.error('Error reassigning colors:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reassign colors' },
      { status: 500 }
    );
  }
}
