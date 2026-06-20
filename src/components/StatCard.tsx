import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
}

function StatCardInner({ title, value, unit, trend }: StatCardProps) {
  return (
    <div className="stat-card card">
      <p className="stat-title">{title}</p>
      <p className="stat-value">
        {value}
        {unit ? <span className="stat-unit"> {unit}</span> : null}
      </p>
      {trend && (
        <span className={`stat-trend trend-${trend}`}>
          {trend === 'up' && (
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16">
              <path d="M8 3l5 7H3z" fill="currentColor" />
            </svg>
          )}
          {trend === 'down' && (
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16">
              <path d="M8 13l5-7H3z" fill="currentColor" />
            </svg>
          )}
          {trend === 'neutral' && (
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16">
              <path d="M2 8h12" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          )}
        </span>
      )}
    </div>
  );
}

export const StatCard = React.memo(StatCardInner);
