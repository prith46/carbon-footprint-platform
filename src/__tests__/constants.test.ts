import { describe, it, expect } from 'vitest';
import {
  EMISSION_FACTORS,
  ACTIVITY_OPTIONS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from '../constants/emissions';
import { REDUCTION_TIPS } from '../constants/tips';
import type { ActivityCategory } from '../types';

const ALL_CATEGORIES: ActivityCategory[] = ['transport', 'food', 'energy', 'shopping'];

describe('EMISSION_FACTORS', () => {
  it('contains known transport activities', () => {
    expect(EMISSION_FACTORS['car']).toBeDefined();
    expect(EMISSION_FACTORS['bus']).toBeDefined();
    expect(EMISSION_FACTORS['train']).toBeDefined();
  });

  it('contains food activities', () => {
    expect(EMISSION_FACTORS['beef']).toBeDefined();
    expect(EMISSION_FACTORS['chicken']).toBeDefined();
  });

  it('all factors are non-negative numbers', () => {
    for (const [, factor] of Object.entries(EMISSION_FACTORS)) {
      expect(typeof factor).toBe('number');
      expect(factor).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('ACTIVITY_OPTIONS', () => {
  it('all options have required fields', () => {
    for (const opt of ACTIVITY_OPTIONS) {
      expect(opt.category).toBeDefined();
      expect(opt.activity).toBeDefined();
      expect(opt.unit).toBeDefined();
      expect(typeof opt.factor).toBe('number');
    }
  });

  it('covers all categories', () => {
    const categories = new Set(ACTIVITY_OPTIONS.map((o) => o.category));
    for (const cat of ALL_CATEGORIES) {
      expect(categories.has(cat)).toBe(true);
    }
  });

  it('factors match EMISSION_FACTORS', () => {
    for (const opt of ACTIVITY_OPTIONS) {
      expect(opt.factor).toBe(EMISSION_FACTORS[opt.activity]);
    }
  });
});

describe('CATEGORY_LABELS', () => {
  it('covers all categories', () => {
    for (const cat of ALL_CATEGORIES) {
      expect(typeof CATEGORY_LABELS[cat]).toBe('string');
      expect(CATEGORY_LABELS[cat].length).toBeGreaterThan(0);
    }
  });
});

describe('CATEGORY_COLORS', () => {
  it('covers all categories with hex colors', () => {
    for (const cat of ALL_CATEGORIES) {
      expect(CATEGORY_COLORS[cat]).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});

describe('REDUCTION_TIPS', () => {
  it('has at least one tip', () => {
    expect(REDUCTION_TIPS.length).toBeGreaterThan(0);
  });

  it('all tips have valid structure', () => {
    for (const tip of REDUCTION_TIPS) {
      expect(tip.id).toBeDefined();
      expect(ALL_CATEGORIES).toContain(tip.category);
      expect(tip.title.length).toBeGreaterThan(0);
      expect(tip.description.length).toBeGreaterThan(0);
      expect(tip.potentialSavingKg).toBeGreaterThan(0);
      expect(['easy', 'medium', 'hard']).toContain(tip.difficulty);
    }
  });

  it('all tip ids are unique', () => {
    const ids = REDUCTION_TIPS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
