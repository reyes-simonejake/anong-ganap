import { CalendarDays, MapPin, WalletCards } from 'lucide-react';

import { Badge, type BadgeProps } from '@/components/ui/badge';
import type { Plan } from '@/types/plan';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency', currency: 'PHP', maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string | null): string {
  if (!value) return 'Not scheduled';
  return new Intl.DateTimeFormat('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
}

function getStatusVariant(status: Plan['status']): BadgeProps['variant'] {
  return status;
}

function getThemeClass(theme: Plan['theme']): string {
  return `theme-label--${theme}`;
}

export function PlanTable({ plans }: { plans: Plan[] }) {
  return (
    <>
      <div className="plan-table-wrap">
        <table className="plan-table">
          <thead className="plan-table__head">
            <tr>
              <th className="plan-table__header">Plan</th>
              <th className="plan-table__header plan-table__header--number">Budget</th>
              <th className="plan-table__header">Type</th>
              <th className="plan-table__header">Date</th>
              <th className="plan-table__header">Status</th>
            </tr>
          </thead>
          <tbody className="plan-table__body">
            {plans.map((plan) => (
              <tr className="plan-table__row" key={plan.plan_id}>
                <td className="plan-table__cell"><strong className="plan-table__title">{plan.title}</strong><span className="plan-table__meta">{plan.location}</span></td>
                <td className="plan-table__number">{formatCurrency(Number(plan.budget))}</td>
                <td className="plan-table__cell"><span className={getThemeClass(plan.theme)}>{plan.theme}</span></td>
                <td className="plan-table__cell">{formatDate(plan.event_date)}</td>
                <td className="plan-table__cell"><Badge variant={getStatusVariant(plan.status)}>{plan.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="plan-list">
        {plans.map((plan) => (
          <article className="plan-list__item" key={plan.plan_id}>
            <header className="plan-list__header">
              <div><h3 className="plan-list__title">{plan.title}</h3><span className={getThemeClass(plan.theme)}>{plan.theme}</span></div>
              <Badge variant={getStatusVariant(plan.status)}>{plan.status}</Badge>
            </header>
            <dl className="plan-list__details">
              <div><dt><MapPin aria-hidden="true" />Location</dt><dd>{plan.location}</dd></div>
              <div><dt><WalletCards aria-hidden="true" />Budget</dt><dd>{formatCurrency(Number(plan.budget))}</dd></div>
              <div><dt><CalendarDays aria-hidden="true" />Date</dt><dd>{formatDate(plan.event_date)}</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </>
  );
}
