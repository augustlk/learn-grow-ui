-- ==========================================
-- SAFE RESET (clears all data before reseeding)
-- ==========================================

--TRUNCATE TABLE
 -- User_Badges,
 -- User_Quizzes,
 -- User_Lessons,
 -- Quiz_Answers,
 -- Quiz_Questions,
 -- Quizzes,
 -- Lesson_Cards,
 -- Lessons,
 -- Units,
 -- Badges,
 -- Users
--RESTART IDENTITY CASCADE;


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
('Micronutrients - Small But Mighty', 3),
('Digestion & Nutrient Absorption', 4),
('Reading Labels & Making Informed Choices', 5);


-- ==========================================
-- LESSONS (3 per unit = 15 total)
-- ==========================================

INSERT INTO Lessons (unit_id, theme, level, prereq_lesson_id) VALUES
-- Unit 1: Welcome & Nutrition Basics
(1, 'What is Nutrition?', 1, NULL),
(1, 'The Six Essential Nutrients', 1, 1),
(1, 'Calories and Energy Balance', 1, 2),
-- Unit 2: Macronutrients
(2, 'Carbohydrates - Your Energy Source', 2, 3),
(2, 'Proteins - Your Building Blocks', 2, 4),
(2, 'Fats - Essential and Misunderstood', 2, 5),
-- Unit 3: Micronutrients
(3, 'Vitamins - Water and Fat Soluble', 3, 6),
(3, 'Essential Minerals', 3, 7),
(3, 'Getting Enough Micronutrients', 3, 8),
-- Unit 4: Digestion
(4, 'How Your Digestive System Works', 4, 9),
(4, 'Nutrient Absorption', 4, 10),
(4, 'Gut Health and the Microbiome', 4, 11),
-- Unit 5: Reading Labels
(5, 'Understanding the Nutrition Facts Label', 5, 12),
(5, 'Ingredient Lists and Marketing Claims', 5, 13),
(5, 'Comparing Foods and Making Better Choices', 5, 14);


-- ==========================================
-- LESSON CARDS (3 per lesson)
-- ==========================================

INSERT INTO Lesson_Cards (lesson_id, card_order, card_text) VALUES

-- Lesson 1: Introduction to Nutrition
(1, 1, 'Nutrition is the science of how your body uses the food and drinks you consume. Every bite you take gives your body something to work with, whether that is energy to move, materials to build cells, or tools to fight off illness. Good nutrition means giving your body the right things in the right amounts.'),
(1, 2, 'Your body relies on six types of essential nutrients: carbohydrates, proteins, fats, vitamins, minerals, and water. Essential means your body cannot make enough of them on its own, so you have to get them from food. Each one plays a unique role in keeping you healthy and functioning.'),
(1, 3, 'Carbohydrates, proteins, and fats are called macronutrients because your body needs them in large amounts. Carbs are your primary energy source; proteins build and repair tissues; fats support brain function and hormone production. A balanced meal includes all three.'),
(1, 4, 'Vitamins and minerals are called micronutrients. You only need them in small amounts, but they are critical for your health. For example, Vitamin C helps your immune system, calcium keeps bones strong, and iron carries oxygen in your blood. A varied diet is the best way to cover your micronutrient needs.'),
(1, 5, 'Water makes up about 60% of your body and is involved in nearly every process, from digesting food to regulating your temperature. Most people need 6 to 8 cups per day. Even mild dehydration can cause fatigue, poor concentration, and headaches.'),

-- Lesson 2: The Six Essential Nutrients
(2, 1, 'Your body relies on six categories of essential nutrients: carbohydrates, proteins, fats, vitamins, minerals, and water. "Essential" means your body cannot make enough of them on its own — you must get them from food. Each one plays a unique role, and most whole foods provide a mix of several nutrients at once, which is why eating a variety of foods is more effective than focusing on any single superfood.'),
(2, 2, 'Carbohydrates, proteins, and fats are macronutrients — your body needs them in gram quantities every day. Carbs are your primary fuel source. Protein builds and repairs every tissue in your body. Fat supports brain function, hormone production, and absorption of fat-soluble vitamins. Cutting any one of these entirely from your diet causes real deficiencies over time, regardless of what you may have heard about low-carb or low-fat diets.'),
(2, 3, 'Vitamins and minerals are micronutrients needed in milligram or microgram amounts, but they are involved in virtually every process in your body — from converting food into energy to building bones to fighting infection. Water, the sixth essential nutrient, makes up about 60% of your body and is required for digestion, circulation, temperature regulation, and waste removal. Even mild dehydration impairs concentration and physical performance.'),

-- Lesson 3: Calories and Energy Balance
(3, 1, 'A calorie is a unit of energy. It measures how much energy a food provides when your body breaks it down. Your body uses this energy for everything from breathing and thinking to walking and exercising. Carbohydrates and protein each provide 4 calories per gram. Fat provides 9 calories per gram, which is why fat-rich foods are more calorie-dense. Alcohol provides 7 calories per gram but has no nutritional value.'),
(3, 2, 'Energy balance is the relationship between calories consumed and calories used. When you eat more than you burn, the excess is stored — primarily as body fat. When you eat less than you burn, your body draws on stored energy. Neither extreme is inherently good or bad; what matters is whether your energy intake supports your health, activity level, and goals over time. Most people do not need to count calories — eating mostly whole foods naturally regulates intake.'),
(3, 3, 'Calories are not all equal in terms of what they do for your body. A 200-calorie apple delivers fiber, vitamins, minerals, and water alongside its energy. A 200-calorie handful of candy delivers energy and very little else. Your body processes these very differently — the apple slows digestion, steadies blood sugar, and provides nutrients your cells can use. Focusing on food quality rather than calorie counting alone leads to better long-term health outcomes for most people.'),

