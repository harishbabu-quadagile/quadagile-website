import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UserCog, Users, Heart, Shield, GraduationCap, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: UserCog,
    title: 'Fractional CHRO',
    description: 'Strategic HR leadership on demand. Get executive-level people expertise without the full-time cost.',
  },
  {
    icon: Users,
    title: 'Talent Acquisition',
    description: 'Build high-performing teams with our structured hiring process and employer branding expertise.',
  },
  {
    icon: Heart,
    title: 'Employee Experience',
    description: 'Design journeys that engage, retain, and inspire—from onboarding to career development.',
  },
  {
    icon: Shield,
    title: 'HR Systems & Compliance',
    description: 'Lightweight systems that protect your business without slowing it down. Audit-ready always.',
  },
  {
    icon: GraduationCap,
    title: 'Leadership Development',
    description: 'Turn managers into multipliers with coaching, frameworks, and real-world practice.',
  },
  {
    icon: Award,
    title: 'Employer Brand',
    description: 'Attract the right talent with authentic messaging and a compelling employee value proposition.',
  },
];

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleCardRef = useRef<HTMLDivElement>(null);
  const serviceCardsRef = useRef<HTMLDivElement[]>([]);
  const ctaCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const titleCard = titleCardRef.current;
    const serviceCards = serviceCardsRef.current;
    const ctaCard = ctaCardRef.current;

    if (!section || !titleCard || serviceCards.length === 0 || !ctaCard) return;

    const ctx = gsap.context(() => {
      // Title card reveal
      gsap.fromTo(titleCard,
        { y: 40, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: titleCard,
            start: 'top 80%',
            end: 'top 55%',
            scrub: 1,
          },
        }
      );

      // Service cards staggered reveal
      serviceCards.forEach((card) => {
        gsap.fromTo(card,
          { y: 40, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 60%',
              scrub: 1,
            },
          }
        );
      });

      // CTA card reveal
      gsap.fromTo(ctaCard,
        { y: 40, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ctaCard,
            start: 'top 85%',
            end: 'top 60%',
            scrub: 1,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    if (el) serviceCardsRef.current[index] = el;
  };

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative w-full bg-[#F6F7F9] grain-overlay py-20 lg:py-28 z-[130]"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Title Card */}
        <div
          ref={titleCardRef}
          className="w-full bg-white rounded-[28px] card-shadow border border-[#111214]/5 p-8 lg:p-12 mb-6"
        >
          <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold text-[#111214]">
            What we offer.
          </h2>
          <p className="mt-4 text-lg text-[#6D737C] max-w-2xl">
            Modular people services—ready when you are. Scale up or down based on your needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {services.map((service, idx) => (
            <div
              key={service.title}
              ref={(el) => addToRefs(el, idx)}
              className="bg-white rounded-[28px] card-shadow border border-[#111214]/5 p-6 lg:p-8 hover:translate-y-[-4px] transition-transform duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-[#2F8E92]/10 flex items-center justify-center mb-6">
                <service.icon className="w-5 h-5 text-[#2F8E92]" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[#111214] mb-3">
                {service.title}
              </h3>
              <p className="text-[#6D737C] text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Card */}
        <div
          ref={ctaCardRef}
          className="w-full bg-[#2F8E92] rounded-[28px] card-shadow p-8 lg:p-12 mt-6 flex flex-col lg:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="font-display text-2xl lg:text-3xl font-bold text-white">
              Not sure where to start?
            </h3>
            <p className="mt-2 text-white/80">
              Book a 20-minute call to discuss your people challenges.
            </p>
          </div>
          <Button
            onClick={scrollToContact}
            className="bg-white text-[#2F8E92] hover:bg-white/90 rounded-xl px-8 py-6 text-base font-medium"
          >
            Book a call
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
