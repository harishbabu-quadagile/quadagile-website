import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { SEO, BreadcrumbSchema } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { getPublishedBlogs } from '@/data/blogs';

gsap.registerPlugin(ScrollTrigger);

export default function BlogsPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const blogs = getPublishedBlogs();

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blogs' },
  ];

  return (
    <>
      <SEO
        title="Insights & Resources | QuadAgile Blog"
        description="Explore the latest insights on HR, talent management, leadership, and building people-first organizations."
        canonical="/blogs"
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
              <span className="text-[#111214]">Blog</span>
            </div>
            <h1 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold text-[#111214]">
              Insights & Resources
            </h1>
            <p className="mt-4 text-lg text-[#6D737C] max-w-2xl">
              Explore the latest insights on HR, talent management, leadership, and building people-first organizations.
            </p>
          </div>

          {/* Blog Grid */}
          <div className="max-w-[1320px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {blogs.map((blog, index) => (
              <article
                key={blog.id}
                ref={(el) => addToRefs(el, index)}
                className="group bg-white rounded-[28px] card-shadow border border-[#111214]/5 overflow-hidden hover:translate-y-[-4px] transition-all duration-300"
              >
                <Link to={`/blogs/${blog.slug}`} className="block">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-4 text-sm text-[#6D737C] mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(blog.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        5 min read
                      </span>
                    </div>
                    <h2 className="font-display text-xl font-semibold text-[#111214] mb-3 line-clamp-2 group-hover:text-[#2F8E92] transition-colors">
                      {blog.title}
                    </h2>
                    <p className="text-[#6D737C] text-sm leading-relaxed line-clamp-3">
                      {blog.excerpt}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-[#2F8E92] font-medium text-sm">
                      Read more
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
