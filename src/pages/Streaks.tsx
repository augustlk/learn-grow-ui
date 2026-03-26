import { useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Flame, Calendar, Trophy, Target } from "lucide-react";
import { useSound } from "@/hooks/useSound";

const Streaks = () => {
  const { play } = useSound();
  useEffect(() => { play("/sounds/streak.mp3"); }, []);
  const currentStreak = 12;
  const longestStreak = 18;
  const totalDaysActive = 34;
  const weeklyGoal = 5;
  const daysThisWeek = 4;

  const daysOfWeek = ["S", "M", "T", "W", "Th", "F", "S"];
  const thisWeekActive = [true, true, true, true, false, false, false];

  // Mock calendar data — last 28 days
  const calendarDays = Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    active: i < 12 || (i > 14 && i < 22),
  }));

  return (
    <AppLayout>
      <div className="px-5 py-6 space-y-6">
        {/* Hero streak */}
        <div className="bg-streak rounded-2xl p-6 text-center streak-glow">
          <Flame className="w-12 h-12 text-streak-foreground mx-auto mb-2" />
          <p className="text-5xl font-extrabold text-streak-foreground">{currentStreak}</p>
          <p className="text-sm font-bold text-streak-foreground/90 mt-1">DAY STREAK 🔥</p>
          <p className="text-xs text-streak-foreground/70 mt-2">
            You don't need to be perfect — just consistent 💚
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Trophy, value: longestStreak, label: "Longest\nStreak" },
            { icon: Calendar, value: totalDaysActive, label: "Total Days\nActive" },
            { icon: Target, value: `${daysThisWeek}/${weeklyGoal}`, label: "Weekly\nGoal" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl p-3 text-center card-elevated border border-primary/20">
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xl font-extrabold text-primary">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground font-medium whitespace-pre-line leading-tight mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* This week */}
        <section>
          <h3 className="text-base font-bold text-foreground mb-3">This Week</h3>
          <div className="bg-card rounded-2xl p-4 card-elevated">
            <div className="flex justify-between">
              {daysOfWeek.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground">{day}</span>
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      thisWeekActive[i]
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {thisWeekActive[i] ? "✓" : "·"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Activity calendar */}
        <section>
          <h3 className="text-base font-bold text-foreground mb-3">Activity Calendar</h3>
          <div className="bg-card rounded-2xl p-4 card-elevated">
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((d) => (
                <div
                  key={d.day}
                  className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-bold ${
                    d.active
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-muted-foreground/50"
                  }`}
                >
                  {d.day}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Motivation */}
        <div className="bg-card rounded-2xl p-4 card-elevated text-center">
          <p className="text-2xl mb-2">🌟</p>
          <p className="text-sm font-bold text-foreground">Keep showing up!</p>
          <p className="text-xs text-muted-foreground mt-1">
            Just 1 more day to hit your weekly goal.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Streaks;
