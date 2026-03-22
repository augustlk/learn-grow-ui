import { useCallback, useEffect, useState } from "react";

export interface InProgressLesson {
  lesson_id: number;
  lesson_title: string;
  unit_id: number;
  unit_title: string;
  last_card_viewed: number;
  total_cards: number;
  started_at: string;
}

export const useInProgressLessons = (userId: number | null) => {
  const [inProgressLessons, setInProgressLessons] = useState<InProgressLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInProgressLessons = useCallback(async () => {
    if (!userId) {
      setInProgressLessons([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(
        `${apiUrl}/api/users/${userId}/lessons/in-progress?t=${Date.now()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch in-progress lessons");
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setInProgressLessons(data.data);
      } else {
        setInProgressLessons([]);
      }
    } catch (err) {
      console.error("Error fetching in-progress lessons:", err);
      setError("Could not load in-progress lessons");
      setInProgressLessons([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchInProgressLessons();
  }, [fetchInProgressLessons]);

  return {
    inProgressLessons,
    loading,
    error,
    refetch: fetchInProgressLessons,
  };
};
