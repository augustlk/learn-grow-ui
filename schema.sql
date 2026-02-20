-- Drop tables if they already exist (safe reset order)
DROP TABLE IF EXISTS User_Badges;
DROP TABLE IF EXISTS User_Quizzes;
DROP TABLE IF EXISTS User_Lessons;
DROP TABLE IF EXISTS Badges;
DROP TABLE IF EXISTS Quizzes;
DROP TABLE IF EXISTS Lessons;
DROP TABLE IF EXISTS Users;

-- ==========================
-- Users
-- ==========================
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    current_streak INT DEFAULT 0,
    max_streak INT DEFAULT 0
);

-- ==========================
-- Lessons
-- ==========================
CREATE TABLE Lessons (
    lesson_id SERIAL PRIMARY KEY,
    theme VARCHAR(100) NOT NULL,
    level INT NOT NULL,
    extra_links TEXT,
    prereq_lesson_id INT,
    CONSTRAINT fk_prereq
        FOREIGN KEY (prereq_lesson_id)
        REFERENCES Lessons(lesson_id)
        ON DELETE SET NULL
);

-- ==========================
-- Quizzes
-- ==========================
CREATE TABLE Quizzes (
    quiz_id SERIAL PRIMARY KEY,
    lesson_id INT NOT NULL,
    num_of_questions INT NOT NULL,
    CONSTRAINT fk_quiz_lesson
        FOREIGN KEY (lesson_id)
        REFERENCES Lessons(lesson_id)
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
    completed_at TIMESTAMP,
    CONSTRAINT fk_user_lesson_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user_lesson_lesson
        FOREIGN KEY (lesson_id)
        REFERENCES Lessons(lesson_id)
        ON DELETE CASCADE,
    CONSTRAINT unique_user_lesson UNIQUE (user_id, lesson_id)
);

-- ==========================
-- User_Quizzes
-- ==========================
CREATE TABLE User_Quizzes (
    user_quiz_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score INT NOT NULL,
    attempt_number INT NOT NULL,
    date_taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    passed BOOLEAN NOT NULL,
    CONSTRAINT fk_user_quiz_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user_quiz_quiz
        FOREIGN KEY (quiz_id)
        REFERENCES Quizzes(quiz_id)
        ON DELETE CASCADE
);

-- ==========================
-- Badges
-- ==========================
CREATE TABLE Badges (
    badge_id SERIAL PRIMARY KEY,
    badge_name VARCHAR(100) NOT NULL,
    badge_level INT NOT NULL
);

-- ==========================
-- User_Badges
-- ==========================
CREATE TABLE User_Badges (
    user_badge_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    badge_id INT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_badge_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user_badge_badge
        FOREIGN KEY (badge_id)
        REFERENCES Badges(badge_id)
        ON DELETE CASCADE,
    CONSTRAINT unique_user_badge UNIQUE (user_id, badge_id)
);
