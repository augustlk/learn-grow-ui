import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

// 1. Setup Environment and Directories
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const { Pool } = pg;

// 2. Database Connection
const pool = new Pool({
  host: process.env.DB_HOST || process.env.VITE_DB_HOST,
  port: parseInt(process.env.DB_PORT || process.env.VITE_DB_PORT || '5432'),
  user: process.env.DB_USER || process.env.VITE_DB_USER,
  password: process.env.DB_PASSWORD || process.env.VITE_DB_PASSWORD,
  database: process.env.DB_NAME || process.env.VITE_DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// 3. Middleware
app.use(cors());
app.use(express.json());

// --- API Routes (Leave these as they were) ---

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/units', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.unit_id, u.unit_title, u.unit_order, l.lesson_id, l.theme AS lesson_title, l.level, l.prereq_lesson_id
      FROM units u
      JOIN lessons l ON l.unit_id = u.unit_id
      ORDER BY u.unit_order ASC, l.lesson_id ASC;
    `);
    const unitsMap = new Map();
    for (const row of result.rows) {
      if (!unitsMap.has(row.unit_id)) {
        unitsMap.set(row.unit_id, {
          unit_id: row.unit_id, unit_title: row.unit_title, unit_order: row.unit_order, lessons: [],
        });
      }
      unitsMap.get(row.unit_id).lessons.push({
        lesson_id: row.lesson_id, lesson_title: row.lesson_title, level: row.level, prereq_lesson_id: row.prereq_lesson_id,
      });
    }
    res.json({ success: true, data: Array.from(unitsMap.values()) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ... (Your other /api routes here) ...

// 4. Static File Serving (For React Deployment)
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('/{*splat}', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).send({error: 'Not found'});
  res.sendFile(path.join(distPath, 'index.html'));
});

// 5. Start Server
const PORT = parseInt(process.env.PORT || process.env.API_PORT || '8080', 10);
app.listen(PORT, () => {
  console.log(`🚀 Server + Frontend running on port ${PORT}`);
});