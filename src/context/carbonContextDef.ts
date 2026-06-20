import { createContext } from 'react';
import type { ActivityEntry, ActivityCategory, DailyTotal, CategoryBreakdown, UserGoal } from '../types';

export interface CarbonContextValue {
  entries: ActivityEntry[];
  goal: UserGoal;
  addEntry: (category: ActivityCategory, activity: string, value: number, unit: string) => void;
  deleteEntry: (id: string) => void;
  updateGoal: (goal: UserGoal) => void;
  dailyTotals: DailyTotal[];
  categoryBreakdown: CategoryBreakdown[];
  weeklyAverage: number;
  monthlyTotal: number;
  trend: 'improving' | 'stable' | 'increasing';
  todayTotal: number;
}

export const CarbonContext = createContext<CarbonContextValue | null>(null);
