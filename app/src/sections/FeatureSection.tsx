import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FeatureSectionProps {
  id?: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  stat?: { value: string; label: string };
  list?: string[];
  chips?: string[];
  quote?: string;
  imagePosition: 'left' | 'right';
  zIndex: number;
}

export function FeatureSection({
  id,
  title,
  description,
  image,
  imageAlt,
  stat,
  list,
  chips,
  quote,
  imagePosition,
  zIndex,
}: FeatureSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);
  const textCardRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const imageCard = imageCardRef.current;
    const textCard = textCardRef.current;

    if (!section || !imageCard || !textCard) return;

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
      if (imagePosition === 'left') {
        scrollTl.fromTo(imageCard,
          { x: '-60vw', opacity: 0, scale: 0.96 },
          { x: 0, opacity: 1, scale: 1, ease: 'none' },
          0
        );
        scrollTl.fromTo(textCard,
          { x: '60vw', opacity: 0, scale: 0.96 },
          { x: 0, opacity: 1, scale: 1, ease: 'none' },
          0
        );
      } else {
        scrollTl.fromTo(textCard,
          { x: '-60vw', opacity: 0, scale: 0.96 },
          { x: 0, opacity: 1, scale: 1, ease: 'none' },
          0
        );
        scrollTl.fromTo(imageCard,
          { x: '60vw', opacity: 0, scale: 0.96 },
          { x: 0, opacity: 1, scale: 1, ease: 'none' },
          0
        );
      }

      // Content animations
      contentRefs.current.forEach((el, i) => {
        if (el) {
          scrollTl.fromTo(el,
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, ease: 'none' },
            0.05 + i * 0.03
          );
        }
      });

      // SETTLE (30%–70%) - hold

      // EXIT (70%–100%)
      if (imagePosition === 'left') {
        scrollTl.fromTo(imageCard,
          { y: 0, opacity: 1 },
          { y: '35vh', opacity: 0, ease: 'power2.in' },
          0.7
        );
        scrollTl.fromTo(textCard,
          { y: 0, opacity: 1 },
          { y: '-35vh', opacity: 0, ease: 'power2.in' },
          0.7
        );
      } else {
        scrollTl.fromTo(textCard,
          { y: 0, opacity: 1 },
          { y: '35vh', opacity: 0, ease: 'power2.in' },
          0.7
        );
        scrollTl.fromTo(imageCard,
          { y: 0, opacity: 1 },
          { y: '-35vh', opacity: 0, ease: 'power2.in' },
          0.7
        );
      }

    }, section);

    return () => ctx.revert();
  }, [imagePosition]);

  const addToRefs = (el: HTMLElement | null, index: number) => {
    if (el) contentRefs.current[index] = el;
  };

  const ImageCard = (
    <div
      ref={imageCardRef}
      className="flex-1 lg:w-[48%] rounded-[28px] overflow-hidden card-shadow"
    >
      <img
        src={image}
        alt={imageAlt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );

  const TextCard = (
    <div
      ref={textCardRef}
      className="flex-1 lg:w-[48%] bg-white rounded-[28px] card-shadow border border-[#111214]/5 p-6 lg:p-10 flex flex-col justify-center"
    >
      <div ref={(el) => addToRefs(el, 0)} className="w-12 h-12 rounded-full border-2 border-[#2F8E92] flex items-center justify-center mb-6">
        <Layers className="w-5 h-5 text-[#2F8E92]" />
      </div>

      <h2
        ref={(el) => addToRefs(el, 1)}
        className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111214] leading-tight"
      >
        {title}
      </h2>

      <p
        ref={(el) => addToRefs(el, 2)}
        className="mt-4 text-base lg:text-lg text-[#6D737C] leading-relaxed"
      >
        {description}
      </p>

      {list && list.length > 0 && (
        <ul ref={(el) => addToRefs(el, 3)} className="mt-6 space-y-3">
          {list.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#2F8E92] mt-2 flex-shrink-0" />
              <span className="text-[#111214] text-sm lg:text-base">{item}</span>
            </li>
          ))}
        </ul>
      )}

      {chips && chips.length > 0 && (
        <div ref={(el) => addToRefs(el, 3)} className="mt-6 flex flex-wrap gap-2">
          {chips.map((chip, index) => (
            <span
              key={index}
              className="px-4 py-2 rounded-full border border-[#111214]/10 text-xs font-medium text-[#6D737C]"
            >
              {chip}
            </span>
          ))}
        </div>
      )}

      {stat && (
        <div ref={(el) => addToRefs(el, 3)} className="mt-8">
          <span className="font-accent text-5xl lg:text-7xl font-semibold text-[#2F8E92]">
            {stat.value}
          </span>
          <p className="mt-2 text-sm text-[#6D737C]">{stat.label}</p>
        </div>
      )}

      {quote && (
        <div ref={(el) => addToRefs(el, 3)} className="mt-8 pt-6 border-t border-[#111214]/10">
          <p className="text-[#111214] italic text-base lg:text-lg">"{quote}"</p>
        </div>
      )}
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative w-full h-screen bg-[#F6F7F9] grain-overlay overflow-hidden"
      style={{ zIndex }}
    >
      <div className="absolute inset-0 flex items-center justify-center pt-16 lg:pt-20">
        <div className="w-[92vw] max-w-[1320px] h-[84vh] flex flex-col lg:flex-row gap-4 lg:gap-[2.2vw]">
          {imagePosition === 'left' ? (
            <>{ImageCard}{TextCard}</>
          ) : (
            <>{TextCard}{ImageCard}</>
          )}
        </div>
      </div>
    </section>
  );
}
