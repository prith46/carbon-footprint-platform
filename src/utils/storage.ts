import type { ActivityEntry, UserGoal, ActivityCategory } from '../types';

const ENTRIES_KEY = 'carbon-entries';
const GOAL_KEY = 'carbon-goal';
const VALID_CATEGORIES: ActivityCategory[] = ['transport', 'food', 'energy', 'shopping'];
const DEFAULT_GOAL: UserGoal = { dailyLimitKg: 10, weeklyLimitKg: 70 };

function isValidEntry(item: unknown): item is ActivityEntry {
  if (typeof item !== 'object' || item === null) {
    return false;
  }
  const obj = item as Record<string, unknown>;
  if (typeof obj.id !== 'string' || obj.id.length === 0) {
    return false;
  }
  if (typeof obj.category !== 'string' || !VALID_CATEGORIES.includes(obj.category as ActivityCategory)) {
    return false;
  }
  if (typeof obj.activity !== 'string' || obj.activity.length === 0) {
    return false;
  }
  if (typeof obj.value !== 'number' || !Number.isFinite(obj.value) || obj.value < 0) {
    return false;
  }
  if (typeof obj.unit !== 'string' || obj.unit.length === 0) {
    return false;
  }
  if (typeof obj.co2Kg !== 'number' || !Number.isFinite(obj.co2Kg) || obj.co2Kg < 0) {
    return false;
  }
  if (typeof obj.date !== 'string' || obj.date.length === 0) {
    return false;
  }
  return true;
}

export function loadEntries(): ActivityEntry[] {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isValidEntry);
  } catch {
    return [];
  }
}

export function saveEntries(entries: ActivityEntry[]): void {
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export function loadGoal(): UserGoal {
  try {
    const raw = localStorage.getItem(GOAL_KEY);
    if (!raw) {
      return { ...DEFAULT_GOAL };
    }
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return { ...DEFAULT_GOAL };
    }
    const obj = parsed as Record<string, unknown>;
    const dailyLimitKg = typeof obj.dailyLimitKg === 'number' && Number.isFinite(obj.dailyLimitKg) && obj.dailyLimitKg >= 0
      ? obj.dailyLimitKg
      : DEFAULT_GOAL.dailyLimitKg;
    const weeklyLimitKg = typeof obj.weeklyLimitKg === 'number' && Number.isFinite(obj.weeklyLimitKg) && obj.weeklyLimitKg >= 0
      ? obj.weeklyLimitKg
      : DEFAULT_GOAL.weeklyLimitKg;
    return { dailyLimitKg, weeklyLimitKg };
  } catch {
    return { ...DEFAULT_GOAL };
  }
}

export function saveGoal(goal: UserGoal): void {
  localStorage.setItem(GOAL_KEY, JSON.stringify(goal));
}
