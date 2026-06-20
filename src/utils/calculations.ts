import type { ActivityEntry, DailyTotal, CategoryBreakdown } from '../types';
import { EMISSION_FACTORS } from '../constants/emissions';
import { TREND_THRESHOLD, TREND_DAYS, PERCENTAGE } from '../constants/limits';

const PRECISION = 1000;

function round(n: number): number {
  return Math.round(n * PRECISION) / PRECISION;
}

function dateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function sumRange(entries: ActivityEntry[], from: string, to: string): number {
  return entries
    .filter((e) => e.date >= from && e.date <= to)
    .reduce((acc, e) => acc + e.co2Kg, 0);
}

export function calculateCO2(activity: string, value: number): number {
  const factor = EMISSION_FACTORS[activity];
  return factor === undefined ? 0 : round(factor * value);
}

export function getDailyTotals(entries: ActivityEntry[]): DailyTotal[] {
  const map = new Map<string, number>();
  for (const entry of entries) {
    map.set(entry.date, (map.get(entry.date) ?? 0) + entry.co2Kg);
  }
  return Array.from(map.entries())
    .map(([date, total]) => ({ date, total: round(total) }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getCategoryBreakdown(entries: ActivityEntry[]): CategoryBreakdown[] {
  const map = new Map<string, number>();
  let grandTotal = 0;
  for (const entry of entries) {
    map.set(entry.category, (map.get(entry.category) ?? 0) + entry.co2Kg);
    grandTotal += entry.co2Kg;
  }
  return Array.from(map.entries()).map(([category, total]) => ({
    category: category as ActivityEntry['category'],
    total: round(total),
    percentage: grandTotal > 0 ? round((total / grandTotal) * PERCENTAGE) : 0,
  }));
}

export function getWeeklyAverage(entries: ActivityEntry[]): number {
  const cutoff = dateDaysAgo(TREND_DAYS);
  const recentEntries = entries.filter((e) => e.date >= cutoff);
  const totals = getDailyTotals(recentEntries);
  if (totals.length === 0) return 0;
  const sum = totals.reduce((acc, d) => acc + d.total, 0);
  return round(sum / TREND_DAYS);
}

export function getMonthlyTotal(entries: ActivityEntry[]): number {
  const monthPrefix = new Date().toISOString().slice(0, 7);
  const sum = entries
    .filter((e) => e.date.startsWith(monthPrefix))
    .reduce((acc, e) => acc + e.co2Kg, 0);
  return round(sum);
}

export function getTrend(entries: ActivityEntry[]): 'improving' | 'stable' | 'increasing' {
  const today = dateDaysAgo(0);
  const cutoff7 = dateDaysAgo(TREND_DAYS);
  const cutoff14 = dateDaysAgo(TREND_DAYS * 2);

  const thisWeek = sumRange(entries, cutoff7, today);
  const lastWeek = sumRange(entries, cutoff14, dateDaysAgo(TREND_DAYS + 1));

  if (lastWeek === 0) return thisWeek === 0 ? 'stable' : 'increasing';
  const change = (thisWeek - lastWeek) / lastWeek;
  if (change < -TREND_THRESHOLD) return 'improving';
  if (change > TREND_THRESHOLD) return 'increasing';
  return 'stable';
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
