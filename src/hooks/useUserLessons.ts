import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from "@/lib/api";

interface UserLesson {
  user_lesson_id?: number;
  user_id: number;
  lesson_id: number;
  status: 'Completed' | 'In Progress' | 'Locked';
  completed_at: string | null;
  last_card_viewed?: number;
}

const normalizeLessonStatus = (
  rawStatus: unknown,
  completedAt: string | null | undefined
): UserLesson['status'] => {
  const normalized = String(rawStatus ?? '').trim().toLowerCase();

  if (normalized === 'completed') return 'Completed';
  if (normalized === 'in progress' || normalized === 'in_progress' || normalized === 'inprogress') {
    return 'In Progress';
  }
  if (normalized === 'locked') return 'Locked';

  return completedAt ? 'Completed' : 'In Progress';
};

export const useUserLessons = (userId: number | null) => {
  const [userLessons, setUserLessons] = useState<UserLesson[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserLessons = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await apiFetch(`/users/${userId}/lessons`);
      const normalizedLessons: UserLesson[] = Array.isArray(data.data)
        ? data.data.map((row: UserLesson & { status?: unknown }) => ({
            ...row,
            completed_at: row.completed_at ?? null,
            status: normalizeLessonStatus(row.status, row.completed_at),
          }))
        : [];
      setUserLessons(normalizedLessons);
    } catch (error) {
      console.error('Error fetching user lessons:', error);
      setUserLessons([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserLessons();
  }, [fetchUserLessons]);

  return { userLessons, loading, refetch: fetchUserLessons };
};
