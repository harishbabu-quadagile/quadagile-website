import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Building2, Clock, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import { SEO, CaseStudySchema, BreadcrumbSchema } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { getCaseStudyBySlug, getPublishedCaseStudies } from '@/data/caseStudies';
import { Button } from '@/components/ui/button';

export default function CaseStudyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const caseStudy = slug ? getCaseStudyBySlug(slug) : undefined;
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, [slug]);

  if (!caseStudy || caseStudy.status !== 'published') {
    return <Navigate to="/case-studies" replace />;
  }

  const relatedCaseStudies = getPublishedCaseStudies()
    .filter(cs => cs.id !== caseStudy.id)
    .slice(0, 2);

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Case Studies', url: '/case-studies' },
    { name: caseStudy.title, url: `/case-studies/${caseStudy.slug}` },
  ];

  return (
    <>
      <SEO
        title={caseStudy.metaTitle}
        description={caseStudy.metaDescription}
        canonical={`/case-studies/${caseStudy.slug}`}
        ogType="article"
        ogImage={caseStudy.featuredImage}
        publishedAt={caseStudy.publishedAt}
      />
      <CaseStudySchema caseStudy={caseStudy} />
      <BreadcrumbSchema items={breadcrumbItems} />

      <Navigation />

      <main className="min-h-screen bg-[#F6F7F9] pt-24 lg:pt-32">
        <div ref={contentRef} className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pb-20">
          <div className="max-w-[1000px] mx-auto">
            {/* Back Link */}
            <Link
              to="/case-studies"
              className="inline-flex items-center gap-2 text-sm text-[#6D737C] hover:text-[#2F8E92] transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all case studies
            </Link>

            {/* Case Study Header */}
            <header className="mb-10">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-[#6D737C] mb-4">
                <Link to="/" className="hover:text-[#2F8E92] transition-colors">Home</Link>
                <ArrowLeft className="w-3 h-3 rotate-180" />
                <Link to="/case-studies" className="hover:text-[#2F8E92] transition-colors">Case Studies</Link>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#2F8E92]/10 text-[#2F8E92] text-sm font-medium">
                  <Building2 className="w-4 h-4" />
                  {caseStudy.industry}
                </span>
                <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#111214]/5 text-[#6D737C] text-sm">
                  <Clock className="w-4 h-4" />
                  {caseStudy.duration}
                </span>
              </div>

              <h1 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold text-[#111214] leading-tight">
                {caseStudy.title}
              </h1>
              <p className="mt-4 text-xl text-[#6D737C]">
                {caseStudy.subtitle}
              </p>
            </header>

            {/* Featured Image */}
            <div className="aspect-[16/9] rounded-[28px] overflow-hidden mb-10">
              <img
                src={caseStudy.featuredImage}
                alt={caseStudy.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Results Bar */}
            <div className="bg-[#2F8E92] rounded-[28px] p-6 lg:p-8 mb-10">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-white" />
                <span className="text-white font-display font-semibold">Key Results</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {caseStudy.results.map((result, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white/80 flex-shrink-0" />
                    <span className="text-white/90 text-sm">{result}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Case Study Content */}
            <article
              className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-[#111214] prose-p:text-[#6D737C] prose-a:text-[#2F8E92] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#111214] prose-li:text-[#6D737C] prose-ul:space-y-2"
              dangerouslySetInnerHTML={{ __html: caseStudy.content }}
            />

            {/* CTA */}
            <div className="mt-12 p-8 lg:p-10 bg-white rounded-[28px] card-shadow border border-[#111214]/5 text-center">
              <h3 className="font-display text-2xl font-semibold text-[#111214] mb-3">
                Want similar results for your organization?
              </h3>
              <p className="text-[#6D737C] mb-6 max-w-lg mx-auto">
                Let's discuss how we can help you achieve your people and HR goals.
              </p>
              <Link to="/#contact">
                <Button className="bg-[#2F8E92] hover:bg-[#267a7d] text-white rounded-xl px-8 py-6 text-base font-medium">
                  Get in touch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Related Case Studies */}
          {relatedCaseStudies.length > 0 && (
            <div className="max-w-[1320px] mx-auto mt-20">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-[#111214] mb-8">
                More Case Studies
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {relatedCaseStudies.map((relatedCaseStudy) => (
                  <article
                    key={relatedCaseStudy.id}
                    className="group bg-white rounded-[28px] card-shadow border border-[#111214]/5 overflow-hidden hover:translate-y-[-4px] transition-all duration-300"
                  >
                    <Link to={`/case-studies/${relatedCaseStudy.slug}`} className="block">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={relatedCaseStudy.featuredImage}
                          alt={relatedCaseStudy.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-display text-lg font-semibold text-[#111214] line-clamp-2 group-hover:text-[#2F8E92] transition-colors">
                          {relatedCaseStudy.title}
                        </h3>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