-- Lesson 4: Carbohydrates
(4, 1, 'Carbohydrates are your body''s preferred and fastest fuel source. When digested, they break down into glucose — a simple sugar that enters your bloodstream and powers your brain, muscles, and organs. Your brain alone uses about 120 grams of glucose per day, which is why very low-carb diets often cause brain fog and fatigue, especially in the early weeks. Carbohydrates are not the enemy; the type and source of carbs is what matters most.'),
(4, 2, 'Simple carbohydrates — found in sugar, white bread, candy, and sugary drinks — are digested quickly, causing a rapid rise and fall in blood sugar. This spike-crash cycle leads to hunger, low energy, and cravings. Complex carbohydrates — found in oats, brown rice, lentils, vegetables, and whole grains — are digested slowly, providing steady, long-lasting energy. Fiber, a type of carbohydrate your body cannot digest, feeds beneficial gut bacteria, slows sugar absorption, and keeps you full longer.'),
(4, 3, 'The glycemic index (GI) ranks foods by how quickly they raise blood sugar. High-GI foods cause rapid spikes; low-GI foods cause gradual rises. Pairing carbohydrates with protein and fat significantly slows digestion and lowers the overall glycemic impact of a meal — which is why eating an apple with almond butter is more satisfying and energy-sustaining than eating the apple alone. For steady energy and blood sugar control, choose complex, fiber-rich carbs and pair them with other macronutrients.'),

-- Lesson 5: Proteins
(5, 1, 'Protein is made up of smaller units called amino acids. There are 20 amino acids in total — 9 are "essential," meaning your body cannot make them and you must get them from food. Your body uses amino acids to build and repair muscles, produce enzymes that drive every chemical reaction in your body, make hormones like insulin and growth hormone, and create antibodies for your immune system. Protein is involved in virtually every biological function.'),
(5, 2, 'Complete proteins contain all 9 essential amino acids in adequate amounts. All animal-based foods — meat, fish, eggs, dairy — are complete proteins. Most plant sources are incomplete, but this does not mean plant-based eaters are at risk. Eating a variety of plant proteins throughout the day — beans, lentils, tofu, tempeh, nuts, seeds, whole grains — covers all essential amino acids. Soy and quinoa are notable exceptions that are complete plant proteins on their own.'),
(5, 3, 'Protein is the most satiating macronutrient — it keeps you fuller longer than carbs or fat at the same calorie count because it slows digestion and triggers satiety hormones. It also has the highest thermic effect, meaning your body burns more energy digesting it. Most adults need about 0.8g of protein per kilogram of body weight per day, but people who exercise regularly benefit from 1.2–2.0g/kg. Good sources include chicken, fish, eggs, Greek yogurt, lentils, edamame, tofu, and cottage cheese.'),

-- Lesson 6: Fats
(6, 1, 'Fat has been unfairly demonized for decades, but your body needs it. Fat supports brain health (your brain is nearly 60% fat), produces hormones including estrogen, testosterone, and cortisol, protects organs, maintains cell membranes, and is required to absorb fat-soluble vitamins A, D, E, and K. Cutting fat out of your diet entirely causes real health problems — the goal is to choose the right types of fat, not eliminate it.'),
(6, 2, 'The type of fat matters more than the total amount. Unsaturated fats — found in avocados, olive oil, nuts, seeds, and fatty fish — support heart health and reduce inflammation. Saturated fats — found in butter, red meat, and full-fat dairy — are fine in moderation but raise LDL cholesterol when consumed in excess. Trans fats — found in many processed and fried foods — raise bad cholesterol and lower good cholesterol simultaneously and should be avoided entirely.'),
(6, 3, 'Omega-3 fatty acids are a type of unsaturated fat with powerful anti-inflammatory effects. They support brain function, heart health, joint health, and mood regulation. The best food sources are fatty fish (salmon, sardines, mackerel), flaxseeds, chia seeds, and walnuts. Most people in Western diets consume far more omega-6 fats (from vegetable oils and processed foods) than omega-3s, which drives inflammation. Regularly including omega-3-rich foods helps restore this balance.'),

-- Lesson 7: Vitamins
(7, 1, 'Vitamins are organic compounds your body needs in small amounts for essential functions. They are divided into two categories based on how they dissolve. Water-soluble vitamins — the B vitamins and vitamin C — dissolve in water, are not stored in the body for long, and must be consumed regularly. Fat-soluble vitamins — A, D, E, and K — dissolve in fat, are stored in body tissue and the liver, and can accumulate to toxic levels if over-supplemented.'),
(7, 2, 'The B vitamins (B1, B2, B3, B5, B6, B7, B9, B12) work together to convert food into energy, support the nervous system, produce red blood cells, and build DNA. Vitamin B12 is found almost exclusively in animal products — vegans and vegetarians should supplement or eat fortified foods. Folate (B9) is critical during pregnancy to prevent neural tube defects. Vitamin C supports immune function, collagen production, and iron absorption from plant sources.'),
(7, 3, 'Vitamin A supports vision, immune health, and skin cell turnover. It is found in liver, dairy, eggs, and as beta-carotene in orange and yellow vegetables. Vitamin D — produced by skin in sunlight and found in fatty fish and fortified foods — is essential for calcium absorption, bone health, and immune function. Many people are deficient. Vitamin E is an antioxidant that protects cells. Vitamin K, found in leafy greens, is essential for blood clotting and bone health.'),

