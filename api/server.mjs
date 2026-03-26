import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const { Pool } = pg;

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

// ================= DB =================
const pool = new Pool({
  host: process.env.DB_HOST || process.env.VITE_DB_HOST,
  port: parseInt(process.env.DB_PORT || process.env.VITE_DB_PORT || '5432'),
  user: process.env.DB_USER || process.env.VITE_DB_USER,
  password: process.env.DB_PASSWORD || process.env.VITE_DB_PASSWORD,
  database: process.env.DB_NAME || process.env.VITE_DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// ================= Middleware =================
app.use(cors());
app.use(express.json({ limit: '10mb' }));

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// helper for user ownership
function checkUser(req, res) {
  const paramId = parseInt(req.params.userId);
  if (req.user.userId !== paramId) {
    res.status(403).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

// ================= AUTH =================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;

    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO Users (first_name, last_name, email, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING user_id, email`,
      [first_name, last_name, email, hashed]
    );

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ success: false, error: 'An account with that email already exists.' });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM Users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.user_id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      userId: user.user_id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT user_id, email, profile_picture
       FROM Users
       WHERE user_id = $1`,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= API =================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/units', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.unit_id, u.unit_title, u.unit_order,
             l.lesson_id, l.theme AS lesson_title, l.level, l.prereq_lesson_id
      FROM units u
      JOIN lessons l ON l.unit_id = u.unit_id
      ORDER BY u.unit_order ASC, l.lesson_id ASC;
    `);

    const unitsMap = new Map();

    for (const row of result.rows) {
      if (!unitsMap.has(row.unit_id)) {
        unitsMap.set(row.unit_id, {
          unit_id: row.unit_id,
          unit_title: row.unit_title,
          unit_order: row.unit_order,
          lessons: [],
        });
      }

      unitsMap.get(row.unit_id).lessons.push({
        lesson_id: row.lesson_id,
        lesson_title: row.lesson_title,
        level: row.level,
        prereq_lesson_id: row.prereq_lesson_id,
      });
    }

    res.json({ success: true, data: Array.from(unitsMap.values()) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ================= USER ROUTES (PROTECTED) =================

app.get('/api/users/:userId/lessons', authMiddleware, async (req, res) => {
  if (!checkUser(req, res)) return;

  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT * FROM User_Lessons WHERE user_id = $1',
      [userId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/users/:userId/lessons/in-progress', authMiddleware, async (req, res) => {
  if (!checkUser(req, res)) return;

  try {
    const { userId } = req.params;

    const result = await pool.query(`
      SELECT ul.lesson_id, ul.last_card_viewed, ul.started_at,
             l.theme AS lesson_title, l.unit_id, u.unit_title,
             COUNT(lc.card_id) AS total_cards
      FROM User_Lessons ul
      JOIN Lessons l ON l.lesson_id = ul.lesson_id
      JOIN Units u ON u.unit_id = l.unit_id
      JOIN Lesson_Cards lc ON lc.lesson_id = ul.lesson_id
      WHERE ul.user_id = $1 AND ul.status = 'In Progress'
      GROUP BY ul.lesson_id, ul.last_card_viewed, ul.started_at,
               l.theme, l.unit_id, u.unit_title
      ORDER BY ul.started_at DESC
    `, [userId]);

    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/users/:userId/lessons/:lessonId/progress', authMiddleware, async (req, res) => {
  if (!checkUser(req, res)) return;

  try {
    const { userId, lessonId } = req.params;
    const { last_card_viewed } = req.body;

    const result = await pool.query(`
      INSERT INTO User_Lessons (user_id, lesson_id, status, last_card_viewed, started_at)
      VALUES ($1, $2, 'In Progress', $3, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, lesson_id)
      DO UPDATE SET last_card_viewed = EXCLUDED.last_card_viewed
      RETURNING status, last_card_viewed
    `, [userId, lessonId, last_card_viewed]);

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/users/:userId/lessons/:lessonId/complete', authMiddleware, async (req, res) => {
  if (!checkUser(req, res)) return;

  try {
    const { userId, lessonId } = req.params;

    await pool.query(`
      INSERT INTO User_Lessons (user_id, lesson_id, status, completed_at)
      VALUES ($1, $2, 'Completed', CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, lesson_id)
      DO UPDATE SET status = 'Completed', completed_at = CURRENT_TIMESTAMP
    `, [userId, lessonId]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ================= STATIC =================
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('/{*splat}', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).send({ error: 'Not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// ================= START =================
const PORT = parseInt(process.env.PORT || '3000', 10);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});