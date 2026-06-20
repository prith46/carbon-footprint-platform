import { useState, useMemo, useCallback } from 'react';
import type { ActivityCategory } from '../types';
import { CATEGORY_LABELS } from '../constants/emissions';
import { useCarbonContext } from '../context/useCarbonContext';

const ALL_CATEGORIES: ActivityCategory[] = ['transport', 'food', 'energy', 'shopping'];

export function EntryList() {
  const { entries, deleteEntry } = useCarbonContext();
  const [filter, setFilter] = useState<ActivityCategory | 'all'>('all');

  const filtered = useMemo(
    () => filter === 'all' ? entries : entries.filter((e) => e.category === filter),
    [entries, filter],
  );

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFilter(e.target.value as ActivityCategory | 'all');
    },
    [],
  );

  return (
    <div className="entry-list card">
      <div className="entry-list-header">
        <h2>Recent Entries</h2>
        <div className="form-group">
          <label htmlFor="el-filter">Filter by category</label>
          <select id="el-filter" value={filter} onChange={handleFilterChange}>
            <option value="all">All</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
            ))}
          </select>
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
