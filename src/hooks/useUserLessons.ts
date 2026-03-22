import { useCallback, useEffect, useState } from 'react';

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
      const apiUrl = import.meta.env.VITE_API_URL || '';
      // Add cache buster to force fresh data
      const response = await fetch(`${apiUrl}/api/users/${userId}/lessons?t=${Date.now()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user lessons');
      }

      const data = await response.json();
      console.log('Fetched user lessons from API:', data.data);
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
      // Fallback to mock data if API fails
      const mockUserLessons: Record<number, UserLesson[]> = {
        1: [
          {
            user_lesson_id: 1,
            user_id: 1,
            lesson_id: 1,
            status: 'Completed',
            completed_at: new Date().toISOString(),
          },
          {
            user_lesson_id: 2,
            user_id: 1,
            lesson_id: 2,
            status: 'In Progress',
            completed_at: null,
          },
        ],
        2: [
          {
            user_lesson_id: 3,
            user_id: 2,
            lesson_id: 1,
            status: 'Completed',
            completed_at: new Date().toISOString(),
          },
        ],
        3: [
          {
            user_lesson_id: 4,
            user_id: 3,
            lesson_id: 1,
            status: 'Completed',
            completed_at: new Date().toISOString(),
          },
        ],
      };
      console.log('Using fallback mock data');
      setUserLessons(mockUserLessons[userId] || []);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserLessons();
  }, [fetchUserLessons]);

  return { userLessons, loading, refetch: fetchUserLessons };
};
