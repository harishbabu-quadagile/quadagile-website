// Blog Types
export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  status: 'draft' | 'published';
  metaTitle: string;
  metaDescription: string;
  tags: string[];
}

// Case Study Types
export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  clientName: string;
  industry: string;
  duration: string;
  results: string[];
  publishedAt: string;
  status: 'draft' | 'published';
  metaTitle: string;
  metaDescription: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
}

// Contact Form Types
export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message: string;
  recaptchaToken: string;
}

// SEO Types
export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedAt?: string;
  modifiedAt?: string;
  author?: string;
  tags?: string[];
  noindex?: boolean;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
}

// Service Types
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}
