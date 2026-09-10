const ACTIVITIES = [
  { time: '3:00 PM', title: 'Coffee in Legazpi Village', meta: 'Indoor · 75 minutes · ₱420' },
  { time: '4:30 PM', title: 'Ayala Triangle walk', meta: 'Outdoor · 60 minutes · Free' },
  { time: '6:00 PM', title: 'Dinner near Greenbelt', meta: 'Indoor · 90 minutes · ₱900' },
];

export function PlanningPreview() {
  return (
    <article className="plan-preview">
      <header className="plan-preview__header">
        <div className="plan-preview__heading"><p className="plan-preview__eyebrow">Saturday in Makati</p><h3 className="plan-preview__title">Slow city date</h3></div>
        <Badge variant="scheduled">Budget checked</Badge>
      </header>
      <div className="condition-strip">
        <span className="condition-strip__item"><CloudSun aria-hidden="true" />29°C · Cloudy</span>
        <span className="condition-strip__item"><MapPinned aria-hidden="true" />4.2 km route</span>
        <span className="condition-strip__item"><WalletCards aria-hidden="true" />₱1,320 total</span>
      </div>
      <ol className="preview-timeline">{ACTIVITIES.map((activity) => <li className="preview-timeline__item" key={activity.time}><time className="preview-timeline__time">{activity.time}</time><div className="preview-timeline__content"><h4 className="preview-timeline__title">{activity.title}</h4><p className="preview-timeline__meta">{activity.meta}</p></div></li>)}</ol>
      <footer className="plan-preview__footer">
        <span className="plan-preview__backup"><ShieldCheck aria-hidden="true" />Rain backup ready</span>
        <span className="plan-preview__remaining">₱680 remaining</span>
      </footer>
    </article>
  );
}
import { CloudSun, MapPinned, ShieldCheck, WalletCards } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
