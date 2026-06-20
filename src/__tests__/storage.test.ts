import { describe, it, expect, beforeEach } from 'vitest';
import { loadEntries, saveEntries, loadGoal, saveGoal } from '../utils/storage';
import type { ActivityEntry, UserGoal } from '../types';

function validEntry(): ActivityEntry {
  return {
    id: 'abc',
    category: 'transport',
    activity: 'car',
    value: 10,
    unit: 'km',
    co2Kg: 2.1,
    date: '2026-06-20',
  };
}

beforeEach(() => {
  localStorage.clear();
});

describe('loadEntries', () => {
  it('returns empty array when localStorage is empty', () => {
    expect(loadEntries()).toEqual([]);
  });

  it('returns empty array for invalid JSON', () => {
    localStorage.setItem('carbon-entries', 'not json');
    expect(loadEntries()).toEqual([]);
  });

  it('returns empty array when stored value is not an array', () => {
    localStorage.setItem('carbon-entries', '{"foo":"bar"}');
    expect(loadEntries()).toEqual([]);
  });

  it('filters out entries with missing id', () => {
    const bad = { ...validEntry(), id: '' };
    localStorage.setItem('carbon-entries', JSON.stringify([bad]));
    expect(loadEntries()).toEqual([]);
  });

  it('filters out entries with invalid category', () => {
    const bad = { ...validEntry(), category: 'invalid' };
    localStorage.setItem('carbon-entries', JSON.stringify([bad]));
    expect(loadEntries()).toEqual([]);
  });

  it('filters out entries with NaN co2Kg', () => {
    const bad = { ...validEntry(), co2Kg: NaN };
    localStorage.setItem('carbon-entries', JSON.stringify([bad]));
    expect(loadEntries()).toEqual([]);
  });

  it('filters out entries with negative value', () => {
    const bad = { ...validEntry(), value: -5 };
    localStorage.setItem('carbon-entries', JSON.stringify([bad]));
    expect(loadEntries()).toEqual([]);
  });

  it('returns valid entries and filters invalid ones', () => {
    const good = validEntry();
    const bad = { ...validEntry(), id: '' };
    localStorage.setItem('carbon-entries', JSON.stringify([good, bad]));
    expect(loadEntries()).toEqual([good]);
  });
});

describe('saveEntries', () => {
  it('stores entries as JSON', () => {
    const entries = [validEntry()];
    saveEntries(entries);
    expect(JSON.parse(localStorage.getItem('carbon-entries')!)).toEqual(entries);
  });
});

describe('loadGoal', () => {
  it('returns defaults when empty', () => {
    expect(loadGoal()).toEqual({ dailyLimitKg: 10, weeklyLimitKg: 70 });
  });

  it('returns defaults for invalid JSON', () => {
    localStorage.setItem('carbon-goal', 'bad');
    expect(loadGoal()).toEqual({ dailyLimitKg: 10, weeklyLimitKg: 70 });
  });

  it('uses default for invalid dailyLimitKg', () => {
    localStorage.setItem('carbon-goal', JSON.stringify({ dailyLimitKg: -1, weeklyLimitKg: 50 }));
    const goal = loadGoal();
    expect(goal.dailyLimitKg).toBe(10);
    expect(goal.weeklyLimitKg).toBe(50);
  });

  it('uses default for NaN weeklyLimitKg', () => {
    localStorage.setItem('carbon-goal', JSON.stringify({ dailyLimitKg: 5, weeklyLimitKg: NaN }));
    const goal = loadGoal();
    expect(goal.weeklyLimitKg).toBe(70);
  });
});

describe('saveGoal', () => {
  it('stores goal as JSON', () => {
    const goal: UserGoal = { dailyLimitKg: 5, weeklyLimitKg: 35 };
    saveGoal(goal);
    expect(JSON.parse(localStorage.getItem('carbon-goal')!)).toEqual(goal);
  });
});

describe('round-trip', () => {
  it('save then load entries preserves data', () => {
    const entries = [validEntry()];
    saveEntries(entries);
    expect(loadEntries()).toEqual(entries);
  });

  it('save then load goal preserves data', () => {
    const goal: UserGoal = { dailyLimitKg: 8, weeklyLimitKg: 56 };
    saveGoal(goal);
    expect(loadGoal()).toEqual(goal);
  });
});