-- Lesson 8: Essential Minerals
(8, 1, 'Minerals are inorganic nutrients your body needs for hundreds of functions. Unlike vitamins, minerals are not destroyed by heat or light, but they can be lost when food is processed or when water used in cooking is discarded. Macrominerals — needed in larger amounts — include calcium, magnesium, potassium, sodium, and phosphorus. Trace minerals — needed in tiny amounts but equally essential — include iron, zinc, iodine, selenium, and copper.'),
(8, 2, 'Calcium is the most abundant mineral in your body, making up the structure of bones and teeth and enabling muscle contraction and nerve signaling. Magnesium participates in over 300 enzyme reactions and supports sleep, muscle recovery, and blood sugar regulation. Iron carries oxygen in red blood cells — deficiency causes anemia, fatigue, and impaired cognitive function. Consuming vitamin C with plant-based iron sources (spinach, lentils, tofu) significantly improves absorption.'),
(8, 3, 'Zinc supports immune function, wound healing, protein synthesis, and your sense of taste and smell. Even mild zinc deficiency impairs the immune response, which is why zinc is associated with cold prevention. Iodine is essential for thyroid hormone production, which regulates metabolism, growth, and brain development — iodized salt and seafood are the main sources. Potassium works with sodium to regulate blood pressure and fluid balance; most people eat too much sodium and too little potassium, a combination that raises cardiovascular risk.'),

-- Lesson 9: Getting Enough Micronutrients
(9, 1, 'The most effective strategy for meeting your micronutrient needs is to eat a wide variety of whole, minimally processed foods. Different foods contain different combinations of vitamins and minerals, so variety — not quantity — is the key. No single superfood covers everything. A diet with a range of vegetables, fruits, whole grains, legumes, nuts, seeds, and quality proteins naturally covers the vast majority of daily needs without requiring you to track individual nutrients.'),
(9, 2, 'Color is one of the most practical shortcuts for nutritional variety. Orange and yellow foods (carrots, sweet potatoes, mangoes) are rich in beta-carotene and vitamin C. Dark leafy greens (spinach, kale, broccoli) provide calcium, iron, folate, and vitamins K and C. Red foods (tomatoes, red peppers, watermelon) contain lycopene and vitamin C. Purple and blue foods (blueberries, purple cabbage, beets) are high in anthocyanins and antioxidants. Eating the full color spectrum means eating the full nutrient spectrum.'),
(9, 3, 'Some groups have higher needs that are difficult to meet through diet alone. Pregnant people need extra folate and iron. Older adults need more vitamin D and B12. People with limited sun exposure need vitamin D supplementation. Vegans and vegetarians should monitor B12, iron, zinc, calcium, and long-chain omega-3s. In these cases, targeted supplementation makes sense. For most people, however, a varied whole-food diet covers needs far better than a multivitamin alongside a poor diet.'),

-- Lesson 10: How Your Digestive System Works
(10, 1, 'Digestion begins before you even take a bite — the sight and smell of food triggers saliva production. In your mouth, chewing breaks food mechanically while salivary amylase begins breaking down starches chemically. Food travels down the esophagus into your stomach, where powerful hydrochloric acid and the enzyme pepsin break down proteins and kill most bacteria. The stomach churns food into a semi-liquid called chyme, which is released in small amounts into the small intestine.'),
(10, 2, 'The small intestine is where most digestion and nearly all nutrient absorption takes place. The pancreas releases enzymes that break down carbohydrates, proteins, and fats. The liver produces bile (stored in the gallbladder) that emulsifies fat into tiny droplets, making it easier to digest. The inner wall of the small intestine is lined with millions of villi — tiny finger-like projections — each covered in even smaller microvilli. Together, these structures create a surface area roughly the size of a tennis court, maximizing nutrient capture.'),
(10, 3, 'What cannot be absorbed passes into the large intestine, where water and electrolytes are extracted and billions of gut bacteria ferment remaining fiber. This fermentation produces short-chain fatty acids that nourish colon cells and support gut health. The remaining material is compacted into stool and eliminated. The full journey from mouth to elimination takes 24 to 72 hours. Factors that speed or slow this process — hydration, fiber intake, physical activity, stress — have real effects on how well your body absorbs nutrients.'),

-- Lesson 11: Nutrient Absorption
(11, 1, 'Not all nutrients in your food end up in your body — absorption is a selective, regulated process. The small intestine absorbs different nutrients in different ways and at different rates. Simple sugars and amino acids pass directly through intestinal cells into the bloodstream. Fats are packaged into structures called chylomicrons and transported through the lymphatic system before entering the blood. Fat-soluble vitamins travel with fat; water-soluble vitamins are absorbed directly into the bloodstream.'),
(11, 2, 'Several factors affect how much of a nutrient you actually absorb. Minerals often compete for the same transport proteins — high calcium intake can reduce iron absorption, and vice versa. Vitamin C dramatically increases iron absorption from plant sources. Fat must be present for fat-soluble vitamins to absorb. Cooking breaks down cell walls in vegetables, making nutrients more accessible — cooked carrots actually deliver more beta-carotene than raw ones. Gut health, stomach acid levels, and age all influence absorption efficiency.'),
(11, 3, 'After absorption, nutrients travel to the liver — the body''s main processing hub. The liver converts nutrients into usable forms, stores glycogen (the body''s short-term glucose reserve), regulates how much of each nutrient enters general circulation, and filters out toxins. From the liver, nutrients are distributed through the bloodstream to cells throughout the body. This is why liver health matters so much for overall nutrition — a damaged liver cannot process nutrients effectively regardless of how well you eat.'),

