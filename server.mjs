import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(cors());
app.use(express.json());

// ─── Health check ────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ─── Units (with lessons) ─────────────────────────────────────────────────────
// Used by the home page to render the unit-grouped lesson list.
// Returns all units, each with their lessons in order.

app.get('/api/units', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        u.unit_id,
        u.unit_title,
        u.unit_order,
        l.lesson_id,
        l.theme        AS lesson_title,
        l.level,
        l.prereq_lesson_id
      FROM Units u
      JOIN Lessons l ON l.unit_id = u.unit_id
      ORDER BY u.unit_order ASC, l.lesson_id ASC;
    `);

    // Group lessons under their unit
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
    console.error('Error fetching units:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── All lessons (flat list) ──────────────────────────────────────────────────

app.get('/api/lessons', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT lesson_id, unit_id, theme AS lesson_title, level, prereq_lesson_id
      FROM Lessons
      ORDER BY lesson_id ASC;
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Lesson cards ─────────────────────────────────────────────────────────────
// Returns the 3 content cards for a given lesson.

app.get('/api/lessons/:lessonId/cards', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const result = await pool.query(`
      SELECT
        lc.card_id,
        lc.card_order,
        lc.card_text,
        l.theme  AS lesson_title,
        u.unit_title
      FROM Lesson_Cards lc
      JOIN Lessons l ON l.lesson_id = lc.lesson_id
      JOIN Units   u ON u.unit_id   = l.unit_id
      WHERE lc.lesson_id = $1
      ORDER BY lc.card_order ASC;
    `, [parseInt(lessonId)]);

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching lesson cards:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Quiz questions for a lesson ──────────────────────────────────────────────
// Returns all questions with their answer options for a lesson's quiz.

app.get('/api/lessons/:lessonId/quiz', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const result = await pool.query(`
      SELECT
        qq.question_id,
        qq.quiz_id,
        qq.question_order,
        qq.question_text,
        json_agg(
          json_build_object(
            'answer_id',   qa.answer_id,
            'answer_text', qa.answer_text,
            'is_correct',  qa.is_correct
          ) ORDER BY qa.answer_id ASC
        ) AS answers
      FROM Quizzes q
      JOIN Quiz_Questions qq ON qq.quiz_id   = q.quiz_id
      JOIN Quiz_Answers   qa ON qa.question_id = qq.question_id
      WHERE q.lesson_id = $1
      GROUP BY qq.question_id, qq.quiz_id, qq.question_order, qq.question_text
      ORDER BY qq.question_order ASC;
    `, [parseInt(lessonId)]);

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── User lesson progress ─────────────────────────────────────────────────────

app.get('/api/users/:userId/lessons', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(`
      SELECT user_id, lesson_id, status, completed_at
      FROM User_Lessons
      WHERE user_id = $1
      ORDER BY lesson_id ASC;
    `, [parseInt(userId)]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching user lessons:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Mark lesson complete ─────────────────────────────────────────────────────

app.post('/api/users/:userId/lessons/:lessonId/complete', async (req, res) => {
  try {
    const { userId, lessonId } = req.params;
    const result = await pool.query(`
      INSERT INTO User_Lessons (user_id, lesson_id, status, completed_at)
      VALUES ($1, $2, 'Completed', CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, lesson_id)
      DO UPDATE SET status = 'Completed', completed_at = CURRENT_TIMESTAMP
      RETURNING *;
    `, [parseInt(userId), parseInt(lessonId)]);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error completing lesson:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Save quiz result ─────────────────────────────────────────────────────────

app.post('/api/users/:userId/quiz/:quizId/result', async (req, res) => {
  try {
    const { userId, quizId } = req.params;
    const { score, passed } = req.body;
    const result = await pool.query(`
      INSERT INTO User_Quizzes (user_id, quiz_id, score, attempt_number, passed, best_score)
      VALUES (
        $1, $2, $3, 
        COALESCE((SELECT MAX(attempt_number) FROM User_Quizzes WHERE user_id = $1 AND quiz_id = $2), 0) + 1,
        $4,
        $4
      )
      ON CONFLICT (user_id, quiz_id)
      DO UPDATE SET
        score          = EXCLUDED.score,
        attempt_number = User_Quizzes.attempt_number + 1,
        passed         = EXCLUDED.passed,
        best_score     = CASE WHEN EXCLUDED.passed THEN TRUE ELSE User_Quizzes.best_score END
      RETURNING *;
    `, [parseInt(userId), parseInt(quizId), score, passed]);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Start server ─────────────────────────────────────────────────────────────

const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});