import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, Clock3, FolderOpenDot } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useUser } from "@/hooks/useUserContext";
import { useInProgressLessons } from "@/hooks/useInProgressLessons";

const getProgressPercent = (lastCardViewed: number, totalCards: number) => {
  if (!totalCards) return 0;
  const safeCurrent = Math.min(Math.max(lastCardViewed + 1, 0), totalCards);
  return Math.round((safeCurrent / totalCards) * 100);
};

const getRelativeStartText = (startedAt: string) => {
  const timestamp = new Date(startedAt).getTime();
  if (Number.isNaN(timestamp)) return "Started recently";

  const diffMs = timestamp - Date.now();
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (Math.abs(diffMs) < hour) {
    return `Started ${rtf.format(Math.round(diffMs / minute), "minute")}`;
  }

  if (Math.abs(diffMs) < day) {
    return `Started ${rtf.format(Math.round(diffMs / hour), "hour")}`;
  }

  return `Started ${rtf.format(Math.round(diffMs / day), "day")}`;
};

const InProgressLessons = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { inProgressLessons, loading, error } = useInProgressLessons(user?.user_id || null);

  const sortedLessons = useMemo(
    () => [...inProgressLessons].sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()),
    [inProgressLessons]
  );

  return (
    <AppLayout>
      <div className="px-5 py-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="bg-card rounded-2xl p-4 card-elevated mb-5">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h1 className="text-lg font-extrabold text-foreground">In Progress Lessons</h1>
            <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-bold">
              {sortedLessons.length}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Pick up where you left off. We save your card progress automatically.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-muted-foreground">Loading in-progress lessons...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-card rounded-2xl p-4 card-elevated text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {!loading && !error && sortedLessons.length === 0 && (
          <div className="bg-card rounded-2xl p-5 card-elevated text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-secondary flex items-center justify-center">
              <FolderOpenDot className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-base font-extrabold text-foreground mb-1">No lessons in progress</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Start a lesson from any unit and it will appear here.
            </p>
            <button
              onClick={() => navigate("/")}
              className="py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm"
            >
              Browse Units
            </button>
          </div>
        )}

        {!loading && !error && sortedLessons.length > 0 && (
          <div className="flex flex-col gap-4 pb-6">
            {sortedLessons.map((lesson) => {
              const progressPercent = getProgressPercent(
                lesson.last_card_viewed,
                Number(lesson.total_cards)
              );
              const currentCard = Math.min(lesson.last_card_viewed + 1, lesson.total_cards);

              return (
                <article
                  key={lesson.lesson_id}
                  className="bg-card rounded-2xl p-4 border border-border card-elevated"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">
                        Unit {lesson.unit_id}: {lesson.unit_title}
                      </p>
                      <h2 className="text-base font-extrabold text-foreground leading-tight">
                        {lesson.lesson_title}
                      </h2>
                    </div>

                    <button
                      onClick={() => navigate(`/lesson?lessonId=${lesson.lesson_id}`)}
                      className="shrink-0 inline-flex items-center gap-1.5 py-2 px-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs"
                    >
                      Resume
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-muted-foreground">
                      Card {currentCard} of {lesson.total_cards}
                    </span>
                    <span className="font-semibold text-primary">{progressPercent}%</span>
                  </div>

                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Clock3 className="w-3.5 h-3.5" />
                    {getRelativeStartText(lesson.started_at)}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default InProgressLessons;