-- Lesson 12: Gut Health and the Microbiome
(12, 1, 'Your gut microbiome is the community of trillions of microorganisms living primarily in your large intestine. These microbes are not passive passengers — they are active participants in your health. They ferment dietary fiber into short-chain fatty acids that nourish your colon, produce vitamins K and B12, train your immune system (about 70% of your immune cells are located in the gut), and communicate with your brain via the vagus nerve, influencing mood, stress response, and even cravings.'),
(12, 2, 'A diverse microbiome is a resilient microbiome. People with greater microbial diversity have better digestive health, stronger immune function, lower systemic inflammation, and reduced risk of metabolic disease. The single most effective way to increase microbial diversity is to eat more types of plant foods. Each plant contains different fibers that feed different bacterial species. Researchers have found that eating 30 or more different plant foods per week is associated with significantly greater microbiome diversity than eating fewer than 10.'),
(12, 3, 'Fermented foods introduce live beneficial bacteria directly into the gut. Yogurt with live cultures, kefir, sauerkraut, kimchi, miso, tempeh, and kombucha all contain probiotics. Prebiotic foods — rich in fiber that feeds existing gut bacteria — include garlic, onions, leeks, asparagus, bananas, oats, and legumes. The microbiome is harmed by frequent antibiotic use, highly processed diets, chronic stress, poor sleep, and lack of physical activity. Supporting gut health is one of the most powerful levers for overall wellbeing.'),

-- Lesson 13: Understanding the Nutrition Facts Label
(13, 1, 'The Nutrition Facts label is a regulated, standardized breakdown of what is in a packaged food. Always start at the top: serving size and servings per container. This is the most important — and most ignored — part of the label. Every number below applies to one serving. If a bag of chips lists 150 calories per serving but contains 3 servings, eating the whole bag means consuming 450 calories. Manufacturers sometimes choose unusually small serving sizes to make nutritional numbers appear more favorable.'),
(13, 2, 'Work through the label from top to bottom. Calories per serving indicate energy density. Total fat breaks into saturated fat (limit) and trans fat (avoid entirely). Sodium — aim to stay under 2,300mg per day for most adults; many packaged foods use a significant portion of this in a single serving. Total carbohydrates breaks into dietary fiber (the more the better) and sugars, including added sugars listed separately. Added sugars are the ones to limit — they provide calories with no nutritional benefit.'),
(13, 3, 'The % Daily Value column on the right shows how much of your recommended daily intake one serving provides, based on a 2,000-calorie diet. The rule of thumb: 5% DV or less is low, 20% DV or more is high. Use this to find foods high in fiber, calcium, iron, and vitamin D — nutrients most people need more of — and low in saturated fat, sodium, and added sugars — nutrients most people consume too much of. Reading labels is a skill that gets faster and more intuitive with practice.'),

-- Lesson 14: Ingredient Lists and Marketing Claims
(14, 1, 'The ingredient list is often more revealing than the Nutrition Facts label. Ingredients are listed by weight from most to least — what appears first makes up the most of the product. If sugar, refined flour, or a type of oil is in the first three ingredients, that food is primarily made of those things. A short list of recognizable, whole-food ingredients is generally a positive sign. A long list of unfamiliar additives suggests a more heavily processed product.'),
(14, 2, 'Sugar has over 60 names on ingredient lists: high-fructose corn syrup, cane juice, maltose, dextrose, sucrose, rice syrup, agave nectar, and many more. Manufacturers often use multiple forms of sugar to spread them down the list, preventing any single form from appearing near the top — a tactic that makes the product look less sugary than it actually is. The same strategy applies to sodium, which appears under many names. When in doubt, add up all the sugar and sodium forms you see listed.'),
(14, 3, 'Front-of-package marketing claims are designed by marketing teams, not nutritionists. Terms like "natural," "wholesome," "artisan," and "farm-fresh" have no regulated definition and can appear on virtually any product. Even regulated claims tell only part of the story: a food can be "low fat" and loaded with sugar, "gluten-free" and highly processed, or "organic" and nutritionally poor. The only reliable information on packaging is found on the Nutrition Facts label and ingredient list on the back — not the front.'),

-- Lesson 15: Comparing Foods and Making Better Choices
(15, 1, 'When comparing two similar products, always normalize serving sizes first. If one yogurt lists nutrition for 100g and another for 150g, you are not comparing the same amount. Convert to per-100g values before making any judgment. This single step eliminates most misleading comparisons and is a habit worth building every time you shop. Serving size manipulation is one of the most common ways packaging makes products appear healthier than they are.'),
(15, 2, 'For general health, focus your comparisons on these key nutrients: higher fiber (supports digestion, satiety, and blood sugar stability), lower added sugars (reduces inflammation and blood sugar spikes), lower sodium (supports healthy blood pressure), and adequate protein (supports satiety and muscle maintenance). When two products look similar on the label, check the ingredient list — whole food ingredients, fewer additives, and a shorter list generally indicate a higher quality product worth choosing.'),
(15, 3, 'The most nutritious foods rarely need labels at all. Whole fruits, vegetables, legumes, eggs, plain meat and fish, nuts, seeds, and whole grains come with no marketing claims because they do not need them. Building a diet around these foods means you spend less time reading labels and more time actually eating well. When you do buy packaged foods, use the label as a tool — not a judgment — and compare products the same way you would compare prices: with a clear method and a specific goal in mind.');


-- ==========================================
-- QUIZZES (1 per lesson, passing score = 4/5 = 80%)
-- ==========================================

INSERT INTO Quizzes (lesson_id, num_of_questions, passing_score)
SELECT lesson_id, 5, 4 FROM Lessons ORDER BY lesson_id;


-- ==========================================
-- QUIZ QUESTIONS
-- ==========================================

