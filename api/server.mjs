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
app.use(express.json({ limit: '10mb' })); // increased limit for base64 images

// --- API Routes ---

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

app.get('/api/users/:userId/lessons', async (req, res) => {
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

app.post('/api/users/:userId/lessons/:lessonId/complete', async (req, res) => {
  try {
    const { userId, lessonId } = req.params;
    await pool.query(`
      INSERT INTO User_Lessons (user_id, lesson_id, status, completed_at)
      VALUES ($1, $2, 'Completed', CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, lesson_id)
      DO UPDATE SET status = 'Completed', completed_at = CURRENT_TIMESTAMP
    `, [userId, lessonId]);
    res.json({ success: true, message: 'Lesson marked as complete' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/lessons/:lessonId/cards', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const result = await pool.query(`
      SELECT lc.card_id, lc.card_order, lc.card_text, l.theme AS lesson_title, u.unit_title
      FROM Lesson_Cards lc
      JOIN Lessons l ON l.lesson_id = lc.lesson_id
      JOIN Units u ON u.unit_id = l.unit_id
      WHERE lc.lesson_id = $1
      ORDER BY lc.card_order ASC
    `, [lessonId]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/lessons/:lessonId/quiz', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const result = await pool.query(`
      SELECT qq.question_id, qq.quiz_id, qq.question_order, qq.question_text,
             qa.answer_id, qa.answer_text, qa.is_correct
      FROM Quiz_Questions qq
      JOIN Quizzes q ON q.quiz_id = qq.quiz_id
      JOIN Quiz_Answers qa ON qa.question_id = qq.question_id
      WHERE q.lesson_id = $1
      ORDER BY qq.question_order ASC, qa.answer_id ASC
    `, [lessonId]);

    const questionsMap = new Map();
    for (const row of result.rows) {
      if (!questionsMap.has(row.question_id)) {
        questionsMap.set(row.question_id, {
          question_id: row.question_id,
          quiz_id: row.quiz_id,
          question_order: row.question_order,
          question_text: row.question_text,
          answers: [],
        });
      }
      questionsMap.get(row.question_id).answers.push({
        answer_id: row.answer_id,
        answer_text: row.answer_text,
        is_correct: row.is_correct,
      });
    }
    res.json({ success: true, data: Array.from(questionsMap.values()) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/users/:userId/quiz/:quizId/result', async (req, res) => {
  try {
    const { userId, quizId } = req.params;
    const { score, passed } = req.body;
    await pool.query(`
      INSERT INTO User_Quizzes (user_id, quiz_id, score, attempt_number, passed, best_score)
      VALUES ($1, $2, $3, 1, $4, TRUE)
      ON CONFLICT (user_id, quiz_id)
      DO UPDATE SET score = $3, passed = $4, date_taken_at = CURRENT_TIMESTAMP
    `, [userId, quizId, score, passed]);
    res.json({ success: true, message: 'Quiz result saved' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- Profile Picture Routes ---

// GET profile picture
app.get('/api/users/:userId/profile-picture', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT profile_picture FROM Users WHERE user_id = $1',
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: result.rows[0].profile_picture || null });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST (upload) profile picture
app.post('/api/users/:userId/profile-picture', async (req, res) => {
  try {
    const { userId } = req.params;
    const { profile_picture } = req.body;
    if (!profile_picture) {
      return res.status(400).json({ success: false, error: 'No image provided' });
    }
    await pool.query(
      'UPDATE Users SET profile_picture = $1 WHERE user_id = $2',
      [profile_picture, userId]
    );
    res.json({ success: true, message: 'Profile picture updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE profile picture
app.delete('/api/users/:userId/profile-picture', async (req, res) => {
  try {
    const { userId } = req.params;
    await pool.query(
      'UPDATE Users SET profile_picture = NULL WHERE user_id = $1',
      [userId]
    );
    res.json({ success: true, message: 'Profile picture removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Static File Serving (For React Deployment)
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('/{*splat}', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).send({ error: 'Not found' });
  res.sendFile(path.join(distPath, 'index.html'));
});

// 5. Start Server
const PORT = parseInt(process.env.PORT || process.env.API_PORT || '3000', 10);
app.listen(PORT, () => {
  console.log(`🚀 Server + Frontend running on port ${PORT}`);
});