import { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section } from '@/components/ui';
import { sanityFetch } from '@/lib/sanity/fetch';
import { getPostsByTag, getAllTagSlugs } from '@/lib/sanity/queries';
import { getImageUrl } from '@/lib/sanity/image';

export const revalidate = 60;

export async function generateStaticParams() {
  const tags = await getAllTagSlugs();
  return tags.map((tag: { slug: { current: string } }) => ({
    slug: tag.slug.current,
  }));
}

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

export default async function TagPage({ params }: { params: { slug: string } }) {
  const tagSlug = params.slug;
  const posts = await sanityFetch({
    query: getPostsByTag(tagSlug),
    tags: ['posts', `tag-${tagSlug}`]
  });

  if (!posts || posts.length === 0) {
    return (
      <Section className="bg-neutral-950">
        <Container>
          <p className="text-neutral-400 text-center py-12">
            No posts found for this tag
          </p>
        </Container>
      </Section>
    );
  }

  // Fetch tag details for metadata and page title
  const tagDetails = await sanityFetch({
    query: `*[_type == "tag" && slug.current == $slug][0]{
      _id,
      title,
      description
    }`,
    params: { slug: tagSlug },
    tags: ['tag', tagSlug]
  });

  return (
    <>
      {/* Hero */}
      <Section className="bg-neutral-950 relative overflow-hidden pb-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px]" />
        <Container className="relative z-10">
          <div className="text-center max-w-3xl mx-auto pb-16">
            {tagDetails && (
              <>
                <div className="inline-block px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-semibold uppercase tracking-wider mb-6">
                  {tagDetails.title}
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
                  {tagDetails.title} Posts
                </h1>
                {tagDetails.description && (
                  <p className="text-xl text-neutral-400">
                    {tagDetails.description}
                  </p>
                )}
              </>
            )}
          </div>
        </Container>
      </Section>

      <Section className="bg-neutral-950">
        <Container>
          {/* Post Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: Post) => (
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
                      src={getImageUrl(post.featuredImage.asset, 800, 450, 'webp')}
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
                          src={getImageUrl(post.author.image.asset, 32, 32, 'webp')}
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