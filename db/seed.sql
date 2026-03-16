-- ==========================================
-- USERS
-- ==========================================

INSERT INTO Users (first_name, last_name, email, password_hash) VALUES
('Alice', 'Johnson', 'alice@example.com', 'hashed_password_1'),
('Bob', 'Smith', 'bob@example.com', 'hashed_password_2'),
('Charlie', 'Brown', 'charlie@example.com', 'hashed_password_3');


-- ==========================================
-- UNITS
-- ==========================================

INSERT INTO Units (unit_title, unit_order) VALUES
('Welcome & Nutrition Basics', 1),
('Macronutrients - Your Body''s Fuel', 2),
('Micronutrients - Small But Mighty', 3),       -- TODO (Team): update unit title if needed
('Digestion & Nutrient Absorption', 4),          -- TODO (Team): update unit title if needed
('Reading Labels & Making Informed Choices', 5); -- TODO (Team): update unit title if needed


-- ==========================================
-- LESSONS
-- ==========================================

INSERT INTO Lessons (unit_id, theme, level, prereq_lesson_id) VALUES
-- Unit 1: Welcome & Nutrition Basics
(1, 'Welcome to NutriLearn', 1, NULL),
(1, 'What is Nutrition?', 1, 1),
(1, 'The Basic Food Groups', 1, 2),
(1, 'Calories Explained', 1, 3),
(1, 'How Your Body Uses Food', 1, 4),
-- Unit 2: Macronutrients
(2, 'Introduction to Macronutrients', 2, 5),
(2, 'Carbohydrates - Your Energy Source', 2, 6),
(2, 'Proteins - Your Building Blocks', 2, 7),
(2, 'Fats - Essential and Misunderstood', 2, 8),
(2, 'Balancing Your Macros', 2, 9),
-- Unit 3: Micronutrients (TODO: update lesson titles and content)
(3, 'Lesson 11 Title - TODO', 3, 10),
(3, 'Lesson 12 Title - TODO', 3, 11),
(3, 'Lesson 13 Title - TODO', 3, 12),
(3, 'Lesson 14 Title - TODO', 3, 13),
(3, 'Lesson 15 Title - TODO', 3, 14),
-- Unit 4: Digestion (TODO: update lesson titles and content)
(4, 'Lesson 16 Title - TODO', 4, 15),
(4, 'Lesson 17 Title - TODO', 4, 16),
(4, 'Lesson 18 Title - TODO', 4, 17),
(4, 'Lesson 19 Title - TODO', 4, 18),
-- Unit 5: Reading Labels (TODO: update lesson titles and content)
(5, 'Lesson 20 Title - TODO', 5, 19),
(5, 'Lesson 21 Title - TODO', 5, 20),
(5, 'Lesson 22 Title - TODO', 5, 21),
(5, 'Lesson 23 Title - TODO', 5, 22);


-- ==========================================
-- LESSON CARDS
-- ==========================================

INSERT INTO Lesson_Cards (lesson_id, card_order, card_text) VALUES

-- Lesson 1: Welcome to NutriLearn
(1, 1, 'Welcome to NutriLearn! This app teaches you about nutrition through short, science-backed lessons. Each lesson covers one focused topic and ends with a five-question quiz. You need to score 80% or higher to unlock the next lesson, so take your time reading each card carefully.'),
(1, 2, 'NutriLearn is organized into five units: Nutrition Basics, Macronutrients, Micronutrients, Digestion, and Reading Food Labels. Each unit builds on the last, giving you a complete foundation in nutrition science — no prior knowledge required.'),
(1, 3, 'Our goal is not to tell you what to eat. It is to give you the knowledge to make your own informed choices. By the end of this course, you will understand how different nutrients affect your body, how to read a nutrition label, and how to apply what you know to your daily life.'),

-- Lesson 2: What is Nutrition?
(2, 1, 'Nutrition is the science of how food and drink affect the body. Every time you eat, you are giving your body raw materials — for energy, for building and repairing cells, and for regulating biological processes. Without adequate nutrition, none of these systems function properly.'),
(2, 2, 'Nutrients are the specific substances in food that your body uses. They fall into two broad categories: macronutrients (carbohydrates, proteins, fats), which you need in large amounts, and micronutrients (vitamins and minerals), which you need in smaller amounts but are equally essential. Water is also a critical nutrient.'),
(2, 3, 'Good nutrition is strongly linked to disease prevention. Poor diet is a leading risk factor for heart disease, type 2 diabetes, obesity, and certain cancers. Conversely, a well-nourished body supports immune function, mental health, energy levels, and longevity. Nutrition is not about perfection — it is about consistent, informed choices.'),

-- Lesson 3: The Basic Food Groups
(3, 1, 'Food groups are categories that organize foods by the nutrients they primarily provide. The five main food groups are: fruits, vegetables, grains, protein foods, and dairy (or calcium-rich alternatives). Each group contributes a different set of nutrients, which is why dietary variety is so important.'),
(3, 2, 'Fruits and vegetables are rich in vitamins, minerals, fiber, and antioxidants. Grains — especially whole grains — provide carbohydrates for energy plus B vitamins and fiber. Protein foods (meat, poultry, fish, eggs, beans, nuts) supply amino acids and iron. Dairy and fortified alternatives provide calcium, Vitamin D, and potassium.'),
(3, 3, 'No single food group provides every nutrient your body needs. Eating a variety across all groups is the most reliable way to meet your nutritional needs without supplements. A simple guideline: at each meal, aim to include at least three different food groups on your plate.'),

