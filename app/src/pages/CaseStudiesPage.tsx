import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Clock, TrendingUp } from 'lucide-react';
import { SEO, BreadcrumbSchema } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { getPublishedCaseStudies } from '@/data/caseStudies';

gsap.registerPlugin(ScrollTrigger);

export default function CaseStudiesPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const caseStudies = getPublishedCaseStudies();

  useEffect(() => {
    const header = headerRef.current;

    if (!header) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(header,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
          },
        }
      );

      cardsRef.current.forEach((card, idx) => {
        if (!card) return;
        gsap.fromTo(card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: idx * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  const addToRefs = (el: HTMLElement | null, idx: number) => {
    if (el) cardsRef.current[idx] = el;
  };

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Case Studies', url: '/case-studies' },
  ];

  return (
    <>
      <SEO
        title="Case Studies | QuadAgile"
        description="See how we've helped startups and growing companies build agile people practices, reduce turnover, and scale their HR operations."
        canonical="/case-studies"
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <Navigation />

      <main className="min-h-screen bg-[#F6F7F9] pt-24 lg:pt-32">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pb-20">
          {/* Header */}
          <div ref={headerRef} className="max-w-[1320px] mx-auto mb-12 lg:mb-16">
            <div className="flex items-center gap-2 text-sm text-[#6D737C] mb-4">
              <Link to="/" className="hover:text-[#2F8E92] transition-colors">Home</Link>
              <ArrowRight className="w-4 h-4" />
              <span className="text-[#111214]">Case Studies</span>
            </div>
            <h1 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold text-[#111214]">
              Client Success Stories
            </h1>
            <p className="mt-4 text-lg text-[#6D737C] max-w-2xl">
              See how we've helped startups and growing companies build agile people practices, reduce turnover, and scale their HR operations.
            </p>
          </div>

          {/* Case Studies Grid */}
          <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {caseStudies.map((caseStudy, index) => (
              <article
                key={caseStudy.id}
                ref={(el) => addToRefs(el, index)}
                className="group bg-white rounded-[28px] card-shadow border border-[#111214]/5 overflow-hidden hover:translate-y-[-4px] transition-all duration-300"
              >
                <Link to={`/case-studies/${caseStudy.slug}`} className="block">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={caseStudy.featuredImage}
                      alt={caseStudy.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 lg:p-8">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#6D737C] mb-4">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {caseStudy.industry}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {caseStudy.duration}
                      </span>
                    </div>
                    <h2 className="font-display text-xl lg:text-2xl font-semibold text-[#111214] mb-2 group-hover:text-[#2F8E92] transition-colors">
                      {caseStudy.title}
                    </h2>
                    <p className="text-[#6D737C] text-sm leading-relaxed mb-6">
                      {caseStudy.subtitle}
                    </p>

                    {/* Results Preview */}
                    <div className="flex items-start gap-3 pt-6 border-t border-[#111214]/5">
                      <TrendingUp className="w-5 h-5 text-[#2F8E92] flex-shrink-0 mt-0.5" />
                      <div className="flex flex-wrap gap-2">
                        {caseStudy.results.slice(0, 2).map((result, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full bg-[#2F8E92]/10 text-[#2F8E92] text-xs font-medium"
                          >
                            {result}
                          </span>
                        ))}
                        {caseStudy.results.length > 2 && (
                          <span className="px-3 py-1 rounded-full bg-[#111214]/5 text-[#6D737C] text-xs font-medium">
                            +{caseStudy.results.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-[#2F8E92] font-medium text-sm">
                      Read case study
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
