import {
    ArrowRight,
    Bot,
    CalendarDays,
    Camera,
    ChevronRight,
    Cloud,
    Heart,
    Mail,
    MapPin,
    Navigation,
    Shirt,
    Sparkles,
    Star,
    Sun,
    Train,
    Users,
    Wallet,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import './index.css';

/* ── Types ─────────────────────────────────────────────────────────────── */
interface TimelineEntry {
    time: string;
    name: string;
    detail: string;
    cost: string;
}

interface OutfitPerson {
    role: string;
    items: string[];
}

interface ActivityType {
    id: string;
    title: string;
    desc: string;
    tag: string;
    modifier: string;
    badgeVariant: 'date' | 'hangout' | 'family' | 'solo';
    icon: React.ReactNode;
}

interface Feature {
    icon: React.ReactNode;
    title: string;
    desc: string;
}

interface Step {
    number: string;
    icon: React.ReactNode;
    title: string;
    desc: string;
}

interface StatItem {
    value: string;
    label: string;
}

/* ── Data ──────────────────────────────────────────────────────────────── */
const TIMELINE_ENTRIES: TimelineEntry[] = [
    {
        time: '3:00 PM',
        name: 'MRT to Ayala Station',
        detail: 'Ride from Cubao — 25 mins',
        cost: '₱30',
    },
    {
        time: '3:30 PM',
        name: 'Coffee at The Curator',
        detail: 'Specialty coffee & pastries, Legazpi Village',
        cost: '₱400',
    },
    {
        time: '5:00 PM',
        name: 'Ayala Triangle Gardens',
        detail: 'Golden hour walk & photo spots',
        cost: 'Free',
    },
    {
        time: '6:30 PM',
        name: 'Dinner at Wildflour Café',
        detail: 'Casual dining, One Bonifacio High Street',
        cost: '₱500',
    },
];

const OUTFIT_PERSONS: OutfitPerson[] = [
    {
        role: 'Person A',
        items: ['White polo', 'Denim jeans', 'White sneakers'],
    },
    {
        role: 'Person B',
        items: ['Beige slip dress', 'White cardigan', 'White sneakers'],
    },
];

const ACTIVITY_TYPES: ActivityType[] = [
    {
        id: 'date',
        title: 'Date Night',
        desc: 'Café hopping, sunset walks, dinner for two — planned down to the last peso.',
        tag: 'Romantic',
        modifier: 'date',
        badgeVariant: 'date',
        icon: <Heart size={28} strokeWidth={1.75} />,
    },
    {
        id: 'hangout',
        title: 'Barkada Hangout',
        desc: 'Group budgets, multiple votes, one finalized plan everyone actually agrees on.',
        tag: 'Social',
        modifier: 'hangout',
        badgeVariant: 'hangout',
        icon: <Users size={28} strokeWidth={1.75} />,
    },
    {
        id: 'family',
        title: 'Family Day',
        desc: 'Kid-friendly spots, accessible routes, and activities the whole family enjoys.',
        tag: 'Family-friendly',
        modifier: 'family',
        badgeVariant: 'family',
        icon: <CalendarDays size={28} strokeWidth={1.75} />,
    },
    {
        id: 'solo',
        title: 'Solo Adventure',
        desc: 'Discover new places on your own terms — cafés, museums, hidden gems near you.',
        tag: 'Self-paced',
        modifier: 'solo',
        badgeVariant: 'solo',
        icon: <Navigation size={28} strokeWidth={1.75} />,
    },
];

const FEATURES: Feature[] = [
    {
        icon: <Cloud size={22} strokeWidth={1.75} />,
        title: 'Weather-aware planning',
        desc: 'Sunny? Parks and rooftops. Umuulan? Cafés and museums. Adjusts automatically.',
    },
    {
        icon: <Train size={22} strokeWidth={1.75} />,
        title: 'Commute routes included',
        desc: 'MRT, jeepney, or Grab — step-by-step with estimated travel time and cost.',
    },
    {
        icon: <Shirt size={22} strokeWidth={1.75} />,
        title: 'Matching outfit suggestions',
        desc: 'Coordinated themes for couples, adjusted for weather and activity vibe.',
    },
    {
        icon: <Mail size={22} strokeWidth={1.75} />,
        title: 'Invitation generator',
        desc: 'Send a personalized invite with the full plan, dress code, and your schedule.',
    },
    {
        icon: <Camera size={22} strokeWidth={1.75} />,
        title: 'Memory archive',
        desc: "Save photos and notes after the ganap. Track every place you've been together.",
    },
];

const STEPS: Step[] = [
    {
        number: '01',
        icon: <MapPin size={20} strokeWidth={2} />,
        title: 'Sabihin mo ang plano mo',
        desc: 'Lagay ang budget, location, activity type, at kung anong oras ka available.',
    },
    {
        number: '02',
        icon: <Bot size={20} strokeWidth={2} />,
        title: 'Gagawa ang AI ng itinerary',
        desc: 'Inaanalisa ang nearby spots, weather, at iyong preferences para gumawa ng perpektong plano.',
    },
    {
        number: '03',
        icon: <Sparkles size={20} strokeWidth={2} />,
        title: 'I-customize ang details',
        desc: 'Palitan ang activities, piliin ang outfit theme, at i-adjust ang budget breakdown.',
    },
    {
        number: '04',
        icon: <Mail size={20} strokeWidth={2} />,
        title: 'I-share at i-enjoy',
        desc: 'I-send ang invitation sa kasama mo. Lahat ay ready — basta pumunta na kayo.',
    },
];

const STATS: StatItem[] = [
    { value: '500+', label: 'planners sa Metro Manila' },
    { value: '₱500', label: 'average saved per plan' },
    { value: '3 min', label: 'para gumawa ng full itinerary' },
    { value: '4.8', label: 'rating mula sa mga user' },
];

/* ── Sub-components ────────────────────────────────────────────────────── */
function Nav() {
    return (
        <nav className="nav">
            <div className="container-landing">
                <div className="nav__inner">
                    <a href="#" className="nav__logo">
                        Anong Ganap<span>?</span>
                    </a>
                    <a
                        href="#get-started"
                        className={cn(
                            buttonVariants({ variant: 'nav', size: 'sm' })
                        )}
                    >
                        Subukan libre <ChevronRight size={14} />
                    </a>
                </div>
            </div>
        </nav>
    );
}

function Hero() {
    return (
        <section className="hero">
            <div className="container-landing">
                <Badge variant="accent" className="mb-5">
                    <Star size={11} fill="currentColor" />
                    Now available in Metro Manila
                </Badge>

                <h1 className="hero__headline">
                    Anong ganap{' '}
                    <span className="hero__headline-accent">this weekend?</span>
                </h1>

                <p className="hero__subtext">
                    Tell us your budget and where you want to go — we'll build
                    the full itinerary. Activities, routes, outfits, and an
                    invite. Lahat na.
                </p>

                <div className="hero__actions">
                    <a
                        href="#get-started"
                        className={buttonVariants({
                            variant: 'primary',
                            size: 'lg',
                        })}
                    >
                        Mag-plan na <ArrowRight size={16} />
                    </a>
                    <a
                        href="#how-it-works"
                        className={buttonVariants({
                            variant: 'ghost',
                            size: 'lg',
                        })}
                    >
                        Paano ito gumagana?
                    </a>
                </div>

                <div className="hero__pills">
                    <Badge variant="muted">
                        <Heart size={11} /> Date nights
                    </Badge>
                    <Badge variant="muted">
                        <Users size={11} /> Barkada hangouts
                    </Badge>
                    <Badge variant="muted">
                        <CalendarDays size={11} /> Family outings
                    </Badge>
                    <Badge variant="muted">
                        <Navigation size={11} /> Solo adventures
                    </Badge>
                </div>
            </div>
        </section>
    );
}

function ProofStrip() {
    return (
        <div className="proof-strip">
            <div className="container-landing">
                <div className="proof-strip__inner">
                    {STATS.map((stat, index) => (
                        <StatItem
                            key={stat.label}
                            stat={stat}
                            showDivider={index < STATS.length - 1}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function StatItem({
    stat,
    showDivider,
}: {
    stat: StatItem;
    showDivider: boolean;
}) {
    return (
        <>
            <div className="proof-stat">
                <span className="proof-stat__number">
                    {stat.value === '4.8' ? (
                        <span className="inline-flex items-center gap-1">
                            {stat.value} <Star size={18} fill="currentColor" />
                        </span>
                    ) : (
                        stat.value
                    )}
                </span>
                <span className="proof-stat__label">{stat.label}</span>
            </div>
            {showDivider && <div className="proof-divider" />}
        </>
    );
}

function HowItWorks() {
    return (
        <section className="section section--muted" id="how-it-works">
            <div className="container-landing">
                <span className="section__label">Paano gumagana</span>
                <h2 className="section__heading">
                    Mula sa idea hanggang sa actual na plano
                </h2>
                <p className="section__subtext">
                    Apat na steps lang — mas mabilis pa kaysa mag-scroll ng
                    TikTok para hanapin kung saan pumunta.
                </p>

                <div className="steps">
                    {STEPS.map((step) => (
                        <StepCard key={step.number} step={step} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function StepCard({ step }: { step: Step }) {
    return (
        <div className="step-card">
            <div className="step-card__header">
                <span className="step-card__icon">{step.icon}</span>
                <span className="step-card__number">{step.number}</span>
            </div>
            <h3 className="step-card__title">{step.title}</h3>
            <p className="step-card__desc">{step.desc}</p>
        </div>
    );
}

function ItineraryShowcase() {
    return (
        <section className="section">
            <div className="container-landing">
                <span className="section__label">Sample output</span>
                <h2 className="section__heading">
                    Ganito ang hitsura ng iyong plano
                </h2>
                <p className="section__subtext">
                    Isang tunay na Makati date plan — kabilang ang commute,
                    costs, at outfit theme.
                </p>

                <div className="itinerary-showcase">
                    <div className="itinerary-card">
                        <ItineraryHeader />
                        <div className="itinerary-card__body">
                            <ItineraryTimeline />
                            <OutfitPreview />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ItineraryHeader() {
    return (
        <div className="itinerary-card__header">
            <span className="itinerary-card__weather">
                <Sun size={14} /> Sunny · 29°C · Bring sunscreen
            </span>
            <p className="itinerary-card__title">Café Date sa Makati</p>
            <p className="itinerary-card__meta">
                Saturday · Makati City · Budget ₱1,000
            </p>
            <div className="itinerary-card__total">
                <span className="itinerary-card__total-label">
                    Total estimated
                </span>
                <span className="itinerary-card__total-amount">₱930</span>
            </div>
        </div>
    );
}

function ItineraryTimeline() {
    return (
        <div className="timeline">
            {TIMELINE_ENTRIES.map((entry) => (
                <TimelineEntry key={entry.time} entry={entry} />
            ))}
        </div>
    );
}

function TimelineEntry({ entry }: { entry: TimelineEntry }) {
    return (
        <div className="timeline-item">
            <span className="timeline-item__dot" />
            <p className="timeline-item__time">{entry.time}</p>
            <p className="timeline-item__name">{entry.name}</p>
            <p className="timeline-item__detail">
                {entry.detail} ·{' '}
                <span className="timeline-item__cost">{entry.cost}</span>
            </p>
        </div>
    );
}

function OutfitPreview() {
    return (
        <div className="outfit-preview">
            <p className="outfit-preview__label">
                <Shirt size={12} className="inline mr-1" />
                Outfit theme · Casual Minimalist
            </p>
            <div className="outfit-preview__grid">
                {OUTFIT_PERSONS.map((person) => (
                    <OutfitPersonCard key={person.role} person={person} />
                ))}
            </div>
        </div>
    );
}

function OutfitPersonCard({ person }: { person: OutfitPerson }) {
    return (
        <div className="outfit-person">
            <p className="outfit-person__role">{person.role}</p>
            <p className="outfit-person__items">{person.items.join('\n')}</p>
        </div>
    );
}

function ActivityTypes() {
    return (
        <section className="section section--muted">
            <div className="container-landing">
                <span className="section__label">Para sa lahat</span>
                <h2 className="section__heading">Sinong kasama mo?</h2>
                <p className="section__subtext">
                    Date, barkada, pamilya, o sarili lang — may dedicated
                    planner kami para sa bawat isa.
                </p>

                <div className="activity-grid">
                    {ACTIVITY_TYPES.map((type) => (
                        <ActivityCard key={type.id} type={type} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ActivityCard({ type }: { type: ActivityType }) {
    return (
        <div className={`activity-card activity-card--${type.modifier}`}>
            <span className="activity-card__icon">{type.icon}</span>
            <h3 className="activity-card__title">{type.title}</h3>
            <p className="activity-card__desc">{type.desc}</p>
            <Badge variant={type.badgeVariant}>{type.tag}</Badge>
        </div>
    );
}

function FeaturesSection() {
    return (
        <section className="section">
            <div className="container-landing">
                <span className="section__label">Mga features</span>
                <h2 className="section__heading">
                    Isang app. Lahat ng kailangan mo.
                </h2>
                <p className="section__subtext">
                    Hindi ka na mag-switch-switch ng apps para sa directions,
                    outfits, at invitations.
                </p>

                <div className="features-layout">
                    <div className="feature-primary">
                        <Bot
                            size={44}
                            strokeWidth={1.5}
                            className="feature-primary__icon"
                        />
                        <h3 className="feature-primary__title">
                            AI Itinerary Generator
                        </h3>
                        <p className="feature-primary__desc">
                            Lagay ang budget, location, at activity type. In
                            under 3 minutes, makakakuha ka ng complete day plan
                            — with times, costs, and specific place
                            recommendations sa lugar mo.
                        </p>
                        <p className="feature-primary__detail">
                            "Plan a ₱1,500 date in BGC this Saturday afternoon"
                            → full itinerary in seconds.
                        </p>
                    </div>

                    <div className="features-secondary">
                        {FEATURES.map((feature) => (
                            <FeatureCard
                                key={feature.title}
                                feature={feature}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ feature }: { feature: Feature }) {
    return (
        <div className="feature-card">
            <span className="feature-card__icon">{feature.icon}</span>
            <h3 className="feature-card__title">{feature.title}</h3>
            <p className="feature-card__desc">{feature.desc}</p>
        </div>
    );
}

function FinalCTA() {
    return (
        <section className="cta-section section--muted" id="get-started">
            <div className="container-landing">
                <p className="cta-section__tagline">Ready ka na ba?</p>
                <h2 className="cta-section__heading">
                    Your Saturday, <strong>sorted.</strong>
                </h2>
                <p className="cta-section__sub">
                    Libre gamitin. Walang sign-up needed para magsimula. I-try
                    mo na ngayon.
                </p>
                <div className="cta-section__actions">
                    <Button variant="primary" size="lg">
                        Mag-plan ng libre <ArrowRight size={16} />
                    </Button>
                    <a
                        href="#how-it-works"
                        className={buttonVariants({
                            variant: 'ghost',
                            size: 'lg',
                        })}
                    >
                        Paano gumagana?
                    </a>
                </div>
                <p className="cta-section__footnote">
                    <Wallet size={13} className="inline mr-1" />
                    ₱0 para magsimula · Walang credit card · Available sa Metro
                    Manila at Cebu
                </p>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="footer">
            <div className="container-landing">
                <div className="footer__inner">
                    <span className="footer__logo">
                        Anong Ganap<span>?</span>
                    </span>
                    <span className="footer__copy">
                        © 2026 Anong Ganap? · AI-Powered Activity Planner ·
                        Metro Manila
                    </span>
                </div>
            </div>
        </footer>
    );
}

/* ── Root component ────────────────────────────────────────────────────── */
export function App() {
    return (
        <div>
            <Nav />
            <main>
                <Hero />
                <ProofStrip />
                <HowItWorks />
                <ItineraryShowcase />
                <ActivityTypes />
                <FeaturesSection />
                <FinalCTA />
            </main>
            <Footer />
        </div>
    );
}
