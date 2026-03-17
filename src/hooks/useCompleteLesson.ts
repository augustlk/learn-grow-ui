import { useState } from 'react';

interface QuizSubmitResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const useCompleteLesson = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markLessonComplete = async (userId: number, lessonId: number): Promise<QuizSubmitResponse> => {
    setLoading(true);
    setError(null);

    try {
      // Update in database via API
      const apiUrl = import.meta.env.VITE_API_URL || '';
      console.log(`Calling API to complete lesson ${lessonId} for user ${userId}`);
      const response = await fetch(`${apiUrl}/api/users/${userId}/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to save lesson completion to database');
      }

      const data = await response.json();
      console.log('API response:', data);

      // Also store in localStorage for offline support
      const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '{}');
      completedLessons[userId] = completedLessons[userId] || [];
      if (!completedLessons[userId].includes(lessonId)) {
        completedLessons[userId].push(lessonId);
      }
      localStorage.setItem('completedLessons', JSON.stringify(completedLessons));

      console.log(`✓ Lesson ${lessonId} marked as complete for user ${userId}`);
      setLoading(false);
      return { success: true, message: 'Lesson marked as complete!' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to complete lesson';
      console.error('Error marking lesson complete:', message);
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  };

  return { markLessonComplete, loading, error };
};
