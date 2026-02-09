import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Linkedin, Twitter } from 'lucide-react';
import { SEO, BlogPostSchema, BreadcrumbSchema } from '@/components/SEO';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { getBlogBySlug, getPublishedBlogs } from '@/data/blogs';


export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const blog = slug ? getBlogBySlug(slug) : undefined;
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, [slug]);

  if (!blog || blog.status !== 'published') {
    return <Navigate to="/blogs" replace />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const relatedBlogs = getPublishedBlogs()
    .filter(b => b.id !== blog.id)
    .slice(0, 3);

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blogs' },
    { name: blog.title, url: `/blogs/${blog.slug}` },
  ];

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      <SEO
        title={blog.metaTitle}
        description={blog.metaDescription}
        canonical={`/blogs/${blog.slug}`}
        ogType="article"
        ogImage={blog.featuredImage}
        publishedAt={blog.publishedAt}
        modifiedAt={blog.updatedAt}
        author={blog.author}
        tags={blog.tags}
      />
      <BlogPostSchema blog={blog} />
      <BreadcrumbSchema items={breadcrumbItems} />

      <Navigation />

      <main className="min-h-screen bg-[#F6F7F9] pt-24 lg:pt-32">
        <div ref={contentRef} className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pb-20">
          <div className="max-w-[900px] mx-auto">
            {/* Back Link */}
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-sm text-[#6D737C] hover:text-[#2F8E92] transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all articles
            </Link>

            {/* Article Header */}
            <header className="mb-10">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-[#6D737C] mb-4">
                <Link to="/" className="hover:text-[#2F8E92] transition-colors">Home</Link>
                <ArrowLeft className="w-3 h-3 rotate-180" />
                <Link to="/blogs" className="hover:text-[#2F8E92] transition-colors">Blog</Link>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-[#2F8E92]/10 text-[#2F8E92] text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold text-[#111214] leading-tight">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-[#6D737C]">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(blog.publishedAt)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  5 min read
                </span>
                <span>By {blog.author}</span>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-3 mt-6">
                <span className="text-sm text-[#6D737C]">Share:</span>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#111214]/5 flex items-center justify-center hover:bg-[#2F8E92] hover:text-white transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#111214]/5 flex items-center justify-center hover:bg-[#2F8E92] hover:text-white transition-colors"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </header>

            {/* Featured Image */}
            <div className="aspect-[16/9] rounded-[28px] overflow-hidden mb-10">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content */}
            <article
              className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-[#111214] prose-p:text-[#6D737C] prose-a:text-[#2F8E92] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#111214] prose-li:text-[#6D737C] prose-ul:space-y-2"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Author Box */}
            <div className="mt-12 p-6 lg:p-8 bg-white rounded-[28px] card-shadow border border-[#111214]/5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#2F8E92]/10 flex items-center justify-center">
                  <span className="font-display text-xl font-semibold text-[#2F8E92]">
                    {blog.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-display font-semibold text-[#111214]">{blog.author}</p>
                  <p className="text-sm text-[#6D737C]">People Strategy Experts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {relatedBlogs.length > 0 && (
            <div className="max-w-[1320px] mx-auto mt-20">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-[#111214] mb-8">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <article
                    key={relatedBlog.id}
                    className="group bg-white rounded-[28px] card-shadow border border-[#111214]/5 overflow-hidden hover:translate-y-[-4px] transition-all duration-300"
                  >
                    <Link to={`/blogs/${relatedBlog.slug}`} className="block">
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={relatedBlog.featuredImage}
                          alt={relatedBlog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-display text-lg font-semibold text-[#111214] line-clamp-2 group-hover:text-[#2F8E92] transition-colors">
                          {relatedBlog.title}
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
