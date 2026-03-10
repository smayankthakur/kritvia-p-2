'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PortfolioProject {
  id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  image: string;
  link: string;
  metrics?: string[];
}

// Mock data that would come from https://www.sitelytc.com/work
// In production, this would be fetched via an API route
const mockPortfolioData: PortfolioProject[] = [
  {
    id: '1',
    title: 'E-Commerce Platform Redesign',
    client: 'RetailTech Inc.',
    category: 'E-Commerce',
    description: 'Complete platform overhaul with AI-powered recommendations',
    image: '/projects/ecommerce.jpg',
    link: 'https://example.com',
    metrics: ['+340% conversions', '50% faster load times'],
  },
  {
    id: '2',
    title: 'Healthcare Analytics Dashboard',
    client: 'MedCore Systems',
    category: 'Healthcare',
    description: 'Real-time patient analytics with predictive modeling',
    image: '/projects/healthcare.jpg',
    link: 'https://example.com',
    metrics: ['99.9% uptime', '40% cost reduction'],
  },
  {
    id: '3',
    title: 'FinTech Mobile App',
    client: 'PayFlow',
    category: 'FinTech',
    description: 'Next-gen payment platform with biometric security',
    image: '/projects/fintech.jpg',
    link: 'https://example.com',
    metrics: ['2M+ users', '$1B+ processed monthly'],
  },
  {
    id: '4',
    title: 'AI Content Platform',
    client: 'ContentAI',
    category: 'AI/ML',
    description: 'Generative AI platform for content creation',
    image: '/projects/content.jpg',
    link: 'https://example.com',
    metrics: ['10x productivity', '500K+ users'],
  },
  {
    id: '5',
    title: 'Logistics Management System',
    client: 'FastShip',
    category: 'Logistics',
    description: 'End-to-end supply chain optimization',
    image: '/projects/logistics.jpg',
    link: 'https://example.com',
    metrics: ['35% faster delivery', '$2M saved annually'],
  },
  {
    id: '6',
    title: 'Real Estate Platform',
    client: 'PropTech Pro',
    category: 'Real Estate',
    description: 'AI-powered property search and valuation',
    image: '/projects/realestate.jpg',
    link: 'https://example.com',
    metrics: ['5000+ properties', '$500M+ in transactions'],
  },
];

const categoryColors: Record<string, string> = {
  'E-Commerce': 'from-orange-500 to-red-500',
  'Healthcare': 'from-green-500 to-emerald-500',
  'FinTech': 'from-blue-500 to-cyan-500',
  'AI/ML': 'from-purple-500 to-pink-500',
  'Logistics': 'from-yellow-500 to-orange-500',
  'Real Estate': 'from-indigo-500 to-blue-500',
};

export function ClientPortfolio() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching from https://www.sitelytc.com/work
    const fetchPortfolio = async () => {
      setIsLoading(true);
      // In production, this would be:
      // const response = await fetch('https://api.sitelytc.com/work');
      // const data = await response.json();
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setProjects(mockPortfolioData);
      setIsLoading(false);
    };

    fetchPortfolio();
  }, []);

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  
  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4"
        >
          Our Work
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight"
        >
          Trusted by Industry Leaders
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-neutral-400 max-w-2xl mx-auto"
        >
          We've helped forward-thinking companies transform their digital presence and achieve exceptional results.
        </motion.p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeCategory === category
                ? 'bg-[#6366F1] text-white'
                : 'bg-[#1A1A1A] text-[#9CA3AF] hover:bg-[#252525] hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#1A1A1A] rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.a
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl overflow-hidden hover:border-[#6366F1]/30 transition-all hover:-translate-y-2"
            >
              {/* Card Header - Gradient */}
              <div className={`h-3 bg-gradient-to-r ${categoryColors[project.category] || 'from-gray-500 to-gray-600'}`} />
              
              {/* Content */}
              <div className="p-6">
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-[#1A1A1A] text-[#9CA3AF]">
                    {project.category}
                  </span>
                  <span className="text-xs text-[#6B7280]">{project.client}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#6366F1] transition-colors">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-[#9CA3AF] text-sm mb-4">
                  {project.description}
                </p>

                {/* Metrics */}
                {project.metrics && (
                  <div className="flex flex-wrap gap-2">
                    {project.metrics.map((metric, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs font-medium rounded bg-[#6366F1]/10 text-[#6366F1]"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                )}

                {/* Arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-[#6366F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#6366F1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.a>
          ))}
        </div>
      )}

      {/* View All Link */}
      <div className="text-center mt-12">
        <a
          href="https://www.sitelytc.com/work"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] hover:bg-[#252525] text-white rounded-xl transition-colors"
        >
          View All Projects
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
