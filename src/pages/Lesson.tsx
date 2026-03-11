import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { lessons } from "@/data/lessons";
import eagleMascot from "@/assets/eagle-mascot.png";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Lesson = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lessonId = parseInt(searchParams.get("lessonId") || "1");
  const [currentSection, setCurrentSection] = useState(0);

  // Lesson content for each lesson
  const lessonContentMap: Record<number, any> = {
    1: {
      title: "Introduction to Nutrition",
      duration: "5 min",
      sections: [
        {
          heading: "What is Nutrition?",
          content: "Nutrition is the science of how your body uses the food and drinks you consume. Every bite you take gives your body something to work with, whether that is energy to move, materials to build cells, or tools to fight off illness. Good nutrition means giving your body the right things in the right amounts."
        },
        {
          heading: "The 6 Essential Nutrients",
          content: "Your body relies on six types of essential nutrients: carbohydrates, proteins, fats, vitamins, minerals, and water. Essential means your body cannot make enough of them on its own, so you have to get them from food. Each one plays a unique role in keeping you healthy and functioning."
        },
        {
          heading: "Macronutrients: Your Body's Fuel",
          content: "Carbohydrates, proteins, and fats are called macronutrients because your body needs them in large amounts. Carbs are your primary energy source; proteins build and repair tissues; fats support brain function and hormone production. A balanced meal includes all three."
        },
        {
          heading: "Micronutrients: Small but Mighty",
          content: "Vitamins and minerals are called micronutrients. You only need them in small amounts, but they are critical for your health. For example, Vitamin C helps your immune system, calcium keeps bones strong, and iron carries oxygen in your blood. A varied diet is the best way to cover your micronutrient needs."
        },
        {
          heading: "Water: The Overlooked Nutrient",
          content: "Water makes up about 60% of your body and is involved in nearly every process, from digesting food to regulating your temperature. Most people need 6 to 8 cups per day. Even mild dehydration can cause fatigue, poor concentration, and headaches."
        }
      ],
      keyTakeaway: "Nutrition is the foundation of your health. Your body needs six essential nutrients every day: carbs, proteins, fats, vitamins, minerals, and water. The food choices you make regularly have a real impact on how you feel and perform."
    },
    2: {
      title: "Proteins",
      duration: "5 min",
      sections: [
        {
          heading: "Understanding Proteins",
          content: "Proteins are made up of amino acids, which are the building blocks of life. Your body uses them to build and repair muscles, enzymes, and hormones."
        },
        {
          heading: "Complete vs Incomplete Proteins",
          content: "Complete proteins contain all 9 essential amino acids your body can't make. Animal sources (meat, eggs, dairy) are complete, while most plant sources need combining."
        },
        {
          heading: "How Much Protein?",
          content: "Most people need 0.8-1g per pound of body weight daily. Athletes may need more. Spread protein throughout the day for optimal muscle recovery and growth."
        }
      ],
      keyTakeaway: "Protein is essential for muscle building, repair, and countless body functions. Aim for varied sources to get all amino acids your body needs."
    },
    3: {
      title: "Healthy and Unhealthy Fats",
      duration: "5 min",
      sections: [
        {
          heading: "Types of Fats",
          content: "Not all fats are bad! Your body needs fat for hormone production, nutrient absorption, and brain function. The key is knowing which fats to choose."
        },
        {
          heading: "Healthy Fats",
          content: "Monounsaturated and polyunsaturated fats are heart-healthy. Find them in avocados, nuts, seeds, olive oil, and fatty fish like salmon. These reduce inflammation!"
        },
        {
          heading: "Unhealthy Fats",
          content: "Saturated and trans fats can raise cholesterol and increase heart disease risk. Limit processed foods, fried items, and fatty meats. Read nutrition labels!"
        }
      ],
      keyTakeaway: "Choose healthy fats from whole foods. Your heart, brain, and hormones will thank you for making smart fat choices daily."
    }
  };

  const lessonContent = lessonContentMap[lessonId] || lessonContentMap[1];
  const totalSections = lessonContent.sections.length + 1; // +1 for key takeaway

  const isOnTakeaway = currentSection === lessonContent.sections.length;
  const progress = ((currentSection + 1) / totalSections) * 100;

  return (
    <AppLayout>
      <div className="px-5 py-4 space-y-4">
        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-muted-foreground">
              {currentSection + 1} / {totalSections}
            </span>
            <span className="text-xs font-semibold text-primary">
              {lessonContent.duration} lesson
            </span>
          </div>
          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Lesson title */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground font-medium">Lesson {lessonId}</p>
          <h2 className="text-xl font-extrabold text-foreground">{lessonContent.title}</h2>
        </div>

        {/* Content card */}
        <div className="bg-card rounded-2xl p-5 card-elevated min-h-[300px] flex flex-col">
          {!isOnTakeaway ? (
            <div className="animate-slide-up flex-1" key={currentSection}>
              <div className="flex items-center gap-3 mb-4">
                <img src={eagleMascot} alt="Eagle mascot" className="w-12 h-12 rounded-full bg-secondary" />
                <h3 className="text-base font-bold text-foreground">
                  {lessonContent.sections[currentSection].heading}
                </h3>
              </div>
              <p className="text-sm text-card-foreground leading-relaxed">
                {lessonContent.sections[currentSection].content}
              </p>
            </div>
          ) : (
            <div className="animate-slide-up flex-1" key="takeaway">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">⭐</span>
                <h3 className="text-base font-bold text-foreground">Key Takeaway</h3>
              </div>
              <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                <p className="text-sm text-foreground font-medium leading-relaxed">
                  {lessonContent.keyTakeaway}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <img src={eagleMascot} alt="Eagle mascot" className="w-10 h-10 rounded-full bg-secondary" />
                <p className="text-xs text-muted-foreground italic">
                  "Great job! You're building real knowledge here." 🦅
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={() => currentSection > 0 ? setCurrentSection(currentSection - 1) : navigate("/")}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-card border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {currentSection > 0 ? "Back" : "Exit"}
          </button>

          {!isOnTakeaway ? (
            <button
              onClick={() => setCurrentSection(currentSection + 1)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => navigate(`/quiz?lessonId=${lessonId}`)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-accent-foreground font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Quiz Me 🎯
            </button>
          )}
        </div>

        {/* Why should I care? */}
        <div className="bg-secondary/60 rounded-xl p-4">
          <p className="text-xs font-bold text-foreground mb-1">💡 Why should I care?</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {lessonId === 1 && "Understanding nutrition gives you the foundation to make smarter food choices every day. What you eat directly impacts your energy, mood, and long-term health."}
            {lessonId === 2 && "Protein is the building block of muscle, skin, and every cell in your body. Eating enough protein supports strength and recovery."}
            {lessonId === 3 && "Choosing the right fats protects your heart, supports brain function, and helps your body absorb essential vitamins."}
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Lesson;
