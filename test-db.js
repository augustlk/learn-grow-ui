import pool from './db.js';

async function testConnection() {
  console.log('--- Testing AWS Connection ---');
  try {
    const timeRes = await pool.query('SELECT NOW()');
    console.log('✅ Success! Connected to AWS.');
    
    const lessonCount = await pool.query('SELECT COUNT(*) FROM Lessons');
    console.log(`✅ Success! Found ${lessonCount.rows[0].count} lessons.`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection failed!', err.message);
    process.exit(1);
  }
}

testConnection();