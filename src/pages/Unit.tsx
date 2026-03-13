import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Lock } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import LessonNode from "@/components/LessonNode";
import { useUser } from "@/hooks/useUserContext";
import { useUserLessonsWithStatus } from "@/hooks/useUserLessonsWithStatus";

const UNIT_EMOJIS: Record<number, string> = {
  1: "🥗",
  2: "💪",
  3: "🌿",
  4: "🫀",
  5: "🏷️",
};

const Unit = () => {
  const navigate = useNavigate();
  const { unitId } = useParams();
  const parsedUnitId = Number(unitId);

  const { user } = useUser();
  const { units, loading } = useUserLessonsWithStatus(user?.user_id || null);

  const unit = useMemo(
    () => units.find((u) => u.unit_id === parsedUnitId),
    [units, parsedUnitId]
  );

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-muted-foreground">Loading unit…</p>
        </div>
      </AppLayout>
    );
  }

  if (!unit) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4 px-5">
          <p className="text-sm text-muted-foreground text-center">
            Could not find this unit.
          </p>
          <button
            onClick={() => navigate("/")}
            className="py-3 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-sm"
          >
            Back to Home
          </button>
        </div>
      </AppLayout>
    );
  }

  if (unit.unitStatus === "locked") {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4 px-5">
          <Lock className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            This unit is locked. Complete the previous unit first.
          </p>
          <button
            onClick={() => navigate("/")}
            className="py-3 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-sm"
          >
            Back to Home
          </button>
        </div>
      </AppLayout>
    );
  }

  const completedCount = unit.lessons.filter((l) => l.status === "completed").length;

  return (
    <AppLayout>
      <div className="px-5 py-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Units
        </button>

        <div className="bg-card rounded-2xl p-4 card-elevated mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-2xl">
              {UNIT_EMOJIS[unit.unit_id] ?? "📚"}
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Unit {unit.unit_order}
              </p>
              <h1 className="text-lg font-extrabold text-foreground">
                {unit.unit_title}
              </h1>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-3">
            Complete each lesson in order. Pass the quiz with at least 80% to unlock the next lesson.
          </p>

          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-muted-foreground">
              Progress
            </span>
            <span className="font-semibold text-primary">
              {completedCount} / {unit.lessons.length}
            </span>
          </div>

          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{
                width: `${(completedCount / unit.lessons.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 pb-6">
          {unit.lessons.map((lesson, i) => (
            <LessonNode
              key={`${lesson.unit_id}-${lesson.lesson_id}`}
              lesson={lesson}
              index={i}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Unit;