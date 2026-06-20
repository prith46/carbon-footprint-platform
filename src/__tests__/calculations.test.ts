import { describe, it, expect } from 'vitest';
import {
  calculateCO2,
  getDailyTotals,
  getCategoryBreakdown,
  getWeeklyAverage,
  getMonthlyTotal,
  getTrend,
  generateId,
} from '../utils/calculations';
import type { ActivityEntry } from '../types';

function makeEntry(overrides: Partial<ActivityEntry> = {}): ActivityEntry {
  return {
    id: '1',
    category: 'transport',
    activity: 'car',
    value: 10,
    unit: 'km',
    co2Kg: 2.1,
    date: '2026-06-20',
    ...overrides,
  };
}

describe('calculateCO2', () => {
  it('returns correct CO2 for a known activity', () => {
    expect(calculateCO2('car', 100)).toBe(21);
  });

  it('returns 0 for an unknown activity', () => {
    expect(calculateCO2('spaceship', 100)).toBe(0);
  });

  it('returns 0 for zero value', () => {
    expect(calculateCO2('car', 0)).toBe(0);
  });

  it('handles negative value by returning negative result', () => {
    expect(calculateCO2('car', -10)).toBe(-2.1);
  });

  it('returns 0 for zero-emission activities', () => {
    expect(calculateCO2('bicycle', 50)).toBe(0);
  });

  it('rounds to 3 decimal places', () => {
    expect(calculateCO2('bus', 1)).toBe(0.089);
  });

  it('handles large values', () => {
    expect(calculateCO2('car', 10000)).toBe(2100);
  });
});

describe('getDailyTotals', () => {
  it('groups entries by date and sums co2Kg', () => {
    const entries = [
      makeEntry({ date: '2026-06-20', co2Kg: 1 }),
      makeEntry({ date: '2026-06-20', co2Kg: 2 }),
      makeEntry({ date: '2026-06-19', co2Kg: 3 }),
    ];
    const result = getDailyTotals(entries);
    expect(result).toEqual([
      { date: '2026-06-19', total: 3 },
      { date: '2026-06-20', total: 3 },
    ]);
  });

  it('sorts by date ascending', () => {
    const entries = [
      makeEntry({ date: '2026-06-22', co2Kg: 1 }),
      makeEntry({ date: '2026-06-20', co2Kg: 2 }),
    ];
    const result = getDailyTotals(entries);
    expect(result[0].date).toBe('2026-06-20');
    expect(result[1].date).toBe('2026-06-22');
  });

  it('returns empty array for empty entries', () => {
    expect(getDailyTotals([])).toEqual([]);
  });
});

describe('getCategoryBreakdown', () => {
  it('computes percentages correctly', () => {
    const entries = [
      makeEntry({ category: 'transport', co2Kg: 3 }),
      makeEntry({ category: 'food', co2Kg: 7 }),
    ];
    const result = getCategoryBreakdown(entries);
    const transport = result.find((r) => r.category === 'transport');
    const food = result.find((r) => r.category === 'food');
    expect(transport?.percentage).toBe(30);
    expect(food?.percentage).toBe(70);
  });

  it('handles single category', () => {
    const entries = [makeEntry({ category: 'energy', co2Kg: 5 })];
    const result = getCategoryBreakdown(entries);
    expect(result).toHaveLength(1);
    expect(result[0].percentage).toBe(100);
  });

  it('returns empty for no entries', () => {
    expect(getCategoryBreakdown([])).toEqual([]);
  });

  it('rounds totals to 3 decimal places', () => {
    const entries = [
      makeEntry({ category: 'transport', co2Kg: 1.1111 }),
      makeEntry({ category: 'transport', co2Kg: 2.2222 }),
    ];
    const result = getCategoryBreakdown(entries);
    expect(result[0].total).toBe(3.333);
  });
});

describe('getWeeklyAverage', () => {
  it('calculates average over 7 days for recent entries', () => {
    const today = new Date().toISOString().slice(0, 10);
    const entries = [makeEntry({ date: today, co2Kg: 7 })];
    const result = getWeeklyAverage(entries);
    expect(result).toBe(1);
  });

  it('returns 0 with no entries', () => {
    expect(getWeeklyAverage([])).toBe(0);
  });

  it('excludes entries older than 7 days', () => {
    const entries = [makeEntry({ date: '2020-01-01', co2Kg: 100 })];
    expect(getWeeklyAverage(entries)).toBe(0);
  });
});

describe('getMonthlyTotal', () => {
  it('sums entries for the current month', () => {
    const monthPrefix = new Date().toISOString().slice(0, 7);
    const entries = [
      makeEntry({ date: `${monthPrefix}-01`, co2Kg: 5 }),
      makeEntry({ date: `${monthPrefix}-15`, co2Kg: 3 }),
    ];
    expect(getMonthlyTotal(entries)).toBe(8);
  });

  it('excludes entries from other months', () => {
    const entries = [makeEntry({ date: '2020-01-01', co2Kg: 10 })];
    expect(getMonthlyTotal(entries)).toBe(0);
  });
});

describe('getTrend', () => {
  it('returns stable when no entries exist', () => {
    expect(getTrend([])).toBe('stable');
  });

  it('returns increasing when only this week has entries', () => {
    const today = new Date().toISOString().slice(0, 10);
    const entries = [makeEntry({ date: today, co2Kg: 10 })];
    expect(getTrend(entries)).toBe('increasing');
  });

  it('returns improving when this week is much less than last week', () => {
    const now = new Date();
    const thisWeekDate = new Date(now);
    thisWeekDate.setDate(thisWeekDate.getDate() - 1);
    const lastWeekDate = new Date(now);
    lastWeekDate.setDate(lastWeekDate.getDate() - 10);

    const entries = [
      makeEntry({ date: thisWeekDate.toISOString().slice(0, 10), co2Kg: 1 }),
      makeEntry({ date: lastWeekDate.toISOString().slice(0, 10), co2Kg: 20 }),
    ];
    expect(getTrend(entries)).toBe('improving');
  });

  it('returns stable when weeks are similar', () => {
    const now = new Date();
    const thisWeekDate = new Date(now);
    thisWeekDate.setDate(thisWeekDate.getDate() - 1);
    const lastWeekDate = new Date(now);
    lastWeekDate.setDate(lastWeekDate.getDate() - 10);

    const entries = [
      makeEntry({ date: thisWeekDate.toISOString().slice(0, 10), co2Kg: 10 }),
      makeEntry({ date: lastWeekDate.toISOString().slice(0, 10), co2Kg: 10 }),
    ];
    expect(getTrend(entries)).toBe('stable');
  });
});

describe('generateId', () => {
  it('returns a string', () => {
    expect(typeof generateId()).toBe('string');
  });

  it('returns unique values on successive calls', () => {
    const ids = new Set(Array.from({ length: 50 }, () => generateId()));
    expect(ids.size).toBe(50);
  });
});
