import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const { Pool } = pg;

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';
const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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
app.use('/api', (_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

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
  const paramId = parseInt(req.params.userId, 10);
  if (req.user.userId !== paramId) {
    res.status(403).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

// ================= Streak helpers =================
function toDayKey(value = new Date()) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dayKeyToDate(dayKey) {
  const [year, month, day] = dayKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function addDays(dayKey, amount) {
  const date = dayKeyToDate(dayKey);
  date.setDate(date.getDate() + amount);
  return toDayKey(date);
}

function startOfWeek(dayKey) {
  const date = dayKeyToDate(dayKey);
  date.setDate(date.getDate() - date.getDay());
  return toDayKey(date);
}

function buildStreakMetrics(dayKeys, referenceDayKey = toDayKey(new Date())) {
  const uniqueSorted = Array.from(new Set((dayKeys || []).filter(Boolean))).sort();
  const activeSet = new Set(uniqueSorted);

  let longestStreak = 0;
  let runningStreak = 0;

  for (let i = 0; i < uniqueSorted.length; i += 1) {
    if (i > 0 && addDays(uniqueSorted[i - 1], 1) === uniqueSorted[i]) {
      runningStreak += 1;
    } else {
      runningStreak = 1;
    }
    longestStreak = Math.max(longestStreak, runningStreak);
  }

  let currentStreak = 0;
  if (uniqueSorted.length > 0) {
    const lastActiveDay = uniqueSorted[uniqueSorted.length - 1];
    const yesterday = addDays(referenceDayKey, -1);

    if (lastActiveDay === referenceDayKey || lastActiveDay === yesterday) {
      currentStreak = 1;
      for (let i = uniqueSorted.length - 1; i > 0; i -= 1) {
        if (addDays(uniqueSorted[i - 1], 1) === uniqueSorted[i]) {
          currentStreak += 1;
        } else {
          break;
        }
      }
    }
  }

  const weekStart = startOfWeek(referenceDayKey);
  const thisWeek = WEEKDAY_LABELS.map((label, index) => {
    const dayKey = addDays(weekStart, index);
    return {
      dayKey,
      label,
      active: activeSet.has(dayKey),
      isToday: dayKey === referenceDayKey,
    };
  });

  return {
    currentStreak,
    longestStreak,
    totalActiveDays: uniqueSorted.length,
    daysThisWeek: thisWeek.filter((day) => day.active).length,
    weeklyGoal: 5,
    thisWeek,
    activeDayKeys: uniqueSorted,
  };
}

function buildCalendar(dayKeys, referenceDayKey = toDayKey(new Date()), weeks = 5) {
  const activeSet = new Set(dayKeys);
  const currentWeekStart = startOfWeek(referenceDayKey);
  const calendarStart = addDays(currentWeekStart, -7 * (weeks - 1));
  const currentMonth = dayKeyToDate(referenceDayKey).getMonth();

  return Array.from({ length: weeks * 7 }, (_, index) => {
    const dayKey = addDays(calendarStart, index);
    const date = dayKeyToDate(dayKey);

    return {
      dayKey,
      dayNumber: date.getDate(),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      monthLabel: date.toLocaleDateString('en-US', { month: 'short' }),
      active: activeSet.has(dayKey),
      isToday: dayKey === referenceDayKey,
      isCurrentMonth: date.getMonth() === currentMonth,
    };
  });
}

async function getUserActivityDayKeys(client, userId) {
  const result = await client.query(
    `
      SELECT completed_at
      FROM User_Lessons
      WHERE user_id = $1
        AND completed_at IS NOT NULL
      ORDER BY completed_at ASC
    `,
    [userId]
  );

  return result.rows.map((row) => toDayKey(row.completed_at));
}

async function syncUserStreakMetrics(client, userId) {
  const dayKeys = await getUserActivityDayKeys(client, userId);
  const metrics = buildStreakMetrics(dayKeys);

  await client.query(
    `
      UPDATE Users
      SET current_streak = $1,
          max_streak = $2
      WHERE user_id = $3
    `,
    [metrics.currentStreak, metrics.longestStreak, userId]
  );

  return metrics;
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
    const userId = req.user.userId;

    let streakMetrics = { currentStreak: 0, longestStreak: 0 };
    try {
      streakMetrics = await syncUserStreakMetrics(pool, userId);
    } catch (streakErr) {
      console.error('Streak sync failed:', streakErr.message);
    }

    const result = await pool.query(
      `
        SELECT user_id, first_name, last_name, email, profile_picture
        FROM Users
        WHERE user_id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        ...result.rows[0],
        current_streak: streakMetrics.currentStreak,
        max_streak: streakMetrics.longestStreak,
      },
    });
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

  const client = await pool.connect();

  try {
    const { userId, lessonId } = req.params;

    await client.query('BEGIN');

    const existingResult = await client.query(
      `
        SELECT user_lesson_id, completed_at
        FROM User_Lessons
        WHERE user_id = $1 AND lesson_id = $2
        FOR UPDATE
      `,
      [userId, lessonId]
    );

    let completedAt;

    if (existingResult.rows.length === 0) {
      const insertResult = await client.query(
        `
          INSERT INTO User_Lessons (user_id, lesson_id, status, completed_at)
          VALUES ($1, $2, 'Completed', CURRENT_TIMESTAMP)
          RETURNING completed_at
        `,
        [userId, lessonId]
      );
      completedAt = insertResult.rows[0].completed_at;
    } else if (existingResult.rows[0].completed_at) {
      await client.query(
        `
          UPDATE User_Lessons
          SET status = 'Completed'
          WHERE user_id = $1 AND lesson_id = $2
        `,
        [userId, lessonId]
      );
      completedAt = existingResult.rows[0].completed_at;
    } else {
      const updateResult = await client.query(
        `
          UPDATE User_Lessons
          SET status = 'Completed',
              completed_at = CURRENT_TIMESTAMP
          WHERE user_id = $1 AND lesson_id = $2
          RETURNING completed_at
        `,
        [userId, lessonId]
      );
      completedAt = updateResult.rows[0].completed_at;
    }

    const streakMetrics = await syncUserStreakMetrics(client, Number(userId));

    await client.query('COMMIT');

    res.json({
      success: true,
      data: {
        completedAt,
        currentStreak: streakMetrics.currentStreak,
        maxStreak: streakMetrics.longestStreak,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, error: error.message });
  } finally {
    client.release();
  }
});

// ================= LESSON CARDS =================
app.get('/api/lessons/:lessonId/cards', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const result = await pool.query(`
      SELECT lc.card_id, lc.card_order, lc.card_text,
             l.theme AS lesson_title, u.unit_title
      FROM Lesson_Cards lc
      JOIN Lessons l ON l.lesson_id = lc.lesson_id
      JOIN Units u ON u.unit_id = l.unit_id
      WHERE lc.lesson_id = $1
      ORDER BY lc.card_order ASC
    `, [lessonId]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ================= LESSON PROGRESS (GET) =================
app.get('/api/users/:userId/lessons/:lessonId', authMiddleware, async (req, res) => {
  if (!checkUser(req, res)) return;
  try {
    const { userId, lessonId } = req.params;
    const result = await pool.query(
      'SELECT * FROM User_Lessons WHERE user_id = $1 AND lesson_id = $2',
      [userId, lessonId]
    );
    res.json({ success: true, data: result.rows[0] || null });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ================= QUIZ =================
app.get('/api/lessons/:lessonId/quiz', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const result = await pool.query(`
      SELECT qq.question_id, qq.quiz_id, qq.question_order, qq.question_text,
             qa.answer_id, qa.answer_text, qa.is_correct
      FROM Quizzes q
      JOIN Quiz_Questions qq ON qq.quiz_id = q.quiz_id
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
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ================= QUIZ RESULT =================
app.post('/api/users/:userId/quiz/:quizId/result', authMiddleware, async (req, res) => {
  if (!checkUser(req, res)) return;
  try {
    const { userId, quizId } = req.params;
    const { score, passed } = req.body;

    await pool.query(`
      INSERT INTO User_Quizzes (user_id, quiz_id, score, attempt_number, passed, best_score)
      VALUES ($1, $2, $3, 1, $4, true)
      ON CONFLICT (user_id, quiz_id) DO UPDATE
        SET attempt_number = User_Quizzes.attempt_number + 1,
            passed         = EXCLUDED.passed OR User_Quizzes.passed,
            date_taken_at  = CURRENT_TIMESTAMP,
            score          = CASE WHEN EXCLUDED.score > User_Quizzes.score THEN EXCLUDED.score ELSE User_Quizzes.score END,
            best_score     = CASE WHEN EXCLUDED.score > User_Quizzes.score THEN true ELSE User_Quizzes.best_score END
    `, [userId, quizId, score, passed]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ================= BADGES =================
app.get('/api/badges', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Badges ORDER BY badge_level ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/users/:userId/badges', authMiddleware, async (req, res) => {
  if (!checkUser(req, res)) return;
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT * FROM User_Badges WHERE user_id = $1',
      [userId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/users/:userId/badges/:badgeId/award', authMiddleware, async (req, res) => {
  if (!checkUser(req, res)) return;
  try {
    const { userId, badgeId } = req.params;
    await pool.query(`
      INSERT INTO User_Badges (user_id, badge_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, badge_id) DO NOTHING
    `, [userId, badgeId]);

    const streakMetrics = await syncUserStreakMetrics(pool, Number(userId));

    res.json({
      success: true,
      data: {
        currentStreak: streakMetrics.currentStreak,
        maxStreak: streakMetrics.longestStreak,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ================= USER STATS =================
app.get('/api/users/:userId/stats', authMiddleware, async (req, res) => {
  if (!checkUser(req, res)) return;
  try {
    const { userId } = req.params;
    const streakMetrics = await syncUserStreakMetrics(pool, Number(userId));

    const [lessonsRes, quizzesRes, unitsRes] = await Promise.all([
      pool.query(
        `SELECT COUNT(*) AS count FROM User_Lessons WHERE user_id = $1 AND status = 'Completed'`,
        [userId]
      ),
      pool.query(
        `SELECT
           COUNT(*) FILTER (WHERE passed = true) AS passed,
           COUNT(*) FILTER (WHERE passed = true AND score = (
             SELECT num_of_questions FROM Quizzes WHERE quiz_id = uq.quiz_id
           )) AS perfect
         FROM User_Quizzes uq WHERE user_id = $1`,
        [userId]
      ),
      pool.query(
        `SELECT DISTINCT l.unit_id
         FROM User_Lessons ul
         JOIN Lessons l ON l.lesson_id = ul.lesson_id
         WHERE ul.user_id = $1 AND ul.status = 'Completed'
           AND NOT EXISTS (
             SELECT 1 FROM Lessons l2
             WHERE l2.unit_id = l.unit_id
               AND NOT EXISTS (
                 SELECT 1 FROM User_Lessons ul2
                 WHERE ul2.user_id = $1
                   AND ul2.lesson_id = l2.lesson_id
                   AND ul2.status = 'Completed'
               )
           )`,
        [userId]
      ),
    ]);

    res.json({
      success: true,
      data: {
        completedLessons: parseInt(lessonsRes.rows[0].count, 10),
        passedQuizzes: parseInt(quizzesRes.rows[0].passed, 10),
        perfectScoreQuizzes: parseInt(quizzesRes.rows[0].perfect, 10),
        completedUnitIds: unitsRes.rows.map((r) => r.unit_id),
        currentStreak: streakMetrics.currentStreak,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ================= STREAKS =================
app.get('/api/users/:userId/streaks', authMiddleware, async (req, res) => {
  if (!checkUser(req, res)) return;

  try {
    const { userId } = req.params;
    const streakMetrics = await syncUserStreakMetrics(pool, Number(userId));
    const calendar = buildCalendar(streakMetrics.activeDayKeys);

    res.json({
      success: true,
      data: {
        currentStreak: streakMetrics.currentStreak,
        longestStreak: streakMetrics.longestStreak,
        totalDaysActive: streakMetrics.totalActiveDays,
        daysThisWeek: streakMetrics.daysThisWeek,
        weeklyGoal: streakMetrics.weeklyGoal,
        thisWeek: streakMetrics.thisWeek,
        calendar,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ================= PREFERENCES =================
app.get('/api/users/:userId/preferences', authMiddleware, async (req, res) => {
  if (!checkUser(req, res)) return;
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT * FROM user_preferences WHERE user_id = $1',
      [userId]
    );
    const data = result.rows.length > 0
      ? result.rows[0]
      : { reminder_enabled: true, reminder_time: '09:00:00' };
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/users/:userId/preferences', authMiddleware, async (req, res) => {
  if (!checkUser(req, res)) return;
  try {
    const { userId } = req.params;
    const { reminder_enabled, reminder_time } = req.body;
    await pool.query(`
      INSERT INTO user_preferences (user_id, reminder_enabled, reminder_time)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id) DO UPDATE
        SET reminder_enabled = EXCLUDED.reminder_enabled,
            reminder_time    = EXCLUDED.reminder_time
    `, [userId, reminder_enabled, reminder_time]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ================= PROFILE PICTURE =================
app.post('/api/users/:userId/profile-picture', authMiddleware, async (req, res) => {
  if (!checkUser(req, res)) return;
  try {
    const { userId } = req.params;
    const { profile_picture } = req.body;
    await pool.query(
      'UPDATE Users SET profile_picture = $1 WHERE user_id = $2',
      [profile_picture, userId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/users/:userId/profile-picture', authMiddleware, async (req, res) => {
  if (!checkUser(req, res)) return;
  try {
    const { userId } = req.params;
    await pool.query(
      'UPDATE Users SET profile_picture = NULL WHERE user_id = $1',
      [userId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
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