INSERT INTO Quiz_Questions (quiz_id, question_order, question_text) VALUES
-- Lesson 1: Introduction to Nutrition
(1, 1, 'What is nutrition?'),
(1, 2, 'How many essential nutrients does the human body rely on?'),
(1, 3, 'Which group of nutrients does your body need in the LARGEST amounts?'),
(1, 4, 'Which of these is an example of a micronutrient?'),
(1, 5, 'About how much of your body weight is water?'),
-- Lesson 2: The Six Essential Nutrients
(2, 1, 'How many categories of essential nutrients does your body rely on?'),
(2, 2, 'Why are nutrients called "essential"?'),
(2, 3, 'What is the primary role of carbohydrates?'),
(2, 4, 'About how much of your body weight is water?'),
(2, 5, 'What happens if you eliminate a macronutrient entirely from your diet?'),
-- Lesson 3: Calories and Energy Balance
(3, 1, 'How many calories per gram does fat provide?'),
(3, 2, 'How many calories per gram do carbohydrates and protein each provide?'),
(3, 3, 'What is energy balance?'),
(3, 4, 'Why are not all calories equal?'),
(3, 5, 'What does focusing on food quality rather than calorie counting lead to?'),
-- Lesson 4: Carbohydrates
(4, 1, 'What do carbohydrates break down into during digestion?'),
(4, 2, 'What is the key difference between simple and complex carbohydrates?'),
(4, 3, 'What does dietary fiber do in the body?'),
(4, 4, 'What does the glycemic index measure?'),
(4, 5, 'How does pairing carbs with protein and fat affect digestion?'),
-- Lesson 5: Proteins
(5, 1, 'How many essential amino acids must come from food?'),
(5, 2, 'What makes a protein "complete"?'),
(5, 3, 'Which plant food is a complete protein on its own?'),
(5, 4, 'Why is protein considered the most satiating macronutrient?'),
(5, 5, 'Besides muscle building, what else does protein do?'),
-- Lesson 6: Fats
(6, 1, 'Which type of fat should be avoided entirely?'),
(6, 2, 'Which type of fat supports heart health and reduces inflammation?'),
(6, 3, 'What are omega-3 fatty acids known for?'),
(6, 4, 'Why is dietary fat necessary even when trying to eat healthily?'),
(6, 5, 'Where are omega-3 fatty acids found?'),
-- Lesson 7: Vitamins
(7, 1, 'What makes a vitamin "water-soluble"?'),
(7, 2, 'Which vitamin is critical for vegans to supplement?'),
(7, 3, 'What does vitamin C help the body absorb more effectively?'),
(7, 4, 'Which vitamin does your skin produce from sunlight?'),
(7, 5, 'What can happen with excess fat-soluble vitamins?'),
-- Lesson 8: Essential Minerals
(8, 1, 'Which mineral carries oxygen in red blood cells?'),
(8, 2, 'What significantly boosts iron absorption from plant sources?'),
(8, 3, 'Which mineral is involved in over 300 enzyme reactions?'),
(8, 4, 'What does iodine support in the body?'),
(8, 5, 'What is the effect of consuming too much sodium and too little potassium?'),
-- Lesson 9: Getting Enough Micronutrients
(9, 1, 'What is the most effective strategy for meeting micronutrient needs?'),
(9, 2, 'What are orange and yellow foods rich in?'),
(9, 3, 'Which group especially needs folate and iron?'),
(9, 4, 'Which micronutrient should vegans especially monitor?'),
(9, 5, 'How many different plant foods per week is associated with high microbiome diversity?'),
-- Lesson 10: How Your Digestive System Works
(10, 1, 'Where does digestion begin?'),
(10, 2, 'What is chyme?'),
(10, 3, 'What is the primary role of the small intestine?'),
(10, 4, 'What do villi do in the small intestine?'),
(10, 5, 'How long does the full digestive journey typically take?'),
-- Lesson 11: Nutrient Absorption
(11, 1, 'How are fats transported after absorption in the small intestine?'),
(11, 2, 'What dramatically increases iron absorption from plant sources?'),
(11, 3, 'What is the liver''s role after nutrients are absorbed?'),
(11, 4, 'Does cooking vegetables increase or decrease nutrient availability?'),
(11, 5, 'What competes for the same transport proteins and can reduce iron absorption?'),
-- Lesson 12: Gut Health and the Microbiome
(12, 1, 'What is the gut microbiome?'),
(12, 2, 'What is the best way to increase microbiome diversity?'),
(12, 3, 'What are prebiotic foods?'),
(12, 4, 'Which is an example of a probiotic food?'),
(12, 5, 'What harms the gut microbiome?'),
-- Lesson 13: Understanding the Nutrition Facts Label
(13, 1, 'What is the most important part of the Nutrition Facts label to check first?'),
(13, 2, 'What does a % Daily Value of 20% or more indicate?'),
(13, 3, 'What is the daily sodium limit for most adults?'),
(13, 4, 'What is the difference between total sugars and added sugars?'),
(13, 5, 'What rule of thumb identifies a "low" % Daily Value?'),
-- Lesson 14: Ingredient Lists and Marketing Claims
(14, 1, 'How are ingredients ordered on a food label?'),
(14, 2, 'Why do manufacturers list multiple forms of sugar separately?'),
(14, 3, 'What does the term "natural" mean on food packaging?'),
(14, 4, 'Where is the most reliable nutritional information found on packaging?'),
(14, 5, 'What does a short ingredient list of recognizable items generally indicate?'),
-- Lesson 15: Comparing Foods and Making Better Choices
(15, 1, 'What should you do first when comparing two food products?'),
(15, 2, 'Which nutrient comparison is most relevant for blood pressure?'),
(15, 3, 'What do the most nutritious foods typically have in common?'),
(15, 4, 'What does the ingredient list reveal that the nutrition label sometimes hides?'),
(15, 5, 'When is higher fiber content beneficial?');


