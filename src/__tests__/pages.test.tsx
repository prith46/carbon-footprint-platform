import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import { CarbonProvider } from '../context/CarbonContext';
import { AnnouncerProvider } from '../context/AnnouncerProvider';
import { Dashboard } from '../pages/Dashboard';
import { TrackPage } from '../pages/TrackPage';
import { InsightsPage } from '../pages/InsightsPage';
import { ProgressPage } from '../pages/ProgressPage';

vi.mock('recharts', () => ({
  BarChart: ({ children }: { children: ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  CartesianGrid: () => null,
  ResponsiveContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PieChart: ({ children }: { children: ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => null,
  Cell: () => null,
  Legend: () => null,
}));

function AllProviders({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter>
      <CarbonProvider>
        <AnnouncerProvider>{children}</AnnouncerProvider>
      </CarbonProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('Dashboard', () => {
  it('shows empty state when no entries', () => {
    render(<Dashboard />, { wrapper: AllProviders });
    expect(screen.getByText('Welcome to CarbonTrack')).toBeDefined();
  });

  it('shows stat cards when entries exist', () => {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('carbon-entries', JSON.stringify([
      { id: '1', category: 'transport', activity: 'car', value: 10, unit: 'km', co2Kg: 2.1, date: today },
    ]));
    render(<Dashboard />, { wrapper: AllProviders });
    expect(screen.getByText("Today's Emissions")).toBeDefined();
    expect(screen.getByText('Weekly Average')).toBeDefined();
    expect(screen.getByText('Monthly Total')).toBeDefined();
  });

  it('renders charts when entries exist', () => {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('carbon-entries', JSON.stringify([
      { id: '1', category: 'transport', activity: 'car', value: 10, unit: 'km', co2Kg: 2.1, date: today },
    ]));
    render(<Dashboard />, { wrapper: AllProviders });
    expect(screen.getByTestId('bar-chart')).toBeDefined();
    expect(screen.getByTestId('pie-chart')).toBeDefined();
  });
});

describe('TrackPage', () => {
  it('renders form and list', () => {
    render(<TrackPage />, { wrapper: AllProviders });
    expect(screen.getByText('Track Your Emissions')).toBeDefined();
    expect(screen.getByText('Log Activity')).toBeDefined();
    expect(screen.getByText('No entries yet')).toBeDefined();
  });

  it('renders page subtitle', () => {
    render(<TrackPage />, { wrapper: AllProviders });
    expect(screen.getByText(/Log your daily activities/)).toBeDefined();
  });
});

describe('InsightsPage', () => {
  it('renders tips', () => {
    render(<InsightsPage />, { wrapper: AllProviders });
    expect(screen.getByText('Insights & Tips')).toBeDefined();
    expect(screen.getByText('Switch to public transit')).toBeDefined();
  });

  it('renders category filter', () => {
    render(<InsightsPage />, { wrapper: AllProviders });
    expect(screen.getByLabelText('Category')).toBeDefined();
  });

  it('renders difficulty filter', () => {
    render(<InsightsPage />, { wrapper: AllProviders });
    expect(screen.getByLabelText('Difficulty')).toBeDefined();
  });

  it('filters tips by category', () => {
    render(<InsightsPage />, { wrapper: AllProviders });
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'energy' } });
    expect(screen.getByText('Switch to LED lighting')).toBeDefined();
    expect(screen.queryByText('Switch to public transit')).toBeNull();
  });

  it('filters tips by difficulty', () => {
    render(<InsightsPage />, { wrapper: AllProviders });
    fireEvent.change(screen.getByLabelText('Difficulty'), { target: { value: 'hard' } });
    expect(screen.getByText('Switch to a green energy provider')).toBeDefined();
    expect(screen.queryByText('Switch to public transit')).toBeNull();
  });

  it('renders GoalSetter', () => {
    render(<InsightsPage />, { wrapper: AllProviders });
    expect(screen.getByText('Set Your Goals')).toBeDefined();
  });
});

describe('ProgressPage', () => {
  it('renders trend banner', () => {
    render(<ProgressPage />, { wrapper: AllProviders });
    expect(screen.getByText(/Trend:/)).toBeDefined();
  });

  it('renders progress bars with goal', () => {
    render(<ProgressPage />, { wrapper: AllProviders });
    expect(screen.getByText('Goal Progress')).toBeDefined();
    expect(screen.getByText('Daily Average')).toBeDefined();
    expect(screen.getByText('Weekly Total')).toBeDefined();
  });

  it('renders monthly note', () => {
    render(<ProgressPage />, { wrapper: AllProviders });
    expect(screen.getByText(/Monthly total so far/)).toBeDefined();
  });

  it('renders progress bar roles', () => {
    const { container } = render(<ProgressPage />, { wrapper: AllProviders });
    const bars = container.querySelectorAll('[role="progressbar"]');
    expect(bars.length).toBe(2);
  });
});
