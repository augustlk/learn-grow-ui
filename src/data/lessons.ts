// This file is the single source of truth for all lesson and quiz content

export interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  status: "completed" | "active" | "locked";
  score?: number;
  modulesTotal?: number;
  modulesCompleted?: number;
  category: string;
  level?: number;
  extraLinks?: string;
}

export const lessons: Lesson[] = [
  {
    "id": 1,
    "title": "Welcome & Nutrition Basics",
    "description": "Unit 1 - Welcome and introduction to nutrition",
    "duration": "5 min",
    "status": "active",
    "category": "Nutrition Basics",
    "level": 1,
    "extraLinks": "https://www.nutrition.gov"
  },
  {
    "id": 2,
    "title": "Macronutrients - Your Body's Fuel",
    "description": "Unit 2 - Macronutrients including carbs, proteins, and fats",
    "duration": "5 min",
    "status": "active",
    "category": "Macronutrients",
    "level": 2,
    "extraLinks": "https://www.nutrition.gov"
  },
  {
    "id": 3,
    "title": "Micronutrients - Small But Mighty",
    "description": "Unit 3 - Vitamins, minerals, and micronutrients",
    "duration": "5 min",
    "status": "active",
    "category": "Micronutrients",
    "level": 3,
    "extraLinks": "https://www.nutrition.gov"
  },
  {
    "id": 5,
    "title": "Reading Labels & Making Informed Choices",
    "description": "Unit 5 - Reading labels and making better food choices",
    "duration": "5 min",
    "status": "active",
    "category": "Reading Labels",
    "level": 5,
    "extraLinks": "https://www.nutrition.gov"
  },
];

export interface Badge {
  id: number;
  name: string;
  emoji: string;
  earned: boolean;
}

export const badges: Badge[] = [
  { "id": 1, "name": "New learner", "emoji": "🌱", "earned": false },
  { "id": 2, "name": "Streak Legend", "emoji": "🏆", "earned": false },
  { "id": 3, "name": "Nutrition Fiend", "emoji": "🍎", "earned": false }
];

export interface LessonSection {
  heading: string;
  content: string;
}

