import { Helmet } from 'react-helmet-async';
import type { SEOProps } from '@/types';

const siteUrl = 'https://quadagile.in';
const siteName = 'QuadAgile';
const defaultImage = '/images/hero_team_meeting.jpg';

export function SEO({
  title,
  description,
  canonical,
  ogImage = defaultImage,
  ogType = 'website',
  publishedAt,
  modifiedAt,
  author,
  tags,
  noindex = false,
}: SEOProps) {
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : undefined;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl || siteUrl} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Article Specific */}
      {ogType === 'article' && publishedAt && (
        <>
          <meta property="article:published_time" content={publishedAt} />
          {modifiedAt && <meta property="article:modified_time" content={modifiedAt} />}
          {author && <meta property="article:author" content={author} />}
          {tags?.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: siteName,
          url: siteUrl,
          logo: `${siteUrl}/logo.png`,
          description: 'People-first HR consulting for modern teams. Fractional CHRO support, talent programs, and employee experience.',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'GoSpaze, 1st Floor, PR Business Center, Sy Nos. 36/2 and 37/1, Marathahalli – Sarjapur Outer Ring Rd, Kadubeesanahalli',
            addressLocality: 'Bengaluru',
            addressRegion: 'Karnataka',
            postalCode: '560103',
            addressCountry: 'IN',
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-74061-09111',
            contactType: 'customer service',
            email: 'reach-us@quadagile.in',
          },
          sameAs: [
            'https://www.linkedin.com/company/quadagile-consulting-llp',
            'https://twitter.com/Quadagile',
            'https://www.youtube.com/@Quadagile',
          ],
        })}
      </script>
    </Helmet>
  );
}

// Blog Post Schema
export function BlogPostSchema({ blog }: { blog: { title: string; slug: string; excerpt: string; featuredImage: string; author: string; publishedAt: string; updatedAt: string; tags: string[] } }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: `${siteUrl}${blog.featuredImage}`,
    author: {
      '@type': 'Organization',
      name: blog.author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt,
    url: `${siteUrl}/blogs/${blog.slug}`,
    keywords: blog.tags?.join(', '),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// Case Study Schema
export function CaseStudySchema({ caseStudy }: { caseStudy: { title: string; slug: string; excerpt: string; featuredImage: string; clientName: string; industry: string; publishedAt: string; results: string[] } }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: caseStudy.title,
    description: caseStudy.excerpt,
    image: `${siteUrl}${caseStudy.featuredImage}`,
    author: {
      '@type': 'Organization',
      name: siteName,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    datePublished: caseStudy.publishedAt,
    url: `${siteUrl}/case-studies/${caseStudy.slug}`,
    about: {
      '@type': 'Organization',
      name: caseStudy.clientName,
      industry: caseStudy.industry,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// Breadcrumb Schema
export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
