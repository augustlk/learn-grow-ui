import AppLayout from "@/components/AppLayout";
import LessonNode from "@/components/LessonNode";
import { lessons } from "@/data/lessons";
import eagleMascot from "@/assets/eagle-mascot.png";

const Index = () => {
  const completedCount = lessons.filter((l) => l.status === "completed").length;
  const nextLesson = lessons.find((l) => l.status === "active");

  return (
    <AppLayout>
      {/* Welcome banner */}
      <div className="px-5 pt-5 pb-3">
        <div className="bg-card rounded-2xl p-4 card-elevated flex items-center gap-4">
          <img src={eagleMascot} alt="NutriLearn eagle mascot" className="w-16 h-16 rounded-full object-cover bg-secondary" />
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">Welcome back! 🎉</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {completedCount} lessons done • Keep it up!
            </p>
            {nextLesson && (
              <p className="text-xs text-primary font-semibold mt-1">
                Up next: {nextLesson.title} ({nextLesson.duration})
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Streak indicator */}
      <div className="px-5 pb-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-lg">🔥</span>
          <span className="font-bold text-streak">12 day streak</span>
          <span className="text-muted-foreground text-xs">• Don't break it!</span>
        </div>
      </div>

      {/* Lesson path */}
      <div className="flex flex-col items-center gap-6 px-5 py-4">
        {lessons.map((lesson, i) => (
          <LessonNode key={lesson.id} lesson={lesson} index={i} />
        ))}
      </div>
    </AppLayout>
  );
};

export default Index;
