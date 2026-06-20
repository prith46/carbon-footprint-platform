import { ActivityForm } from '../components/ActivityForm';
import { EntryList } from '../components/EntryList';

export function TrackPage() {
  return (
    <div className="page track-page">
      <h1>Track Your Emissions</h1>
      <p className="page-subtitle">
        Log your daily activities to measure your carbon footprint.
      </p>
      <ActivityForm />
      <EntryList />
    </div>
  );
}