-- Lesson 4: Calories Explained
(4, 1, 'A calorie is a unit of energy. Specifically, it is the amount of energy needed to raise the temperature of one kilogram of water by one degree Celsius. In nutrition, calories tell you how much energy a food provides when your body breaks it down. Your body uses this energy for everything from breathing and thinking to walking and exercising.'),
(4, 2, 'Different macronutrients provide different amounts of energy per gram. Carbohydrates provide 4 calories per gram. Protein also provides 4 calories per gram. Fat provides 9 calories per gram — more than double. This is why fat-rich foods are calorie-dense. Alcohol provides 7 calories per gram but has no nutritional value.'),
(4, 3, 'Calories are not inherently good or bad. Your body needs them to survive. What matters is the balance between calories consumed and calories used, and the nutritional quality of the foods providing those calories. A 200-calorie apple and a 200-calorie candy bar have the same energy value but very different effects on your body.'),

-- Lesson 5: How Your Body Uses Food
(5, 1, 'Digestion begins the moment food enters your mouth. Chewing breaks food into smaller pieces and mixes it with saliva, which contains an enzyme called amylase that begins breaking down carbohydrates. Food then travels down the esophagus to the stomach, where acids and enzymes continue the breakdown process, particularly for proteins.'),
(5, 2, 'Most nutrient absorption happens in the small intestine. The walls of the small intestine are lined with tiny finger-like projections called villi, which dramatically increase the surface area available for absorption. Nutrients pass through the intestinal wall into the bloodstream and are carried to cells throughout the body.'),
(5, 3, 'Metabolism is the collective term for all the chemical reactions in your body that convert food into energy and building materials. Your basal metabolic rate (BMR) is how many calories your body burns at complete rest just to maintain basic functions — breathing, circulation, and cell repair. BMR accounts for 60-70% of total daily energy use for most people.'),

-- Lesson 6: Introduction to Macronutrients
(6, 1, 'Macronutrients are the three main classes of nutrients your body needs in large amounts every day: carbohydrates, proteins, and fats. The word "macro" means large — unlike vitamins and minerals, you measure macronutrients in grams, not milligrams. Every single calorie you consume comes from one of these three sources.'),
(6, 2, 'Each macronutrient has a distinct primary role. Carbohydrates are your body''s preferred and fastest fuel source — your brain runs almost exclusively on glucose, a carbohydrate. Protein provides the amino acids needed to build and repair every tissue in your body. Fat insulates organs, produces hormones, and enables absorption of fat-soluble vitamins.'),
(6, 3, 'A common mistake is to demonize one macronutrient — cutting all carbs, avoiding all fat, or eating only protein. Each macronutrient is essential. Eliminating any one of them causes deficiencies and imbalances over time. The key is choosing high-quality sources of each and eating them in proportions that match your lifestyle and goals.'),

-- Lesson 7: Carbohydrates - Your Energy Source
(7, 1, 'Carbohydrates are sugars and starches found in foods like bread, rice, fruit, vegetables, and dairy. When digested, they break down into glucose, which enters the bloodstream and fuels cells throughout the body — especially the brain and muscles. Simple carbohydrates (sugars) digest quickly and cause rapid blood sugar spikes. Complex carbohydrates (starches and fiber) digest slowly and provide more sustained energy.'),
(7, 2, 'Fiber is a special type of carbohydrate your body cannot fully digest. Instead of being absorbed, fiber slows digestion, stabilizes blood sugar levels, feeds beneficial gut bacteria, and adds bulk to stools preventing constipation. Adults need 25–38 grams of fiber per day; most people get far less. Good sources include whole grains, legumes, fruits, and vegetables.'),
(7, 3, 'The glycemic index (GI) ranks foods by how quickly they raise blood sugar. High-GI foods like white bread and sugary drinks cause rapid spikes followed by crashes, leading to hunger and low energy. Low-GI foods like oats, legumes, and most whole fruits release energy gradually. For steady energy and blood sugar control, choose complex carbs and pair them with protein and fat.'),

-- Lesson 8: Proteins - Your Building Blocks
(8, 1, 'Protein is made up of smaller units called amino acids. There are 20 amino acids in total; 11 can be made by your body (non-essential) and 9 must come from food (essential). These essential amino acids are: histidine, isoleucine, leucine, lysine, methionine, phenylalanine, threonine, tryptophan, and valine. Without all nine, your body cannot build proteins properly.'),
(8, 2, 'A complete protein contains all 9 essential amino acids in adequate amounts. Animal-based foods — meat, poultry, fish, eggs, and dairy — are all complete proteins. Most plant-based proteins are incomplete (missing one or more essential amino acids), but combining different plant sources throughout the day covers all essentials. Rice and beans together, for example, provide a complete amino acid profile.'),
(8, 3, 'Protein does far more than build muscle. It makes enzymes that drive every chemical reaction in your body. It produces hormones like insulin and growth hormone. It forms antibodies for your immune system. Hemoglobin — the protein that carries oxygen in red blood cells — is also a protein. Most adults need about 0.8 grams of protein per kilogram of body weight per day, though active individuals need more.'),

-- Lesson 9: Fats - Essential and Misunderstood
(9, 1, 'Not all fats are the same. Unsaturated fats — found in olive oil, avocados, nuts, seeds, and fatty fish — reduce inflammation and support heart and brain health. Saturated fats — found in butter, red meat, and full-fat dairy — raise LDL (bad) cholesterol and should be limited. Trans fats — created by partially hydrogenating vegetable oils and found in many processed foods — raise LDL and lower HDL (good) cholesterol and should be avoided entirely.'),
(9, 2, 'Fat plays a critical structural and functional role in your body. Every cell membrane is made of a phospholipid bilayer — essentially a fat layer. Your brain is about 60% fat by dry weight. Fat surrounds and protects vital organs. It also enables the absorption of fat-soluble vitamins A, D, E, and K: without dietary fat, you cannot properly absorb these nutrients no matter how much you eat them.'),
(9, 3, 'Fat also serves as a long-term energy reserve and produces steroid hormones including estrogen, testosterone, and cortisol. Very low-fat diets can disrupt hormone balance and cause deficiencies in fat-soluble vitamins, leading to problems with vision, immunity, bone density, and blood clotting. Healthy fats are not something to fear — they are something to choose wisely.'),

