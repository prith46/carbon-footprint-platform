import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CarbonProvider } from './context/CarbonContext';
import { AnnouncerProvider } from './context/AnnouncerProvider';
import { Layout } from './components/Layout';
import './App.css';

const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const TrackPage = lazy(() => import('./pages/TrackPage').then(m => ({ default: m.TrackPage })));
const InsightsPage = lazy(() => import('./pages/InsightsPage').then(m => ({ default: m.InsightsPage })));
const ProgressPage = lazy(() => import('./pages/ProgressPage').then(m => ({ default: m.ProgressPage })));

export function App(): React.ReactNode {
  return (
    <HashRouter>
      <CarbonProvider>
        <AnnouncerProvider>
          <Suspense fallback={<div className="loading" role="status">Loading…</div>}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/track" element={<TrackPage />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </AnnouncerProvider>
      </CarbonProvider>
    </HashRouter>
  );
}
