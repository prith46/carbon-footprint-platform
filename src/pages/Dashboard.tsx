import { useCarbonContext } from '../context/useCarbonContext';
import { StatCard } from '../components/StatCard';
import { EmissionChart } from '../components/EmissionChart';
import { CategoryPieChart } from '../components/CategoryPieChart';
import { SmartRecommendations } from '../components/SmartRecommendations';

const TREND_LABELS = {
  improving: 'Improving',
  stable: 'Stable',
  increasing: 'Increasing',
} as const;

const TREND_ICONS = {
  improving: '↓',
  stable: '→',
  increasing: '↑',
} as const;

export function Dashboard() {
  const { entries, todayTotal, weeklyAverage, monthlyTotal, trend } =
    useCarbonContext();

  if (entries.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="page dashboard-page">
      <h1>Dashboard</h1>
      <div className="stat-grid">
        <StatCard title="Today's Emissions" value={todayTotal.toFixed(1)} unit="kg CO2" />
        <StatCard title="Weekly Average" value={weeklyAverage.toFixed(1)} unit="kg CO2/day" />
        <StatCard title="Monthly Total" value={monthlyTotal.toFixed(1)} unit="kg CO2" />
        <StatCard
          title="Trend"
          value={`${TREND_ICONS[trend]} ${TREND_LABELS[trend]}`}
        />
      </div>
      <SmartRecommendations />
      <section className="chart-section">
        <EmissionChart />
      </section>
      <section className="chart-section">
        <CategoryPieChart />
      </section>
      <section className="info-section card">
        <h2>Understanding Your Carbon Footprint</h2>
        <p>
          Your carbon footprint is the total amount of greenhouse gases produced by your
          daily activities, measured in kilograms of CO2 equivalent. The average person
          produces about 16 kg of CO2 per day. By tracking your emissions, you can
          identify your biggest sources and take targeted action to reduce your impact.
        </p>
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="page dashboard-page">
      <h1>Dashboard</h1>
      <div className="empty-state card">
        <h2>Welcome to CarbonTrack</h2>
        <p>
          Start by logging your first activity to see your carbon footprint
          data here. Head over to the <strong>Track</strong> page to begin.
        </p>
      </div>
    </div>
  );
}