-- Lesson 10: Balancing Your Macros
(10, 1, 'General dietary guidelines suggest getting 45–65% of daily calories from carbohydrates, 10–35% from protein, and 20–35% from fat. These are ranges, not rigid rules. Your ideal balance depends on your age, activity level, health status, and personal goals. An endurance athlete needs more carbohydrates; someone focused on building muscle needs more protein.'),
(10, 2, 'The plate method is a simple, practical tool for balancing macros without counting grams. At each meal, fill half your plate with non-starchy vegetables and fruits, one quarter with lean protein (chicken, fish, beans, tofu), and one quarter with complex carbohydrates (whole grains, legumes, starchy vegetables). Add a small amount of healthy fat — olive oil, nuts, or avocado.'),
(10, 3, 'Consistency matters more than precision. Hitting exact macro percentages every day is neither realistic nor necessary for most people. What works is building regular eating patterns that include all three macronutrients at most meals, choosing high-quality whole food sources, and adjusting based on how your body feels and performs. Over time, these habits become automatic.'),

-- Lessons 11-23: Placeholders for teammates to fill in
-- TODO (Unit 3 team): Replace these placeholders with real lesson content
(11, 1, 'TODO: Add card 1 content for Lesson 11.'),
(11, 2, 'TODO: Add card 2 content for Lesson 11.'),
(11, 3, 'TODO: Add card 3 content for Lesson 11.'),

(12, 1, 'TODO: Add card 1 content for Lesson 12.'),
(12, 2, 'TODO: Add card 2 content for Lesson 12.'),
(12, 3, 'TODO: Add card 3 content for Lesson 12.'),

(13, 1, 'TODO: Add card 1 content for Lesson 13.'),
(13, 2, 'TODO: Add card 2 content for Lesson 13.'),
(13, 3, 'TODO: Add card 3 content for Lesson 13.'),

(14, 1, 'TODO: Add card 1 content for Lesson 14.'),
(14, 2, 'TODO: Add card 2 content for Lesson 14.'),
(14, 3, 'TODO: Add card 3 content for Lesson 14.'),

(15, 1, 'TODO: Add card 1 content for Lesson 15.'),
(15, 2, 'TODO: Add card 2 content for Lesson 15.'),
(15, 3, 'TODO: Add card 3 content for Lesson 15.'),

-- TODO (Unit 4 team): Replace these placeholders with real lesson content
(16, 1, 'TODO: Add card 1 content for Lesson 16.'),
(16, 2, 'TODO: Add card 2 content for Lesson 16.'),
(16, 3, 'TODO: Add card 3 content for Lesson 16.'),

(17, 1, 'TODO: Add card 1 content for Lesson 17.'),
(17, 2, 'TODO: Add card 2 content for Lesson 17.'),
(17, 3, 'TODO: Add card 3 content for Lesson 17.'),

(18, 1, 'TODO: Add card 1 content for Lesson 18.'),
(18, 2, 'TODO: Add card 2 content for Lesson 18.'),
(18, 3, 'TODO: Add card 3 content for Lesson 18.'),

(19, 1, 'TODO: Add card 1 content for Lesson 19.'),
(19, 2, 'TODO: Add card 2 content for Lesson 19.'),
(19, 3, 'TODO: Add card 3 content for Lesson 19.'),

-- TODO (Unit 5 team): Replace these placeholders with real lesson content
(20, 1, 'TODO: Add card 1 content for Lesson 20.'),
(20, 2, 'TODO: Add card 2 content for Lesson 20.'),
(20, 3, 'TODO: Add card 3 content for Lesson 20.'),

(21, 1, 'TODO: Add card 1 content for Lesson 21.'),
(21, 2, 'TODO: Add card 2 content for Lesson 21.'),
(21, 3, 'TODO: Add card 3 content for Lesson 21.'),

(22, 1, 'TODO: Add card 1 content for Lesson 22.'),
(22, 2, 'TODO: Add card 2 content for Lesson 22.'),
(22, 3, 'TODO: Add card 3 content for Lesson 22.'),

(23, 1, 'TODO: Add card 1 content for Lesson 23.'),
(23, 2, 'TODO: Add card 2 content for Lesson 23.'),
(23, 3, 'TODO: Add card 3 content for Lesson 23.');


-- ==========================================
-- QUIZZES (1 per lesson, passing score = 4/5 = 80%)
-- ==========================================

INSERT INTO Quizzes (lesson_id, num_of_questions, passing_score)
SELECT lesson_id, 5, 4 FROM Lessons ORDER BY lesson_id;


-- ==========================================
-- QUIZ QUESTIONS & ANSWERS
-- Units 1 & 2: real questions
-- Units 3-5: placeholders for teammates
-- ==========================================

