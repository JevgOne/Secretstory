import { NextRequest, NextResponse } from 'next/server';
import { db, executeTransaction } from '@/lib/db';
import * as bcrypt from 'bcryptjs';

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove multiple hyphens
}

// Helper function to assign random color for calendar
function getRandomColor(): string {
  const colors = [
    '#ec4899', // pink
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#f97316', // orange
    '#10b981', // green
    '#eab308', // yellow
    '#14b8a6', // teal
    '#f43f5e', // rose
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      age,
      height,
      weight,
      bust,
      waist,
      hips,
      bio,
      location,
      availableDays,
      tattoo_percentage,
      tattoo_description,
      piercing,
      piercing_description,
      languages,
      services,
      agreeTerms,
      agreePrivacy
    } = body;

    // === VALIDATION ===

    // Required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Jméno, email a heslo jsou povinné' },
        { status: 400 }
      );
    }

    // Password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Hesla se neshodují' },
        { status: 400 }
      );
    }

    // Password strength (at least 6 characters)
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Heslo musí mít alespoň 6 znaků' },
        { status: 400 }
      );
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Neplatný formát emailu' },
        { status: 400 }
      );
    }

    // Terms and privacy agreement
    if (!agreeTerms || !agreePrivacy) {
      return NextResponse.json(
        { error: 'Musíte souhlasit s podmínkami a zásadami ochrany osobních údajů' },
        { status: 400 }
      );
    }

    // === CHECK IF EMAIL ALREADY EXISTS ===

    const existingUser = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email]
    });

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email je již zaregistrován' },
        { status: 409 }
      );
    }

    // === PREPARE DATA ===

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Generate slug from name
    let slug = generateSlug(name);

    // Check if slug exists and make it unique
    const existingSlug = await db.execute({
      sql: 'SELECT id FROM girls WHERE slug = ?',
      args: [slug]
    });

    if (existingSlug.rows.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    // Assign random color
    const color = getRandomColor();

    // Build measurements string
    let measurements = '';
    if (bust || waist || hips) {
      measurements = `${bust || '-'}-${waist || '-'}-${hips || '-'}`;
    }

    // Build bio with location and availability if provided
    let fullBio = bio || '';
    if (location) {
      fullBio += `\n\nMísto: ${location}`;
    }
    if (availableDays && availableDays.length > 0) {
      fullBio += `\n\nDostupnost: ${availableDays.join(', ')}`;
    }
    fullBio = fullBio.trim();

    // === INSERT INTO DATABASE (TRANSACTION) ===

    try {
      // First insert into girls table
      const girlInsert = await db.execute({
        sql: `
          INSERT INTO girls (
            name, slug, email, phone, age, height, weight, bust,
            color, status, bio, verified, online,
            tattoo_percentage, tattoo_description, piercing, piercing_description, languages, services
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, 0, 0, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          name,
          slug,
          email,
          phone || null,
          age ? parseInt(age) : null,
          height ? parseInt(height) : null,
          weight ? parseInt(weight) : null,
          measurements || null,
          color,
          fullBio || null,
          tattoo_percentage || 0,
          tattoo_description || null,
          piercing ? 1 : 0,
          piercing_description || null,
          languages && languages.length > 0 ? JSON.stringify(languages) : null,
          services && services.length > 0 ? JSON.stringify(services) : null
        ]
      });

      const girl_id = Number(girlInsert.lastInsertRowid);

      // Then insert into users table with the girl_id
      await db.execute({
        sql: `
          INSERT INTO users (email, password_hash, role, girl_id)
          VALUES (?, ?, 'girl', ?)
        `,
        args: [email, password_hash, girl_id]
      });

      // === SUCCESS RESPONSE ===

      return NextResponse.json({
        success: true,
        message: 'Registrace úspěšná! Váš profil čeká na schválení administrátorem.',
        girl: {
          id: girl_id,
          name,
          slug,
          email,
          status: 'pending'
        }
      });

    } catch (dbError) {
      console.error('Database insertion error:', dbError);
      return NextResponse.json(
        { error: 'Chyba při ukládání do databáze' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Chyba při registraci' },
      { status: 500 }
    );
  }
}
