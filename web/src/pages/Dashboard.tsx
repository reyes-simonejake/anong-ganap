import { ArrowRight, CalendarCheck, MapPin, WalletCards } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PlanTable } from '@/components/plans/PlanTable';
import { PlansState } from '@/components/plans/PlansState';
import { Button } from '@/components/ui/button';
import { usePlans } from '@/hooks/usePlans';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency', currency: 'PHP', maximumFractionDigits: 0,
  }).format(value);
}

export function DashboardPage() {
  const { plans, isLoading, errorMessage, reload } = usePlans();
  const scheduledPlans = plans.filter((plan) => plan.status === 'scheduled').length;
  const averageBudget = plans.length > 0
    ? plans.reduce((total, plan) => total + Number(plan.budget), 0) / plans.length
    : 0;
  const locationCount = new Set(plans.map((plan) => plan.location)).size;
  const recentPlans = plans.slice(0, 5);

  return (
    <main className="workspace-page">
      <header className="page-header">
        <div className="page-header__copy">
          <p className="page-eyebrow">Operations overview</p>
          <h1 className="page-title">Planning desk</h1>
          <p className="page-summary">Review generated plans and spot incomplete records before sharing.</p>
        </div>
        <Button asChild>
          <Link to="/plans">Review all plans <ArrowRight aria-hidden="true" /></Link>
        </Button>
      </header>
      <section aria-label="Plan metrics" className="metric-strip">
        <article className="metric-item"><CalendarCheck aria-hidden="true" /><span className="metric-item__value">{plans.length}</span><span className="metric-item__label">Saved plans</span></article>
        <article className="metric-item"><CalendarCheck aria-hidden="true" /><span className="metric-item__value">{scheduledPlans}</span><span className="metric-item__label">Scheduled</span></article>
        <article className="metric-item"><WalletCards aria-hidden="true" /><span className="metric-item__value">{formatCurrency(averageBudget)}</span><span className="metric-item__label">Average budget</span></article>
        <article className="metric-item"><MapPin aria-hidden="true" /><span className="metric-item__value">{locationCount}</span><span className="metric-item__label">Locations covered</span></article>
      </section>
      <section className="workspace-section">
        <div className="section-heading-row">
          <div className="section-heading-row__copy"><p className="section-kicker">Latest activity</p><h2 className="section-title">Recent plans</h2></div>
          <Link className="text-link" to="/plans">View complete list</Link>
        </div>
        <PlansState errorMessage={errorMessage} isEmpty={!isLoading && plans.length === 0} isLoading={isLoading} onRetry={reload} />
        {!isLoading && !errorMessage && recentPlans.length > 0 ? <PlanTable plans={recentPlans} /> : null}
      </section>
    </main>
  );
}
