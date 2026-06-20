import { useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import type { ActivityCategory, DailyTotal, CategoryBreakdown, UserGoal } from '../types';
import { loadEntries, saveEntries, loadGoal, saveGoal } from '../utils/storage';
import {
  calculateCO2,
  getDailyTotals,
  getCategoryBreakdown,
  getWeeklyAverage,
  getMonthlyTotal,
  getTrend,
  generateId,
} from '../utils/calculations';
import { CarbonContext, type CarbonContextValue } from './carbonContextDef';

export function CarbonProvider({ children }: { children: ReactNode }): ReactNode {
  const [entries, setEntries] = useState(() => loadEntries());
  const [goal, setGoal] = useState(() => loadGoal());

  useEffect(() => { saveEntries(entries); }, [entries]);
  useEffect(() => { saveGoal(goal); }, [goal]);

  const addEntry = useCallback(
    (category: ActivityCategory, activity: string, value: number, _unit: string): void => {
      setEntries((prev) => [{
        id: generateId(), category, activity, value, unit: _unit,
        co2Kg: calculateCO2(activity, value),
        date: new Date().toISOString().split('T')[0],
      }, ...prev]);
    }, [],
  );

  const deleteEntry = useCallback((id: string): void => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateGoal = useCallback((newGoal: UserGoal): void => {
    setGoal(newGoal);
  }, []);

  const dailyTotals = useMemo((): DailyTotal[] => getDailyTotals(entries), [entries]);
  const categoryBreakdown = useMemo((): CategoryBreakdown[] => getCategoryBreakdown(entries), [entries]);
  const weeklyAverage = useMemo((): number => getWeeklyAverage(entries), [entries]);
  const monthlyTotal = useMemo((): number => getMonthlyTotal(entries), [entries]);
  const trend = useMemo((): 'improving' | 'stable' | 'increasing' => getTrend(entries), [entries]);
  const todayTotal = useMemo((): number => {
    const today = new Date().toISOString().split('T')[0];
    return entries.filter((e) => e.date === today).reduce((sum, e) => sum + e.co2Kg, 0);
  }, [entries]);

  const value = useMemo((): CarbonContextValue => ({
    entries, goal, addEntry, deleteEntry, updateGoal,
    dailyTotals, categoryBreakdown, weeklyAverage, monthlyTotal, trend, todayTotal,
  }), [entries, goal, addEntry, deleteEntry, updateGoal, dailyTotals, categoryBreakdown, weeklyAverage, monthlyTotal, trend, todayTotal]);

  return <CarbonContext.Provider value={value}>{children}</CarbonContext.Provider>;
}
