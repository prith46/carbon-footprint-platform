import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import { CarbonProvider } from '../context/CarbonContext';
import { StatCard } from '../components/StatCard';
import { TipCard } from '../components/TipCard';
import { ActivityForm } from '../components/ActivityForm';
import { EntryList } from '../components/EntryList';
import { GoalSetter } from '../components/GoalSetter';
import { Layout } from '../components/Layout';
import type { ReductionTip } from '../types';

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
      <CarbonProvider>{children}</CarbonProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('StatCard', () => {
  it('renders title and value', () => {
    render(<StatCard title="Test Stat" value="42" />);
    expect(screen.getByText('Test Stat')).toBeDefined();
    expect(screen.getByText('42')).toBeDefined();
  });

  it('renders unit when provided', () => {
    render(<StatCard title="Stat" value="10" unit="kg" />);
    expect(screen.getByText('kg')).toBeDefined();
  });

  it('renders trend up arrow', () => {
    const { container } = render(<StatCard title="Stat" value="5" trend="up" />);
    expect(container.querySelector('.trend-up')).not.toBeNull();
  });

  it('renders trend down arrow', () => {
    const { container } = render(<StatCard title="Stat" value="5" trend="down" />);
    expect(container.querySelector('.trend-down')).not.toBeNull();
  });

  it('renders neutral trend', () => {
    const { container } = render(<StatCard title="Stat" value="5" trend="neutral" />);
    expect(container.querySelector('.trend-neutral')).not.toBeNull();
  });

  it('does not render trend when not provided', () => {
    const { container } = render(<StatCard title="Stat" value="5" />);
    expect(container.querySelector('.stat-trend')).toBeNull();
  });
});

describe('TipCard', () => {
  const tip: ReductionTip = {
    id: 'tip-1',
    category: 'transport',
    title: 'Take the bus',
    description: 'Buses are greener than cars.',
    potentialSavingKg: 4.5,
    difficulty: 'easy',
  };

  it('renders tip title and description', () => {
    render(<TipCard tip={tip} />);
    expect(screen.getByText('Take the bus')).toBeDefined();
    expect(screen.getByText('Buses are greener than cars.')).toBeDefined();
  });

  it('renders category badge', () => {
    render(<TipCard tip={tip} />);
    expect(screen.getByText('Transport')).toBeDefined();
  });

  it('renders difficulty badge', () => {
    render(<TipCard tip={tip} />);
    expect(screen.getByText('easy')).toBeDefined();
  });

  it('renders potential saving', () => {
    render(<TipCard tip={tip} />);
    expect(screen.getByText('4.5 kg CO2')).toBeDefined();
  });
});

describe('ActivityForm', () => {
  it('renders category select with label', () => {
    render(<ActivityForm />, { wrapper: AllProviders });
    expect(screen.getByLabelText('Category')).toBeDefined();
  });

  it('renders activity select with label', () => {
    render(<ActivityForm />, { wrapper: AllProviders });
    expect(screen.getByLabelText('Activity')).toBeDefined();
  });

  it('renders amount input', () => {
    render(<ActivityForm />, { wrapper: AllProviders });
    expect(screen.getByLabelText(/Amount/)).toBeDefined();
  });

  it('renders submit button', () => {
    render(<ActivityForm />, { wrapper: AllProviders });
    expect(screen.getByText('Add Entry')).toBeDefined();
  });

  it('submits correctly with valid input', () => {
    render(<ActivityForm />, { wrapper: AllProviders });
    fireEvent.change(screen.getByLabelText('Activity'), { target: { value: 'car' } });
    fireEvent.change(screen.getByLabelText(/Amount/), { target: { value: '50' } });
    fireEvent.click(screen.getByText('Add Entry'));
    expect(screen.getByText(/Added 50 km of car/)).toBeDefined();
  });
});

describe('EntryList', () => {
  it('shows empty message when no entries', () => {
    render(<EntryList />, { wrapper: AllProviders });
    expect(screen.getByText('No entries yet')).toBeDefined();
  });

  it('shows entries in a table', () => {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('carbon-entries', JSON.stringify([
      { id: '1', category: 'transport', activity: 'car', value: 10, unit: 'km', co2Kg: 2.1, date: today },
    ]));
    render(<EntryList />, { wrapper: AllProviders });
    expect(screen.getByText('car')).toBeDefined();
    expect(screen.getByText('2.10')).toBeDefined();
  });

  it('has a delete button for each entry', () => {
    localStorage.setItem('carbon-entries', JSON.stringify([
      { id: '1', category: 'transport', activity: 'car', value: 10, unit: 'km', co2Kg: 2.1, date: '2026-06-20' },
    ]));
    render(<EntryList />, { wrapper: AllProviders });
    expect(screen.getByLabelText('Delete entry for car')).toBeDefined();
  });

  it('delete button removes entry', () => {
    localStorage.setItem('carbon-entries', JSON.stringify([
      { id: '1', category: 'transport', activity: 'car', value: 10, unit: 'km', co2Kg: 2.1, date: '2026-06-20' },
    ]));
    render(<EntryList />, { wrapper: AllProviders });
    act(() => {
      screen.getByLabelText('Delete entry for car').click();
    });
    expect(screen.getByText('No entries yet')).toBeDefined();
  });

  it('has category filter', () => {
    render(<EntryList />, { wrapper: AllProviders });
    expect(screen.getByLabelText('Filter by category')).toBeDefined();
  });
});

describe('GoalSetter', () => {
  it('renders with current goal values', () => {
    render(<GoalSetter />, { wrapper: AllProviders });
    expect(screen.getByText(/10 kg\/day/)).toBeDefined();
    expect(screen.getByText(/70 kg\/week/)).toBeDefined();
  });

  it('renders daily and weekly inputs', () => {
    render(<GoalSetter />, { wrapper: AllProviders });
    expect(screen.getByLabelText('Daily CO2 limit (kg)')).toBeDefined();
    expect(screen.getByLabelText('Weekly CO2 limit (kg)')).toBeDefined();
  });

  it('shows confirmation on save', () => {
    render(<GoalSetter />, { wrapper: AllProviders });
    fireEvent.change(screen.getByLabelText('Daily CO2 limit (kg)'), { target: { value: '8' } });
    fireEvent.change(screen.getByLabelText('Weekly CO2 limit (kg)'), { target: { value: '56' } });
    fireEvent.click(screen.getByText('Save Goals'));
    expect(screen.getByText('Goals updated successfully')).toBeDefined();
  });
});

describe('Layout', () => {
  it('renders nav links', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    );
    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('Track')).toBeDefined();
    expect(screen.getByText('Insights')).toBeDefined();
    expect(screen.getByText('Progress')).toBeDefined();
  });

  it('has skip-to-content link', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    );
    expect(screen.getByText('Skip to main content')).toBeDefined();
  });

  it('has toggle menu button', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Toggle navigation menu')).toBeDefined();
  });

  it('renders app name', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    );
    expect(screen.getByText('CarbonTrack')).toBeDefined();
  });
});