INSERT INTO Quiz_Questions (quiz_id, question_order, question_text) VALUES
-- Lesson 1
(1, 1, 'What score do you need on a quiz to unlock the next lesson?'),
(1, 2, 'How many units does NutriLearn contain?'),
(1, 3, 'What is the main focus of NutriLearn?'),
(1, 4, 'Approximately how long does each lesson take?'),
(1, 5, 'What happens when you score 80% or higher on a quiz?'),
-- Lesson 2
(2, 1, 'What is nutrition?'),
(2, 2, 'Which of the following is a macronutrient?'),
(2, 3, 'Which condition is strongly linked to poor nutrition?'),
(2, 4, 'What are the two main categories of nutrients?'),
(2, 5, 'What best describes the goal of good nutrition?'),
-- Lesson 3
(3, 1, 'How many main food groups are there?'),
(3, 2, 'Which food group is the best source of calcium?'),
(3, 3, 'What do fruits and vegetables primarily provide?'),
(3, 4, 'What does the protein food group primarily supply?'),
(3, 5, 'Why is eating across all food groups important?'),
-- Lesson 4
(4, 1, 'What does a calorie measure?'),
(4, 2, 'How many calories per gram does fat provide?'),
(4, 3, 'How many calories per gram do carbohydrates and protein each provide?'),
(4, 4, 'Which macronutrient provides the most calories per gram?'),
(4, 5, 'What matters most when thinking about calorie intake?'),
-- Lesson 5
(5, 1, 'Where does digestion begin?'),
(5, 2, 'What enzyme in saliva begins carbohydrate digestion?'),
(5, 3, 'Where does most nutrient absorption take place?'),
(5, 4, 'What is metabolism?'),
(5, 5, 'What is basal metabolic rate (BMR)?'),
-- Lesson 6
(6, 1, 'What are the three macronutrients?'),
(6, 2, 'What is the primary role of carbohydrates in the body?'),
(6, 3, 'What does protein primarily do in the body?'),
(6, 4, 'Which macronutrient is needed for fat-soluble vitamin absorption?'),
(6, 5, 'What happens when you completely eliminate a macronutrient from your diet?'),
-- Lesson 7
(7, 1, 'What do carbohydrates break down into during digestion?'),
(7, 2, 'What is the key difference between simple and complex carbohydrates?'),
(7, 3, 'What does dietary fiber do in the body?'),
(7, 4, 'What does the glycemic index measure?'),
(7, 5, 'Which is the best choice for sustained, steady energy?'),
-- Lesson 8
(8, 1, 'How many essential amino acids must come from food?'),
(8, 2, 'What makes a protein "complete"?'),
(8, 3, 'Which of the following is a complete protein source?'),
(8, 4, 'Besides building muscle, protein is used to make:'),
(8, 5, 'How can people who eat no animal products get all essential amino acids?'),
-- Lesson 9
(9, 1, 'Which type of fat should be avoided entirely?'),
(9, 2, 'Why is dietary fat necessary even when trying to eat healthily?'),
(9, 3, 'Which food is a source of healthy unsaturated fat?'),
(9, 4, 'What can happen with an extremely low-fat diet?'),
(9, 5, 'Which vitamins require dietary fat for proper absorption?'),
-- Lesson 10
(10, 1, 'What percentage of daily calories should generally come from carbohydrates?'),
(10, 2, 'Using the plate method, how much of your plate should be lean protein?'),
(10, 3, 'Who generally needs more carbohydrates in their diet?'),
(10, 4, 'What is the plate method designed to help with?'),
(10, 5, 'Why do macronutrient needs vary between individuals?'),
-- Lessons 11-23: Placeholders
-- TODO (Unit 3 team): Replace question text with real questions for lessons 11-15
(11, 1, 'TODO: Question 1 for Lesson 11'), (11, 2, 'TODO: Question 2 for Lesson 11'), (11, 3, 'TODO: Question 3 for Lesson 11'), (11, 4, 'TODO: Question 4 for Lesson 11'), (11, 5, 'TODO: Question 5 for Lesson 11'),
(12, 1, 'TODO: Question 1 for Lesson 12'), (12, 2, 'TODO: Question 2 for Lesson 12'), (12, 3, 'TODO: Question 3 for Lesson 12'), (12, 4, 'TODO: Question 4 for Lesson 12'), (12, 5, 'TODO: Question 5 for Lesson 12'),
(13, 1, 'TODO: Question 1 for Lesson 13'), (13, 2, 'TODO: Question 2 for Lesson 13'), (13, 3, 'TODO: Question 3 for Lesson 13'), (13, 4, 'TODO: Question 4 for Lesson 13'), (13, 5, 'TODO: Question 5 for Lesson 13'),
(14, 1, 'TODO: Question 1 for Lesson 14'), (14, 2, 'TODO: Question 2 for Lesson 14'), (14, 3, 'TODO: Question 3 for Lesson 14'), (14, 4, 'TODO: Question 4 for Lesson 14'), (14, 5, 'TODO: Question 5 for Lesson 14'),
(15, 1, 'TODO: Question 1 for Lesson 15'), (15, 2, 'TODO: Question 2 for Lesson 15'), (15, 3, 'TODO: Question 3 for Lesson 15'), (15, 4, 'TODO: Question 4 for Lesson 15'), (15, 5, 'TODO: Question 5 for Lesson 15'),
-- TODO (Unit 4 team): Replace question text with real questions for lessons 16-19
(16, 1, 'TODO: Question 1 for Lesson 16'), (16, 2, 'TODO: Question 2 for Lesson 16'), (16, 3, 'TODO: Question 3 for Lesson 16'), (16, 4, 'TODO: Question 4 for Lesson 16'), (16, 5, 'TODO: Question 5 for Lesson 16'),
(17, 1, 'TODO: Question 1 for Lesson 17'), (17, 2, 'TODO: Question 2 for Lesson 17'), (17, 3, 'TODO: Question 3 for Lesson 17'), (17, 4, 'TODO: Question 4 for Lesson 17'), (17, 5, 'TODO: Question 5 for Lesson 17'),
(18, 1, 'TODO: Question 1 for Lesson 18'), (18, 2, 'TODO: Question 2 for Lesson 18'), (18, 3, 'TODO: Question 3 for Lesson 18'), (18, 4, 'TODO: Question 4 for Lesson 18'), (18, 5, 'TODO: Question 5 for Lesson 18'),
(19, 1, 'TODO: Question 1 for Lesson 19'), (19, 2, 'TODO: Question 2 for Lesson 19'), (19, 3, 'TODO: Question 3 for Lesson 19'), (19, 4, 'TODO: Question 4 for Lesson 19'), (19, 5, 'TODO: Question 5 for Lesson 19'),
-- TODO (Unit 5 team): Replace question text with real questions for lessons 20-23
(20, 1, 'TODO: Question 1 for Lesson 20'), (20, 2, 'TODO: Question 2 for Lesson 20'), (20, 3, 'TODO: Question 3 for Lesson 20'), (20, 4, 'TODO: Question 4 for Lesson 20'), (20, 5, 'TODO: Question 5 for Lesson 20'),
(21, 1, 'TODO: Question 1 for Lesson 21'), (21, 2, 'TODO: Question 2 for Lesson 21'), (21, 3, 'TODO: Question 3 for Lesson 21'), (21, 4, 'TODO: Question 4 for Lesson 21'), (21, 5, 'TODO: Question 5 for Lesson 21'),
(22, 1, 'TODO: Question 1 for Lesson 22'), (22, 2, 'TODO: Question 2 for Lesson 22'), (22, 3, 'TODO: Question 3 for Lesson 22'), (22, 4, 'TODO: Question 4 for Lesson 22'), (22, 5, 'TODO: Question 5 for Lesson 22'),
(23, 1, 'TODO: Question 1 for Lesson 23'), (23, 2, 'TODO: Question 2 for Lesson 23'), (23, 3, 'TODO: Question 3 for Lesson 23'), (23, 4, 'TODO: Question 4 for Lesson 23'), (23, 5, 'TODO: Question 5 for Lesson 23');