-- ==========================================
-- QUIZ ANSWERS (correct answer always first)
-- ==========================================

INSERT INTO Quiz_Answers (question_id, answer_text, is_correct) VALUES
-- L1Q1: What is nutrition?
(1, 'How your body uses food and drinks', TRUE), (1, 'The study of exercise', FALSE), (1, 'A type of diet plan', FALSE), (1, 'The number of calories in food', FALSE),
-- L1Q2: How many essential nutrients does the human body rely on?
(2, '6', TRUE), (2, '3', FALSE), (2, '4', FALSE), (2, '5', FALSE),
-- L1Q3: Which group of nutrients does your body need in the LARGEST amounts?
(3, 'Macronutrients', TRUE), (3, 'Vitamins', FALSE), (3, 'Minerals', FALSE), (3, 'Antioxidants', FALSE),
-- L1Q4: Which of these is an example of a micronutrient?
(4, 'Vitamin C', TRUE), (4, 'Carbohydrate', FALSE), (4, 'Fat', FALSE), (4, 'Protein', FALSE),
-- L1Q5: About how much of your body weight is water?
(5, '60%', TRUE), (5, '20%', FALSE), (5, '40%', FALSE), (5, '80%', FALSE),

-- L2Q1
(6, 'Six', TRUE), (6, 'Three', FALSE), (6, 'Ten', FALSE),
-- L2Q2
(7, 'Your body cannot make enough of them on its own — they must come from food', TRUE), (7, 'They are the most expensive nutrients to obtain', FALSE), (7, 'They provide the most calories per gram', FALSE),
-- L2Q3
(8, 'To serve as the body''s primary fuel source', TRUE), (8, 'To build and repair tissues', FALSE), (8, 'To produce hormones', FALSE),
-- L2Q4
(9, 'About 60%', TRUE), (9, 'About 20%', FALSE), (9, 'About 40%', FALSE),
-- L2Q5
(10, 'Deficiencies and imbalances develop over time', TRUE), (10, 'Your body produces more of it internally to compensate', FALSE), (10, 'Nothing — the body adapts without any negative effect', FALSE),

-- L3Q1
(11, '9 calories per gram', TRUE), (11, '4 calories per gram', FALSE), (11, '7 calories per gram', FALSE),
-- L3Q2
(12, '4 calories per gram each', TRUE), (12, '9 calories per gram each', FALSE), (12, '2 calories per gram each', FALSE),
-- L3Q3
(13, 'The relationship between calories consumed and calories used', TRUE), (13, 'The number of calories in a given food', FALSE), (13, 'How quickly your body burns fat', FALSE),
-- L3Q4
(14, 'Different foods deliver different nutrients and affect the body differently alongside their calories', TRUE), (14, 'Some calories are burned faster than others during exercise', FALSE), (14, 'Calories from fat are always stored while calories from carbs are always burned', FALSE),
-- L3Q5
(15, 'Better long-term health outcomes for most people', TRUE), (15, 'Rapid weight loss within the first month', FALSE), (15, 'The need to track every meal carefully', FALSE),

-- L4Q1
(16, 'Glucose', TRUE), (16, 'Amino acids', FALSE), (16, 'Fatty acids', FALSE),
-- L4Q2
(17, 'Simple carbs digest quickly causing blood sugar spikes; complex carbs digest slowly providing sustained energy', TRUE), (17, 'Simple carbs are always healthier because they digest faster', FALSE), (17, 'Complex carbs contain no fiber or nutrients', FALSE),
-- L4Q3
(18, 'Slows digestion, feeds gut bacteria, and stabilizes blood sugar', TRUE), (18, 'Provides a fast source of energy like glucose', FALSE), (18, 'Raises blood sugar rapidly for quick energy', FALSE),
-- L4Q4
(19, 'How quickly a food raises blood sugar levels', TRUE), (19, 'How many calories a food contains', FALSE), (19, 'How much protein a food has per serving', FALSE),
-- L4Q5
(20, 'It slows digestion and lowers the overall blood sugar impact of the meal', TRUE), (20, 'It speeds up digestion so you absorb more nutrients', FALSE), (20, 'It has no meaningful effect on how carbs are processed', FALSE),

-- L5Q1
(21, '9 essential amino acids', TRUE), (21, '20 amino acids total', FALSE), (21, '3 essential amino acids', FALSE),
-- L5Q2
(22, 'It contains all 9 essential amino acids in adequate amounts', TRUE), (22, 'It comes exclusively from an animal source', FALSE), (22, 'It has more than 30 grams of protein per serving', FALSE),
-- L5Q3
(23, 'Quinoa', TRUE), (23, 'Brown rice', FALSE), (23, 'Almonds', FALSE),
-- L5Q4
(24, 'It keeps you fuller longer and triggers satiety hormones', TRUE), (24, 'It has the fewest calories per gram', FALSE), (24, 'It is digested the fastest of all macronutrients', FALSE),
-- L5Q5
(25, 'Making enzymes, hormones, and immune antibodies', TRUE), (25, 'Storing glycogen in the liver', FALSE), (25, 'Absorbing fat-soluble vitamins', FALSE),

