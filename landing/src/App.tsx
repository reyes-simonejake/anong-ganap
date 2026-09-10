import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CalendarDays, Check, ChevronRight, CloudSun, Heart, MapPin, Navigation, Sparkles, TrainFront, Users, Wallet } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import './index.css';

type PlanMode = 'date' | 'friends' | 'family' | 'solo';

const MODES: { id: PlanMode; label: string; icon: React.ReactNode }[] = [
    { id: 'date', label: 'Date', icon: <Heart size={16} /> },
    { id: 'friends', label: 'Friends', icon: <Users size={16} /> },
    { id: 'family', label: 'Family', icon: <CalendarDays size={16} /> },
    { id: 'solo', label: 'Solo', icon: <Navigation size={16} /> },
];

const MODE_DETAILS: Record<PlanMode, { title: string; note: string; color: string }> = {
    date: { title: 'Makati date', note: 'Coffee, golden hour, dinner', color: 'coral' },
    friends: { title: 'Friends’ day out', note: 'Food, games, no planning stress', color: 'teal' },
    family: { title: 'Family day this weekend', note: 'Easy routes, kid-friendly stops', color: 'yellow' },
    solo: { title: 'Solo day around Manila', note: 'A slow day, at your own pace', color: 'blue' },
};

const STEPS = [
    { label: 'Share the idea', detail: 'Tell us where, when, and how much—even a rough idea works.', icon: <Sparkles size={22} /> },
    { label: 'Shape the day', detail: 'We’ll line up the spots, timing, routes, and a budget that fits.', icon: <MapPin size={22} /> },
    { label: 'Send the invite', detail: 'One clear plan makes it easy for everyone to say yes.', icon: <ArrowRight size={22} /> },
];

function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) { setVisible(true); return; }
        const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.14, rootMargin: '0px 0px -32px' });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);
    return <div ref={ref} className={cn('reveal', visible && 'reveal--visible', className)}>{children}</div>;
}

function Nav() {
    return <header className="site-nav"><div className="landing-shell site-nav__inner"><a className="brand-mark" href="#top" aria-label="Anong Ganap home"><span className="brand-mark__dot" aria-hidden="true" />Anong Ganap<span className="brand-mark__question">?</span></a><nav className="site-nav__links" aria-label="Main navigation"><a href="#how-it-works">How it works</a><a href="#use-cases">For everyone</a></nav><a href="#planner" className={cn(buttonVariants({ variant: 'nav', size: 'sm' }), 'site-nav__cta')}>Plan yours <ChevronRight size={15} /></a></div></header>;
}

function PlannerPreview() {
    const [mode, setMode] = useState<PlanMode>('date');
    const detail = MODE_DETAILS[mode];
    return <div className="planner-preview" id="planner"><div className="planner-preview__topline"><span className="planner-preview__window"><i /><i /><i /></span><span className="planner-preview__caption">PLAN BUILDER / 01</span></div><div className="planner-preview__body"><p className="planner-preview__label">Who’s coming along?</p><div className="mode-switcher" role="group" aria-label="Choose an activity type">{MODES.map((item) => <Button variant="outline" size="sm" className={cn('mode-switcher__item', mode === item.id && 'is-selected')} key={item.id} type="button" onClick={() => setMode(item.id)} aria-pressed={mode === item.id}>{item.icon}<span>{item.label}</span></Button>)}</div><div className={cn('plan-result', `plan-result--${detail.color}`)}><div className="plan-result__sticker"><Sparkles size={18} /></div><div><span className="plan-result__eyebrow">Your next plan</span><h2>{detail.title}</h2><p>{detail.note}</p></div><span className="plan-result__arrow"><ArrowRight size={18} /></span></div><div className="planner-preview__fields"><span><MapPin size={15} /> Metro Manila</span><span><CalendarDays size={15} /> This weekend</span><span><Wallet size={15} /> ₱1,000 budget</span></div><Button variant="primary" size="lg" className="planner-preview__button">Create my plan <ArrowRight size={17} /></Button></div></div>;
}

function Hero() {
    return <section className="hero" id="top"><div className="landing-shell hero__grid"><div className="hero__copy"><div className="hero__stamp">WEEKEND PLANS, MADE LOCAL</div><h1>You have the idea.<br /><span>We’ll plan the rest.</span></h1><p className="hero__lede">Have somewhere in mind but no one can decide? Tell us where, when, and how much. We’ll shape the day with places, timing, routes, budget, and an invite ready to share.</p><div className="hero__actions"><a href="#planner" className={buttonVariants({ variant: 'primary', size: 'lg' })}>Start planning <ArrowRight size={17} /></a><a href="#how-it-works" className={buttonVariants({ variant: 'ghost', size: 'lg' })}>How it works <ChevronRight size={17} /></a></div><div className="hero__trust"><span className="hero__avatar-stack"><i>J</i><i>M</i><i>A</i></span><span>For dates, friends, families, and solo days.</span></div></div><Reveal className="hero__planner-reveal"><PlannerPreview /></Reveal></div><div className="hero__ticker" aria-label="What Anong Ganap plans"><div className="hero__ticker-track"><span>DATE NIGHT</span><b>✦</b><span>GROUP DAY OUT</span><b>✦</b><span>FAMILY DAY</span><b>✦</b><span>SOLO ADVENTURE</span><b>✦</b><span>DATE NIGHT</span><b>✦</b><span>GROUP DAY OUT</span></div></div></section>;
}

