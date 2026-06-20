import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useCarbonContext } from '../context/useCarbonContext';
import { CATEGORY_COLORS } from '../constants/emissions';
import { CHART_HEIGHT, RECENT_DAYS } from '../constants/limits';

function EmissionChartInner() {
  const { dailyTotals } = useCarbonContext();

  const recentTotals = dailyTotals.slice(-RECENT_DAYS);

  return (
    <div
      className="card chart-card"
      role="img"
      aria-label={`Daily carbon emissions chart showing last ${RECENT_DAYS} days`}
    >
      <h2>Daily Emissions (Last {RECENT_DAYS} Days)</h2>
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <BarChart data={recentTotals}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(d: string) => d.slice(5)} />
          <YAxis unit=" kg" />
          <Tooltip />
          <Bar dataKey="total" fill={CATEGORY_COLORS.transport} name="CO2 (kg)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export const EmissionChart = React.memo(EmissionChartInner);
