import { describe, it, expect } from 'vitest';
import { ALL_TIME_DAYS, ENTRY_RANGE_OPTIONS, isCategoryFilter, isRangeDays } from '../constants/filters';

describe('filter constants and guards', () => {
  it('exposes range options including all time', () => {
    expect(ENTRY_RANGE_OPTIONS.some((o) => o.days === ALL_TIME_DAYS)).toBe(true);
    expect(ENTRY_RANGE_OPTIONS.length).toBeGreaterThanOrEqual(3);
  });

  it('accepts valid category filters', () => {
    expect(isCategoryFilter('all')).toBe(true);
    expect(isCategoryFilter('transport')).toBe(true);
    expect(isCategoryFilter('food')).toBe(true);
  });

  it('rejects invalid category filters', () => {
    expect(isCategoryFilter('hacked')).toBe(false);
    expect(isCategoryFilter(42)).toBe(false);
    expect(isCategoryFilter(null)).toBe(false);
    expect(isCategoryFilter(undefined)).toBe(false);
  });

  it('accepts valid range day counts', () => {
    expect(isRangeDays(ALL_TIME_DAYS)).toBe(true);
    expect(isRangeDays(7)).toBe(true);
  });

  it('rejects invalid range day counts', () => {
    expect(isRangeDays(999)).toBe(false);
    expect(isRangeDays('7')).toBe(false);
    expect(isRangeDays(NaN)).toBe(false);
  });
});
