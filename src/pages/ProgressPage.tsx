import { useMemo } from 'react';
import { useCarbonContext } from '../context/useCarbonContext';
import { EmissionChart } from '../components/EmissionChart';

const TREND_MESSAGES = {
  improving: 'Great work! Your emissions are trending downward. Keep it up!',
  stable: 'Your emissions are holding steady. Look for new ways to reduce.',
  increasing: 'Your emissions are rising. Check your insights for reduction tips.',
} as const;

export function ProgressPage() {
  const { trend, goal, weeklyAverage, monthlyTotal } = useCarbonContext();

  const dailyPercent = useMemo(
    () => goal.dailyLimitKg > 0 ? Math.min((weeklyAverage / goal.dailyLimitKg) * 100, 100) : 0,
    [weeklyAverage, goal.dailyLimitKg],
  );

  const weeklyTotal = useMemo(() => weeklyAverage * 7, [weeklyAverage]);

  const weeklyPercent = useMemo(
    () => goal.weeklyLimitKg > 0 ? Math.min((weeklyTotal / goal.weeklyLimitKg) * 100, 100) : 0,
    [weeklyTotal, goal.weeklyLimitKg],
  );

  return (
    <div className="page progress-page">
      <h1>Your Progress</h1>
      <div className="trend-banner card">
        <h2>Trend: {trend.charAt(0).toUpperCase() + trend.slice(1)}</h2>
        <p>{TREND_MESSAGES[trend]}</p>
      </div>
      <section className="chart-section">
        <h2>Last 30 Days</h2>
        <EmissionChart />
      </section>
      <section className="goal-progress card">
        <h2>Goal Progress</h2>
        {goal.dailyLimitKg > 0 ? (
          <>
            <ProgressBar
              label="Daily Average"
              current={weeklyAverage}
              limit={goal.dailyLimitKg}
              percent={dailyPercent}
              unit="kg CO2"
            />
            <ProgressBar
              label="Weekly Total"
              current={weeklyTotal}
              limit={goal.weeklyLimitKg}
              percent={weeklyPercent}
              unit="kg CO2"
            />
            <p className="monthly-note">
              Monthly total so far: <strong>{monthlyTotal.toFixed(1)} kg CO2</strong>
            </p>
          </>
        ) : (
          <p>Set a goal on the Insights page to track your progress here.</p>
        )}
      </section>
    </div>
  );
}

interface ProgressBarProps {
  label: string;
  current: number;
  limit: number;
  percent: number;
  unit: string;
}

function ProgressBar({ label, current, limit, percent, unit }: ProgressBarProps) {
  const isOver = current > limit;
  return (
    <div className="progress-item">
      <div className="progress-label">
        <span>{label}</span>
        <span>
          {current.toFixed(1)} / {limit.toFixed(1)} {unit}
        </span>
      </div>
      <div className="progress-bar-track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`progress-bar-fill ${isOver ? 'over-limit' : ''}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
