-- ==========================================
-- UNITS
-- ==========================================

INSERT INTO Units (unit_title, unit_order) VALUES
('Welcome & Nutrition Basics',1),
('Macronutrients - Your Body''s Fuel',2),
('Micronutrients - Small But Mighty',3),
('Digestion & Nutrient Absorption',4),
('Reading Labels & Making Informed Choices',5);


-- ==========================================
-- LESSONS
-- ==========================================

INSERT INTO Lessons (unit_id, theme, level) VALUES

-- UNIT 1
(1,'Welcome to NutriLearn',1),
(1,'What is Nutrition?',1),
(1,'The Basic Food Groups',1),
(1,'Calories Explained',1),
(1,'How Your Body Uses Food',1),

-- UNIT 2
(2,'Introduction to Macronutrients',2),
(2,'Carbohydrates - Your Energy Source',2),
(2,'Proteins - Your Building Blocks',2),
(2,'Fats - Essential and Misunderstood',2),
(2,'Balancing Your Macros',2),

-- UNIT 3
(3,'Introduction to Micronutrients',3),
(3,'Water-Soluble Vitamins (B & C)',3),
(3,'Fat-Soluble Vitamins (A, D, E, K)',3),
(3,'Important Minerals',3),
(3,'Getting Enough Micronutrients',3),

-- UNIT 4
(4,'The Digestive System in Detail',4),
(4,'How Nutrients Are Absorbed',4),
(4,'Gut Health and Microbiome Basics',4),
(4,'Factors That Affect Digestion',4),

-- UNIT 5
(5,'Understanding the Nutrition Facts Label',5),
(5,'Ingredient Lists Decoded',5),
(5,'Marketing Claims vs. Reality',5),
(5,'Comparing Food Products',5);


-- ==========================================
-- LESSON CARDS
-- ==========================================

INSERT INTO Lesson_Cards (lesson_id, card_order, card_text) VALUES

-- Lesson 1
(1,1,'Welcome to NutriLearn! In this course you will learn how food fuels the body and supports long-term health.'),
(1,2,'Nutrition is more than just calories. It includes the nutrients that allow your body to grow, repair itself, and function properly.'),
(1,3,'By the end of this course you will understand how to evaluate foods and make healthier choices.'),

-- Lesson 2
(2,1,'Nutrition is the science of how food affects the body.'),
(2,2,'The body needs nutrients to provide energy, support growth, and regulate important biological processes.'),
(2,3,'Good nutrition helps prevent disease and supports overall well-being.'),

-- Lesson 3
(3,1,'Foods are often grouped into categories based on the nutrients they provide.'),
(3,2,'Common food groups include fruits, vegetables, grains, protein foods, and dairy.'),
(3,3,'Eating a variety of food groups helps ensure your body receives a balanced set of nutrients.'),

-- Lesson 4
(4,1,'Calories measure the amount of energy provided by food.'),
(4,2,'Your body uses calories to fuel movement, thinking, and basic biological functions.'),
(4,3,'Balancing calories consumed with calories used helps maintain a healthy body weight.'),

-- Lesson 5
(5,1,'Food provides the energy and building blocks the body needs.'),
(5,2,'The digestive system breaks food down into nutrients the body can absorb.'),
(5,3,'Those nutrients are transported through the bloodstream to support cells throughout the body.'),

-- Lesson 6
(6,1,'Macronutrients are nutrients your body needs in large amounts.'),
(6,2,'The three main macronutrients are carbohydrates, proteins, and fats.'),
(6,3,'Each macronutrient plays a different but important role in supporting health.'),

-- Lesson 7
(7,1,'Carbohydrates are the body''s main source of energy.'),
(7,2,'Foods like bread, rice, fruits, and vegetables contain carbohydrates.'),
(7,3,'Complex carbohydrates provide longer-lasting energy than simple sugars.'),

-- Lesson 8
(8,1,'Proteins are essential for building and repairing tissues.'),
(8,2,'Protein is made up of smaller building blocks called amino acids.'),
(8,3,'Common protein sources include meat, beans, eggs, and nuts.'),

-- Lesson 9
(9,1,'Fats often have a negative reputation, but they are essential nutrients.'),
(9,2,'Healthy fats help the body absorb certain vitamins and support brain health.'),
(9,3,'Examples of healthy fats include avocados, nuts, and olive oil.'),

-- Lesson 10
(10,1,'Balancing macronutrients helps maintain stable energy levels.'),
(10,2,'Meals that include carbs, proteins, and fats provide a balanced source of nutrition.'),
(10,3,'Understanding your macros can help you build healthier meals.'),

-- Lesson 11
(11,1,'Micronutrients are nutrients required in smaller amounts but still essential.'),
(11,2,'They include vitamins and minerals that support body functions.'),
(11,3,'Even small deficiencies in micronutrients can affect health.'),

