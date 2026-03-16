import { useCallback, useEffect, useMemo, useState } from 'react';
import { useUserLessons } from './useUserLessons';

export interface LessonWithStatus {
  id: number;
  lesson_id: number;
  unit_id: number;
  unit_title: string;
  unit_order: number;
  title: string;
  duration: string;
  status: 'completed' | 'active' | 'locked';
  level: number;
  prereq_lesson_id: number | null;
  modulesTotal?: number;
  modulesCompleted?: number;
  description?: string;
  category?: string;
  extraLinks?: string;
}

export interface UnitWithLessons {
  unit_id: number;
  unit_title: string;
  unit_order: number;
  lessons: LessonWithStatus[];
  unitStatus: 'completed' | 'active' | 'locked';
}

interface RawLesson {
  lesson_id: number;
  lesson_title: string;
  level: number;
  prereq_lesson_id: number | null;
}

interface RawUnit {
  unit_id: number;
  unit_title: string;
  unit_order: number;
  lessons: RawLesson[];
}

export const useUserLessonsWithStatus = (userId: number | null) => {
  const [rawUnits, setRawUnits] = useState<RawUnit[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const { userLessons, refetch: refetchUserLessons } = useUserLessons(userId);

  const fetchAllLessons = useCallback(async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/units`);
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setRawUnits(data.data);
      } else {
        setRawUnits([]);
      }
    } catch (error) {
      console.error('Error fetching units/lessons:', error);
      setRawUnits([]);
    } finally {
      setLoadingLessons(false);
    }
  }, []);

  useEffect(() => {
    fetchAllLessons();
  }, [fetchAllLessons]);

  const { lessons, units } = useMemo(() => {
    if (rawUnits.length === 0) return { lessons: [], units: [] };

    const completedIds = new Set(
      userLessons
        .filter((ul) => ul.status === 'Completed')
        .map((ul) => ul.lesson_id)
    );

    const inProgressIds = new Set(
      userLessons
        .filter((ul) => ul.status === 'In Progress')
        .map((ul) => ul.lesson_id)
    );

    const flatLessons = rawUnits
      .flatMap((unit) =>
        unit.lessons.map((lesson) => ({
          ...lesson,
          unit_id: unit.unit_id,
          unit_title: unit.unit_title,
          unit_order: unit.unit_order,
        }))
      )
      .sort((a, b) => a.lesson_id - b.lesson_id);

    const withStatus: LessonWithStatus[] = flatLessons.map((row, index) => {
      let status: 'completed' | 'active' | 'locked';

      if (completedIds.has(row.lesson_id)) {
        status = 'completed';
      } else if (inProgressIds.has(row.lesson_id)) {
        status = 'active';
      } else if (index === 0) {
        status = 'active';
      } else {
        const prevLesson = flatLessons[index - 1];
        status = completedIds.has(prevLesson.lesson_id) ? 'active' : 'locked';
      }

      return {
        id: row.lesson_id,
        lesson_id: row.lesson_id,
        unit_id: row.unit_id,
        unit_title: row.unit_title,
        unit_order: row.unit_order,
        title: row.lesson_title,
        duration: '5 min',
        status,
        level: row.level,
        prereq_lesson_id: row.prereq_lesson_id ?? null,
        description: `Level ${row.level} lesson`,
        category: row.unit_title,
      };
    });

    const unitMap: Record<number, UnitWithLessons> = {};

    withStatus.forEach((lesson) => {
      if (!unitMap[lesson.unit_id]) {
        unitMap[lesson.unit_id] = {
          unit_id: lesson.unit_id,
          unit_title: lesson.unit_title,
          unit_order: lesson.unit_order,
          lessons: [],
          unitStatus: 'locked',
        };
      }
      unitMap[lesson.unit_id].lessons.push(lesson);
    });

    const unitList = Object.values(unitMap)
      .sort((a, b) => a.unit_order - b.unit_order)
      .map((unit, index, arr) => {
        const completedCount = unit.lessons.filter((l) => l.status === 'completed').length;
        const totalCount = unit.lessons.length;
        const allCompleted = completedCount === totalCount;

        let unitStatus: 'completed' | 'active' | 'locked';

        if (allCompleted) {
          unitStatus = 'completed';
        } else if (index === 0) {
          unitStatus = 'active';
        } else {
          const previousUnit = arr[index - 1];
          const previousCompleted =
            previousUnit.lessons.filter((l) => l.status === 'completed').length ===
            previousUnit.lessons.length;

          unitStatus = previousCompleted ? 'active' : 'locked';
        }

        return {
          ...unit,
          unitStatus,
        };
      });

    return { lessons: withStatus, units: unitList };
  }, [rawUnits, userLessons]);

  const refetch = useCallback(async () => {
    await Promise.all([fetchAllLessons(), refetchUserLessons()]);
  }, [fetchAllLessons, refetchUserLessons]);

  return { lessons, units, loading: loadingLessons, refetch };
};