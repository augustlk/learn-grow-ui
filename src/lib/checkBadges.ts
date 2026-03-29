import { apiFetch } from "@/lib/api";

interface UserStats {
  completedLessons: number;
  passedQuizzes: number;
  perfectScoreQuizzes: number;
  completedUnitIds: number[];
  currentStreak: number;
}

interface Badge {
  badge_id: number;
  badge_name: string;
  badge_level: number;
  badge_description: string | null;
  icon: string | null;
}

const REQUIREMENTS: Record<string, (s: UserStats) => boolean> = {
  "first lesson":         (s) => s.completedLessons >= 1,
  "5-day streak":         (s) => s.currentStreak >= 5,
  "quiz champion":        (s) => s.passedQuizzes >= 1,
  "perfect score":        (s) => s.perfectScoreQuizzes >= 1,
  "10-day streak":        (s) => s.currentStreak >= 10,
  "unit master":          (s) => s.completedUnitIds.length >= 1,
  "5 quizzes passed":     (s) => s.passedQuizzes >= 5,
  "30-day streak":        (s) => s.currentStreak >= 30,
  "lesson completionist": (s) => s.completedLessons >= 15,
  "nutrition expert":     (s) => s.perfectScoreQuizzes >= 15,
  "nutrition newbie":     (s) => s.completedUnitIds.includes(1),
  "macro master":         (s) => s.completedUnitIds.includes(2),
  "micro maven":          (s) => s.completedUnitIds.includes(3),
  "gut guru":             (s) => s.completedUnitIds.includes(4),
  "label reader":         (s) => s.completedUnitIds.includes(5),
};

export async function checkBadges(
  userId: number,
  currentStreak = 0
): Promise<{ name: string; icon: string }[]> {
  const [allJson, earnedJson, lessonsJson, statsJson] = await Promise.all([
    apiFetch("/badges"),
    apiFetch(`/users/${userId}/badges`),
    apiFetch(`/users/${userId}/lessons`),
    apiFetch(`/users/${userId}/stats`),
  ]);

  const allBadges: Badge[] = Array.isArray(allJson?.data) ? allJson.data : [];

  const earnedIds = new Set<number>(
    Array.isArray(earnedJson?.data)
      ? earnedJson.data.map((b: { badge_id: number }) => b.badge_id)
      : []
  );

  const lessonsData = Array.isArray(lessonsJson?.data) ? lessonsJson.data : [];
  const completedLessonsCount = lessonsData.filter(
    (lesson: { status: string }) => lesson.status.toLowerCase() === "completed"
  ).length;

  const stats: UserStats = {
    completedLessons: statsJson?.success
      ? statsJson.data.completedLessons
      : completedLessonsCount,
    passedQuizzes: statsJson?.success ? statsJson.data.passedQuizzes : 0,
    perfectScoreQuizzes: statsJson?.success ? statsJson.data.perfectScoreQuizzes : 0,
    completedUnitIds: statsJson?.success ? statsJson.data.completedUnitIds : [],
    currentStreak: statsJson?.success ? statsJson.data.currentStreak : currentStreak,
  };

  const toAward = allBadges.filter((badge) => {
    if (earnedIds.has(badge.badge_id)) return false;
    const check = REQUIREMENTS[badge.badge_name.toLowerCase()];
    return check ? check(stats) : false;
  });

  if (toAward.length === 0) {
    return [];
  }

  await Promise.all(
    toAward.map((badge) =>
      apiFetch(`/users/${userId}/badges/${badge.badge_id}/award`, {
        method: "POST",
      })
    )
  );

  return toAward.map((badge) => ({
    name: badge.badge_name,
    icon: badge.icon ?? "🏅",
  }));
}