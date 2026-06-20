import { useState, useCallback } from 'react';
import { MAX_GOAL_LIMIT_KG } from '../constants/limits';
import { useCarbonContext } from '../context/useCarbonContext';
import { useAnnouncer } from '../context/useAnnouncer';

export function GoalSetter() {
  const { goal, updateGoal } = useCarbonContext();
  const announce = useAnnouncer();
  const [daily, setDaily] = useState(String(goal.dailyLimitKg));
  const [weekly, setWeekly] = useState(String(goal.weeklyLimitKg));
  const [saved, setSaved] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const d = parseFloat(daily);
      const w = parseFloat(weekly);
      if (Number.isFinite(d) && d > 0 && Number.isFinite(w) && w > 0) {
        updateGoal({
          dailyLimitKg: Math.min(d, MAX_GOAL_LIMIT_KG),
          weeklyLimitKg: Math.min(w, MAX_GOAL_LIMIT_KG),
        });
        setSaved(true);
        announce('Goals updated successfully');
        setTimeout(() => setSaved(false), 3000);
      }
    },
    [daily, weekly, updateGoal, announce],
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
          max={MAX_GOAL_LIMIT_KG}
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
          max={MAX_GOAL_LIMIT_KG}
          step="0.5"
          value={weekly}
          onChange={(e) => setWeekly(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">Save Goals</button>
      <p className="confirmation-msg">
        {saved ? 'Goals updated successfully' : ''}
      </p>
    </form>
  );
}
