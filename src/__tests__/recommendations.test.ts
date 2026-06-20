import { describe, it, expect } from 'vitest';
import { generateRecommendations } from '../utils/recommendations';
import type { ActivityEntry, CategoryBreakdown, UserGoal } from '../types';

const GOAL: UserGoal = { dailyLimitKg: 10, weeklyLimitKg: 70 };

function entry(category: ActivityEntry['category'], co2Kg: number): ActivityEntry {
  return { id: `${category}-${co2Kg}-${Math.random()}`, category, activity: 'car', value: 1, unit: 'km', co2Kg, date: '2026-06-20' };
}

describe('generateRecommendations', () => {
  it('returns a start recommendation when there are no entries', () => {
    const recs = generateRecommendations({ entries: [], breakdown: [], trend: 'stable', weeklyAverage: 0, goal: GOAL });
    expect(recs).toHaveLength(1);
    expect(recs[0].id).toBe('rec-start');
  });

  it('flags being over the daily goal as high priority', () => {
    const breakdown: CategoryBreakdown[] = [{ category: 'transport', total: 100, percentage: 100 }];
    const recs = generateRecommendations({ entries: [entry('transport', 100)], breakdown, trend: 'stable', weeklyAverage: 20, goal: GOAL });
    const goalRec = recs.find((r) => r.id === 'rec-goal');
    expect(goalRec).toBeDefined();
    expect(goalRec?.priority).toBe('high');
  });

  it('does not flag goal when within the daily limit', () => {
    const breakdown: CategoryBreakdown[] = [{ category: 'food', total: 5, percentage: 100 }];
    const recs = generateRecommendations({ entries: [entry('food', 5)], breakdown, trend: 'stable', weeklyAverage: 5, goal: GOAL });
    expect(recs.find((r) => r.id === 'rec-goal')).toBeUndefined();
  });

  it('warns when the trend is increasing', () => {
    const breakdown: CategoryBreakdown[] = [{ category: 'energy', total: 50, percentage: 100 }];
    const recs = generateRecommendations({ entries: [entry('energy', 50)], breakdown, trend: 'increasing', weeklyAverage: 5, goal: GOAL });
    expect(recs.find((r) => r.id === 'rec-trend')).toBeDefined();
  });

  it('suggests a targeted tip for a dominant category', () => {
    const breakdown: CategoryBreakdown[] = [
      { category: 'transport', total: 60, percentage: 60 },
      { category: 'food', total: 40, percentage: 40 },
    ];
    const recs = generateRecommendations({ entries: [entry('transport', 60)], breakdown, trend: 'stable', weeklyAverage: 5, goal: GOAL });
    const catRec = recs.find((r) => r.id === 'rec-category');
    expect(catRec).toBeDefined();
    expect(catRec?.message.length).toBeGreaterThan(0);
  });

  it('gives positive reinforcement when improving and within goal', () => {
    const breakdown: CategoryBreakdown[] = [{ category: 'food', total: 5, percentage: 100 }];
    const recs = generateRecommendations({ entries: [entry('food', 5)], breakdown, trend: 'improving', weeklyAverage: 5, goal: GOAL });
    expect(recs.find((r) => r.id === 'rec-positive')).toBeDefined();
  });

  it('sorts recommendations by priority (high first)', () => {
    const breakdown: CategoryBreakdown[] = [{ category: 'transport', total: 100, percentage: 100 }];
    const recs = generateRecommendations({ entries: [entry('transport', 100)], breakdown, trend: 'increasing', weeklyAverage: 20, goal: GOAL });
    expect(recs[0].priority).toBe('high');
  });

  it('caps recommendations at four', () => {
    const breakdown: CategoryBreakdown[] = [{ category: 'transport', total: 100, percentage: 100 }];
    const recs = generateRecommendations({ entries: [entry('transport', 100)], breakdown, trend: 'increasing', weeklyAverage: 20, goal: GOAL });
    expect(recs.length).toBeLessThanOrEqual(4);
  });

  it('handles a zero daily goal without flagging goal overage', () => {
    const breakdown: CategoryBreakdown[] = [{ category: 'food', total: 5, percentage: 100 }];
    const recs = generateRecommendations({ entries: [entry('food', 5)], breakdown, trend: 'stable', weeklyAverage: 5, goal: { dailyLimitKg: 0, weeklyLimitKg: 0 } });
    expect(recs.find((r) => r.id === 'rec-goal')).toBeUndefined();
  });
});
