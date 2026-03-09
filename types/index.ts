// Core Types for Kritvia Platform — Phase 2

export interface NavItem {
  name: string;
  href: string;
  description?: string;
}

export interface Solution {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
  features?: string[];
}

export interface Service {
  id: string;
  title: string;
  tagline: string;
  description: string;
  href: string;
  icon: string;
  highlights: string[];
  tags: string[];
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  href: string;
  gradient: string;
  features?: string[];
}

export interface Industry {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
}

export interface CaseStudy {
  id: string;
  client: string;
  title: string;
  result: string;
  emoji: string;
  description?: string;
  industry?: string;
  technologies?: string[];
  results?: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  href: string;
  date: string;
  category: string;
  readTime?: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  excerpt: string;
  href: string;
  date: string;
  category: string;
  tag: string;
  readTime: string;
  featured?: boolean;
}

export interface Stat {
  value: string;
  label: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department?: string;
  bio: string;
  image?: string;
  linkedin?: string;
  twitter?: string;
  expertise?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatar?: string;
}

export interface Technology {
  id: string;
  name: string;
  icon: string;
  category: string;
  description?: string;
  logoUrl?: string;
}

export interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
  highlight?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  honeypot?: string;
}

export interface BookingData {
  service: string;
  date: string;
  time: string;
  name: string;
  email: string;
  company?: string;
  message?: string;
}

export interface FormResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

export interface PageMetadata {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
}
