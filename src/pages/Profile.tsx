import { useEffect, useRef, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { badges } from "@/data/lessons";
import { useUser } from "@/hooks/useUserContext";
import { useUserLessons } from "@/hooks/useUserLessons";
import { lessons } from "@/data/lessons";
import { ChevronRight, Camera, Trash2 } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";

const Profile = () => {
  const { user, loading, updateProfilePicture } = useUser();
  const { userLessons } = useUserLessons(user?.user_id || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const completedLessons = userLessons.filter((ul) => ul.status === "Completed");
  const inProgressLessons = userLessons.filter((ul) => ul.status === "In Progress");
  const streak = user?.current_streak ?? 0;

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  // Mark the first `streak` days (capped at 7) as active
  const activeToday = daysOfWeek.map((_, i) => i < Math.min(streak, 7));

  const [earnedBadgeIds, setEarnedBadgeIds] = useState(new Set<number>());

  useEffect(() => {
    if (!user?.user_id) return;

    const apiUrl = import.meta.env.VITE_API_URL || "";

    fetch(`${apiUrl}/api/users/${user.user_id}/badges`)
      .then(res => res.json())
      .then(data => {
        setEarnedBadgeIds(new Set(data.data.map((b: any) => b.badge_id)));
      });
  }, [user?.user_id]);

  const earnedBadges = badges.map(b => ({
    ...b,
    earned: earnedBadgeIds.has(b.id),
  }));

  // ── file upload handlers (unchanged) ──────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) { alert("Please select an image file."); return; }
    if (file.size > 2 * 1024 * 1024) { alert("Image must be smaller than 2MB."); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "";
        const response = await fetch(`${apiUrl}/api/users/${user.user_id}/profile-picture`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile_picture: base64 }),
        });
        const data = await response.json();
        if (data.success) { updateProfilePicture(base64); }
        else { alert("Failed to save profile picture."); }
      } catch { alert("Failed to upload profile picture."); }
      finally { setUploading(false); }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePicture = async () => {
    if (!user) return;
    setUploading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${apiUrl}/api/users/${user.user_id}/profile-picture`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) { updateProfilePicture(null); }
    } catch { alert("Failed to remove profile picture."); }
    finally { setUploading(false); }
  };
  // ──────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <AppLayout>
        <div className="px-5 py-6 flex items-center justify-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-3 pb-8">

        {/* ── HERO BANNER ─────────────────────────────────────────── */}
        <div className="mx-0 rounded-b-3xl bg-primary px-5 pt-6 pb-10 text-center">
          {/* Avatar */}
          <div className="relative inline-block mb-3">
            <UserAvatar
              firstName={user?.first_name}
              lastName={user?.last_name}
              profilePicture={user?.profile_picture}
              size="lg"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
              aria-label="Upload profile picture"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          <h2 className="text-lg font-extrabold text-primary-foreground">
            {user ? `${user.first_name} ${user.last_name}` : "My Profile"}
          </h2>
          {user && <p className="text-xs text-primary-foreground/70 mt-0.5">{user.email}</p>}

          {/* Upload / Remove buttons */}
          <div className="flex justify-center gap-2 mt-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-xs bg-white/20 text-primary-foreground font-semibold px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors disabled:opacity-50"
            >
              {uploading ? "Saving..." : user?.profile_picture ? "Change Photo" : "Add Photo"}
            </button>
            {user?.profile_picture && (
              <button
                onClick={handleRemovePicture}
                disabled={uploading}
                className="text-xs bg-white/20 text-primary-foreground font-semibold px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Remove
              </button>
            )}
          </div>
        </div>

        {/* ── FLOATING STATS CARD ─────────────────────────────────── */}
        <div className="mx-4 -mt-6 bg-card rounded-2xl border border-border card-elevated">
          <div className="grid grid-cols-3 divide-x divide-border">
            {[
              { value: completedLessons.length, label: "Lessons\nCompleted" },
              { value: streak, label: "Day\nStreak" },
              { value: earnedBadges.length, label: "Badges\nEarned" },
            ].map((stat) => (
              <div key={stat.label} className="py-4 text-center">
                <p className="text-2xl font-extrabold text-primary">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground font-semibold whitespace-pre-line leading-tight mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── BADGES ──────────────────────────────────────────────── */}
        <div className="mx-4 bg-card rounded-2xl border border-border card-elevated p-4">
          <h3 className="text-sm font-extrabold text-foreground mb-3 flex items-center gap-1.5">
            🏅 Badges
          </h3>
          <div className="flex gap-2">
            {earnedBadges.map((badge) => (
              <div
                key={badge.id}
                className={`flex-1 flex flex-col items-center gap-1 p-2.5 rounded-xl border ${
                  badge.earned
                    ? "bg-secondary border-border"
                    : "bg-muted/40 border-transparent opacity-40"
                }`}
              >
                <span className="text-xl">{badge.emoji}</span>
                <span className="text-[9px] font-bold text-foreground text-center leading-tight">
                  {badge.name}
                </span>
              </div>
            ))}
          </div>
          <button className="text-xs text-primary font-semibold mt-3 flex items-center gap-1 hover:underline">
            View all badges <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* ── IN PROGRESS ─────────────────────────────────────────── */}
        <div className="mx-4 bg-card rounded-2xl border border-border card-elevated p-4">
          <h3 className="text-sm font-extrabold text-foreground mb-3 flex items-center gap-1.5">
            📖 In Progress
          </h3>
          {inProgressLessons.length > 0 ? (
            <div className="flex flex-col gap-1">
              {inProgressLessons.map((userLesson) => {
                const lesson = lessons.find((l) => l.id === userLesson.lesson_id);
                return lesson ? (
                  <div key={lesson.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-extrabold text-accent">{lesson.id}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{lesson.title}</p>
                      <p className="text-[10px] text-muted-foreground">In Progress</p>
                    </div>
                    {/* progress bar */}
                    <div className="w-14 h-1.5 bg-muted rounded-full overflow-hidden flex-shrink-0">
                      <div className="h-full bg-accent rounded-full" style={{ width: "40%" }} />
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No lessons in progress</p>
          )}
        </div>

        {/* ── COMPLETED LESSONS ───────────────────────────────────── */}
        <div className="mx-4 bg-card rounded-2xl border border-border card-elevated p-4">
          <h3 className="text-sm font-extrabold text-foreground mb-3 flex items-center gap-1.5">
            ✅ Completed Lessons
          </h3>
          {completedLessons.length > 0 ? (
            <div className="flex flex-col gap-1">
              {completedLessons.map((userLesson) => {
                const lesson = lessons.find((l) => l.id === userLesson.lesson_id);
                return lesson ? (
                  <div key={lesson.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-extrabold text-primary-foreground">✓</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{lesson.title}</p>
                      <p className="text-[10px] text-muted-foreground">Completed</p>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No completed lessons yet</p>
          )}
        </div>

        {/* ── STREAK WITH DAYS CALENDAR ───────────────────────────── */}
        <div className="mx-4 bg-streak rounded-2xl p-4 streak-glow">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-3xl font-extrabold text-streak-foreground leading-none">
                {streak} 🔥
              </p>
              <p className="text-xs font-bold text-streak-foreground/80 mt-1">DAYS IN A ROW</p>
            </div>
            <div className="flex gap-1.5">
              {daysOfWeek.map((day, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-extrabold text-streak-foreground ${
                    activeToday[i] ? "bg-streak-foreground/50" : "bg-streak-foreground/20"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
          <button className="w-full py-2 rounded-xl bg-streak-foreground/20 hover:bg-streak-foreground/30 text-streak-foreground font-bold text-xs transition-colors">
            Log today's streak!
          </button>
          <p className="text-[10px] text-streak-foreground/70 text-center mt-2">
            You don't need to be perfect — just consistent 💚
          </p>
        </div>

      </div>
    </AppLayout>
  );
};

export default Profile;
