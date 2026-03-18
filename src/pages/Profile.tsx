import { useRef, useState } from "react";
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

  const completedLessons = userLessons.filter((ul) => ul.status === 'Completed');
  const inProgressLessons = userLessons.filter((ul) => ul.status === 'In Progress');
  const earnedBadges = badges.filter((b) => b.earned);
  const streak = user?.current_streak || 12;
  const daysOfWeek = ["S", "M", "T", "W", "Th", "F", "S"];
  const activeToday = [true, true, true, true, true, false, false];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be smaller than 2MB.');
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${apiUrl}/api/users/${user.user_id}/profile-picture`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile_picture: base64 }),
        });
        const data = await response.json();
        if (data.success) {
          updateProfilePicture(base64);
        } else {
          alert('Failed to save profile picture.');
        }
      } catch {
        alert('Failed to upload profile picture.');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePicture = async () => {
    if (!user) return;
    setUploading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/users/${user.user_id}/profile-picture`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        updateProfilePicture(null);
      }
    } catch {
      alert('Failed to remove profile picture.');
    } finally {
      setUploading(false);
    }
  };

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
      <div className="px-5 py-6 space-y-6">
        {/* Avatar with upload */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <UserAvatar
              firstName={user?.first_name}
              lastName={user?.last_name}
              profilePicture={user?.profile_picture}
              size="lg"
            />
            {/* Camera button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
              aria-label="Upload profile picture"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="text-center">
            <h2 className="text-lg font-bold text-foreground">
              {user ? `${user.first_name} ${user.last_name}` : "My Profile"}
            </h2>
            {user && (
              <p className="text-xs text-muted-foreground">{user.email}</p>
            )}
          </div>

          {/* Upload / Remove buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-xs bg-primary/10 text-primary font-semibold px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              {uploading ? 'Saving...' : user?.profile_picture ? 'Change Photo' : 'Add Photo'}
            </button>
            {user?.profile_picture && (
              <button
                onClick={handleRemovePicture}
                disabled={uploading}
                className="text-xs bg-destructive/10 text-destructive font-semibold px-3 py-1.5 rounded-full hover:bg-destructive/20 transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Remove
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: completedLessons.length, label: "Lessons\nCompleted" },
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
            {completedLessons.length > 0 ? (
              completedLessons.map((userLesson) => {
                const lesson = lessons.find((l) => l.id === userLesson.lesson_id);
                return lesson ? (
                  <div key={lesson.id} className="bg-card rounded-xl p-3 flex items-center gap-3 card-elevated">
                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                      <span className="text-success text-sm font-bold">✓</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                ) : null;
              })
            ) : (
              <p className="text-sm text-muted-foreground">No completed lessons yet</p>
            )}
          </div>
        </section>

        {/* In Progress */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📝</span>
            <h3 className="text-base font-bold text-foreground">In Progress</h3>
          </div>
          <div className="space-y-2">
            {inProgressLessons.length > 0 ? (
              inProgressLessons.map((userLesson) => {
                const lesson = lessons.find((l) => l.id === userLesson.lesson_id);
                return lesson ? (
                  <div key={lesson.id} className="bg-card rounded-xl p-3 flex items-center gap-3 card-elevated">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-accent text-sm">📖</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">In Progress</p>
                    </div>
                  </div>
                ) : null;
              })
            ) : (
              <p className="text-sm text-muted-foreground">No lessons in progress</p>
            )}
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