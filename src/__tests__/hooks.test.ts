import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilteredEntries } from '../hooks/useFilteredEntries';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { ActivityEntry } from '../types';

function makeEntry(overrides: Partial<ActivityEntry> = {}): ActivityEntry {
  return {
    id: '1',
    category: 'transport',
    activity: 'car',
    value: 10,
    unit: 'km',
    co2Kg: 2.1,
    date: new Date().toISOString().slice(0, 10),
    ...overrides,
  };
}

describe('useFilteredEntries', () => {
  const today = new Date().toISOString().slice(0, 10);
  const entries: ActivityEntry[] = [
    makeEntry({ id: '1', category: 'transport', date: today }),
    makeEntry({ id: '2', category: 'food', date: today }),
    makeEntry({ id: '3', category: 'transport', date: '2020-01-01' }),
  ];

  it('returns all entries with "all" category and large days', () => {
    const { result } = renderHook(() => useFilteredEntries(entries, 'all', 9999));
    expect(result.current).toHaveLength(3);
  });

  it('filters by category', () => {
    const { result } = renderHook(() => useFilteredEntries(entries, 'food', 9999));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].category).toBe('food');
  });

  it('filters by date range', () => {
    const { result } = renderHook(() => useFilteredEntries(entries, 'all', 7));
    expect(result.current).toHaveLength(2);
  });

  it('filters by both category and date', () => {
    const { result } = renderHook(() => useFilteredEntries(entries, 'transport', 7));
    expect(result.current).toHaveLength(1);
  });

  it('handles empty array', () => {
    const { result } = renderHook(() => useFilteredEntries([], 'all', 30));
    expect(result.current).toEqual([]);
  });
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns default value when nothing stored', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 42));
    expect(result.current[0]).toBe(42);
  });

  it('returns stored value when present', () => {
    localStorage.setItem('test-key', JSON.stringify('hello'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('hello');
  });

  it('persists value to localStorage on set', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    act(() => {
      result.current[1]('updated');
    });
    expect(result.current[0]).toBe('updated');
    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe('updated');
  });

  it('returns default for invalid stored JSON', () => {
    localStorage.setItem('test-key', 'not-json');
    const { result } = renderHook(() => useLocalStorage('test-key', 99));
    expect(result.current[0]).toBe(99);
  });

  it('handles object values', () => {
    const { result } = renderHook(() => useLocalStorage('obj-key', { a: 1 }));
    act(() => {
      result.current[1]({ a: 2 });
    });
    expect(result.current[0]).toEqual({ a: 2 });
  });
});