export interface LessonContent {
  title: string;
  duration: string;
  sections: LessonSection[];
  keyTakeaway: string;
  whyShouldICare: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  image?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// ─────────────────────────────────────────────
// LESSON CONTENT MAP
// Lesson.tsx reads from this — just add new units here!
// ─────────────────────────────────────────────

export const lessonContentMap: Record<number, LessonContent> = {

  // ─── UNIT 1: Welcome & Nutrition Basics ───
  1: {
    title: "Introduction to Nutrition",
    duration: "5 min",
    whyShouldICare: "Understanding nutrition gives you the foundation to make smarter food choices every day. What you eat directly impacts your energy, mood, and long-term health.",
    sections: [
      {
        heading: "What is Nutrition?",
        content: "Nutrition is the science of how your body uses the food and drinks you consume. Every bite you take gives your body something to work with, whether that is energy to move, materials to build cells, or tools to fight off illness. Good nutrition means giving your body the right things in the right amounts.",
      },
      {
        heading: "The 6 Essential Nutrients",
        content: "Your body relies on six types of essential nutrients: carbohydrates, proteins, fats, vitamins, minerals, and water. Essential means your body cannot make enough of them on its own, so you have to get them from food. Each one plays a unique role in keeping you healthy and functioning.",
      },
      {
        heading: "Macronutrients: Your Body's Fuel",
        content: "Carbohydrates, proteins, and fats are called macronutrients because your body needs them in large amounts. Carbs are your primary energy source; proteins build and repair tissues; fats support brain function and hormone production. A balanced meal includes all three.",
      },
      {
        heading: "Micronutrients: Small but Mighty",
        content: "Vitamins and minerals are called micronutrients. You only need them in small amounts, but they are critical for your health. For example, Vitamin C helps your immune system, calcium keeps bones strong, and iron carries oxygen in your blood. A varied diet is the best way to cover your micronutrient needs.",
      },
      {
        heading: "Water: The Overlooked Nutrient",
        content: "Water makes up about 60% of your body and is involved in nearly every process, from digesting food to regulating your temperature. Most people need 6 to 8 cups per day. Even mild dehydration can cause fatigue, poor concentration, and headaches.",
      },
    ],
    keyTakeaway: "Nutrition is the foundation of your health. Your body needs six essential nutrients every day: carbs, proteins, fats, vitamins, minerals, and water. The food choices you make regularly have a real impact on how you feel and perform.",
  },

  // ─── UNIT 2: Macronutrients - Your Body's Fuel ───
  2: {
    title: "Macronutrients - Your Body's Fuel",
    duration: "5 min",
    whyShouldICare: "Macronutrients are the foundation of every meal you eat. Understanding carbs, proteins, and fats helps you fuel your body better, build muscle, and maintain steady energy throughout the day.",
    sections: [
      {
        heading: "What Are Macronutrients?",
        content: "Macronutrients are the three main nutrients your body needs in large amounts every day: carbohydrates, proteins, and fats. The word 'macro' means large, and unlike vitamins or minerals, your body requires these in grams — not milligrams. Every calorie you eat comes from one of these three sources.",
      },
      {
        heading: "Carbohydrates - Your Energy Source",
        content: "Carbohydrates are your body's preferred and fastest source of energy. When you eat carbs, your body breaks them down into glucose, which fuels your brain, muscles, and organs. Choose complex carbs like oats, brown rice, and vegetables for steady, lasting energy instead of sugar spikes.",
      },
      {
        heading: "Proteins - Your Building Blocks",
        content: "Protein is made up of smaller units called amino acids. Your body uses amino acids to build and repair muscles, produce enzymes and hormones, and support your immune system. There are 9 essential amino acids your body cannot make — you must get them from food like meat, eggs, dairy, or a varied plant-based diet.",
      },
      {
        heading: "Fats - Essential and Misunderstood",
        content: "Fat is not the enemy — the type of fat matters. Unsaturated fats found in avocados, olive oil, and nuts support heart health and brain function. Saturated fats should be eaten in moderation, and trans fats found in processed foods should be avoided entirely.",
      },
      {
        heading: "Balancing Your Macros",
        content: "There is no one-size-fits-all macro ratio. General guidelines suggest 45–65% of calories from carbs, 10–35% from protein, and 20–35% from fat. A simple approach: fill half your plate with vegetables and complex carbs, one quarter with lean protein, and one quarter with healthy fats.",
      },
    ],
    keyTakeaway: "Macronutrients — carbs, proteins, and fats — are the building blocks of every meal. Each one plays a unique role, and your body needs all three in the right balance to perform and feel its best.",
  },

  // ─── UNIT 3: Micronutrients - Small But Mighty ───
  3: {
    title: "Micronutrients - Small But Mighty",
    duration: "5 min",
    whyShouldICare: "Even though you need micronutrients in tiny amounts, deficiencies can cause serious health problems. Getting enough vitamins and minerals keeps your immune system strong, your bones healthy, and your energy levels up.",
    sections: [
      {
        heading: "What Are Micronutrients?",
        content: "Micronutrients are vitamins and minerals your body needs in small amounts to function properly. Unlike macronutrients, they do not provide calories — but they are essential for nearly every process in your body, from energy production to immune defense.",
      },
      {
        heading: "Water-Soluble Vitamins (B & C)",
        content: "Water-soluble vitamins dissolve in water and are not stored in your body for long, so you need them regularly. B vitamins help convert food into energy and support brain function. Vitamin C supports your immune system, skin health, and helps absorb iron from plant foods.",
      },
      {
        heading: "Fat-Soluble Vitamins (A, D, E, K)",
        content: "Fat-soluble vitamins are stored in your body's fat tissue and liver. Vitamin A supports vision and immune health. Vitamin D (made from sunlight) strengthens bones. Vitamin E is an antioxidant that protects cells. Vitamin K is essential for blood clotting and bone health.",
      },
      {
        heading: "Important Minerals",
        content: "Minerals like calcium, iron, magnesium, and zinc are critical for your health. Calcium and magnesium keep bones and muscles strong. Iron carries oxygen in your blood — low iron causes fatigue. Zinc supports immune function and wound healing. A varied diet covers most mineral needs.",
      },
      {
        heading: "Getting Enough Micronutrients",
        content: "The best way to get all your micronutrients is to eat a wide variety of whole foods — colorful fruits and vegetables, whole grains, lean proteins, dairy or fortified alternatives, nuts, and seeds. Each color of fruit or vegetable provides different vitamins and minerals, so variety is key.",
      },
    ],
    keyTakeaway: "Micronutrients may be needed in small amounts, but they are critical for your health. Eat a wide variety of colorful whole foods to cover your vitamin and mineral needs without relying on supplements.",
  },

  // ─── UNIT 5: Reading Labels & Making Informed Choices ───
  5: {
    title: "Reading Labels & Making Informed Choices",
    duration: "5 min",
    whyShouldICare: "Reading food labels helps you cut through marketing and choose products that actually support your health goals. It is one of the most practical nutrition skills you can use every time you shop.",
    sections: [
      {
        heading: "Start with Serving Size",
        content: "The Nutrition Facts label is a regulated, standardized breakdown of what is in a packaged food. Start at the top with serving size and servings per container, since every number below applies to one serving. If a snack has 150 calories per serving but 3 servings per bag, eating the whole bag means 450 calories. Serving size is often manipulated to make products look healthier than they are.",
      },
      {
        heading: "Read the Core Nutrients",
        content: "Work from top to bottom: calories per serving, total fat (limit saturated fat and avoid trans fat), sodium, and total carbohydrates. In carbohydrates, focus on dietary fiber and added sugars. Fiber is beneficial and supports fullness and blood sugar control, while added sugars provide extra calories with little nutritional value.",
      },
      {
        heading: "Use % Daily Value to Compare",
        content: "The % Daily Value (%DV) shows how much one serving contributes to your daily intake based on a 2,000-calorie diet. A quick rule: 5% DV or less is low, 20% DV or more is high. Aim for foods higher in fiber, calcium, iron, and vitamin D, and lower in saturated fat, sodium, and added sugars.",
      },
      {
        heading: "Check Ingredient Lists and Claims",
        content: "Ingredient lists are ordered by weight, from most to least. If sugar or refined flour appears near the top, that food is mostly made of those ingredients. Front-of-package words like 'natural' or 'wholesome' can be misleading marketing language, so rely on the Nutrition Facts label and ingredient list instead of the front label.",
      },
      {
        heading: "Compare Products Fairly",
        content: "When choosing between two products, first compare equivalent serving sizes. Then prioritize more fiber, less added sugar, less sodium, and enough protein. This method makes food comparisons more accurate and helps you make better choices quickly without overthinking every label.",
      },
    ],
    keyTakeaway: "Food labels are practical decision tools. Start with serving size, review key nutrients, use %DV to compare, and verify ingredient quality instead of trusting front-label marketing.",
  },
};

// ─────────────────────────────────────────────
// QUIZ MAP
// Quiz.tsx reads from this — just add new unit quizzes here!
// ─────────────────────────────────────────────

export const quizMap: Record<number, QuizQuestion[]> = {

  // ─── UNIT 1 QUIZ ───
  1: [
    {
      id: 1,
      question: "What is nutrition?",
      image: "🥗",
      options: ["The study of exercise", "How your body uses food and drinks", "A type of diet plan", "The number of calories in food"],
      correctIndex: 1,
      explanation: "Nutrition is the science of how your body uses the food and drinks you consume to get energy, build structures, and stay healthy."
    },
    {
      id: 2,
      question: "How many essential nutrients does the human body rely on?",
      image: "🔢",
      options: ["3", "4", "5", "6"],
      correctIndex: 3,
      explanation: "The six essential nutrients are carbohydrates, proteins, fats, vitamins, minerals, and water."
    },
    {
      id: 3,
      question: "Which group of nutrients does your body need in the LARGEST amounts?",
      image: "🍞",
      options: ["Vitamins", "Minerals", "Macronutrients", "Antioxidants"],
      correctIndex: 2,
      explanation: "Macronutrients (carbs, proteins, and fats) are needed in large amounts and provide the bulk of your energy and structural materials."
    },
    {
      id: 4,
      question: "Which of these is an example of a micronutrient?",
      image: "🍊",
      options: ["Carbohydrate", "Fat", "Protein", "Vitamin C"],
      correctIndex: 3,
      explanation: "Vitamins and minerals are micronutrients, meaning they are needed in small amounts but are essential for health. Vitamin C supports your immune system."
    },
    {
      id: 5,
      question: "About how much of your body weight is water?",
      image: "💧",
      options: ["20%", "40%", "60%", "80%"],
      correctIndex: 2,
      explanation: "Water makes up approximately 60% of your body and is involved in nearly every bodily process, from digestion to temperature regulation."
    },
  ],

  // ─── UNIT 2 QUIZ — 1 question per lesson section ───
  2: [
    {
      // Section 1: What Are Macronutrients?
      id: 1,
      question: "What does the word 'macro' mean in macronutrients?",
      image: "🍽️",
      options: [
        "Small amounts needed",
        "Large amounts needed",
        "Only found in plants",
        "Provides no calories",
      ],
      correctIndex: 1,
      explanation: "The word 'macro' means large. Macronutrients — carbs, proteins, and fats — are needed in large amounts (measured in grams) compared to micronutrients like vitamins and minerals.",
    },
    {
      // Section 2: Carbohydrates - Your Energy Source
      id: 2,
      question: "What does your body break carbohydrates down into for energy?",
      image: "⚡",
      options: [
        "Amino acids",
        "Fatty acids",
        "Glucose",
        "Fiber",
      ],
      correctIndex: 2,
      explanation: "When you eat carbohydrates, your body breaks them down into glucose — a simple sugar that fuels your brain, muscles, and organs.",
    },
    {
      // Section 3: Proteins - Your Building Blocks
      id: 3,
      question: "What are proteins made up of?",
      image: "🥩",
      options: [
        "Glucose molecules",
        "Fatty acids",
        "Amino acids",
        "Fiber chains",
      ],
      correctIndex: 2,
      explanation: "Proteins are made up of smaller units called amino acids. Your body uses amino acids to build and repair muscles, produce hormones, and support your immune system.",
    },
    {
      // Section 4: Fats - Essential and Misunderstood
      id: 4,
      question: "Which type of fat should you avoid entirely?",
      image: "🍟",
      options: [
        "Unsaturated fat",
        "Trans fat",
        "Omega-3 fat",
        "Saturated fat",
      ],
      correctIndex: 1,
      explanation: "Trans fats are artificially created and raise bad cholesterol while lowering good cholesterol. Unlike unsaturated fats found in avocados and olive oil, trans fats found in processed foods should be avoided entirely.",
    },
    {
      // Section 5: Balancing Your Macros
      id: 5,
      question: "Using the plate method, how much of your plate should be vegetables and complex carbs?",
      image: "🍱",
      options: [
        "One quarter",
        "One third",
        "One half",
        "The whole plate",
      ],
      correctIndex: 2,
      explanation: "The plate method suggests filling one half of your plate with vegetables and complex carbs, one quarter with lean protein, and one quarter with healthy fats — a simple way to balance your macros.",
    },
  ],

  // ─── UNIT 3 QUIZ ───
  3: [
    {
      id: 1,
      question: "What makes a vitamin 'water-soluble'?",
      image: "💧",
      options: ["It dissolves in fat", "It dissolves in water and is not stored long", "It only comes from meat", "It requires sunlight to activate"],
      correctIndex: 1,
      explanation: "Water-soluble vitamins like B and C dissolve in water and are not stored in the body for long, so you need to consume them regularly through food.",
    },
    {
      id: 2,
      question: "Which vitamin does your body produce from sunlight?",
      image: "☀️",
      options: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"],
      correctIndex: 3,
      explanation: "Your skin produces Vitamin D when exposed to sunlight. It is essential for bone health, immune function, and mood regulation.",
    },
    {
      id: 3,
      question: "Which mineral carries oxygen in your blood?",
      image: "🩸",
      options: ["Calcium", "Zinc", "Iron", "Magnesium"],
      correctIndex: 2,
      explanation: "Iron is a key component of hemoglobin, the protein in red blood cells that carries oxygen throughout your body. Low iron leads to fatigue and anemia.",
    },
    {
      id: 4,
      question: "What is the best way to get all your micronutrients?",
      image: "🌈",
      options: ["Take a multivitamin daily", "Eat only meat and dairy", "Eat a wide variety of colorful whole foods", "Drink protein shakes"],
      correctIndex: 2,
      explanation: "Eating a variety of colorful fruits, vegetables, whole grains, and proteins naturally covers most of your vitamin and mineral needs without relying on supplements.",
    },
    {
      id: 5,
      question: "Which vitamins are fat-soluble?",
      image: "🧴",
      options: ["B and C", "A, D, E, and K", "C and D", "B6, B12, and C"],
      correctIndex: 1,
      explanation: "Vitamins A, D, E, and K are fat-soluble, meaning they are stored in your body's fat tissue and liver. You need dietary fat to absorb them properly.",
    },
  ],

  // ─── UNIT 5 QUIZ ───
  5: [
    {
      id: 1,
      question: "What is the most important part of the Nutrition Facts label to check first?",
      image: "📦",
      options: ["Calories per serving", "Serving size and servings per container", "Total fat", "Protein"],
      correctIndex: 1,
      explanation: "Serving size and servings per container determine how to interpret every number on the label. If you eat multiple servings, you must multiply calories and nutrients accordingly.",
    },
    {
      id: 2,
      question: "What does a % Daily Value of 20% or more usually indicate?",
      image: "📊",
      options: ["Low amount of that nutrient", "High amount of that nutrient", "The food is unhealthy", "The nutrient is not important"],
      correctIndex: 1,
      explanation: "A common rule of thumb is 5% DV or less is low, while 20% DV or more is high for that nutrient in one serving.",
    },
    {
      id: 3,
      question: "What is the daily sodium limit for most adults?",
      image: "🧂",
      options: ["500mg", "1,200mg", "2,300mg", "5,000mg"],
      correctIndex: 2,
      explanation: "Most adults are advised to stay under about 2,300mg of sodium per day. Many packaged foods can contribute a large portion of this in just one serving.",
    },
    {
      id: 4,
      question: "Why can front-of-package claims like 'natural' be misleading?",
      image: "🏷️",
      options: ["They are always false", "They are mostly unregulated marketing terms", "They only apply to fresh foods", "They are required by nutrition law"],
      correctIndex: 1,
      explanation: "Terms like 'natural' and 'wholesome' are often marketing language and may not reflect the product's overall nutrition quality.",
    },
    {
      id: 5,
      question: "When comparing two packaged foods, what should you do first?",
      image: "⚖️",
      options: ["Choose the one with fewer ingredients", "Choose the cheaper one", "Normalize and compare serving sizes", "Choose the one with the boldest health claim"],
      correctIndex: 2,
      explanation: "Comparisons are only accurate when the serving sizes match. After normalizing serving sizes, compare fiber, added sugar, sodium, and protein.",
    },
  ],
};

// Keep these exports so existing code doesn't break
export const lesson1Quiz = quizMap[1];
export const sampleQuiz = quizMap[1];
export const lessonContent = lessonContentMap[1];