-- ==========================================
-- QUIZ ANSWERS
-- Units 1 & 2: real answers (correct answer always first, is_correct = TRUE)
-- Units 3-5: placeholder answers
-- ==========================================

INSERT INTO Quiz_Answers (question_id, answer_text, is_correct) VALUES
-- Q1 (L1Q1)
(1, '80% or higher', TRUE), (1, '60% or higher', FALSE), (1, '100% — a perfect score', FALSE),
-- Q2 (L1Q2)
(2, '5 units', TRUE), (2, '3 units', FALSE), (2, '10 units', FALSE),
-- Q3 (L1Q3)
(3, 'Understanding food and nutrition science', TRUE), (3, 'Tracking calories and macros precisely', FALSE), (3, 'Following a specific diet plan', FALSE),
-- Q4 (L1Q4)
(4, 'About 5 minutes', TRUE), (4, 'About 30 minutes', FALSE), (4, 'About 1 hour', FALSE),
-- Q5 (L1Q5)
(5, 'The next lesson unlocks', TRUE), (5, 'You earn a perfect score badge immediately', FALSE), (5, 'The current lesson resets so you can review', FALSE),

-- Q6 (L2Q1)
(6, 'The science of how food and drink affect the body', TRUE), (6, 'A specific plan for losing weight', FALSE), (6, 'The study of physical exercise and movement', FALSE),
-- Q7 (L2Q2)
(7, 'Fat', TRUE), (7, 'Iron', FALSE), (7, 'Vitamin C', FALSE),
-- Q8 (L2Q3)
(8, 'Type 2 diabetes', TRUE), (8, 'Sunburn', FALSE), (8, 'Broken bones from falls', FALSE),
-- Q9 (L2Q4)
(9, 'Macronutrients and micronutrients', TRUE), (9, 'Vitamins and calories', FALSE), (9, 'Proteins and carbohydrates', FALSE),
-- Q10 (L2Q5)
(10, 'Giving your body the right nutrients to function well', TRUE), (10, 'Eating as little as possible to maintain weight', FALSE), (10, 'Avoiding all processed foods completely', FALSE),

-- Q11 (L3Q1)
(11, '5', TRUE), (11, '3', FALSE), (11, '7', FALSE),
-- Q12 (L3Q2)
(12, 'Dairy and fortified alternatives', TRUE), (12, 'Grains and cereals', FALSE), (12, 'Fruits and berries', FALSE),
-- Q13 (L3Q3)
(13, 'Vitamins, minerals, and fiber', TRUE), (13, 'Protein and healthy fats', FALSE), (13, 'Carbohydrates and iron only', FALSE),
-- Q14 (L3Q4)
(14, 'Amino acids and iron', TRUE), (14, 'Simple sugars and vitamin C', FALSE), (14, 'Calcium and phosphorus', FALSE),
-- Q15 (L3Q5)
(15, 'No single food provides all the nutrients your body needs', TRUE), (15, 'To consume more total calories each day', FALSE), (15, 'Because all food groups taste different', FALSE),

-- Q16 (L4Q1)
(16, 'The amount of energy in food', TRUE), (16, 'The amount of fat in food', FALSE), (16, 'The amount of sugar in food', FALSE),
-- Q17 (L4Q2)
(17, '9 calories per gram', TRUE), (17, '4 calories per gram', FALSE), (17, '7 calories per gram', FALSE),
-- Q18 (L4Q3)
(18, '4 calories per gram', TRUE), (18, '9 calories per gram', FALSE), (18, '2 calories per gram', FALSE),
-- Q19 (L4Q4)
(19, 'Fat', TRUE), (19, 'Carbohydrate', FALSE), (19, 'Protein', FALSE),
-- Q20 (L4Q5)
(20, 'The balance and overall nutritional quality of your diet', TRUE), (20, 'Eating the fewest possible calories each day', FALSE), (20, 'Avoiding all fat to reduce calorie density', FALSE),

-- Q21 (L5Q1)
(21, 'The mouth', TRUE), (21, 'The stomach', FALSE), (21, 'The small intestine', FALSE),
-- Q22 (L5Q2)
(22, 'Amylase', TRUE), (22, 'Pepsin', FALSE), (22, 'Lipase', FALSE),
-- Q23 (L5Q3)
(23, 'The small intestine', TRUE), (23, 'The large intestine', FALSE), (23, 'The stomach', FALSE),
-- Q24 (L5Q4)
(24, 'All chemical reactions that convert food into energy and building materials', TRUE), (24, 'The speed at which you digest a meal', FALSE), (24, 'How much fat your body stores', FALSE),
-- Q25 (L5Q5)
(25, 'The energy your body needs at rest to maintain basic functions', TRUE), (25, 'The calories you burn during intense exercise', FALSE), (25, 'How quickly you absorb nutrients after a meal', FALSE),

