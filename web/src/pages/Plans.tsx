import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { PlanTable } from '@/components/plans/PlanTable';
import { PlansState } from '@/components/plans/PlansState';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { usePlans } from '@/hooks/usePlans';

export function PlansPage() {
  const { plans, isLoading, errorMessage, reload } = usePlans();
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState('all');
  const filteredPlans = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return plans.filter((plan) => {
      const planText = `${plan.title} ${plan.location}`.toLowerCase();
      return (!normalizedQuery || planText.includes(normalizedQuery))
        && (theme === 'all' || plan.theme === theme);
    });
  }, [plans, query, theme]);

  return (
    <main className="workspace-page">
      <header className="page-header">
        <div className="page-header__copy"><p className="page-eyebrow">Plan library</p><h1 className="page-title">Every ganap, one clear view</h1><p className="page-summary">Search by plan or place, then check budget, schedule, weather, and status.</p></div>
      </header>
      <section aria-label="Plan filters" className="filter-bar">
        <label className="filter-field">
          <span className="filter-field__label">Search plans</span>
          <span className="filter-field__control">
            <Search aria-hidden="true" />
            <Input onChange={(event) => setQuery(event.target.value)} placeholder="Makati date, BGC hangout..." type="search" value={query} />
          </span>
        </label>
        <label className="filter-field">
          <span className="filter-field__label">Activity type</span>
          <Select onChange={(event) => setTheme(event.target.value)} value={theme}>
            <option value="all">All types</option>
            <option value="date">Date</option>
            <option value="hangout">Hangout</option>
            <option value="family">Family</option>
            <option value="solo">Solo</option>
          </Select>
        </label>
      </section>
      <PlansState errorMessage={errorMessage} isEmpty={!isLoading && filteredPlans.length === 0} isLoading={isLoading} onRetry={reload} />
      {!isLoading && !errorMessage && filteredPlans.length > 0 ? <PlanTable plans={filteredPlans} /> : null}
    </main>
  );
}
