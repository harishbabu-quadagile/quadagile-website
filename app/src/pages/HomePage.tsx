import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SEO } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/sections/HeroSection';
import { FeatureSection } from '@/sections/FeatureSection';
import { MetricsSection } from '@/sections/MetricsSection';
import { ServicesSection } from '@/sections/ServicesSection';
import { ContactSection } from '@/sections/ContactSection';

gsap.registerPlugin(ScrollTrigger);

// Feature sections data
const featureSections = [
  {
    id: 'about',
    title: 'Designed for how teams actually work.',
    description: 'We replace rigid policies with lightweight, high-impact people practices—so your culture scales with your business.',
    image: '/images/team_working_desk.jpg',
    imageAlt: 'Team working collaboratively at desk',
    stat: { value: '90%', label: 'of leaders say our playbooks reduced decision fatigue.' },
    imagePosition: 'left' as const,
    zIndex: 20,
  },
  {
    title: 'Agile principles. Practical HR.',
    description: 'Short cycles, clear ownership, and continuous feedback—so people operations stay responsive.',
    image: '/images/workshop_whiteboard.jpg',
    imageAlt: 'Workshop with sticky notes on whiteboard',
    list: [
      'Define outcomes before processes.',
      'Ship policies in weeks, not quarters.',
      'Measure what matters, then iterate.',
    ],
    imagePosition: 'right' as const,
    zIndex: 40,
  },
  {
    title: "Culture isn't a slogan. It's a system.",
    description: 'We design rituals, feedback loops, and recognition habits that reinforce how your team actually works.',
    image: '/images/team_huddle_smile.jpg',
    imageAlt: 'Team huddle with friendly expressions',
    chips: ['Weekly check-ins', 'Peer recognition', 'Clear growth paths'],
    imagePosition: 'left' as const,
    zIndex: 50,
  },
  {
    title: 'Retention starts with clarity.',
    description: 'When expectations, growth, and feedback are clear, people stay—and perform.',
    image: '/images/manager_1on1.jpg',
    imageAlt: 'One-on-one mentoring session',
    quote: 'Clarity is the cheapest retention tool.',
    imagePosition: 'right' as const,
    zIndex: 60,
  },
  {
    title: 'Talent programs that scale.',
    description: 'From onboarding to leadership, we build journeys that grow with your team.',
    image: '/images/onboarding_laptop.jpg',
    imageAlt: 'Onboarding session with laptop',
    list: [
      'Onboarding that builds belonging.',
      'Manager training with real practice.',
      'Leadership pipelines you can trust.',
    ],
    imagePosition: 'left' as const,
    zIndex: 70,
  },
  {
    title: 'Lightweight systems. Strong compliance.',
    description: 'Documentation, policies, and workflows that protect your business without slowing it down.',
    image: '/images/hero_team_meeting.jpg',
    imageAlt: 'Team meeting in modern office',
    chips: ['Audit-ready', 'Consistent', 'Easy to maintain'],
    imagePosition: 'right' as const,
    zIndex: 80,
  },
  {
    title: 'Leadership development that sticks.',
    description: 'Real scenarios, clear frameworks, and coaching that turns managers into multipliers.',
    image: '/images/interview_panel.jpg',
    imageAlt: 'Leadership development session',
    list: [
      'Decision-making under uncertainty.',
      'Feedback and difficult conversations.',
      'Coaching for performance.',
    ],
    imagePosition: 'left' as const,
    zIndex: 90,
  },
  {
    title: 'Employer brand that attracts the right people.',
    description: 'Messaging, careers content, and interview experience—aligned to who you actually are.',
    image: '/images/decision_meeting.jpg',
    imageAlt: 'Team discussing around laptop',
    chips: ['Authentic', 'Consistent', 'Convertible'],
    imagePosition: 'right' as const,
    zIndex: 100,
  },
  {
    title: 'Faster, smarter people decisions.',
    description: "Clear ownership, simple criteria, and the right data—so decisions don't get stuck.",
    image: '/images/workshop_whiteboard.jpg',
    imageAlt: 'Decision making workshop',
    list: [
      'Owner + deadline for every decision.',
      'Criteria before opinions.',
      'Document and iterate.',
    ],
    imagePosition: 'left' as const,
    zIndex: 110,
  },
  {
    title: 'Onboarding that builds momentum.',
    description: 'A clear first week, early wins, and connection to culture—so new hires contribute faster.',
    image: '/images/onboarding_laptop.jpg',
    imageAlt: 'New hire onboarding',
    chips: ['Day-1 clarity', '30-day goals', 'Culture touchpoints'],
    imagePosition: 'right' as const,
    zIndex: 120,
  },
];

export default function HomePage() {
  useEffect(() => {
    // Global snap for pinned sections
    const setupGlobalSnap = () => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(
              r => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            if (!inPinned) return value;

            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    };

    // Delay to ensure all ScrollTriggers are created
    const timer = setTimeout(setupGlobalSnap, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <>
      <SEO
        title="QuadAgile - People-First HR Consulting for Modern Teams"
        description="Fractional CHRO support, talent programs, and employee experience—designed for startups and growing companies. Build agile people practices that scale."
        canonical="/"
        ogType="website"
      />
      
      <Navigation />
      
      <main className="relative">
        <HeroSection />
        
        <FeatureSection {...featureSections[0]} />
        
        <MetricsSection />
        
        {featureSections.slice(1).map((section, index) => (
          <FeatureSection key={index} {...section} />
        ))}
        
        <ServicesSection />
        
        <ContactSection />
      </main>
      
      <Footer />
    </>
  );
}
