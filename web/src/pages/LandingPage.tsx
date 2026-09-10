import { ArrowDown, ArrowRight, CloudSun, Mail, MapPinned, Shirt } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PlanningPreview } from '@/components/landing/PlanningPreview';
import { Button } from '@/components/ui/button';

const STEPS = [
  { number: '01', title: 'Set the non-negotiables', copy: 'Location, date, budget, vibe, and how you want to get around.' },
  { number: '02', title: 'Check the real conditions', copy: 'Weather, nearby places, route time, and estimated costs are gathered first.' },
  { number: '03', title: 'Build a workable itinerary', copy: 'Three timed activities, one backup, and a budget check come back together.' },
  { number: '04', title: 'Dress, save, and share', copy: 'Generate coordinated outfits and send the final invitation from one plan.' },
];

const CAPABILITIES = [
  { icon: CloudSun, label: 'Weather', title: 'Indoor alternatives when rain changes the plan' },
  { icon: MapPinned, label: 'Routes', title: 'Travel distance and time beside every itinerary' },
  { icon: Shirt, label: 'Outfits', title: 'Coordinated suggestions grounded in the forecast' },
  { icon: Mail, label: 'Invites', title: 'A saved plan becomes an email-ready invitation' },
];

function WorkflowSteps() {
  return (
    <div className="workflow-steps">
      {STEPS.map((step) => (
        <article className="workflow-step" key={step.number}>
          <span className="workflow-step__number">{step.number}</span>
          <h3 className="workflow-step__title">{step.title}</h3>
          <p className="workflow-step__copy">{step.copy}</p>
        </article>
      ))}
    </div>
  );
}

function CapabilityList() {
  return (
    <section aria-label="Planning capabilities" className="capability-band">
      {CAPABILITIES.map(({ icon: Icon, label, title }) => (
        <article className="capability-item" key={label}>
          <Icon aria-hidden="true" className="capability-item__icon" />
          <span className="capability-item__label">{label}</span>
          <h3 className="capability-item__title">{title}</h3>
        </article>
      ))}
    </section>
  );
}

export function LandingPage() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <img alt="Friends planning a weekend itinerary at a Metro Manila cafe" className="landing-hero__image" src="/images/hero-manila-planning.png" />
        <div className="landing-hero__shade" />
        <div className="landing-hero__content">
          <p className="landing-hero__eyebrow">Plan the day, not just the idea</p>
          <h1 className="landing-hero__title">Anong Ganap?</h1>
          <p className="landing-hero__copy">Turn one “saan tayo?” into a timed itinerary with routes, budget checks, outfit ideas, and an invitation ready to send.</p>
          <div className="landing-hero__actions">
            <Button asChild variant="accent">
              <Link to="/dashboard">Open planning desk <ArrowRight aria-hidden="true" /></Link>
            </Button>
            <Button asChild variant="outline">
              <a href="#workflow">See the flow <ArrowDown aria-hidden="true" /></a>
            </Button>
          </div>
          <p className="landing-hero__note">Built for dates, barkada plans, family days, and solo trips around the Philippines.</p>
        </div>
      </section>
      <section className="landing-band" id="workflow">
        <div className="landing-band__intro"><p className="section-kicker">One connected flow</p><h2 className="landing-band__title">The plan gets practical before it gets pretty.</h2><p className="landing-band__copy">Recommendations are checked against conditions you can act on, then saved as one shareable plan.</p></div>
        <WorkflowSteps />
      </section>
      <section className="preview-band">
        <div className="preview-band__copy"><p className="section-kicker">Example output</p><h2 className="preview-band__title">Enough detail to leave the group chat.</h2><p className="preview-band__body">Each activity has a time, place, and cost. Weather and travel sit beside the itinerary instead of becoming last-minute surprises.</p><Link className="text-link" to="/plans">Review saved plans</Link></div>
        <PlanningPreview />
      </section>
      <CapabilityList />
    </main>
  );
}
