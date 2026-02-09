import AppLayout from "@/components/AppLayout";
import { lessons, badges } from "@/data/lessons";
import { User, ChevronRight } from "lucide-react";

const Profile = () => {
  const completed = lessons.filter((l) => l.status === "completed");
  const inProgress = lessons.filter((l) => l.status === "active");
  const earnedBadges = badges.filter((b) => b.earned);
  const streak = 12;
  const daysOfWeek = ["S", "M", "T", "W", "Th", "F", "S"];
  const activeToday = [true, true, true, true, true, false, false];

  return (
    <AppLayout>
      <div className="px-5 py-6 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full bg-card border-4 border-border flex items-center justify-center card-elevated">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-bold text-foreground">My Profile</h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: completed.length, label: "Lessons\nCompleted" },
            { value: streak, label: "Day\nStreak" },
            { value: earnedBadges.length, label: "Badges\nEarned" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl p-3 text-center card-elevated border border-primary/20">
              <p className="text-2xl font-extrabold text-primary">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground font-medium whitespace-pre-line leading-tight mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Badges */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🏅</span>
            <h3 className="text-base font-bold text-foreground">Badges</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-3 rounded-xl min-w-[80px] ${
                  badge.earned ? "bg-card card-elevated" : "bg-muted/50 opacity-50"
                }`}
              >
                <span className="text-2xl">{badge.emoji}</span>
                <span className="text-[10px] font-semibold text-foreground text-center leading-tight">{badge.name}</span>
              </div>
            ))}
          </div>
          <button className="text-xs text-primary font-semibold mt-2 flex items-center gap-1 hover:underline">
            View all badges <ChevronRight className="w-3 h-3" />
          </button>
        </section>

        {/* Completed Lessons */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">✅</span>
            <h3 className="text-base font-bold text-foreground">Completed Lessons</h3>
          </div>
          <div className="space-y-2">
            {completed.map((lesson) => (
              <div key={lesson.id} className="bg-card rounded-xl p-3 flex items-center gap-3 card-elevated">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                  <span className="text-success text-sm font-bold">✓</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{lesson.title}</p>
                  <p className="text-xs text-muted-foreground">{lesson.score}% Score</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* In Progress */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📝</span>
            <h3 className="text-base font-bold text-foreground">In Progress</h3>
          </div>
          <div className="space-y-2">
            {inProgress.map((lesson) => (
              <div key={lesson.id} className="bg-card rounded-xl p-3 flex items-center gap-3 card-elevated">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-accent text-sm">📖</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{lesson.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {lesson.modulesCompleted} of {lesson.modulesTotal} Modules Complete
                  </p>
                  <div className="mt-1.5 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${(lesson.modulesCompleted! / lesson.modulesTotal!) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Streak */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔥</span>
            <h3 className="text-base font-bold text-foreground">Current Streak</h3>
          </div>
          <div className="bg-streak rounded-2xl p-5 text-center streak-glow">
            <p className="text-4xl font-extrabold text-streak-foreground">{streak}</p>
            <p className="text-sm font-bold text-streak-foreground/90 mt-1">DAYS IN A ROW!</p>
            <div className="flex justify-center gap-2 mt-4">
              {daysOfWeek.map((day, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold ${
                    activeToday[i]
                      ? "bg-streak-foreground/20 text-streak-foreground"
                      : "bg-streak-foreground/10 text-streak-foreground/50"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
            <button className="mt-4 bg-streak-foreground/20 hover:bg-streak-foreground/30 text-streak-foreground font-bold text-sm px-6 py-2 rounded-xl transition-colors">
              Log today's streak!
            </button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            You don't need to be perfect — just consistent 💚
          </p>
        </section>
      </div>
    </AppLayout>
  );
};

export default Profile;