-- Q26 (L6Q1)
(26, 'Carbohydrates, proteins, and fats', TRUE), (26, 'Vitamins, minerals, and water', FALSE), (26, 'Glucose, amino acids, and fatty acids', FALSE),
-- Q27 (L6Q2)
(27, 'Providing energy, especially for the brain', TRUE), (27, 'Building and repairing muscle tissue', FALSE), (27, 'Storing fat-soluble vitamins', FALSE),
-- Q28 (L6Q3)
(28, 'Build and repair body tissues', TRUE), (28, 'Provide the fastest source of energy', FALSE), (28, 'Regulate body temperature', FALSE),
-- Q29 (L6Q4)
(29, 'Fat', TRUE), (29, 'Carbohydrate', FALSE), (29, 'Protein', FALSE),
-- Q30 (L6Q5)
(30, 'Deficiencies and energy imbalances over time', TRUE), (30, 'Rapid weight loss with no downsides', FALSE), (30, 'The body to produce it internally in greater amounts', FALSE),

-- Q31 (L7Q1)
(31, 'Glucose', TRUE), (31, 'Amino acids', FALSE), (31, 'Fatty acids', FALSE),
-- Q32 (L7Q2)
(32, 'Simple carbs digest quickly; complex carbs digest slowly and provide sustained energy', TRUE), (32, 'Simple carbs are always healthier choices', FALSE), (32, 'Complex carbs contain no fiber or nutrients', FALSE),
-- Q33 (L7Q3)
(33, 'Slows digestion, feeds gut bacteria, and stabilizes blood sugar', TRUE), (33, 'Provides a fast source of energy like glucose', FALSE), (33, 'Raises blood sugar rapidly for quick energy', FALSE),
-- Q34 (L7Q4)
(34, 'How quickly a food raises blood sugar levels', TRUE), (34, 'How many calories a food contains', FALSE), (34, 'How much protein a food has', FALSE),
-- Q35 (L7Q5)
(35, 'Oats with nuts and berries', TRUE), (35, 'White rice with no added fat', FALSE), (35, 'A sugary energy drink', FALSE),

-- Q36 (L8Q1)
(36, '9 essential amino acids', TRUE), (36, '20 amino acids total', FALSE), (36, '5 essential amino acids', FALSE),
-- Q37 (L8Q2)
(37, 'It contains all 9 essential amino acids', TRUE), (37, 'It comes exclusively from an animal source', FALSE), (37, 'It has more than 30 grams of protein per serving', FALSE),
-- Q38 (L8Q3)
(38, 'Eggs', TRUE), (38, 'White rice', FALSE), (38, 'Almonds', FALSE),
-- Q39 (L8Q4)
(39, 'Making enzymes, hormones, and immune antibodies', TRUE), (39, 'Storing glycogen in the liver and muscles', FALSE), (39, 'Producing saturated fatty acids', FALSE),
-- Q40 (L8Q5)
(40, 'By combining different plant protein sources throughout the day', TRUE), (40, 'It is impossible without eating some animal products', FALSE), (40, 'By eating very large amounts of a single plant protein', FALSE),

-- Q41 (L9Q1)
(41, 'Trans fat (partially hydrogenated oils)', TRUE), (41, 'Unsaturated fat from olive oil and avocados', FALSE), (41, 'Omega-3 fat from fatty fish', FALSE),
-- Q42 (L9Q2)
(42, 'Fat-soluble vitamins A, D, E, and K cannot be absorbed without it', TRUE), (42, 'Fat is the only source of energy for the brain', FALSE), (42, 'Fat provides the most readily available energy', FALSE),
-- Q43 (L9Q3)
(43, 'Avocado', TRUE), (43, 'Butter', FALSE), (43, 'Whole milk', FALSE),
-- Q44 (L9Q4)
(44, 'Hormone disruption and fat-soluble vitamin deficiencies', TRUE), (44, 'Guaranteed improvement in heart health', FALSE), (44, 'Significantly increased energy levels', FALSE),
-- Q45 (L9Q5)
(45, 'Vitamins A, D, E, and K', TRUE), (45, 'Vitamins B and C', FALSE), (45, 'All vitamins equally require fat', FALSE),

-- Q46 (L10Q1)
(46, '45–65%', TRUE), (46, '10–20%', FALSE), (46, '70–80%', FALSE),
-- Q47 (L10Q2)
(47, 'One quarter of the plate', TRUE), (47, 'One half of the plate', FALSE), (47, 'Three quarters of the plate', FALSE),
-- Q48 (L10Q3)
(48, 'Athletes and people who exercise frequently', TRUE), (48, 'Sedentary adults who sit most of the day', FALSE), (48, 'Older adults over the age of 65', FALSE),
-- Q49 (L10Q4)
(49, 'Visually balancing macronutrients at each meal without counting', TRUE), (49, 'Counting exact grams of each macronutrient', FALSE), (49, 'Eliminating all processed foods from the diet', FALSE),
-- Q50 (L10Q5)
(50, 'Age, activity level, health status, and personal goals all differ', TRUE), (50, 'Everyone has exactly the same nutritional needs', FALSE), (50, 'Only professional athletes need different macros', FALSE),

-- Questions 51-115: Placeholders for units 3-5
-- TODO (Unit 3 team): Replace with real answers for lessons 11-15
(51, 'TODO: Correct answer for L11Q1', TRUE), (51, 'TODO: Wrong answer A', FALSE), (51, 'TODO: Wrong answer B', FALSE),
(52, 'TODO: Correct answer for L11Q2', TRUE), (52, 'TODO: Wrong answer A', FALSE), (52, 'TODO: Wrong answer B', FALSE),
(53, 'TODO: Correct answer for L11Q3', TRUE), (53, 'TODO: Wrong answer A', FALSE), (53, 'TODO: Wrong answer B', FALSE),
(54, 'TODO: Correct answer for L11Q4', TRUE), (54, 'TODO: Wrong answer A', FALSE), (54, 'TODO: Wrong answer B', FALSE),
(55, 'TODO: Correct answer for L11Q5', TRUE), (55, 'TODO: Wrong answer A', FALSE), (55, 'TODO: Wrong answer B', FALSE),

