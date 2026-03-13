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

// ─────────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ─────────────────────────────────────────────
// UNITS & LESSONS
// ─────────────────────────────────────────────

// Get all units with their lessons
app.get('/api/units', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.unit_id,
        u.unit_title,
        u.unit_order,
        l.lesson_id,
        l.theme,
        l.level,
        l.total_cards,
        l.extra_links,
        l.prereq_lesson_id
      FROM Units u
      JOIN Lessons l ON u.unit_id = l.unit_id
      ORDER BY u.unit_order ASC, l.lesson_id ASC;
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching units:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all lessons (flat list for home screen)
app.get('/api/lessons', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        l.lesson_id,
        l.unit_id,
        l.theme AS title,
        l.level,
        l.total_cards,
        l.extra_links,
        u.unit_title,
        u.unit_order
      FROM Lessons l
      JOIN Units u ON l.unit_id = u.unit_id
      ORDER BY u.unit_order ASC, l.lesson_id ASC;
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get lesson cards for a specific lesson
app.get('/api/lessons/:lessonId/cards', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const result = await pool.query(`
      SELECT 
        lc.card_id,
        lc.lesson_id,
        lc.card_order,
        lc.card_text,
        l.theme AS lesson_title,
        l.level,
        l.extra_links,
        u.unit_title
      FROM Lesson_Cards lc
      JOIN Lessons l ON lc.lesson_id = l.lesson_id
      JOIN Units u ON l.unit_id = u.unit_id
      WHERE lc.lesson_id = $1
      ORDER BY lc.card_order ASC;
    `, [parseInt(lessonId)]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching lesson cards:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─────────────────────────────────────────────
// QUIZZES
// ─────────────────────────────────────────────

// Get quiz questions and answers for a specific lesson
app.get('/api/lessons/:lessonId/quiz', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const result = await pool.query(`
      SELECT 
        qq.question_id,
        qq.question_order,
        qq.question_text,
        qa.answer_id,
        qa.answer_text,
        qa.is_correct,
        q.quiz_id,
        q.passing_score
      FROM Quizzes q
      JOIN Quiz_Questions qq ON q.quiz_id = qq.quiz_id
      JOIN Quiz_Answers qa ON qq.question_id = qa.question_id
      WHERE q.lesson_id = $1
      ORDER BY qq.question_order ASC, qa.answer_id ASC;
    `, [parseInt(lessonId)]);

    // Group answers under each question
    const questionsMap = {};
    result.rows.forEach((row) => {
      if (!questionsMap[row.question_id]) {
        questionsMap[row.question_id] = {
          id: row.question_id,
          question: row.question_text,
          options: [],
          correctIndex: -1,
          quiz_id: row.quiz_id,
          passing_score: row.passing_score,
        };
      }
      const optionIndex = questionsMap[row.question_id].options.length;
      questionsMap[row.question_id].options.push(row.answer_text);
      if (row.is_correct) {
        questionsMap[row.question_id].correctIndex = optionIndex;
      }
    });

    const questions = Object.values(questionsMap);
    res.json({ success: true, data: questions });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─────────────────────────────────────────────
// USER PROGRESS
// ─────────────────────────────────────────────

// Get user's lesson progress
app.get('/api/users/:userId/lessons', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT user_id, lesson_id, status, completed_at
       FROM User_Lessons
       WHERE user_id = $1
       ORDER BY lesson_id ASC;`,
      [parseInt(userId)]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching user lessons:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update lesson status to complete
app.post('/api/users/:userId/lessons/:lessonId/complete', async (req, res) => {
  try {
    const { userId, lessonId } = req.params;
    const result = await pool.query(
      `INSERT INTO User_Lessons (user_id, lesson_id, status, completed_at)
       VALUES ($1, $2, 'Completed', CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, lesson_id) 
       DO UPDATE SET status = 'Completed', completed_at = CURRENT_TIMESTAMP
       RETURNING *;`,
      [parseInt(userId), parseInt(lessonId)]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating lesson status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save user quiz result
app.post('/api/users/:userId/quiz/:quizId/result', async (req, res) => {
  try {
    const { userId, quizId } = req.params;
    const { score, passed } = req.body;

    // Get attempt number
    const attemptResult = await pool.query(
      `SELECT COUNT(*) FROM User_Quizzes WHERE user_id = $1 AND quiz_id = $2;`,
      [parseInt(userId), parseInt(quizId)]
    );
    const attemptNumber = parseInt(attemptResult.rows[0].count) + 1;

    const result = await pool.query(
      `INSERT INTO User_Quizzes (user_id, quiz_id, score, attempt_number, passed)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *;`,
      [parseInt(userId), parseInt(quizId), score, attemptNumber, passed]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});