import { Route, Routes } from 'react-router-dom';

import { SiteHeader } from '@/components/layout/SiteHeader';
import { DashboardPage } from '@/pages/Dashboard';
import { LandingPage } from '@/pages/LandingPage';
import { PlansPage } from '@/pages/Plans';

export function App() {
  return (
    <div className="app-shell">
      <SiteHeader />
      <Routes>
        <Route element={<LandingPage />} path="/" />
        <Route element={<DashboardPage />} path="/dashboard" />
        <Route element={<PlansPage />} path="/plans" />
      </Routes>
    </div>
  );
}