(56, 'TODO: Correct answer for L12Q1', TRUE), (56, 'TODO: Wrong answer A', FALSE), (56, 'TODO: Wrong answer B', FALSE),
(57, 'TODO: Correct answer for L12Q2', TRUE), (57, 'TODO: Wrong answer A', FALSE), (57, 'TODO: Wrong answer B', FALSE),
(58, 'TODO: Correct answer for L12Q3', TRUE), (58, 'TODO: Wrong answer A', FALSE), (58, 'TODO: Wrong answer B', FALSE),
(59, 'TODO: Correct answer for L12Q4', TRUE), (59, 'TODO: Wrong answer A', FALSE), (59, 'TODO: Wrong answer B', FALSE),
(60, 'TODO: Correct answer for L12Q5', TRUE), (60, 'TODO: Wrong answer A', FALSE), (60, 'TODO: Wrong answer B', FALSE),

(61, 'TODO: Correct answer for L13Q1', TRUE), (61, 'TODO: Wrong answer A', FALSE), (61, 'TODO: Wrong answer B', FALSE),
(62, 'TODO: Correct answer for L13Q2', TRUE), (62, 'TODO: Wrong answer A', FALSE), (62, 'TODO: Wrong answer B', FALSE),
(63, 'TODO: Correct answer for L13Q3', TRUE), (63, 'TODO: Wrong answer A', FALSE), (63, 'TODO: Wrong answer B', FALSE),
(64, 'TODO: Correct answer for L13Q4', TRUE), (64, 'TODO: Wrong answer A', FALSE), (64, 'TODO: Wrong answer B', FALSE),
(65, 'TODO: Correct answer for L13Q5', TRUE), (65, 'TODO: Wrong answer A', FALSE), (65, 'TODO: Wrong answer B', FALSE),

(66, 'TODO: Correct answer for L14Q1', TRUE), (66, 'TODO: Wrong answer A', FALSE), (66, 'TODO: Wrong answer B', FALSE),
(67, 'TODO: Correct answer for L14Q2', TRUE), (67, 'TODO: Wrong answer A', FALSE), (67, 'TODO: Wrong answer B', FALSE),
(68, 'TODO: Correct answer for L14Q3', TRUE), (68, 'TODO: Wrong answer A', FALSE), (68, 'TODO: Wrong answer B', FALSE),
(69, 'TODO: Correct answer for L14Q4', TRUE), (69, 'TODO: Wrong answer A', FALSE), (69, 'TODO: Wrong answer B', FALSE),
(70, 'TODO: Correct answer for L14Q5', TRUE), (70, 'TODO: Wrong answer A', FALSE), (70, 'TODO: Wrong answer B', FALSE),

(71, 'TODO: Correct answer for L15Q1', TRUE), (71, 'TODO: Wrong answer A', FALSE), (71, 'TODO: Wrong answer B', FALSE),
(72, 'TODO: Correct answer for L15Q2', TRUE), (72, 'TODO: Wrong answer A', FALSE), (72, 'TODO: Wrong answer B', FALSE),
(73, 'TODO: Correct answer for L15Q3', TRUE), (73, 'TODO: Wrong answer A', FALSE), (73, 'TODO: Wrong answer B', FALSE),
(74, 'TODO: Correct answer for L15Q4', TRUE), (74, 'TODO: Wrong answer A', FALSE), (74, 'TODO: Wrong answer B', FALSE),
(75, 'TODO: Correct answer for L15Q5', TRUE), (75, 'TODO: Wrong answer A', FALSE), (75, 'TODO: Wrong answer B', FALSE),

-- TODO (Unit 4 team): Replace with real answers for lessons 16-19
(76, 'TODO: Correct answer for L16Q1', TRUE), (76, 'TODO: Wrong answer A', FALSE), (76, 'TODO: Wrong answer B', FALSE),
(77, 'TODO: Correct answer for L16Q2', TRUE), (77, 'TODO: Wrong answer A', FALSE), (77, 'TODO: Wrong answer B', FALSE),
(78, 'TODO: Correct answer for L16Q3', TRUE), (78, 'TODO: Wrong answer A', FALSE), (78, 'TODO: Wrong answer B', FALSE),
(79, 'TODO: Correct answer for L16Q4', TRUE), (79, 'TODO: Wrong answer A', FALSE), (79, 'TODO: Wrong answer B', FALSE),
(80, 'TODO: Correct answer for L16Q5', TRUE), (80, 'TODO: Wrong answer A', FALSE), (80, 'TODO: Wrong answer B', FALSE),

(81, 'TODO: Correct answer for L17Q1', TRUE), (81, 'TODO: Wrong answer A', FALSE), (81, 'TODO: Wrong answer B', FALSE),
(82, 'TODO: Correct answer for L17Q2', TRUE), (82, 'TODO: Wrong answer A', FALSE), (82, 'TODO: Wrong answer B', FALSE),
(83, 'TODO: Correct answer for L17Q3', TRUE), (83, 'TODO: Wrong answer A', FALSE), (83, 'TODO: Wrong answer B', FALSE),
(84, 'TODO: Correct answer for L17Q4', TRUE), (84, 'TODO: Wrong answer A', FALSE), (84, 'TODO: Wrong answer B', FALSE),
(85, 'TODO: Correct answer for L17Q5', TRUE), (85, 'TODO: Wrong answer A', FALSE), (85, 'TODO: Wrong answer B', FALSE),

