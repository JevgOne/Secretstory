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
    // Extended color palette - 25 unique colors
    const allColors = [
      '#e91e63', // pink
      '#9c27b0', // purple
      '#673ab7', // deep purple
      '#3f51b5', // indigo
      '#2196f3', // blue
      '#03a9f4', // light blue
      '#00bcd4', // cyan
      '#009688', // teal
      '#4caf50', // green
      '#8bc34a', // light green
      '#cddc39', // lime
      '#ffc107', // amber
      '#ff9800', // orange
      '#ff5722', // deep orange
      '#f44336', // red
      '#795548', // brown
      '#607d8b', // blue grey
      '#e040fb', // purple accent
      '#7c4dff', // deep purple accent
      '#448aff', // blue accent
      '#18ffff', // cyan accent
      '#69f0ae', // green accent
      '#ffab40', // orange accent
      '#ff4081', // pink accent
      '#536dfe', // indigo accent
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
