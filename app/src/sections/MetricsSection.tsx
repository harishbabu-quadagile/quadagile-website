import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  { value: '3×', label: 'faster people decisions' },
  { value: '40%', label: 'reduction in early turnover' },
  { value: '90%', label: 'manager confidence post-program' },
];

export function MetricsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const statementRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;
    const statement = statementRef.current;

    if (!section || cards.length === 0 || !statement) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0%–30%)
      // Card 1 from left
      scrollTl.fromTo(cards[0],
        { x: '-50vw', opacity: 0, rotation: -2 },
        { x: 0, opacity: 1, rotation: 0, ease: 'none' },
        0
      );
      // Card 2 from bottom
      scrollTl.fromTo(cards[1],
        { y: '80vh', opacity: 0, scale: 0.92 },
        { y: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      );
      // Card 3 from right
      scrollTl.fromTo(cards[2],
        { x: '50vw', opacity: 0, rotation: 2 },
        { x: 0, opacity: 1, rotation: 0, ease: 'none' },
        0
      );
      // Statement
      scrollTl.fromTo(statement,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.12
      );

      // SETTLE (30%–70%) - hold

      // EXIT (70%–100%)
      cards.forEach((card) => {
        scrollTl.fromTo(card,
          { scale: 1, opacity: 1 },
          { scale: 0.92, opacity: 0, ease: 'power2.in' },
          0.7
        );
      });
      scrollTl.fromTo(statement,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.85
      );

    }, section);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    if (el) cardsRef.current[index] = el;
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#F6F7F9] grain-overlay overflow-hidden z-30"
    >
      <div className="absolute inset-0 flex items-center justify-center pt-16 lg:pt-20">
        <div className="w-[92vw] max-w-[1320px] flex flex-col items-center">
          {/* Metrics Cards */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-[2vw] w-full">
            {metrics.map((metric, index) => (
              <div
                key={index}
                ref={(el) => addToRefs(el, index)}
                className={`flex-1 bg-white rounded-[28px] card-shadow border border-[#111214]/5 p-8 lg:p-12 flex flex-col justify-between ${
                  index === 1 ? 'lg:min-h-[420px]' : 'lg:min-h-[380px]'
                }`}
              >
                <span className="font-accent text-5xl lg:text-7xl xl:text-8xl font-semibold text-[#2F8E92]">
                  {metric.value}
                </span>
                <p className="mt-6 text-base lg:text-lg text-[#6D737C]">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Statement */}
          <p
            ref={statementRef}
            className="mt-12 lg:mt-16 text-xl lg:text-2xl xl:text-3xl font-display font-semibold text-[#111214] text-center max-w-3xl"
          >
            We help teams move from busywork to business impact.
          </p>
        </div>
      </div>
    </section>
  );
}
