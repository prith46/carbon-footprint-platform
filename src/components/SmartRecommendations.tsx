import React, { useMemo } from 'react';
import { useCarbonContext } from '../context/useCarbonContext';
import { generateRecommendations } from '../utils/recommendations';

function SmartRecommendationsInner() {
  const { entries, categoryBreakdown, trend, weeklyAverage, goal } = useCarbonContext();

  const recommendations = useMemo(
    () => generateRecommendations({ entries, breakdown: categoryBreakdown, trend, weeklyAverage, goal }),
    [entries, categoryBreakdown, trend, weeklyAverage, goal],
  );

  return (
    <section className="smart-recommendations card" aria-labelledby="smart-rec-heading">
      <h2 id="smart-rec-heading">
        <span aria-hidden="true">🤖</span> Smart Recommendations
      </h2>
      <ul className="rec-list">
        {recommendations.map((rec) => (
          <li key={rec.id} className={`recommendation-item rec-priority-${rec.priority}`}>
            <span className="recommendation-icon" aria-hidden="true">{rec.icon}</span>
            <span className="recommendation-text">
              <strong>{rec.title}</strong>
              {rec.message}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const SmartRecommendations = React.memo(SmartRecommendationsInner);
