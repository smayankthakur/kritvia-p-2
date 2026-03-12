import { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section } from '@/components/ui';
import { getPosts } from '@/lib/sanity/queries';

export const metadata: Metadata = {
  title: 'Blog — AI & Technology Insights | Kritvia',
  description:
    'Expert insights on AI development, cloud architecture, SaaS engineering, and technology strategy from the Kritvia team.',
};

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  image?: {
    alt: string;
    asset: {
      _id: string;
      url: string;
    };
  };
  author?: {
    _id: string;
    name: string;
    slug: { current: string };
    image?: {
      alt: string;
      asset: {
        _id: string;
        url: string;
      };
    };
  };
  category?: {
    _id: string;
    title: string;
    slug: { current: string };
  };
}

// Fallback posts for when CMS has no content
const FALLBACK_POSTS = [
  {
    _id: '1',
    title: 'Building Production-Ready RAG Systems: A Complete Guide',
    slug: { current: 'building-rag-systems' },
    excerpt: 'Everything you need to know about designing, building, and deploying RAG pipelines that perform reliably at enterprise scale.',
    publishedAt: '2026-03-01',
    category: { _id: '1', title: 'AI/ML', slug: { current: 'ai-ml' } },
  },
  {
    _id: '2',
    title: 'Why Most SaaS Startups Get Multi-Tenancy Wrong',
    slug: { current: 'saas-multi-tenancy' },
    excerpt: 'The three architectural mistakes that haunt SaaS companies at scale, and how to avoid them from day one.',
    publishedAt: '2026-02-15',
    category: { _id: '2', title: 'SaaS', slug: { current: 'saas' } },
  },
  {
    _id: '3',
    title: 'The 2026 State of Enterprise AI: What\'s Actually Working',
    slug: { current: 'enterprise-ai-2026' },
    excerpt: 'After 50+ enterprise AI projects, here\'s what we\'ve learned about what separates successful AI initiatives from expensive failures.',
    publishedAt: '2026-02-01',
    category: { _id: '3', title: 'Strategy', slug: { current: 'strategy' } },
  },
  {
    _id: '4',
    title: 'Kubernetes Cost Optimization: Cutting 40% Without Sacrificing Performance',
    slug: { current: 'kubernetes-cost-optimization' },
    excerpt: 'Practical techniques for reducing Kubernetes infrastructure costs through right-sizing, spot instances, and intelligent autoscaling.',
    publishedAt: '2026-01-20',
    category: { _id: '4', title: 'Cloud', slug: { current: 'cloud' } },
  },
  {
    _id: '5',
    title: 'TypeScript Design Patterns for Large-Scale Next.js Applications',
    slug: { current: 'typescript-nextjs-patterns' },
    excerpt: 'Architectural patterns and TypeScript conventions that keep large Next.js codebases maintainable as teams and features grow.',
    publishedAt: '2026-01-10',
    category: { _id: '5', title: 'Engineering', slug: { current: 'engineering' } },
  },
  {
    _id: '6',
    title: 'Prompt Engineering in Production: Beyond Basic Prompts',
    slug: { current: 'prompt-engineering-production' },
    excerpt: 'Advanced prompting strategies — chain-of-thought, few-shot learning, and structured outputs — for production AI applications.',
    publishedAt: '2025-12-20',
    category: { _id: '6', title: 'AI/ML', slug: { current: 'ai-ml' } },
  },
];

async function getPostsFromSanity(): Promise<Post[]> {
  try {
    const posts = await getPosts();
    return posts && posts.length > 0 ? posts : FALLBACK_POSTS;
  } catch {
    return FALLBACK_POSTS;
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function BlogPage() {
  // Show loading state while fetching data
  const postsPromise = getPostsFromSanity();
  
  // For simplicity in this example, we'll await directly
  // In a real app, you might use React Suspense or a more sophisticated loading approach
  const posts = await postsPromise;
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      {/* Hero */}
      <Section className="bg-neutral-950 relative overflow-hidden pb-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px]" />
        <Container className="relative z-10">
          <div className="text-center max-w-3xl mx-auto pb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-semibold uppercase tracking-wider mb-6">
              Blog
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
              Insights from the{' '}
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Engineering Floor
              </span>
            </h1>
            <p className="text-xl text-neutral-400">
              Practical articles on AI, cloud architecture, and modern software engineering. No fluff, just what actually works in production.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-neutral-950">
        <Container>
          {/* Featured Post */}
          {featured && (
            <Link
              href={`/blog/${featured.slug.current}`}
              className="group block mb-12 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-primary-700/50 transition-all"
            >
              <div className="p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 font-medium">
                    Featured
                  </span>
                  {featured.category && (
                    <span className="text-xs text-neutral-600">{featured.category.title}</span>
                  )}
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-primary-300 transition-colors max-w-3xl">
                  {featured.title}
                </h2>
                <p className="text-neutral-400 leading-relaxed mb-4 max-w-2xl">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">{formatDate(featured.publishedAt)}</span>
                  <span className="text-primary-400 text-sm font-medium group-hover:text-primary-300 transition-colors">
                    Read article →
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Post Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug.current}`}
                className="group flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-800/50 hover:border-neutral-700 transition-all"
              >
                {post.category && (
                  <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-500 mb-3 self-start">
                    {post.category.title}
                  </span>
                )}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors leading-snug flex-1">
                  {post.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                <span className="text-xs text-neutral-600 mt-auto">{formatDate(post.publishedAt)}</span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Newsletter */}
      <Section className="bg-neutral-900/50 border-t border-neutral-800">
        <Container>
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Subscribe to Our Newsletter</h2>
            <p className="text-neutral-400 mb-6 text-sm">Monthly deep-dives on AI, engineering, and technology strategy. 3,000+ subscribers.</p>
            <form className="flex gap-3">
              <input
                type="email"
                placeholder="your@company.com"
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl text-sm transition-colors flex-shrink-0"
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
