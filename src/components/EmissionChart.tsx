import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useCarbonContext } from '../context/useCarbonContext';
import { CATEGORY_COLORS } from '../constants/emissions';

function EmissionChartInner() {
  const { dailyTotals } = useCarbonContext();

  const last14 = dailyTotals.slice(-14);

  return (
    <div
      className="card chart-card"
      role="img"
      aria-label="Daily carbon emissions chart showing last 14 days"
    >
      <h2>Daily Emissions (Last 14 Days)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={last14}>
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