(86, 'TODO: Correct answer for L18Q1', TRUE), (86, 'TODO: Wrong answer A', FALSE), (86, 'TODO: Wrong answer B', FALSE),
(87, 'TODO: Correct answer for L18Q2', TRUE), (87, 'TODO: Wrong answer A', FALSE), (87, 'TODO: Wrong answer B', FALSE),
(88, 'TODO: Correct answer for L18Q3', TRUE), (88, 'TODO: Wrong answer A', FALSE), (88, 'TODO: Wrong answer B', FALSE),
(89, 'TODO: Correct answer for L18Q4', TRUE), (89, 'TODO: Wrong answer A', FALSE), (89, 'TODO: Wrong answer B', FALSE),
(90, 'TODO: Correct answer for L18Q5', TRUE), (90, 'TODO: Wrong answer A', FALSE), (90, 'TODO: Wrong answer B', FALSE),

(91, 'TODO: Correct answer for L19Q1', TRUE), (91, 'TODO: Wrong answer A', FALSE), (91, 'TODO: Wrong answer B', FALSE),
(92, 'TODO: Correct answer for L19Q2', TRUE), (92, 'TODO: Wrong answer A', FALSE), (92, 'TODO: Wrong answer B', FALSE),
(93, 'TODO: Correct answer for L19Q3', TRUE), (93, 'TODO: Wrong answer A', FALSE), (93, 'TODO: Wrong answer B', FALSE),
(94, 'TODO: Correct answer for L19Q4', TRUE), (94, 'TODO: Wrong answer A', FALSE), (94, 'TODO: Wrong answer B', FALSE),
(95, 'TODO: Correct answer for L19Q5', TRUE), (95, 'TODO: Wrong answer A', FALSE), (95, 'TODO: Wrong answer B', FALSE),

-- TODO (Unit 5 team): Replace with real answers for lessons 20-23
(96, 'TODO: Correct answer for L20Q1', TRUE), (96, 'TODO: Wrong answer A', FALSE), (96, 'TODO: Wrong answer B', FALSE),
(97, 'TODO: Correct answer for L20Q2', TRUE), (97, 'TODO: Wrong answer A', FALSE), (97, 'TODO: Wrong answer B', FALSE),
(98, 'TODO: Correct answer for L20Q3', TRUE), (98, 'TODO: Wrong answer A', FALSE), (98, 'TODO: Wrong answer B', FALSE),
(99, 'TODO: Correct answer for L20Q4', TRUE), (99, 'TODO: Wrong answer A', FALSE), (99, 'TODO: Wrong answer B', FALSE),
(100, 'TODO: Correct answer for L20Q5', TRUE), (100, 'TODO: Wrong answer A', FALSE), (100, 'TODO: Wrong answer B', FALSE),

(101, 'TODO: Correct answer for L21Q1', TRUE), (101, 'TODO: Wrong answer A', FALSE), (101, 'TODO: Wrong answer B', FALSE),
(102, 'TODO: Correct answer for L21Q2', TRUE), (102, 'TODO: Wrong answer A', FALSE), (102, 'TODO: Wrong answer B', FALSE),
(103, 'TODO: Correct answer for L21Q3', TRUE), (103, 'TODO: Wrong answer A', FALSE), (103, 'TODO: Wrong answer B', FALSE),
(104, 'TODO: Correct answer for L21Q4', TRUE), (104, 'TODO: Wrong answer A', FALSE), (104, 'TODO: Wrong answer B', FALSE),
(105, 'TODO: Correct answer for L21Q5', TRUE), (105, 'TODO: Wrong answer A', FALSE), (105, 'TODO: Wrong answer B', FALSE),

(106, 'TODO: Correct answer for L22Q1', TRUE), (106, 'TODO: Wrong answer A', FALSE), (106, 'TODO: Wrong answer B', FALSE),
(107, 'TODO: Correct answer for L22Q2', TRUE), (107, 'TODO: Wrong answer A', FALSE), (107, 'TODO: Wrong answer B', FALSE),
(108, 'TODO: Correct answer for L22Q3', TRUE), (108, 'TODO: Wrong answer A', FALSE), (108, 'TODO: Wrong answer B', FALSE),
(109, 'TODO: Correct answer for L22Q4', TRUE), (109, 'TODO: Wrong answer A', FALSE), (109, 'TODO: Wrong answer B', FALSE),
(110, 'TODO: Correct answer for L22Q5', TRUE), (110, 'TODO: Wrong answer A', FALSE), (110, 'TODO: Wrong answer B', FALSE),

(111, 'TODO: Correct answer for L23Q1', TRUE), (111, 'TODO: Wrong answer A', FALSE), (111, 'TODO: Wrong answer B', FALSE),
(112, 'TODO: Correct answer for L23Q2', TRUE), (112, 'TODO: Wrong answer A', FALSE), (112, 'TODO: Wrong answer B', FALSE),
(113, 'TODO: Correct answer for L23Q3', TRUE), (113, 'TODO: Wrong answer A', FALSE), (113, 'TODO: Wrong answer B', FALSE),
(114, 'TODO: Correct answer for L23Q4', TRUE), (114, 'TODO: Wrong answer A', FALSE), (114, 'TODO: Wrong answer B', FALSE),
(115, 'TODO: Correct answer for L23Q5', TRUE), (115, 'TODO: Wrong answer A', FALSE), (115, 'TODO: Wrong answer B', FALSE);


-- ==========================================
-- BADGES
-- ==========================================

INSERT INTO Badges (badge_name, badge_level) VALUES
('Nutrition Beginner', 1),
('Macro Master', 2),
('Micronutrient Expert', 3),  -- TODO (Unit 3 team): update badge name if needed
('Digestion Guru', 4),        -- TODO (Unit 4 team): update badge name if needed
('Label Detective', 5);       -- TODO (Unit 5 team): update badge name if needed


-- ==========================================
-- SAMPLE PROGRESS (Alice has completed Lesson 1 and passed Quiz 1)
-- ==========================================

INSERT INTO User_Lessons (user_id, lesson_id, status, completed_at)
VALUES (1, 1, 'Completed', CURRENT_TIMESTAMP);

INSERT INTO User_Quizzes (user_id, quiz_id, score, attempt_number, passed, best_score)
VALUES (1, 1, 5, 1, TRUE, TRUE);
