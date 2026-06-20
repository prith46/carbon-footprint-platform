import React from 'react';
import type { ReductionTip } from '../types';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../constants/emissions';

interface TipCardProps {
  tip: ReductionTip;
}

function TipCardInner({ tip }: TipCardProps) {
  return (
    <article className="tip-card card">
      <div className="tip-header">
        <span
          className="category-badge"
          style={{ backgroundColor: CATEGORY_COLORS[tip.category] }}
        >
          {CATEGORY_LABELS[tip.category]}
        </span>
        <span className={`difficulty-badge difficulty-${tip.difficulty}`}>
          {tip.difficulty}
        </span>
      </div>
      <h3>{tip.title}</h3>
      <p>{tip.description}</p>
      <p className="tip-saving">
        Potential saving: <strong>{tip.potentialSavingKg} kg CO2</strong> per week
      </p>
    </article>
  );
}

export const TipCard = React.memo(TipCardInner);
