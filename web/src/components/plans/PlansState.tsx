interface PlansStateProps {
  isLoading: boolean;
  isEmpty: boolean;
  errorMessage: string;
  onRetry: () => void;
}

export function PlansState({ isLoading, isEmpty, errorMessage, onRetry }: PlansStateProps) {
  if (isLoading) {
    return <div aria-label="Loading plans" className="data-state--loading"><span className="data-state__bar" /><span className="data-state__bar" /><span className="data-state__bar" /></div>;
  }
  if (errorMessage) {
    return <div className="data-state--error"><TriangleAlert aria-hidden="true" className="data-state__icon" /><h3 className="data-state__title">Plans are unavailable</h3><p className="data-state__copy">{errorMessage}</p><Button onClick={onRetry} variant="outline"><RefreshCw aria-hidden="true" />Try again</Button></div>;
  }
  if (isEmpty) {
    return <div className="data-state--empty"><CalendarPlus aria-hidden="true" className="data-state__icon" /><h3 className="data-state__title">No plans match this view</h3><p className="data-state__copy">Generate a plan from the mobile app, then refresh this workspace.</p><Button onClick={onRetry} variant="outline"><RefreshCw aria-hidden="true" />Refresh plans</Button></div>;
  }
  return null;
}
import { CalendarPlus, RefreshCw, TriangleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
