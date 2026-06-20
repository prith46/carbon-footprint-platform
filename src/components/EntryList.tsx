import { useCallback } from 'react';
import type { ActivityCategory } from '../types';
import { CATEGORY_LABELS } from '../constants/emissions';
import { ALL_TIME_DAYS, ENTRY_RANGE_OPTIONS, isCategoryFilter, isRangeDays } from '../constants/filters';
import { useCarbonContext } from '../context/useCarbonContext';
import { useFilteredEntries } from '../hooks/useFilteredEntries';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ALL_CATEGORIES: ActivityCategory[] = ['transport', 'food', 'energy', 'shopping'];

export function EntryList() {
  const { entries, deleteEntry } = useCarbonContext();
  const [category, setCategory] = useLocalStorage<ActivityCategory | 'all'>('carbon-filter-category', 'all');
  const [rangeDays, setRangeDays] = useLocalStorage<number>('carbon-filter-range', ALL_TIME_DAYS);

  const safeCategory = isCategoryFilter(category) ? category : 'all';
  const safeRange = isRangeDays(rangeDays) ? rangeDays : ALL_TIME_DAYS;
  const filtered = useFilteredEntries(entries, safeCategory, safeRange);

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value as ActivityCategory | 'all'),
    [setCategory],
  );

  const handleRangeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => setRangeDays(Number(e.target.value)),
    [setRangeDays],
  );

  return (
    <div className="entry-list card">
      <div className="entry-list-header">
        <h2>Recent Entries</h2>
        <div className="filters">
          <div className="form-group">
            <label htmlFor="el-filter">Filter by category</label>
            <select id="el-filter" value={safeCategory} onChange={handleCategoryChange}>
              <option value="all">All</option>
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="el-range">Time range</label>
            <select id="el-range" value={safeRange} onChange={handleRangeChange}>
              {ENTRY_RANGE_OPTIONS.map((opt) => (
                <option key={opt.days} value={opt.days}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="empty-msg">No entries yet</p>
      ) : (
        <table className="entries-table">
          <caption className="sr-only">Logged carbon emission entries</caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Category</th>
              <th scope="col">Activity</th>
              <th scope="col">Amount</th>
              <th scope="col">CO2 (kg)</th>
              <th scope="col"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.date}</td>
                <td>{CATEGORY_LABELS[entry.category]}</td>
                <td>{entry.activity}</td>
                <td>{entry.value} {entry.unit}</td>
                <td>{entry.co2Kg.toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    aria-label={`Delete entry for ${entry.activity}`}
                    onClick={() => deleteEntry(entry.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
