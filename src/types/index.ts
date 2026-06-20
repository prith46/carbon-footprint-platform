export type ActivityCategory = 'transport' | 'food' | 'energy' | 'shopping';

export interface ActivityEntry {
  id: string;
  category: ActivityCategory;
  activity: string;
  value: number;
  unit: string;
  co2Kg: number;
  date: string;
}

export interface DailyTotal {
  date: string;
  total: number;
}

export interface CategoryBreakdown {
  category: ActivityCategory;
  total: number;
  percentage: number;
}

export interface ReductionTip {
  id: string;
  category: ActivityCategory;
  title: string;
  description: string;
  potentialSavingKg: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserGoal {
  dailyLimitKg: number;
  weeklyLimitKg: number;
}

export type RecommendationPriority = 'high' | 'medium' | 'low';

export interface Recommendation {
  id: string;
  priority: RecommendationPriority;
  icon: string;
  title: string;
  message: string;
}

export type Trend = 'improving' | 'stable' | 'increasing';
