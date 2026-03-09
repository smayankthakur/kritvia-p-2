'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatar?: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'FinTech Innovations',
    quote: 'Kritvia transformed our data pipeline with a custom ML solution that reduced processing time by 78%. Their team\'s expertise in AI is unmatched — they delivered on time and exceeded every KPI.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Marcus Williams',
    role: 'VP Engineering',
    company: 'HealthTech Corp',
    quote: 'We went from idea to production in 14 weeks. The Kritvia team built our entire SaaS platform on a tight schedule without compromising quality. Truly exceptional engineering.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    role: 'CEO',
    company: 'RetailAI',
    quote: 'The AI recommendation engine Kritvia built for us increased our conversion rate by 34% in the first month. The ROI was evident within weeks of launch.',
    rating: 5,
  },
  {
    id: '4',
    name: 'David Park',
    role: 'Head of Product',
    company: 'CloudScale Systems',
    quote: 'Kritvia\'s cloud architecture design reduced our infrastructure costs by 45% while improving reliability. Their AWS expertise saved us from costly mistakes.',
    rating: 5,
  },
];

interface Props {
  testimonials?: Testimonial[];
}

export function TestimonialCarousel({ testimonials = DEFAULT_TESTIMONIALS }: Props) {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [autoplay, next]);

  const t = testimonials[current];

  return (
    <div className="relative">
      {/* Main Card */}
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 lg:p-12"
        onMouseEnter={() => setAutoplay(false)}
        onMouseLeave={() => setAutoplay(true)}
      >
        {/* Stars */}
        <div className="flex gap-1 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={cn('w-5 h-5', i < t.rating ? 'text-yellow-400' : 'text-neutral-700')}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-xl lg:text-2xl text-white leading-relaxed font-light mb-8">
          <span className="text-primary-400 text-5xl leading-none font-serif mr-2">&ldquo;</span>
          {t.quote}
          <span className="text-primary-400 text-5xl leading-none font-serif ml-2">&rdquo;</span>
        </blockquote>

        {/* Author */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {t.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-white">{t.name}</div>
            <div className="text-sm text-neutral-400">{t.role} · {t.company}</div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); setAutoplay(false); }}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === current ? 'w-6 bg-primary-500' : 'w-1.5 bg-neutral-700 hover:bg-neutral-500',
                )}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex gap-2">
            <button
              onClick={() => { prev(); setAutoplay(false); }}
              className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 flex items-center justify-center transition-colors"
              aria-label="Previous"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => { next(); setAutoplay(false); }}
              className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 flex items-center justify-center transition-colors"
              aria-label="Next"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Side Cards (visible on lg+) */}
      <div className="hidden lg:block absolute -left-4 top-1/2 -translate-y-1/2 opacity-40 scale-90 pointer-events-none">
        <div className="w-16 h-48 bg-neutral-900 border border-neutral-800 rounded-xl" />
      </div>
      <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 opacity-40 scale-90 pointer-events-none">
        <div className="w-16 h-48 bg-neutral-900 border border-neutral-800 rounded-xl" />
      </div>
    </div>
  );
}
