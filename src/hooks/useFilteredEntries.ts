import { useMemo } from 'react';
import type { ActivityEntry, ActivityCategory } from '../types';

export function useFilteredEntries(
  entries: ActivityEntry[],
  category: ActivityCategory | 'all',
  days: number,
): ActivityEntry[] {
  return useMemo((): ActivityEntry[] => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().split('T')[0];

    return entries.filter((entry) => {
      if (category !== 'all' && entry.category !== category) {
        return false;
      }
      return entry.date >= cutoffStr;
    });
  }, [entries, category, days]);
}
