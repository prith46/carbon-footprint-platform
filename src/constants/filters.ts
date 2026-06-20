import type { ActivityCategory } from '../types';

export const ALL_TIME_DAYS = 36500;

const VALID_CATEGORIES: ActivityCategory[] = ['transport', 'food', 'energy', 'shopping'];

interface RangeOption {
  days: number;
  label: string;
}

export const ENTRY_RANGE_OPTIONS: RangeOption[] = [
  { days: ALL_TIME_DAYS, label: 'All time' },
  { days: 7, label: 'Last 7 days' },
  { days: 30, label: 'Last 30 days' },
  { days: 90, label: 'Last 90 days' },
];

export function isCategoryFilter(value: unknown): value is ActivityCategory | 'all' {
  return value === 'all' || (typeof value === 'string' && VALID_CATEGORIES.includes(value as ActivityCategory));
}

export function isRangeDays(value: unknown): value is number {
  return typeof value === 'number' && ENTRY_RANGE_OPTIONS.some((opt) => opt.days === value);
}
