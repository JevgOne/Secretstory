import { createClient } from '@libsql/client'
import { SERVICES } from '../lib/services-data'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  console.error('❌ Missing required environment variables: TURSO_DATABASE_URL or TURSO_AUTH_TOKEN')
  process.exit(1)
}

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function migrateServices() {
  console.log('Starting services migration...')

  try {
    // Drop existing table if it exists
    await db.execute('DROP TABLE IF EXISTS services')
    console.log('✓ Dropped existing services table')

    // Create services table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        name_cs TEXT NOT NULL,
        name_en TEXT NOT NULL,
        name_de TEXT NOT NULL,
        name_uk TEXT NOT NULL,
        category TEXT NOT NULL CHECK(category IN ('basic', 'oral', 'special', 'massage', 'extras', 'types')),
        description_cs TEXT,
        description_en TEXT,
        description_de TEXT,
        description_uk TEXT,
        seo_title_cs TEXT,
        seo_title_en TEXT,
        seo_title_de TEXT,
        seo_title_uk TEXT,
        seo_description_cs TEXT,
        seo_description_en TEXT,
        seo_description_de TEXT,
        seo_description_uk TEXT,
        content_cs TEXT,
        content_en TEXT,
        content_de TEXT,
        content_uk TEXT,
        icon TEXT,
        base_price INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Services table created')

    // Create indexes
    await db.execute('CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug)')
    await db.execute('CREATE INDEX IF NOT EXISTS idx_services_category ON services(category)')
    console.log('✓ Indexes created')

    // Insert services data
    console.log(`Inserting ${SERVICES.length} services...`)

    for (const service of SERVICES) {
      await db.execute({
        sql: `
          INSERT OR REPLACE INTO services (
            slug, name_cs, name_en, name_de, name_uk, category,
            description_cs, description_en, description_de, description_uk,
            seo_title_cs, seo_title_en, seo_title_de, seo_title_uk,
            seo_description_cs, seo_description_en, seo_description_de, seo_description_uk,
            content_cs, content_en, content_de, content_uk, icon
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          service.slug,
          service.name.cs,
          service.name.en,
          service.name.de,
          service.name.uk,
          service.category,
          service.description.cs,
          service.description.en,
          service.description.de,
          service.description.uk,
          service.seoTitle.cs,
          service.seoTitle.en,
          service.seoTitle.de,
          service.seoTitle.uk,
          service.seoDescription.cs,
          service.seoDescription.en,
          service.seoDescription.de,
          service.seoDescription.uk,
          service.content.cs,
          service.content.en,
          service.content.de,
          service.content.uk,
          service.icon || null
        ]
      })
      console.log(`✓ Inserted service: ${service.name.cs}`)
    }

    console.log(`\n✅ Migration completed successfully! ${SERVICES.length} services migrated.`)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrateServices()
