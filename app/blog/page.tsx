import { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section } from '@/components/ui';
import { sanityFetch } from '@/lib/sanity/fetch';
import { getPostsQuery } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/image';

export const revalidate = 60;

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
  status?: string;
  updatedAt?: string;
  featuredImage?: {
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
  seo?: {
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function BlogPage() {
  const posts = await sanityFetch({
    query: getPostsQuery,
    tags: ['posts']
  });

  if (posts.length === 0) {
    return (
      <Section className="bg-neutral-950">
        <Container>
          <p className="text-neutral-400 text-center py-12">
            No blog posts available yet
          </p>
        </Container>
      </Section>
    );
  }

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
                 {featured.featuredImage && (
                   <div className="mb-6">
                     <img
                       src={urlFor(featured.featuredImage.asset, { width: 800, height: 450, format: 'webp' })}
                       alt={featured.featuredImage.alt}
                       className="rounded-xl w-full h-48 object-cover"
                     />
                   </div>
                 )}
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
                {featured.author && (
                  <div className="mt-4 flex items-center gap-3 text-sm text-neutral-500">
                 {featured.author.image ? (
                       <img
                         src={urlFor(featured.author.image.asset, { width: 40, height: 40, format: 'webp' })}
                         alt={featured.author.name}
                         className="w-10 h-10 rounded-full object-cover"
                       />
                     ) : null}
                    <span>{featured.author.name}</span>
                  </div>
                )}
              </div>
            </Link>
          )}

          {/* Post Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post: Post) => (
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
                 {post.featuredImage && (
                   <div className="mb-4">
                     <img
                       src={urlFor(post.featuredImage.asset, { width: 800, height: 450, format: 'webp' })}
                       alt={post.featuredImage.alt}
                       className="rounded-xl w-full h-48 object-cover"
                     />
                   </div>
                 )}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors leading-snug flex-1">
                  {post.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="mt-auto flex items-center gap-3 text-xs text-neutral-600">
                   {post.author && (
                     <>
                       {post.author.image ? (
                         <img
                           src={urlFor(post.author.image.asset, { width: 32, height: 32, format: 'webp' })}
                           alt={post.author.name}
                           className="w-8 h-8 rounded-full object-cover"
                         />
                       ) : null}
                       <span>{post.author.name}</span>
                     </>
                   )}
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
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
