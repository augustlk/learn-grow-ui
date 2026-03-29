import { useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Flame, Calendar, Trophy, Target } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { useUser } from "@/hooks/useUserContext";
import { useStreakStats } from "@/hooks/useStreakStats";

const WEEKDAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatCalendarRange(startDayKey?: string, endDayKey?: string) {
  if (!startDayKey || !endDayKey) return "Last 5 weeks";

  const [startYear, startMonth, startDay] = startDayKey.split("-").map(Number);
  const [endYear, endMonth, endDay] = endDayKey.split("-").map(Number);

  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);

  const startLabel = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const endLabel = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return `${startLabel} - ${endLabel}`;
}

const Streaks = () => {
  const { play } = useSound();
  const { user } = useUser();
  const { stats, loading } = useStreakStats(user?.user_id ?? null);

  useEffect(() => {
    play("/sounds/streak.mp3");
  }, [play]);

  if (!user) return null;

  if (loading) {
    return (
      <AppLayout>
        <div className="px-5 py-6 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading streaks...</p>
        </div>
      </AppLayout>
    );
  }

  const calendarRange = formatCalendarRange(
    stats.calendar[0]?.dayKey,
    stats.calendar[stats.calendar.length - 1]?.dayKey
  );

  return (
    <AppLayout>
      <div className="px-5 py-6 space-y-6">
        <div className="bg-streak rounded-2xl p-6 text-center streak-glow">
          <Flame className="w-12 h-12 text-streak-foreground mx-auto mb-2" />
          <p className="text-5xl font-extrabold text-streak-foreground">
            {stats.currentStreak}
          </p>
          <p className="text-sm font-bold text-streak-foreground/90 mt-1">
            DAY STREAK 🔥
          </p>
          <p className="text-xs text-streak-foreground/80 mt-2">
            {stats.daysThisWeek}/{stats.weeklyGoal} active days this week
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Trophy, value: stats.longestStreak, label: "Longest\nStreak" },
            { icon: Calendar, value: stats.totalDaysActive, label: "Total Days\nActive" },
            { icon: Target, value: `${stats.daysThisWeek}/${stats.weeklyGoal}`, label: "Weekly\nGoal" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-xl p-3 text-center card-elevated border border-primary/20"
            >
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xl font-extrabold text-primary">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground font-medium whitespace-pre-line leading-tight mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <section>
          <h3 className="text-base font-bold text-foreground mb-3">This Week</h3>
          <div className="bg-card rounded-2xl p-4 card-elevated">
            <div className="flex justify-between gap-2">
              {stats.thisWeek.map((day) => (
                <div key={day.dayKey} className="flex flex-col items-center gap-2">
                  <span
                    className={`text-xs font-bold ${
                      day.isToday ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {day.label}
                  </span>

                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center text-sm font-extrabold transition-all ${
                      day.active
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : day.isToday
                        ? "bg-background text-foreground border-primary/50"
                        : "bg-muted/70 text-muted-foreground border-border"
                    }`}
                  >
                    {day.active ? "✓" : day.isToday ? "•" : "–"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="text-base font-bold text-foreground">Activity Calendar</h3>
            <span className="text-[10px] font-semibold text-muted-foreground">
              {calendarRange}
            </span>
          </div>

          <div className="bg-card rounded-2xl p-4 card-elevated">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {WEEKDAY_HEADERS.map((label) => (
                <div
                  key={label}
                  className="text-center text-[10px] font-bold text-muted-foreground"
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {stats.calendar.map((day) => (
                <div
                  key={day.dayKey}
                  title={day.dayKey}
                  className={`aspect-square rounded-lg border flex items-center justify-center text-xs font-bold transition-colors ${
                    day.active
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : day.isCurrentMonth
                      ? "bg-muted/70 text-foreground border-border/70"
                      : "bg-muted/30 text-muted-foreground border-border/40"
                  } ${day.isToday ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
                >
                  {day.dayNumber}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] text-muted-foreground mt-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-primary border border-primary" />
                Completed lesson
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-muted border border-border" />
                No completed lesson
              </div>
            </div>
          </div>
        </section>

        <div className="bg-card rounded-2xl p-4 card-elevated text-center">
          <p className="text-2xl mb-2">🌟</p>
          <p className="text-sm font-bold text-foreground">Keep showing up!</p>
          <p className="text-xs text-muted-foreground mt-1">
            Consistency counts more than intensity.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Streaks;