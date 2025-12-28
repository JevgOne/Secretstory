import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';
import * as readline from 'readline';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function createAdmin() {
  console.log('🔐 Create Secure Admin Account\n');

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('❌ Missing database credentials');
    process.exit(1);
  }

  const db = createClient({ url, authToken });

  try {
    // Get admin details
    const email = await question('Admin email: ');
    const password = await question('Admin password (min 8 characters): ');
    const confirmPassword = await question('Confirm password: ');

    // Validation
    if (!email || !email.includes('@')) {
      console.error('❌ Invalid email address');
      process.exit(1);
    }

    if (password.length < 8) {
      console.error('❌ Password must be at least 8 characters');
      process.exit(1);
    }

    if (password !== confirmPassword) {
      console.error('❌ Passwords do not match');
      process.exit(1);
    }

    // Check if email already exists
    const existing = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email]
    });

    if (existing.rows.length > 0) {
      console.error('❌ Email already exists');
      process.exit(1);
    }

    // Hash password
    console.log('\n🔒 Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    console.log('👤 Creating admin account...');
    await db.execute({
      sql: 'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      args: [email, passwordHash, 'admin']
    });

    console.log('\n✅ Admin account created successfully!');
    console.log(`\nEmail: ${email}`);
    console.log('Role: admin');
    console.log('\n🔐 You can now login at: /admin/login');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

createAdmin();
