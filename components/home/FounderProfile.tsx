'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Founder {
  name: string;
  title: string;
  bio: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

// Mock data that would come from https://mayank.sitelytc.com/
// In production, this would be fetched via an API route
const mockFounderData: Founder = {
  name: 'Mayank Thakur',
  title: 'Founder & CEO',
  bio: 'Visionary leader with 10+ years of experience in AI and enterprise software. Previously led engineering teams at top tech companies. Passionate about helping businesses transform through technology.',
  image: '/founders/mayank.jpg',
  linkedin: 'https://linkedin.com/in/mayankthakur',
  twitter: 'https://twitter.com/mayankthakur',
  website: 'https://mayank.sitelytc.com',
};

const achievements = [
  { number: '10+', label: 'Years Experience' },
  { number: '50+', label: 'Enterprise Clients' },
  { number: '150+', label: 'Projects Delivered' },
  { number: '$2B+', label: 'Value Generated' },
];

export function FounderProfile() {
  const [founder, setFounder] = useState<Founder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching from https://mayank.sitelytc.com/
    const fetchFounder = async () => {
      setIsLoading(true);
      // In production, this would be:
      // const response = await fetch('https://api.mayank.sitelytc.com/profile');
      // const data = await response.json();
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setFounder(mockFounderData);
      setIsLoading(false);
    };

    fetchFounder();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Profile Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1] via-[#22D3EE] to-[#A78BFA] opacity-20" />
            
            {isLoading ? (
              <div className="absolute inset-0 bg-[#1A1A1A] animate-pulse" />
            ) : (
              <>
                {/* Placeholder for actual image */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#0D0D0D]">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#6366F1] to-[#22D3EE] flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {founder?.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent" />
              </>
            )}
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#6366F1] to-[#22D3EE] rounded-2xl opacity-50 blur-xl" />
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-[#A78BFA] to-[#6366F1] rounded-full opacity-30 blur-2xl" />
        </motion.div>

        {/* Profile Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Label */}
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] text-xs font-semibold uppercase tracking-wider mb-4">
            Leadership
          </div>

          {/* Title */}
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-2">
            Meet Our Founder
          </h2>
          
          {/* Name & Title */}
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-8 bg-[#1A1A1A] rounded w-48 animate-pulse" />
              <div className="h-6 bg-[#1A1A1A] rounded w-32 animate-pulse" />
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-semibold text-[#22D3EE] mb-4">
                {founder?.name}
              </h3>
              <p className="text-[#9CA3AF] text-lg mb-6">
                {founder?.title}
              </p>
            </>
          )}

          {/* Bio */}
          {isLoading ? (
            <div className="space-y-3 mb-8">
              <div className="h-4 bg-[#1A1A1A] rounded animate-pulse" />
              <div className="h-4 bg-[#1A1A1A] rounded animate-pulse" />
              <div className="h-4 bg-[#1A1A1A] rounded w-3/4 animate-pulse" />
            </div>
          ) : (
            <p className="text-[#9CA3AF] text-lg mb-8 leading-relaxed">
              {founder?.bio}
            </p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-center p-4 bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl"
              >
                <div className="text-2xl font-bold text-white mb-1">
                  {achievement.number}
                </div>
                <div className="text-xs text-[#6B7280]">
                  {achievement.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social Links */}
          {!isLoading && (
            <div className="flex gap-4">
              {founder?.linkedin && (
                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#1A1A1A] hover:bg-[#252525] rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              )}
              {founder?.twitter && (
                <a
                  href={founder.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#1A1A1A] hover:bg-[#252525] rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
              </a>
              )}
              {founder?.website && (
                <a
                  href={founder.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#1A1A1A] hover:bg-[#252525] rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
