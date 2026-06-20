import { useState, useMemo } from 'react';
import type { ActivityCategory, ReductionTip } from '../types';
import { useCarbonContext } from '../context/useCarbonContext';
import { REDUCTION_TIPS } from '../constants/tips';
import { CATEGORY_LABELS } from '../constants/emissions';
import { TipCard } from '../components/TipCard';
import { GoalSetter } from '../components/GoalSetter';

type Difficulty = ReductionTip['difficulty'];

const ALL_CATEGORIES: ActivityCategory[] = ['transport', 'food', 'energy', 'shopping'];
const ALL_DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export function InsightsPage() {
  const { categoryBreakdown } = useCarbonContext();
  const [filterCategory, setFilterCategory] = useState<ActivityCategory | 'all'>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | 'all'>('all');

  const rankedCategories = useMemo(
    () => [...categoryBreakdown].sort((a, b) => b.total - a.total).map((c) => c.category),
    [categoryBreakdown],
  );

  const sortedTips = useMemo(() => {
    const ranked = [...REDUCTION_TIPS].sort((a, b) => {
      const aIdx = rankedCategories.indexOf(a.category);
      const bIdx = rankedCategories.indexOf(b.category);
      return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
    });
    return ranked.filter((tip) => {
      if (filterCategory !== 'all' && tip.category !== filterCategory) return false;
      if (filterDifficulty !== 'all' && tip.difficulty !== filterDifficulty) return false;
      return true;
    });
  }, [rankedCategories, filterCategory, filterDifficulty]);

  const topCategory = rankedCategories[0];

  return (
    <div className="page insights-page">
      <h1>Insights &amp; Tips</h1>
      {topCategory && (
        <p className="page-subtitle">
          Your highest emission category is <strong>{CATEGORY_LABELS[topCategory]}</strong>.
          Focus on tips in that area for the biggest impact.
        </p>
      )}
      <div className="filters">
        <div className="form-group">
          <label htmlFor="filter-category">Category</label>
          <select
            id="filter-category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as ActivityCategory | 'all')}
          >
            <option value="all">All categories</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="filter-difficulty">Difficulty</label>
          <select
            id="filter-difficulty"
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value as Difficulty | 'all')}
          >
            <option value="all">All levels</option>
            {ALL_DIFFICULTIES.map((d) => (
              <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="tips-grid">
        {sortedTips.map((tip) => (
          <TipCard key={tip.id} tip={tip} />
        ))}
        {sortedTips.length === 0 && (
          <p className="no-results">No tips match your filters.</p>
        )}
      </div>
      <section className="goal-section">
        <h2>Set Your Reduction Goal</h2>
        <GoalSetter />
      </section>
    </div>
  );
}
