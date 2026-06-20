import { useState, useCallback, useMemo } from 'react';
import type { ActivityCategory } from '../types';
import { ACTIVITY_OPTIONS, CATEGORY_LABELS } from '../constants/emissions';
import { useCarbonContext } from '../context/useCarbonContext';

const CATEGORIES: ActivityCategory[] = ['transport', 'food', 'energy', 'shopping'];

export function ActivityForm() {
  const { addEntry } = useCarbonContext();
  const [category, setCategory] = useState<ActivityCategory>('transport');
  const [activity, setActivity] = useState('');
  const [value, setValue] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const filteredOptions = useMemo(
    () => ACTIVITY_OPTIONS.filter((o) => o.category === category),
    [category],
  );

  const selectedOption = useMemo(
    () => filteredOptions.find((o) => o.activity === activity),
    [filteredOptions, activity],
  );

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setCategory(e.target.value as ActivityCategory);
      setActivity('');
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const numVal = parseFloat(value);
      if (!activity || !numVal || numVal <= 0 || !selectedOption) return;
      addEntry(category, activity, numVal, selectedOption.unit);
      setConfirmation(`Added ${numVal} ${selectedOption.unit} of ${activity}`);
      setValue('');
      setActivity('');
      setTimeout(() => setConfirmation(''), 3000);
    },
    [activity, value, selectedOption, category, addEntry],
  );

  return (
    <form className="activity-form card" onSubmit={handleSubmit}>
      <h2>Log Activity</h2>
      <div className="form-group">
        <label htmlFor="af-category">Category</label>
        <select id="af-category" value={category} onChange={handleCategoryChange}>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="af-activity">Activity</label>
        <select id="af-activity" value={activity} onChange={(e) => setActivity(e.target.value)}>
          <option value="">Select activity</option>
          {filteredOptions.map((opt) => (
            <option key={opt.activity} value={opt.activity}>{opt.activity}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="af-value">
          Amount{selectedOption ? ` (${selectedOption.unit})` : ''}
        </label>
        <input
          id="af-value"
          type="number"
          min="0"
          step="0.1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">Add Entry</button>
      <div aria-live="polite" className="confirmation-msg">{confirmation}</div>
    </form>
  );
}
