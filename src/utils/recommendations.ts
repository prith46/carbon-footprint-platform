import type {
  ActivityEntry,
  CategoryBreakdown,
  Recommendation,
  RecommendationPriority,
  ReductionTip,
  Trend,
  UserGoal,
} from '../types';
import { CATEGORY_LABELS } from '../constants/emissions';
import { REDUCTION_TIPS } from '../constants/tips';

const DOMINANT_CATEGORY_THRESHOLD = 40;
const PRIORITY_RANK: Record<RecommendationPriority, number> = { high: 0, medium: 1, low: 2 };
const MAX_RECOMMENDATIONS = 4;

export interface RecommendationInput {
  entries: ActivityEntry[];
  breakdown: CategoryBreakdown[];
  trend: Trend;
  weeklyAverage: number;
  goal: UserGoal;
}

function topTipFor(category: CategoryBreakdown['category']): ReductionTip | undefined {
  return REDUCTION_TIPS
    .filter((tip) => tip.category === category)
    .sort((a, b) => b.potentialSavingKg - a.potentialSavingKg)[0];
}

function goalRec(weeklyAverage: number, goal: UserGoal): Recommendation | null {
  if (goal.dailyLimitKg <= 0 || weeklyAverage <= goal.dailyLimitKg) return null;
  const over = weeklyAverage - goal.dailyLimitKg;
  const pct = Math.round((over / goal.dailyLimitKg) * 100);
  return {
    id: 'rec-goal',
    priority: 'high',
    icon: '⚠️',
    title: `You're ${pct}% over your daily goal`,
    message: `Your recent daily average is ${weeklyAverage.toFixed(1)} kg vs your ${goal.dailyLimitKg} kg target. Cutting about ${over.toFixed(1)} kg per day brings you back on track.`,
  };
}

function trendRec(trend: Trend, top: CategoryBreakdown | undefined): Recommendation | null {
  if (trend !== 'increasing' || !top) return null;
  return {
    id: 'rec-trend',
    priority: 'high',
    icon: '📈',
    title: 'Your emissions are rising',
    message: `Emissions are up versus last week, driven mostly by ${CATEGORY_LABELS[top.category]}. Targeting it now has the biggest effect.`,
  };
}

function categoryRec(top: CategoryBreakdown | undefined): Recommendation | null {
  if (!top || top.percentage < DOMINANT_CATEGORY_THRESHOLD) return null;
  const tip = topTipFor(top.category);
  if (!tip) return null;
  return {
    id: 'rec-category',
    priority: 'medium',
    icon: '🎯',
    title: `${CATEGORY_LABELS[top.category]} is ${top.percentage.toFixed(0)}% of your footprint`,
    message: `Highest-impact action: ${tip.title.toLowerCase()} — about ${tip.potentialSavingKg} kg CO2 saved per week.`,
  };
}

function positiveRec(trend: Trend, weeklyAverage: number, goal: UserGoal): Recommendation | null {
  const underGoal = goal.dailyLimitKg > 0 && weeklyAverage <= goal.dailyLimitKg;
  if (trend !== 'improving' && !underGoal) return null;
  return {
    id: 'rec-positive',
    priority: 'low',
    icon: '✅',
    title: 'You are on a good track',
    message: trend === 'improving'
      ? 'Your emissions are trending down — keep up the habits that are working.'
      : 'You are within your daily goal. Consider setting a more ambitious target.',
  };
}

export function generateRecommendations(input: RecommendationInput): Recommendation[] {
  if (input.entries.length === 0) {
    return [{
      id: 'rec-start',
      priority: 'medium',
      icon: '🌱',
      title: 'Start tracking to unlock insights',
      message: 'Log your first activity on the Track page and personalized, data-driven recommendations will appear here.',
    }];
  }
  const sorted = [...input.breakdown].sort((a, b) => b.total - a.total);
  const top = sorted[0];
  const recs = [
    goalRec(input.weeklyAverage, input.goal),
    trendRec(input.trend, top),
    categoryRec(top),
    positiveRec(input.trend, input.weeklyAverage, input.goal),
  ].filter((rec): rec is Recommendation => rec !== null);

  return recs
    .sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority])
    .slice(0, MAX_RECOMMENDATIONS);
}
