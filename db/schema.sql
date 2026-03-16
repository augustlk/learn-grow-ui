-- ==========================================
-- SAFE RESET
-- ==========================================

DROP TABLE IF EXISTS User_Badges;
DROP TABLE IF EXISTS User_Quizzes;
DROP TABLE IF EXISTS User_Card_Progress;
DROP TABLE IF EXISTS User_Lessons;
DROP TABLE IF EXISTS Quiz_Answers;
DROP TABLE IF EXISTS Quiz_Questions;
DROP TABLE IF EXISTS Lesson_Cards;
DROP TABLE IF EXISTS Badges;
DROP TABLE IF EXISTS Quizzes;
DROP TABLE IF EXISTS Lessons;
DROP TABLE IF EXISTS Units;
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
    max_streak INT DEFAULT 0
);

-- ==========================================
-- UNITS
-- ==========================================

CREATE TABLE Units (
    unit_id SERIAL PRIMARY KEY,
    unit_title VARCHAR(200) NOT NULL,
    unit_order INT NOT NULL
);

-- ==========================================
-- LESSONS
-- ==========================================

CREATE TABLE Lessons (
    lesson_id SERIAL PRIMARY KEY,
    unit_id INT NOT NULL,
    theme VARCHAR(200) NOT NULL,
    total_cards INT DEFAULT 3,
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

-- ==========================================
-- LESSON CARDS
-- ==========================================

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

-- ==========================================
-- USER CARD PROGRESS
-- ==========================================

CREATE TABLE User_Card_Progress (
    progress_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    card_id INT NOT NULL,
    viewed BOOLEAN DEFAULT FALSE,
    viewed_at TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (card_id) REFERENCES Lesson_Cards(card_id) ON DELETE CASCADE,

    CONSTRAINT unique_user_card UNIQUE (user_id, card_id)
);

-- ==========================================
-- QUIZZES
-- ==========================================

CREATE TABLE Quizzes (
    quiz_id SERIAL PRIMARY KEY,
    lesson_id INT NOT NULL,
    num_of_questions INT NOT NULL,
    passing_score INT DEFAULT 4,

    FOREIGN KEY (lesson_id)
        REFERENCES Lessons(lesson_id)
        ON DELETE CASCADE
);

-- ==========================================
-- QUIZ QUESTIONS
-- ==========================================

CREATE TABLE Quiz_Questions (
    question_id SERIAL PRIMARY KEY,
    quiz_id INT NOT NULL,
    question_order INT NOT NULL,
    question_text TEXT NOT NULL,

    FOREIGN KEY (quiz_id)
        REFERENCES Quizzes(quiz_id)
        ON DELETE CASCADE
);

-- ==========================================
-- QUIZ ANSWERS
-- ==========================================

CREATE TABLE Quiz_Answers (
    answer_id SERIAL PRIMARY KEY,
    question_id INT NOT NULL,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (question_id)
        REFERENCES Quiz_Questions(question_id)
        ON DELETE CASCADE
);

-- ==========================================
-- USER LESSONS
-- ==========================================

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

    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES Quizzes(quiz_id) ON DELETE CASCADE
);

-- ==========================================
-- BADGES
-- ==========================================

CREATE TABLE Badges (
    badge_id SERIAL PRIMARY KEY,
    badge_name VARCHAR(100) NOT NULL,
    badge_level INT NOT NULL
);

-- ==========================================
-- USER BADGES
-- ==========================================

CREATE TABLE User_Badges (
    user_badge_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    badge_id INT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES Badges(badge_id) ON DELETE CASCADE,

    CONSTRAINT unique_user_badge UNIQUE (user_id, badge_id)
);