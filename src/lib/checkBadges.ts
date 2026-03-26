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

// Requirements mapped directly from badge_description in the seed file.
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

/**
 * Checks which badges the user newly qualifies for, awards them via the API,
 * and returns the name + icon of each newly awarded badge.
 * Awaiting this ensures badges are saved before the caller navigates away.
 */
export async function checkBadges(
  userId: number,
  currentStreak: number
): Promise<{ name: string; icon: string }[]> {
  const apiUrl = import.meta.env.VITE_API_URL || "";
  const token = localStorage.getItem("token");
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  // Fetch all needed data in parallel
  const [allRes, earnedRes, lessonsRes, statsRes] = await Promise.all([
    fetch(`${apiUrl}/api/badges`),
    fetch(`${apiUrl}/api/users/${userId}/badges`, { headers: authHeader }),
    fetch(`${apiUrl}/api/users/${userId}/lessons`, { headers: authHeader }),
    fetch(`${apiUrl}/api/users/${userId}/stats`, { headers: authHeader }),
  ]);

  const [allJson, earnedJson, lessonsJson, statsJson] = await Promise.all([
    allRes.json(),
    earnedRes.json(),
    lessonsRes.json(),
    statsRes.json(),
  ]);

  const allBadges: Badge[] = Array.isArray(allJson.data) ? allJson.data : [];

  const earnedIds = new Set<number>(
    Array.isArray(earnedJson.data)
      ? earnedJson.data.map((b: { badge_id: number }) => b.badge_id)
      : []
  );

  // Count completed lessons directly from the lessons list as a reliable fallback
  const lessonsData = Array.isArray(lessonsJson.data) ? lessonsJson.data : [];
  const completedLessonsCount = lessonsData.filter(
    (l: { status: string }) => l.status.toLowerCase() === "completed"
  ).length;

  // Prefer stats endpoint values, fall back to what we computed ourselves
  const stats: UserStats = {
    completedLessons: statsJson.success
      ? statsJson.data.completedLessons
      : completedLessonsCount,
    passedQuizzes: statsJson.success ? statsJson.data.passedQuizzes : 0,
    perfectScoreQuizzes: statsJson.success ? statsJson.data.perfectScoreQuizzes : 0,
    completedUnitIds: statsJson.success ? statsJson.data.completedUnitIds : [],
    currentStreak,
  };

  console.log("[checkBadges] stats:", stats);

  // Find unearned badges the user now qualifies for
  const toAward = allBadges.filter((badge) => {
    if (earnedIds.has(badge.badge_id)) return false;
    const check = REQUIREMENTS[badge.badge_name.toLowerCase()];
    return check ? check(stats) : false;
  });

  if (toAward.length === 0) {
    console.log("[checkBadges] No new badges to award.");
    return [];
  }

  console.log("[checkBadges] Awarding:", toAward.map((b) => b.badge_name));

  // Award all qualifying badges in parallel and wait for all to finish
  await Promise.all(
    toAward.map((badge) =>
      fetch(`${apiUrl}/api/users/${userId}/badges/${badge.badge_id}/award`, {
        method: "POST",
        headers: authHeader,
      })
    )
  );

  return toAward.map((b) => ({ name: b.badge_name, icon: b.icon ?? "🏅" }));
}
