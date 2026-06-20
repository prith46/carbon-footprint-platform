import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, type PieLabelRenderProps } from 'recharts';
import { useCarbonContext } from '../context/useCarbonContext';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../constants/emissions';
import type { ActivityCategory } from '../types';

function CategoryPieChartInner() {
  const { categoryBreakdown } = useCarbonContext();

  const data = categoryBreakdown.map((item) => ({
    name: CATEGORY_LABELS[item.category],
    value: Math.round(item.total * 100) / 100,
    percentage: item.percentage,
    category: item.category,
  }));

  return (
    <div
      className="card chart-card"
      role="img"
      aria-label="Carbon emissions breakdown by category"
    >
      <h2>Emissions by Category</h2>
      {data.length === 0 ? (
        <p className="empty-msg">No data to display</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={(props: PieLabelRenderProps) =>
                `${String(props.name ?? '')} ${(Number(props.percent ?? 0) * 100).toFixed(0)}%`
              }
            >
              {data.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={CATEGORY_COLORS[entry.category as ActivityCategory]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export const CategoryPieChart = React.memo(CategoryPieChartInner);
