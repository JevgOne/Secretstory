// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Now import db after env vars are loaded
import { db } from '../lib/db';

async function seedReviews() {
  try {
    console.log('🌱 Seeding reviews...');

    // Create test reviews
    const reviews = [
      {
        girl_id: 1, // Katy
        booking_id: 1,
        author_name: 'Jan N.',
        author_email: 'jan@example.com',
        rating: 5,
        title: 'Amazing experience!',
        content: 'Katy is very professional and made me feel comfortable from the first moment. Highly recommended.',
        status: 'approved',
        approved_by: 1 // Admin
      },
      {
        girl_id: 1, // Katy
        booking_id: null,
        author_name: 'Petr S.',
        author_email: null,
        rating: 4,
        title: 'Great company',
        content: 'Beautiful and intelligent. Great conversation over dinner.',
        status: 'approved',
        approved_by: 1
      },
      {
        girl_id: 2, // Ema
        booking_id: null,
        author_name: 'Martin K.',
        author_email: 'martin@example.com',
        rating: 5,
        title: 'Wonderful evening',
        content: 'Ema exceeded all my expectations. Very attentive and sweet. Will definitely meet again.',
        status: 'approved',
        approved_by: 1
      },
      {
        girl_id: 1, // Katy - pending approval
        booking_id: null,
        author_name: 'Anonymous',
        author_email: null,
        rating: 5,
        title: 'Best in Prague!',
        content: 'Simply the best experience I have ever had. Katy is incredible.',
        status: 'pending',
        approved_by: null
      }
    ];

    for (const review of reviews) {
      if (review.status === 'approved') {
        await db.execute({
          sql: `
            INSERT INTO reviews (
              girl_id, booking_id, author_name, author_email,
              rating, title, content, status, approved_by, approved_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
          `,
          args: [
            review.girl_id,
            review.booking_id,
            review.author_name,
            review.author_email,
            review.rating,
            review.title,
            review.content,
            review.status,
            review.approved_by
          ]
        });
      } else {
        await db.execute({
          sql: `
            INSERT INTO reviews (
              girl_id, booking_id, author_name, author_email,
              rating, title, content, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            review.girl_id,
            review.booking_id,
            review.author_name,
            review.author_email,
            review.rating,
            review.title,
            review.content,
            review.status
          ]
        });
      }
    }

    console.log('✅ Reviews seeded successfully!');

    // Update girls stats
    console.log('📊 Updating girls stats...');

    // Katy: 2 approved reviews, avg 4.5
    await db.execute({
      sql: `
        UPDATE girls
        SET reviews_count = 2,
            rating = 4.5
        WHERE id = 1
      `
    });

    // Ema: 1 approved review, rating 5
    await db.execute({
      sql: `
        UPDATE girls
        SET reviews_count = 1,
            rating = 5.0
        WHERE id = 2
      `
    });

    console.log('✅ Girls stats updated!');
    console.log('\nReviews created:');
    console.log('  - 2 approved reviews for Katy (1 pending)');
    console.log('  - 1 approved review for Ema');

  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    process.exit(1);
  }
}

seedReviews();
