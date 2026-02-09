import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const leftCard = leftCardRef.current;
    const rightCard = rightCardRef.current;
    const headline = headlineRef.current;
    const body = bodyRef.current;
    const cta = ctaRef.current;
    const eyebrow = eyebrowRef.current;

    if (!section || !leftCard || !rightCard || !headline || !body || !cta || !eyebrow) return;

    const ctx = gsap.context(() => {
      // Initial state (hidden)
      gsap.set([leftCard, rightCard], { opacity: 0, scale: 0.98 });
      gsap.set(leftCard, { x: '-18vw' });
      gsap.set(rightCard, { x: '18vw' });
      gsap.set(eyebrow, { opacity: 0, y: 20 });
      gsap.set(headline, { opacity: 0, y: 24 });
      gsap.set(body, { opacity: 0, y: 20 });
      gsap.set(cta, { opacity: 0, y: 16 });

      // Entrance animation (auto-play on load)
      const tl = gsap.timeline({ delay: 0.2 });
      
      tl.to(leftCard, {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
      })
      .to(rightCard, {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.7')
      .to(eyebrow, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.5')
      .to(headline, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.3')
      .to(body, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.3')
      .to(cta, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.2');

      // Scroll-driven exit animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset to visible when scrolling back
            gsap.to([leftCard, rightCard], { x: 0, opacity: 1, scale: 1, rotation: 0, duration: 0.3 });
          },
        },
      });

      // EXIT (70%–100%)
      scrollTl.fromTo(leftCard,
        { x: 0, opacity: 1, rotation: 0 },
        { x: '-55vw', opacity: 0, rotation: -1, ease: 'power2.in' },
        0.7
      );
      scrollTl.fromTo(rightCard,
        { x: 0, opacity: 1, rotation: 0 },
        { x: '55vw', opacity: 0, rotation: 1, ease: 'power2.in' },
        0.7
      );

    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.querySelector('#services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#F6F7F9] grain-overlay overflow-hidden z-10"
    >
      <div className="absolute inset-0 flex items-center justify-center pt-16 lg:pt-20">
        <div className="w-[92vw] max-w-[1320px] h-[84vh] flex flex-col lg:flex-row gap-4 lg:gap-[2.2vw]">
          {/* Left Card - Text */}
          <div
            ref={leftCardRef}
            className="flex-1 lg:w-[48%] bg-white rounded-[28px] card-shadow border border-[#111214]/5 p-6 lg:p-10 flex flex-col justify-between"
          >
            <div ref={eyebrowRef} className="inline-flex">
              <span className="px-4 py-2 rounded-full border border-[#111214]/10 text-xs font-medium text-[#6D737C] uppercase tracking-wider">
                QuadAgile
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center py-6">
              <h1
                ref={headlineRef}
                className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] font-bold text-[#111214] leading-[1.1] tracking-tight"
              >
                People-first HR, built for modern teams.
              </h1>
              <p
                ref={bodyRef}
                className="mt-4 lg:mt-6 text-base lg:text-lg text-[#6D737C] leading-relaxed max-w-lg"
              >
                Fractional CHRO support, talent programs, and employee experience—designed for startups and growing companies.
              </p>
            </div>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={scrollToContact}
                className="bg-[#2F8E92] hover:bg-[#267a7d] text-white rounded-xl px-6 py-6 text-base font-medium"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Book a call
              </Button>
              <Button
                onClick={scrollToServices}
                variant="outline"
                className="border-[#111214]/20 text-[#111214] hover:bg-[#F6F7F9] rounded-xl px-6 py-6 text-base font-medium"
              >
                See services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Card - Image */}
          <div
            ref={rightCardRef}
            className="flex-1 lg:w-[48%] rounded-[28px] overflow-hidden card-shadow relative"
          >
            <img
              src="/images/hero_team_meeting.jpg"
              alt="Team collaboration in modern office"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6">
              <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[#111214]">
                Collaborative teams start with the right foundation.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
