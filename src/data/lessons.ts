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
}

export const lessons: Lesson[] = [
  { id: 1, title: "Macro Nutrient Basics", description: "Learn about proteins, carbs, and fats", duration: "3 min", status: "completed", score: 90, category: "Fundamentals" },
  { id: 2, title: "Reading Nutrition Labels", description: "Decode what's on the package", duration: "4 min", status: "completed", score: 84, category: "Fundamentals" },
  { id: 3, title: "Hydration & Water", description: "Why water matters for your body", duration: "2 min", status: "completed", score: 92, category: "Fundamentals" },
  { id: 4, title: "Vitamins & Minerals", description: "Essential micronutrients explained", duration: "5 min", status: "active", modulesTotal: 5, modulesCompleted: 3, category: "Micronutrients" },
  { id: 5, title: "Healthy Fats Explained", description: "Not all fats are created equal", duration: "4 min", status: "active", modulesTotal: 6, modulesCompleted: 1, category: "Macronutrients" },
  { id: 6, title: "Protein Sources", description: "Where to get your protein", duration: "3 min", status: "locked", category: "Macronutrients" },
  { id: 7, title: "Meal Timing", description: "When you eat matters too", duration: "3 min", status: "locked", category: "Advanced" },
  { id: 8, title: "Fiber & Digestion", description: "Keep your gut happy", duration: "4 min", status: "locked", category: "Advanced" },
  { id: 9, title: "Sports Nutrition", description: "Fuel for performance", duration: "5 min", status: "locked", category: "Performance" },
  { id: 10, title: "Supplements 101", description: "What works, what doesn't", duration: "4 min", status: "locked", category: "Advanced" },
];

export interface Badge {
  id: number;
  name: string;
  emoji: string;
  earned: boolean;
}

export const badges: Badge[] = [
  { id: 1, name: "First Steps", emoji: "🌱", earned: true },
  { id: 2, name: "Macro Master", emoji: "💪", earned: true },
  { id: 3, name: "Hydro Hero", emoji: "💧", earned: true },
  { id: 4, name: "Label Reader", emoji: "🔍", earned: true },
  { id: 5, name: "Week Warrior", emoji: "🔥", earned: true },
  { id: 6, name: "Quiz Whiz", emoji: "🧠", earned: false },
  { id: 7, name: "Perfect Score", emoji: "⭐", earned: false },
  { id: 8, name: "Streak Master", emoji: "🏆", earned: false },
];

export interface QuizQuestion {
  id: number;
  question: string;
  image?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

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
  title: "Macro Nutrient Basics",
  duration: "3 min",
  sections: [
    {
      heading: "What are Macronutrients?",
      content: "Macronutrients are the nutrients your body needs in large amounts to function properly. There are three main types: proteins, carbohydrates, and fats. Each plays a unique role in keeping you healthy and energized.",
    },
    {
      heading: "Proteins — Your Body's Building Blocks",
      content: "Protein helps build and repair muscles, skin, and organs. Good sources include chicken, fish, beans, eggs, and tofu. Aim to include a protein source in every meal.",
    },
    {
      heading: "Carbohydrates — Your Energy Source",
      content: "Carbs are your body's preferred fuel. Choose complex carbs like whole grains, fruits, and vegetables over simple sugars. They provide sustained energy throughout the day.",
    },
    {
      heading: "Fats — Essential, Not Evil",
      content: "Healthy fats support brain function and hormone production. Focus on unsaturated fats from sources like olive oil, nuts, avocados, and fatty fish. Limit trans fats and excessive saturated fats.",
    },
  ],
  keyTakeaway: "Balance all three macronutrients for optimal health. No single macro is 'bad' — it's about choosing quality sources and appropriate portions.",
};
