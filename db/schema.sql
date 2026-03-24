-- ==========================================
-- SAFE RESET
-- ==========================================

DROP TABLE IF EXISTS user_preferences;
DROP TABLE IF EXISTS User_Badges;
DROP TABLE IF EXISTS User_Quizzes;
DROP TABLE IF EXISTS User_Card_Progress;
DROP TABLE IF EXISTS User_Lessons;
DROP TABLE IF EXISTS Quiz_Answers;
DROP TABLE IF EXISTS Quiz_Questions;
DROP TABLE IF EXISTS Lesson_Cards;
DROP TABLE IF EXISTS Badges;
DROP TABLE IF EXISTS Quizzes;
DROP TABLE IF EXISTS Lesson_Cards;
DROP TABLE IF EXISTS Lessons;
DROP TABLE IF EXISTS Units;
DROP TABLE IF EXISTS Badges;
DROP TABLE IF EXISTS Users;

-- ==========================================
-- USERS
-- ==========================================

CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    current_streak INT DEFAULT 0,
    max_streak INT DEFAULT 0,
    profile_picture TEXT
);

-- ==========================
-- Units
-- ==========================
CREATE TABLE Units (
    unit_id SERIAL PRIMARY KEY,
    unit_title VARCHAR(255) NOT NULL,
    unit_order INTEGER NOT NULL
);

-- ==========================
-- Lessons
-- ==========================
CREATE TABLE Lessons (
    lesson_id SERIAL PRIMARY KEY,
    unit_id INT NOT NULL,
    theme VARCHAR(100) NOT NULL,
    level INT NOT NULL,
    extra_links TEXT,
    prereq_lesson_id INT,
    CONSTRAINT fk_lesson_unit
        FOREIGN KEY (unit_id)
        REFERENCES Units(unit_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_prereq
        FOREIGN KEY (prereq_lesson_id)
        REFERENCES Lessons(lesson_id)
        ON DELETE SET NULL
);

-- ==========================
-- Lesson_Cards
-- ==========================
CREATE TABLE Lesson_Cards (
    card_id SERIAL PRIMARY KEY,
    lesson_id INT NOT NULL,
    card_order INT NOT NULL,
    card_text TEXT NOT NULL,
    CONSTRAINT fk_card_lesson
        FOREIGN KEY (lesson_id)
        REFERENCES Lessons(lesson_id)
        ON DELETE CASCADE
);

-- ==========================
-- Quizzes
-- ==========================
CREATE TABLE Quizzes (
    quiz_id SERIAL PRIMARY KEY,
    lesson_id INT NOT NULL,
    num_of_questions INT NOT NULL,
    passing_score INT NOT NULL DEFAULT 4,
    CONSTRAINT fk_quiz_lesson
        FOREIGN KEY (lesson_id)
        REFERENCES Lessons(lesson_id)
        ON DELETE CASCADE
);

-- ==========================
-- Quiz_Questions
-- ==========================
CREATE TABLE Quiz_Questions (
    question_id SERIAL PRIMARY KEY,
    quiz_id INT NOT NULL,
    question_order INT NOT NULL,
    question_text TEXT NOT NULL,
    CONSTRAINT fk_question_quiz
        FOREIGN KEY (quiz_id)
        REFERENCES Quizzes(quiz_id)
        ON DELETE CASCADE
);

-- ==========================
-- Quiz_Answers
-- ==========================
CREATE TABLE Quiz_Answers (
    answer_id SERIAL PRIMARY KEY,
    question_id INT NOT NULL,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_answer_question
        FOREIGN KEY (question_id)
        REFERENCES Quiz_Questions(question_id)
        ON DELETE CASCADE
);

-- ==========================
-- User_Lessons
-- ==========================
CREATE TABLE User_Lessons (
    user_lesson_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    lesson_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    last_card_viewed INT DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES Lessons(lesson_id) ON DELETE CASCADE,

    CONSTRAINT unique_user_lesson UNIQUE (user_id, lesson_id)
);

-- ==========================================
-- USER QUIZZES
-- ==========================================

CREATE TABLE User_Quizzes (
    user_quiz_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score INT NOT NULL,
    attempt_number INT NOT NULL,
    date_taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    passed BOOLEAN NOT NULL,
    best_score BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_user_quiz_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user_quiz_quiz
        FOREIGN KEY (quiz_id)
        REFERENCES Quizzes(quiz_id)
        ON DELETE CASCADE,
    CONSTRAINT unique_user_quiz UNIQUE (user_id, quiz_id)
);

-- ==========================================
-- BADGES
-- ==========================================
CREATE TABLE Badges (
    badge_id SERIAL PRIMARY KEY,
    badge_name VARCHAR(100) NOT NULL,
    badge_level INT NOT NULL,
    badge_description TEXT,
    icon VARCHAR(255)
);

-- ==========================================
-- USER BADGES (ONLY STORES EARNED BADGES)
-- ==========================================
CREATE TABLE User_Badges (
    user_badge_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    badge_id INT NOT NULL,
    earned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES Badges(badge_id) ON DELETE CASCADE,

    CONSTRAINT unique_user_badge UNIQUE (user_id, badge_id)
);

-- ==========================================
-- USER PREFERENCES
-- ==========================================
CREATE TABLE user_preferences (
    user_id          INT PRIMARY KEY,
    reminder_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    reminder_time    TIME    NOT NULL DEFAULT '09:00:00',

    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);