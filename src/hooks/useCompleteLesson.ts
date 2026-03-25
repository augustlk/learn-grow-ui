import { useState } from 'react';
import { apiFetch } from "@/lib/api";

interface QuizSubmitResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const useCompleteLesson = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markLessonComplete = async (
    userId: number,
    lessonId: number
  ): Promise<QuizSubmitResponse> => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Calling API to complete lesson ${lessonId} for user ${userId}`);

      // ✅ this already handles errors + returns JSON
      const data = await apiFetch(
        `/users/${userId}/lessons/${lessonId}/complete`,
        { method: "POST" }
      );

      console.log('API response:', data);

      // localStorage fallback
      const completedLessons = JSON.parse(
        localStorage.getItem('completedLessons') || '{}'
      );

      completedLessons[userId] = completedLessons[userId] || [];

      if (!completedLessons[userId].includes(lessonId)) {
        completedLessons[userId].push(lessonId);
      }

      localStorage.setItem(
        'completedLessons',
        JSON.stringify(completedLessons)
      );

      setLoading(false);

      return { success: true, message: 'Lesson marked as complete!' };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to complete lesson';

      console.error('Error marking lesson complete:', message);

      setError(message);
      setLoading(false);

      return { success: false, error: message };
    }
  };

  return { markLessonComplete, loading, error };
};