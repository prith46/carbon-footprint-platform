import type { ActivityEntry, DailyTotal, CategoryBreakdown } from '../types';
import { EMISSION_FACTORS } from '../constants/emissions';

export function calculateCO2(activity: string, value: number): number {
  const factor = EMISSION_FACTORS[activity];
  if (factor === undefined) {
    return 0;
  }
  return Math.round(factor * value * 1000) / 1000;
}

export function getDailyTotals(entries: ActivityEntry[]): DailyTotal[] {
  const map = new Map<string, number>();
  for (const entry of entries) {
    const existing = map.get(entry.date) ?? 0;
    map.set(entry.date, existing + entry.co2Kg);
  }
  return Array.from(map.entries())
    .map(([date, total]) => ({ date, total: Math.round(total * 1000) / 1000 }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getCategoryBreakdown(entries: ActivityEntry[]): CategoryBreakdown[] {
  const map = new Map<string, number>();
  let grandTotal = 0;
  for (const entry of entries) {
    const existing = map.get(entry.category) ?? 0;
    map.set(entry.category, existing + entry.co2Kg);
    grandTotal += entry.co2Kg;
  }
  return Array.from(map.entries()).map(([category, total]) => ({
    category: category as ActivityEntry['category'],
    total: Math.round(total * 1000) / 1000,
    percentage: grandTotal > 0 ? Math.round((total / grandTotal) * 1000) / 10 : 0,
  }));
}

export function getWeeklyAverage(entries: ActivityEntry[]): number {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const cutoff = sevenDaysAgo.toISOString().slice(0, 10);

  const recentEntries = entries.filter((e) => e.date >= cutoff);
  const dailyTotals = getDailyTotals(recentEntries);
  if (dailyTotals.length === 0) {
    return 0;
  }
  const sum = dailyTotals.reduce((acc, d) => acc + d.total, 0);
  return Math.round((sum / 7) * 1000) / 1000;
}

export function getMonthlyTotal(entries: ActivityEntry[]): number {
  const now = new Date();
  const monthPrefix = now.toISOString().slice(0, 7);
  const sum = entries
    .filter((e) => e.date.startsWith(monthPrefix))
    .reduce((acc, e) => acc + e.co2Kg, 0);
  return Math.round(sum * 1000) / 1000;
}

export function getTrend(entries: ActivityEntry[]): 'improving' | 'stable' | 'increasing' {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const fourteenDaysAgo = new Date(now);
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const cutoff7 = sevenDaysAgo.toISOString().slice(0, 10);
  const cutoff14 = fourteenDaysAgo.toISOString().slice(0, 10);
  const today = now.toISOString().slice(0, 10);

  const thisWeek = entries
    .filter((e) => e.date >= cutoff7 && e.date <= today)
    .reduce((acc, e) => acc + e.co2Kg, 0);

  const lastWeek = entries
    .filter((e) => e.date >= cutoff14 && e.date < cutoff7)
    .reduce((acc, e) => acc + e.co2Kg, 0);

  if (lastWeek === 0 && thisWeek === 0) {
    return 'stable';
  }
  if (lastWeek === 0) {
    return 'increasing';
  }

  const change = (thisWeek - lastWeek) / lastWeek;
  if (change < -0.1) {
    return 'improving';
  }
  if (change > 0.1) {
    return 'increasing';
  }
  return 'stable';
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
