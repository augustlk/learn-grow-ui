import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export interface StreakWeekDay {
  dayKey: string;
  label: string;
  active: boolean;
  isToday: boolean;
}

export interface CalendarDay {
  dayKey: string;
  dayNumber: number;
  weekday: string;
  monthLabel: string;
  active: boolean;
  isToday: boolean;
  isCurrentMonth: boolean;
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalDaysActive: number;
  daysThisWeek: number;
  weeklyGoal: number;
  thisWeek: StreakWeekDay[];
  calendar: CalendarDay[];
}

function toDayKey(value: Date | string = new Date()) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dayKeyToDate(dayKey: string) {
  const [year, month, day] = dayKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(dayKey: string, amount: number) {
  const date = dayKeyToDate(dayKey);
  date.setDate(date.getDate() + amount);
  return toDayKey(date);
}

function startOfWeek(dayKey: string) {
  const date = dayKeyToDate(dayKey);
  date.setDate(date.getDate() - date.getDay());
  return toDayKey(date);
}

function buildEmptyStats(referenceDayKey = toDayKey(new Date())): StreakStats {
  const weekStart = startOfWeek(referenceDayKey);
  const currentMonth = dayKeyToDate(referenceDayKey).getMonth();
  const calendarStart = addDays(weekStart, -28);

  return {
    currentStreak: 0,
    longestStreak: 0,
    totalDaysActive: 0,
    daysThisWeek: 0,
    weeklyGoal: 5,
    thisWeek: WEEKDAY_LABELS.map((label, index) => {
      const dayKey = addDays(weekStart, index);
      return {
        dayKey,
        label,
        active: false,
        isToday: dayKey === referenceDayKey,
      };
    }),
    calendar: Array.from({ length: 35 }, (_, index) => {
      const dayKey = addDays(calendarStart, index);
      const date = dayKeyToDate(dayKey);

      return {
        dayKey,
        dayNumber: date.getDate(),
        weekday: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        monthLabel: date.toLocaleDateString("en-US", {
          month: "short",
        }),
        active: false,
        isToday: dayKey === referenceDayKey,
        isCurrentMonth: date.getMonth() === currentMonth,
      };
    }),
  };
}

export const useStreakStats = (userId: number | null) => {
  const [stats, setStats] = useState<StreakStats>(() => buildEmptyStats());
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!userId) {
      setStats(buildEmptyStats());
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await apiFetch(`/users/${userId}/streaks`);

      if (data?.success && data.data) {
        setStats({
          ...buildEmptyStats(),
          ...data.data,
        });
      } else {
        setStats(buildEmptyStats());
      }
    } catch (error) {
      console.error("Error fetching streak stats:", error);
      setStats(buildEmptyStats());
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { stats, loading, refetch };
};