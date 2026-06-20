import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { CarbonProvider } from '../context/CarbonContext';
import { useCarbonContext } from '../context/useCarbonContext';

function wrapper({ children }: { children: ReactNode }) {
  return <CarbonProvider>{children}</CarbonProvider>;
}

function ConsumerComponent() {
  const ctx = useCarbonContext();
  return (
    <div>
      <span data-testid="count">{ctx.entries.length}</span>
      <span data-testid="daily">{ctx.goal.dailyLimitKg}</span>
      <span data-testid="weekly">{ctx.goal.weeklyLimitKg}</span>
      <span data-testid="today">{ctx.todayTotal}</span>
      <span data-testid="trend">{ctx.trend}</span>
      <button onClick={() => ctx.addEntry('transport', 'car', 10, 'km')}>add</button>
      <button onClick={() => ctx.deleteEntry('delete-me')}>delete</button>
      <button onClick={() => ctx.updateGoal({ dailyLimitKg: 5, weeklyLimitKg: 35 })}>goal</button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('CarbonContext', () => {
  it('provides entries array', () => {
    render(<ConsumerComponent />, { wrapper });
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('provides default goal', () => {
    render(<ConsumerComponent />, { wrapper });
    expect(screen.getByTestId('daily').textContent).toBe('10');
    expect(screen.getByTestId('weekly').textContent).toBe('70');
  });

  it('addEntry adds to entries', () => {
    render(<ConsumerComponent />, { wrapper });
    act(() => {
      screen.getByText('add').click();
    });
    expect(screen.getByTestId('count').textContent).toBe('1');
  });

  it('deleteEntry removes matching entry', () => {
    localStorage.setItem('carbon-entries', JSON.stringify([
      { id: 'delete-me', category: 'transport', activity: 'car', value: 10, unit: 'km', co2Kg: 2.1, date: '2026-06-20' },
      { id: 'keep-me', category: 'food', activity: 'beef', value: 1, unit: 'serving', co2Kg: 6.61, date: '2026-06-20' },
    ]));
    render(<ConsumerComponent />, { wrapper });
    expect(screen.getByTestId('count').textContent).toBe('2');
    act(() => {
      screen.getByText('delete').click();
    });
    expect(screen.getByTestId('count').textContent).toBe('1');
  });

  it('updateGoal updates goal', () => {
    render(<ConsumerComponent />, { wrapper });
    act(() => {
      screen.getByText('goal').click();
    });
    expect(screen.getByTestId('daily').textContent).toBe('5');
    expect(screen.getByTestId('weekly').textContent).toBe('35');
  });

  it('todayTotal is calculated for today entries', () => {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('carbon-entries', JSON.stringify([
      { id: '1', category: 'transport', activity: 'car', value: 10, unit: 'km', co2Kg: 2.1, date: today },
      { id: '2', category: 'transport', activity: 'car', value: 5, unit: 'km', co2Kg: 1.05, date: today },
    ]));
    render(<ConsumerComponent />, { wrapper });
    expect(Number(screen.getByTestId('today').textContent)).toBeCloseTo(3.15);
  });

  it('trend defaults to stable with no entries', () => {
    render(<ConsumerComponent />, { wrapper });
    expect(screen.getByTestId('trend').textContent).toBe('stable');
  });

  it('useCarbonContext throws outside provider', () => {
    expect(() => {
      renderHook(() => useCarbonContext());
    }).toThrow('useCarbonContext must be used within a CarbonProvider');
  });
});