function HowItWorks() {
    return <section className="section how-it-works" id="how-it-works"><Reveal className="landing-shell"><div className="section-heading"><span className="section-heading__scribble">NO MORE “WE’LL FIGURE IT OUT”</span><h2>From “What should we do?”<br /><em>to “Let’s go.”</em></h2><p>Planning together should be part of the fun. Start with an idea; we’ll handle the details.</p></div><div className="step-list">{STEPS.map((step, index) => <div className="step-row" key={step.label}><span className="step-row__number">0{index + 1}</span><span className="step-row__icon">{step.icon}</span><div><h3>{step.label}</h3><p>{step.detail}</p></div><ArrowRight className="step-row__arrow" size={22} /></div>)}</div></Reveal></section>;
}

function PlanProof() {
    return <section className="section plan-proof"><Reveal className="landing-shell plan-proof__grid"><div className="plan-proof__intro"><span className="section-heading__scribble">THE WHOLE DAY, SORTED</span><h2>More than a list of places.</h2><p>See the shape of your day before you send the invite. Every stop has a time, a route, and a reason to be there.</p><a href="#planner" className={buttonVariants({ variant: 'ghost', size: 'default' })}>Try the planner <ArrowRight size={16} /></a></div><div className="itinerary-board"><div className="itinerary-board__head"><div><span className="board-kicker">SATURDAY / MAKATI</span><h3>Makati date</h3></div><Badge variant="accent"><CloudSun size={14} /> 29°C</Badge></div><div className="itinerary-board__budget"><span>ESTIMATED TOTAL</span><strong>₱930</strong><span className="budget-pill">WITHIN ₱1,000</span></div><div className="itinerary-timeline"><div className="itinerary-item"><time>3:00 PM</time><span className="timeline-dot timeline-dot--teal" /><div><strong>MRT to Ayala</strong><p><TrainFront size={14} /> Cubao → Ayala · ₱30</p></div></div><div className="itinerary-item"><time>3:30 PM</time><span className="timeline-dot timeline-dot--coral" /><div><strong>Coffee at The Curator</strong><p><MapPin size={14} /> Coffee and pastries · ₱400</p></div></div><div className="itinerary-item"><time>5:00 PM</time><span className="timeline-dot timeline-dot--yellow" /><div><strong>Ayala Triangle Gardens</strong><p><Sparkles size={14} /> Golden-hour walk · Free</p></div></div><div className="itinerary-item"><time>6:30 PM</time><span className="timeline-dot timeline-dot--blue" /><div><strong>Dinner at Wildflour</strong><p><Heart size={14} /> One Bonifacio · ₱500</p></div></div></div><div className="itinerary-board__footer"><span>OUTFIT</span><strong>Casual minimalist</strong><span className="board-check"><Check size={15} /> Ready to share</span></div></div></Reveal></section>;
}

function UseCases() {
    return <section className="section use-cases" id="use-cases"><Reveal className="landing-shell"><div className="section-heading section-heading--left"><span className="section-heading__scribble">WHAT’S YOUR PLAN?</span><h2>Whatever the vibe,<br /><em>make it yours.</em></h2></div><div className="use-cases__grid"><article className="use-case use-case--coral"><Heart size={28} /><h3>Date night</h3><p>Coffee, sunset walks, dinner for two—romantic with a budget.</p><span>Romance, with a plan</span></article><article className="use-case use-case--teal"><Users size={28} /><h3>Group day out</h3><p>Food, games, and a plan that will not get lost in the group chat.</p><span>Less chat, more plans</span></article><article className="use-case use-case--yellow"><CalendarDays size={28} /><h3>Family day</h3><p>Kid-friendly places, easy routes, and room for everyone’s pace.</p><span>Made for the whole family</span></article><article className="use-case use-case--blue"><Navigation size={28} /><h3>Solo adventure</h3><p>Find a new corner of the city on your own time and terms.</p><span>Your day, your rules</span></article></div></Reveal></section>;
}

function FinalCTA() {
    return <section className="final-cta" id="get-started"><Reveal className="landing-shell final-cta__inner"><div><span className="section-heading__scribble">YOUR TURN</span><h2>Where are we going?</h2><p>Start with a place, a budget, or a rough idea. We’ll take it from there.</p></div><a href="#planner" className={buttonVariants({ variant: 'primary', size: 'lg' })}>Start for free <ArrowRight size={17} /></a></Reveal></section>;
}

function Footer() {
    return <footer className="site-footer"><div className="landing-shell site-footer__inner"><span className="brand-mark brand-mark--footer"><span className="brand-mark__dot" aria-hidden="true" />Anong Ganap<span className="brand-mark__question">?</span></span><span>For plans that make it out of the group chat.</span><span>© 2026 Anong Ganap?</span></div></footer>;
}

export function App() { return <div className="landing-page"><Nav /><main><Hero /><HowItWorks /><PlanProof /><UseCases /><FinalCTA /></main><Footer /></div>; }
