import { useState, useCallback } from 'react';
import { useCarbonContext } from '../context/useCarbonContext';

export function GoalSetter() {
  const { goal, updateGoal } = useCarbonContext();
  const [daily, setDaily] = useState(String(goal.dailyLimitKg));
  const [weekly, setWeekly] = useState(String(goal.weeklyLimitKg));
  const [saved, setSaved] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const d = parseFloat(daily);
      const w = parseFloat(weekly);
      if (d > 0 && w > 0) {
        updateGoal({ dailyLimitKg: d, weeklyLimitKg: w });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    },
    [daily, weekly, updateGoal],
  );

  return (
    <form className="goal-setter card" onSubmit={handleSubmit}>
      <h2>Set Your Goals</h2>
      <p className="goal-current">
        Current: {goal.dailyLimitKg} kg/day, {goal.weeklyLimitKg} kg/week
      </p>
      <div className="form-group">
        <label htmlFor="gs-daily">Daily CO2 limit (kg)</label>
        <input
          id="gs-daily"
          type="number"
          min="0"
          step="0.1"
          value={daily}
          onChange={(e) => setDaily(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="gs-weekly">Weekly CO2 limit (kg)</label>
        <input
          id="gs-weekly"
          type="number"
          min="0"
          step="0.5"
          value={weekly}
          onChange={(e) => setWeekly(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">Save Goals</button>
      <div aria-live="polite" className="confirmation-msg">
        {saved ? 'Goals updated successfully' : ''}
      </div>
    </form>
  );
}