-- L6Q1
(26, 'Trans fat', TRUE), (26, 'Unsaturated fat from olive oil', FALSE), (26, 'Saturated fat from dairy', FALSE),
-- L6Q2
(27, 'Unsaturated fat', TRUE), (27, 'Saturated fat', FALSE), (27, 'Trans fat', FALSE),
-- L6Q3
(28, 'Powerful anti-inflammatory effects supporting brain and heart health', TRUE), (28, 'Raising bad cholesterol levels', FALSE), (28, 'Providing the fastest source of energy', FALSE),
-- L6Q4
(29, 'Fat-soluble vitamins A, D, E, and K cannot be absorbed without it', TRUE), (29, 'Fat is the only source of energy for the brain', FALSE), (29, 'Fat prevents blood sugar from rising after meals', FALSE),
-- L6Q5
(30, 'Fatty fish, flaxseeds, chia seeds, and walnuts', TRUE), (30, 'Butter, red meat, and full-fat dairy', FALSE), (30, 'Vegetable oils used in processed foods', FALSE),

-- L7Q1
(31, 'It dissolves in water and is not stored long in the body', TRUE), (31, 'It must be taken with a glass of water to be effective', FALSE), (31, 'It is found only in watery foods like fruit', FALSE),
-- L7Q2
(32, 'Vitamin B12', TRUE), (32, 'Vitamin C', FALSE), (32, 'Vitamin B6', FALSE),
-- L7Q3
(33, 'Iron from plant sources', TRUE), (33, 'Calcium from dairy', FALSE), (33, 'Fat-soluble vitamins', FALSE),
-- L7Q4
(34, 'Vitamin D', TRUE), (34, 'Vitamin A', FALSE), (34, 'Vitamin E', FALSE),
-- L7Q5
(35, 'They can accumulate to toxic levels in the body', TRUE), (35, 'They are immediately excreted in urine', FALSE), (35, 'They become water-soluble at high doses', FALSE),

-- L8Q1
(36, 'Iron', TRUE), (36, 'Calcium', FALSE), (36, 'Magnesium', FALSE),
-- L8Q2
(37, 'Consuming vitamin C at the same meal', TRUE), (37, 'Drinking more water throughout the day', FALSE), (37, 'Taking a calcium supplement alongside iron', FALSE),
-- L8Q3
(38, 'Magnesium', TRUE), (38, 'Iron', FALSE), (38, 'Zinc', FALSE),
-- L8Q4
(39, 'Thyroid hormone production which regulates metabolism', TRUE), (39, 'Carrying oxygen in red blood cells', FALSE), (39, 'Building bone and tooth structure', FALSE),
-- L8Q5
(40, 'Increased cardiovascular risk and higher blood pressure', TRUE), (40, 'Improved muscle recovery and energy levels', FALSE), (40, 'No meaningful effect on health', FALSE),

-- L9Q1
(41, 'Eating a wide variety of whole minimally processed foods', TRUE), (41, 'Taking a comprehensive multivitamin every morning', FALSE), (41, 'Eating the same highly nutritious foods every day', FALSE),
-- L9Q2
(42, 'Beta-carotene and vitamin C', TRUE), (42, 'Iron and vitamin B12', FALSE), (42, 'Calcium and vitamin D', FALSE),
-- L9Q3
(43, 'Pregnant people', TRUE), (43, 'Teenage boys', FALSE), (43, 'Athletes in their twenties', FALSE),
-- L9Q4
(44, 'Vitamin B12', TRUE), (44, 'Vitamin C', FALSE), (44, 'Fiber', FALSE),
-- L9Q5
(45, '30 or more', TRUE), (45, '5 or more', FALSE), (45, '15 or more', FALSE),

-- L10Q1
(46, 'In the mouth before you even take a bite', TRUE), (46, 'In the stomach', FALSE), (46, 'In the small intestine', FALSE),
-- L10Q2
(47, 'The semi-liquid food mixture that leaves the stomach', TRUE), (47, 'A digestive enzyme produced by the pancreas', FALSE), (47, 'A type of stomach acid produced by the liver', FALSE),
-- L10Q3
(48, 'Most digestion and nearly all nutrient absorption', TRUE), (48, 'Storing food before it is digested', FALSE), (48, 'Extracting water and compacting waste', FALSE),
-- L10Q4
(49, 'Increase surface area for nutrient absorption', TRUE), (49, 'Produce digestive enzymes', FALSE), (49, 'Filter toxins from absorbed nutrients', FALSE),
-- L10Q5
(50, '24 to 72 hours', TRUE), (50, '2 to 4 hours', FALSE), (50, 'About 7 days', FALSE),

-- L11Q1
(51, 'Packaged into chylomicrons and transported through the lymphatic system', TRUE), (51, 'Directly into the bloodstream like sugars and amino acids', FALSE), (51, 'Stored immediately in fat cells without entering circulation', FALSE),
-- L11Q2
(52, 'Vitamin C consumed at the same meal', TRUE), (52, 'Drinking large amounts of water', FALSE), (52, 'Eating more protein alongside iron', FALSE),
-- L11Q3
(53, 'It processes nutrients into usable forms and regulates their entry into circulation', TRUE), (53, 'It stores all nutrients until the body needs them', FALSE), (53, 'It filters nutrients before sending them to the small intestine', FALSE),
-- L11Q4
(54, 'Increases — cooking breaks down cell walls making nutrients more accessible', TRUE), (54, 'Decreases — heat destroys most vitamins and minerals', FALSE), (54, 'Has no meaningful effect on nutrient availability', FALSE),
-- L11Q5
(55, 'High calcium intake', TRUE), (55, 'High vitamin C intake', FALSE), (55, 'High protein intake', FALSE),

