export type PlanStatus = 'draft' | 'scheduled' | 'completed';

export interface Plan {
  plan_id: number;
  title: string;
  location: string;
  budget: number;
  theme: 'date' | 'hangout' | 'family' | 'solo';
  status: PlanStatus;
  event_date: string | null;
  weather_summary: string | null;
  date_created: string;
}
