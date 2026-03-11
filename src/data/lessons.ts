// This file is auto-generated from the database
// Generated at: 2026-02-21T03:06:30.342Z

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
    "title": "Nutrition Basics",
    "description": "Level 1 lesson on nutrition basics",
    "duration": "5 min",
    "status": "active",
    "category": "Nutrition Basics",
    "level": 1,
    "extraLinks": "https://www.nutrition.gov"
  },
  {
    "id": 2,
    "title": "Proteins",
    "description": "Level 2 lesson on proteins",
    "duration": "5 min",
    "status": "active",
    "category": "Proteins",
    "level": 2,
    "extraLinks": "https://sqljoins.com"
  },
  {
    "id": 3,
    "title": "Healthy and Unhealthy Fats",
    "description": "Level 3 lesson on healthy and unhealthy fats",
    "duration": "5 min",
    "status": "active",
    "category": "Healthy and Unhealthy Fats",
    "level": 3,
    "extraLinks": "https://advanced-sql.com"
  }
];

export interface Badge {
  id: number;
  name: string;
  emoji: string;
  earned: boolean;
}

export const badges: Badge[] = [
  {
    "id": 1,
    "name": "New learner",
    "emoji": "🌱",
    "earned": false
  },
  {
    "id": 2,
    "name": "Streak Legend",
    "emoji": "🏆",
    "earned": false
  },
  {
    "id": 3,
    "name": "Nutrition Fiend",
    "emoji": "🍎",
    "earned": false
  }
];

export interface QuizQuestion {
  id: number;
  question: string;
  image?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const lesson1Quiz: QuizQuestion[] = [
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
];

export const sampleQuiz: QuizQuestion[] = [
  {
    id: 1, question: "What type of nutrient is chicken?",
    image: "🍗", options: ["Carbohydrate", "Fat", "Protein", "Vitamin"],
    correctIndex: 2, explanation: "Chicken is primarily a source of protein, which helps build and repair muscles."
  },
  {
    id: 2, question: "Which vitamin do you get from sunlight?",
    image: "☀️", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
    correctIndex: 3, explanation: "Your body produces Vitamin D when your skin is exposed to sunlight."
  },
  {
    id: 3, question: "How many glasses of water should you aim for daily?",
    image: "💧", options: ["2-3", "4-5", "6-8", "10-12"],
    correctIndex: 2, explanation: "Most health authorities recommend 6-8 glasses (about 2 liters) of water per day."
  },
  {
    id: 4, question: "Which of these is a healthy fat source?",
    image: "🥑", options: ["Candy bar", "Avocado", "White bread", "Soda"],
    correctIndex: 1, explanation: "Avocados contain heart-healthy monounsaturated fats and are packed with nutrients."
  },
  {
    id: 5, question: "What does fiber help with?",
    image: "🥦", options: ["Building muscle", "Digestion", "Tanning", "Sleep"],
    correctIndex: 1, explanation: "Fiber aids digestion by adding bulk to your stool and feeding beneficial gut bacteria."
  },
];

export const lessonContent = {
  title: "Introduction to Nutrition",
  duration: "5 min",
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
};