-- L12Q1
(56, 'The community of trillions of microorganisms living in your digestive tract', TRUE), (56, 'The bacteria that cause digestive infections', FALSE), (56, 'The digestive enzymes produced by the gut lining', FALSE),
-- L12Q2
(57, 'Eating a wide variety of plant foods', TRUE), (57, 'Taking a daily probiotic supplement', FALSE), (57, 'Eating the same healthy foods consistently', FALSE),
-- L12Q3
(58, 'Foods rich in fiber that feeds existing beneficial gut bacteria', TRUE), (58, 'Foods that contain live bacterial cultures', FALSE), (58, 'Probiotic supplements in capsule form', FALSE),
-- L12Q4
(59, 'Yogurt with live and active cultures', TRUE), (59, 'White bread', FALSE), (59, 'Boiled vegetables', FALSE),
-- L12Q5
(60, 'Frequent antibiotic use, highly processed diet, chronic stress, and poor sleep', TRUE), (60, 'Eating too many fruits and vegetables', FALSE), (60, 'Drinking too much water', FALSE),

-- L13Q1
(61, 'Serving size and servings per container', TRUE), (61, 'Calories per serving', FALSE), (61, 'Total fat content', FALSE),
-- L13Q2
(62, 'High — that nutrient is present in a significant amount', TRUE), (62, 'Low — you should look for a lower alternative', FALSE), (62, 'That the food exceeds safe daily limits', FALSE),
-- L13Q3
(63, '2,300mg', TRUE), (63, '500mg', FALSE), (63, '5,000mg', FALSE),
-- L13Q4
(64, 'Added sugars are those added during processing; total sugars includes naturally occurring sugars too', TRUE), (64, 'They are the same thing listed in two different ways', FALSE), (64, 'Total sugars are worse for you; added sugars are naturally occurring', FALSE),
-- L13Q5
(65, '5% DV or less', TRUE), (65, '20% DV or less', FALSE), (65, '10% DV or less', FALSE),

-- L14Q1
(66, 'By weight from most to least abundant', TRUE), (66, 'Alphabetically', FALSE), (66, 'By nutritional importance', FALSE),
-- L14Q2
(67, 'To spread sugar throughout the list so no single form appears near the top', TRUE), (67, 'Because different sugars have different health effects', FALSE), (67, 'Food regulations require each sugar type to be listed separately', FALSE),
-- L14Q3
(68, 'Nothing regulated — it can appear on almost any product', TRUE), (68, 'The product contains no synthetic ingredients', FALSE), (68, 'The product is certified organic by the USDA', FALSE),
-- L14Q4
(69, 'The Nutrition Facts label and ingredient list on the back of the package', TRUE), (69, 'The front-of-package marketing claims', FALSE), (69, 'The brand name and product description', FALSE),
-- L14Q5
(70, 'A less processed food with higher nutritional quality', TRUE), (70, 'A lower calorie food', FALSE), (70, 'A food with more added nutrients', FALSE),

-- L15Q1
(71, 'Normalize the serving sizes so you are comparing the same amount', TRUE), (71, 'Compare the calorie counts directly', FALSE), (71, 'Check which product has better front-of-package claims', FALSE),
-- L15Q2
(72, 'Sodium', TRUE), (72, 'Total fat', FALSE), (72, 'Calories', FALSE),
-- L15Q3
(73, 'They rarely need labels or marketing claims at all', TRUE), (73, 'They are always certified organic', FALSE), (73, 'They are always sold frozen or canned', FALSE),
-- L15Q4
(74, 'The actual quality and degree of processing of the ingredients', TRUE), (74, 'The exact calorie difference between products', FALSE), (74, 'Which product is fresher', FALSE),
-- L15Q5
(75, 'It supports digestion, satiety, and blood sugar stability', TRUE), (75, 'It means the food has fewer calories', FALSE), (75, 'It means the food is low in sodium', FALSE);


-- ==========================================
-- BADGES
-- ==========================================

INSERT INTO Badges (badge_name, badge_description, badge_level, icon) VALUES
('First Lesson', 'Complete your first lesson', 1, '📚'),
('5-Day Streak', 'Login for 5 consecutive days', 1, '🔥'),
('Quiz Champion', 'Pass your first quiz', 1, '🏆'),
('Perfect Score', 'Score 5/5 on any quiz', 2, '⭐'),
('10-Day Streak', 'Maintain a 10-day login streak', 2, '⚡'),
('Unit Master', 'Complete all lessons in any unit', 2, '🎯'),
('5 Quizzes Passed', 'Pass 5 quizzes total', 3, '📝'),
('30-Day Streak', 'Maintain a 30-day login streak', 3, '💎'),
('Lesson Completionist', 'Complete all 15 lessons', 4, '🎓'),
('Nutrition Expert', 'Pass all 15 quizzes with perfect scores', 4, '🥗'),
('Nutrition Newbie', 'Complete the Welcome & Nutrition Basics unit', 1, '🌱'),
('Macro Master', 'Complete the Macronutrients unit', 1, '💪'),
('Micro Maven', 'Complete the Micronutrients unit', 1, '🔬'),
('Gut Guru', 'Complete the Digestion & Nutrient Absorption unit', 1, '🫀'),
('Label Reader', 'Complete the Reading Labels unit', 1, '🏷️');


-- ==========================================
-- SAMPLE PROGRESS (Alice has completed Lesson 1 and passed Quiz 1)
-- ==========================================

INSERT INTO User_Lessons (user_id, lesson_id, status, completed_at)
VALUES (1, 1, 'Completed', CURRENT_TIMESTAMP);

INSERT INTO User_Quizzes (user_id, quiz_id, score, attempt_number, passed)
VALUES (1, 1, 5, 1, TRUE);
