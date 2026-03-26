import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Lock, BookOpen } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useUser } from "@/hooks/useUserContext";
import { useUserLessonsWithStatus } from "@/hooks/useUserLessonsWithStatus";
import eagleMascot from "@/assets/eagle-mascot.png";

const UNIT_EMOJIS: Record<number, string> = {
  1: "🥗",
  2: "💪",
  3: "🌿",
  4: "🫀",
  5: "🏷️",
};

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const streakUser = user as (typeof user & { current_streak?: number }) | null;
  const { units, lessons, refetch, loading } = useUserLessonsWithStatus(user?.user_id || null);

  const completedCount = lessons.filter((l) => l.status === "completed").length;
  const nextActiveUnit = units.find((u) => u.unitStatus === "active");

  useEffect(() => {
    refetch();
  }, [location, refetch]);

  return (
    <AppLayout>
      {/* Welcome banner */}
      <div className="pt-3 pb-2">
        <div className="bg-card rounded-2xl p-4 lg:p-6 card-elevated flex items-center justify-center gap-4 max-w-2xl">
          <img
            src={eagleMascot}
            alt="NutriLearn eagle mascot"
            className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover bg-secondary shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xl lg:text-2xl font-bold text-foreground mb-2">Welcome back! 🎉</p>
            <p className="text-base lg:text-lg text-muted-foreground mb-1">
              {completedCount} of {lessons.length} lessons completed
            </p>
            {nextActiveUnit && (
              <p className="text-sm lg:text-base text-primary font-semibold">
                Up next: {nextActiveUnit.unit_title}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Streak indicator */}
      <div className="pb-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-lg">🔥</span>
          <span className="font-bold text-streak">
            {streakUser?.current_streak || 0} day streak
          </span>
          <span className="text-muted-foreground text-xs">• Don't break it!</span>
        </div>
      </div>

      {/* Units list */}
      <div className="pb-8">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-extrabold text-foreground">Course Units</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Start with a unit, then work through its lessons in order.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-muted-foreground">Loading units…</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {units.map((unit) => {
            const completed = unit.lessons.filter((l) => l.status === "completed").length;
            const total = unit.lessons.length;
            const isLocked = unit.unitStatus === "locked";

            return (
              <button
                key={unit.unit_id}
                onClick={() => {
                  if (!isLocked) navigate(`/unit/${unit.unit_id}`);
                }}
                disabled={isLocked}
                className={`text-left rounded-2xl border p-4 lg:p-6 card-elevated transition-all ${
                  isLocked
                    ? "bg-muted/40 border-border opacity-70 cursor-not-allowed"
                    : "bg-card border-border hover:scale-[1.02] hover:border-primary"
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                      isLocked ? "bg-muted" : "bg-secondary"
                    }`}
                  >
                    {UNIT_EMOJIS[unit.unit_id] ?? "📚"}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-sm font-extrabold text-foreground truncate">
                        {unit.unit_title}
                      </h2>

                      {unit.unitStatus === "completed" ? (
                        <Check className="w-4 h-4 text-primary shrink-0" />
                      ) : unit.unitStatus === "locked" ? (
                        <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                      ) : (
                        <BookOpen className="w-4 h-4 text-primary shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mb-3">
                      {completed}/{total} lessons completed
                    </p>

                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${total ? (completed / total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;