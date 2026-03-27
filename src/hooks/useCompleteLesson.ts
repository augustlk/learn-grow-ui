import { useState } from 'react';
import { apiFetch } from "@/lib/api";
import { useUser } from "@/hooks/useUserContext";

interface QuizSubmitResponse {
  success: boolean;
  message?: string;
  error?: string;
  currentStreak?: number;
  maxStreak?: number;
  completedAt?: string;
}

export const useCompleteLesson = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshUser } = useUser();

  const markLessonComplete = async (
    userId: number,
    lessonId: number
  ): Promise<QuizSubmitResponse> => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch(
        `/users/${userId}/lessons/${lessonId}/complete`,
        { method: "POST" }
      );

      await refreshUser();
      setLoading(false);

      return {
        success: true,
        message: 'Lesson marked as complete!',
        currentStreak: data?.data?.currentStreak,
        maxStreak: data?.data?.maxStreak,
        completedAt: data?.data?.completedAt,
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to complete lesson';

      setError(message);
      setLoading(false);

      return { success: false, error: message };
    }
  };

  return { markLessonComplete, loading, error };
};