import { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Research — AI & Technology Insights',
  description:
    'Original research, technical deep-dives, and industry analysis from the Kritvia engineering team on AI, cloud architecture, and modern software development.',
};

const research = [
  {
    id: '1',
    category: 'AI/ML',
    tag: 'Research Paper',
    title: 'Evaluating RAG Architectures for Enterprise Knowledge Bases',
    excerpt:
      'A systematic comparison of 8 RAG system architectures across accuracy, latency, and cost dimensions — including practical recommendations for production deployment.',
    date: 'March 2026',
    readTime: '18 min read',
    href: '/research/rag-architectures',
    featured: true,
  },
  {
    id: '2',
    category: 'Cloud',
    tag: 'Whitepaper',
    title: 'The True Cost of Cloud: A Framework for FinOps Optimization',
    excerpt:
      'How enterprises can reduce cloud spend by 30–50% through systematic FinOps practices, reserved instances strategy, and right-sizing automation.',
    date: 'February 2026',
    readTime: '22 min read',
    href: '/research/finops-framework',
    featured: true,
  },
  {
    id: '3',
    category: 'SaaS',
    tag: 'Case Analysis',
    title: 'Multi-Tenant Architecture Patterns at Scale: Lessons from 20 SaaS Products',
    excerpt:
      'Patterns, anti-patterns, and architectural decisions we observed across 20 SaaS products — and what separates those that scaled from those that didn\'t.',
    date: 'January 2026',
    readTime: '16 min read',
    href: '/research/multi-tenant-patterns',
    featured: false,
  },
  {
    id: '4',
    category: 'AI/ML',
    tag: 'Technical Report',
    title: 'LLM Fine-Tuning vs. RAG: When to Use Each Approach',
    excerpt:
      'A practical decision framework for choosing between fine-tuning and retrieval-augmented generation, with benchmark data from real-world deployments.',
    date: 'December 2025',
    readTime: '14 min read',
    href: '/research/llm-finetuning-vs-rag',
    featured: false,
  },
  {
    id: '5',
    category: 'Security',
    tag: 'Whitepaper',
    title: 'Zero Trust Architecture for AI Applications',
    excerpt:
      'Security considerations unique to AI systems — from model poisoning to prompt injection — and how to build Zero Trust defenses at the application layer.',
    date: 'November 2025',
    readTime: '20 min read',
    href: '/research/zero-trust-ai',
    featured: false,
  },
  {
    id: '6',
    category: 'DevOps',
    tag: 'Research',
    title: 'MLOps Maturity Model: A Benchmark for AI Teams',
    excerpt:
      'A five-level maturity framework for ML operations, with actionable improvement paths for each level, drawn from assessments of 40+ AI teams.',
    date: 'October 2025',
    readTime: '12 min read',
    href: '/research/mlops-maturity-model',
    featured: false,
  },
];

const topics = ['All', 'AI/ML', 'Cloud', 'SaaS', 'Security', 'DevOps', 'Data'];

export default function ResearchPage() {
  const featured = research.filter((r) => r.featured);
  const rest = research.filter((r) => !r.featured);

  return (
    <>
      {/* Hero */}
      <Section className="bg-neutral-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-600/10 rounded-full blur-3xl" />
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <div className="inline-block px-3 py-1 rounded-full bg-secondary-500/10 border border-secondary-500/20 text-secondary-400 text-xs font-semibold uppercase tracking-wider mb-6">
              Research & Insights
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Engineering Intelligence,{' '}
              <span className="bg-gradient-to-r from-secondary-400 to-primary-400 bg-clip-text text-transparent">
                Shared Openly
              </span>
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed">
              Original research, technical deep-dives, and benchmarks from our engineering team. We publish what we learn so the community can build better systems.
            </p>
          </div>
        </Container>
      </Section>

      {/* Topics Filter */}
      <div className="sticky top-20 z-30 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800">
        <Container>
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none">
            {topics.map((topic) => (
              <button
                key={topic}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  topic === 'All'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-400 hover:text-white'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* Featured Papers */}
      <Section className="bg-neutral-950">
        <Container>
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-8">Featured Research</h2>
          <div className="grid lg:grid-cols-2 gap-6 mb-16">
            {featured.map((paper) => (
              <Link
                key={paper.id}
                href={paper.href}
                className="group bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:bg-neutral-800/50 hover:border-primary-700/50 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 font-medium">
                    {paper.tag}
                  </span>
                  <span className="text-xs text-neutral-600">{paper.category}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-300 transition-colors leading-snug">
                  {paper.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">{paper.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-neutral-600">
                  <span>{paper.date}</span>
                  <span>{paper.readTime}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* All Papers */}
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-6">All Research</h2>
          <div className="space-y-4">
            {rest.map((paper) => (
              <Link
                key={paper.id}
                href={paper.href}
                className="group flex items-start gap-6 p-6 bg-neutral-900 border border-neutral-800 rounded-xl hover:bg-neutral-800/50 hover:border-neutral-700 transition-all"
              >
                <div className="flex-shrink-0 w-24 text-right">
                  <span className="text-xs text-neutral-600">{paper.date}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-500">
                      {paper.tag}
                    </span>
                    <span className="text-xs text-neutral-600">{paper.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors mb-2">{paper.title}</h3>
                  <p className="text-neutral-500 text-sm line-clamp-2">{paper.excerpt}</p>
                </div>
                <div className="flex-shrink-0 text-xs text-neutral-600 pt-1">{paper.readTime}</div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Newsletter CTA */}
      <Section className="bg-neutral-900/50 border-t border-neutral-800">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Get Research Directly in Your Inbox</h2>
            <p className="text-neutral-400 mb-8">New research, technical guides, and case studies delivered monthly. No spam, ever.</p>
            <form className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@company.com"
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl text-sm transition-colors flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </Container>
      </Section>
    </>
  );
}
