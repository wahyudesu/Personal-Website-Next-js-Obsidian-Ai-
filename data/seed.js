import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import 'dotenv/config'; // Load environment variables

async function seedDatabase() {
  // Baca file JSON lokal
  const filePath = path.join(process.cwd(), 'data', 'knowledge_base.json');
  const knowledgeBase = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // Setup koneksi ke Neon
  const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

  try {
    // Insert data JSON ke tabel
    const result = await sql`
      INSERT INTO knowledge_base (data)
      VALUES (${knowledgeBase})
      RETURNING *;
    `;

    console.log('Data seeded successfully:', result[0]);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    // Tutup koneksi
    await sql.end();
  }
}

seedDatabase();