-- Lesson 12
(12,1,'Water-soluble vitamins include vitamin C and the B vitamins.'),
(12,2,'These vitamins dissolve in water and are not stored extensively in the body.'),
(12,3,'Because of this, they must be consumed regularly through food.'),

-- Lesson 13
(13,1,'Fat-soluble vitamins include vitamins A, D, E, and K.'),
(13,2,'These vitamins are stored in the body''s fat tissue.'),
(13,3,'They support vision, bone health, immunity, and blood clotting.'),

-- Lesson 14
(14,1,'Minerals are inorganic nutrients the body needs for various functions.'),
(14,2,'Examples include calcium, iron, potassium, and magnesium.'),
(14,3,'Minerals support bone strength, oxygen transport, and nerve function.'),

-- Lesson 15
(15,1,'A varied diet is the best way to obtain enough micronutrients.'),
(15,2,'Fruits, vegetables, whole grains, and lean proteins contain many essential nutrients.'),
(15,3,'Eating a colorful plate often means you are consuming a variety of vitamins and minerals.'),

-- Lesson 16
(16,1,'The digestive system begins breaking down food in the mouth.'),
(16,2,'Food travels through the stomach and intestines where digestion continues.'),
(16,3,'Different organs work together to extract nutrients from food.'),

-- Lesson 17
(17,1,'Nutrient absorption primarily occurs in the small intestine.'),
(17,2,'Tiny structures called villi increase the surface area for absorption.'),
(17,3,'Once absorbed, nutrients enter the bloodstream and travel to cells.'),

-- Lesson 18
(18,1,'The gut microbiome refers to the trillions of microorganisms in your digestive system.'),
(18,2,'These microbes help break down food and support immune health.'),
(18,3,'Eating fiber-rich foods can help maintain a healthy microbiome.'),

-- Lesson 19
(19,1,'Digestion can be affected by hydration, fiber intake, and physical activity.'),
(19,2,'Stress and lack of sleep can also impact digestive health.'),
(19,3,'Healthy lifestyle habits support efficient digestion.'),

-- Lesson 20
(20,1,'The Nutrition Facts label provides detailed information about packaged foods.'),
(20,2,'It includes serving size, calories, and nutrient content.'),
(20,3,'Understanding labels helps consumers make healthier choices.'),

-- Lesson 21
(21,1,'Ingredient lists show what a product contains.'),
(21,2,'Ingredients are listed in order of weight, from highest to lowest.'),
(21,3,'Shorter ingredient lists often indicate less processed foods.'),

-- Lesson 22
(22,1,'Food packaging often includes marketing claims like "natural" or "low-fat".'),
(22,2,'These claims may not always reflect the overall healthfulness of a food.'),
(22,3,'Always check the Nutrition Facts label for accurate information.'),

-- Lesson 23
(23,1,'Comparing food products helps identify healthier choices.'),
(23,2,'Look at calories, added sugars, sodium, and fiber when comparing foods.'),
(23,3,'Small label differences can have a big impact on nutrition.' );


-- ==========================================
-- QUIZZES
-- ==========================================

INSERT INTO Quizzes (lesson_id, num_of_questions)
SELECT lesson_id,5 FROM Lessons;


-- ==========================================
-- QUIZ QUESTIONS
-- ==========================================

INSERT INTO Quiz_Questions (quiz_id, question_order, question_text)
SELECT quiz_id,1,'What is the main idea of this lesson?' FROM Quizzes;

INSERT INTO Quiz_Questions (quiz_id, question_order, question_text)
SELECT quiz_id,2,'Which statement correctly relates to this nutrition concept?' FROM Quizzes;

INSERT INTO Quiz_Questions (quiz_id, question_order, question_text)
SELECT quiz_id,3,'Which example best represents the concept from this lesson?' FROM Quizzes;

INSERT INTO Quiz_Questions (quiz_id, question_order, question_text)
SELECT quiz_id,4,'Why is this topic important for maintaining health?' FROM Quizzes;

INSERT INTO Quiz_Questions (quiz_id, question_order, question_text)
SELECT quiz_id,5,'Which choice supports healthy nutrition habits?' FROM Quizzes;


-- ==========================================
-- QUIZ ANSWERS
-- ==========================================

INSERT INTO Quiz_Answers (question_id, answer_text, is_correct)
SELECT question_id,'Correct Answer',TRUE FROM Quiz_Questions;

INSERT INTO Quiz_Answers (question_id, answer_text, is_correct)
SELECT question_id,'Incorrect Option A',FALSE FROM Quiz_Questions;

INSERT INTO Quiz_Answers (question_id, answer_text, is_correct)
SELECT question_id,'Incorrect Option B',FALSE FROM Quiz_Questions;


-- ==========================================
-- BADGES
-- ==========================================

INSERT INTO Badges (badge_name, badge_level) VALUES
('Nutrition Beginner',1),
('Macro Master',2),
('Vitamin Expert',3),
('Digestive Guru',4),
('Label Detective',5);