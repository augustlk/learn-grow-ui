import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import eagleMascot from "@/assets/eagle-mascot.png";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { lessonContentMap } from "@/data/lessons";

const Lesson = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lessonId = parseInt(searchParams.get("lessonId") || "1");
  const [currentSection, setCurrentSection] = useState(0);

  // Reads directly from lessons.ts — no database needed!
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
            {lessonContent.whyShouldICare}
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Lesson;