import { notFound } from 'next/navigation';
import { sanityFetch } from '@/lib/sanity/fetch';
import { getPostBySlugQuery, getAllPostSlugs, getRelatedPosts } from '@/lib/sanity/queries';
import BlogPostLoading from './loading';
import PortableTextRenderer from '@/components/PortableTextRenderer';
import { getImageUrl } from '@/lib/sanity/image';
import Link from 'next/link';

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  content: any[];
  publishedAt: string;
  image: {
    alt: string;
    asset: {
      _id: string;
      url: string;
    };
  };
  author: {
    _id: string;
    name: string;
    slug: { current: string };
    bio: any[];
    image: {
      alt: string;
      asset: {
        _id: string;
        url: string;
      };
    };
  };
  category: {
    _id: string;
    title: string;
    slug: { current: string };
    description: string;
  };
}

export const revalidate = 60; // ISR: revalidate every 60 seconds

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug: { slug: { current: string } }) => ({
    slug: slug.slug.current,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await sanityFetch({
    query: getPostBySlugQuery,
    params: { slug: params.slug },
    tags: ['post', params.slug]
  });

  if (!post) {
    return {
      title: 'Post not found — Kritvia',
      description: 'The requested blog post could not be found.',
    };
  }

   return {
     title: `${post.title} — Kritvia`,
     description: post.excerpt || 'Expert insights on AI, cloud architecture, and technology strategy from Kritvia.',
     openGraph: {
       title: `${post.title} — Kritvia`,
       description: post.excerpt || 'Expert insights on AI, cloud architecture, and technology strategy from Kritvia.',
       images: [
         {
           url: getImageUrl(post.image.asset, 1200, 630, 'webp'),
           width: 1200,
           height: 630,
           alt: post.image.alt
         }
       ]
     },
     twitter: {
       card: 'summary_large_image',
       title: `${post.title} — Kritvia`,
       description: post.excerpt || 'Expert insights on AI, cloud architecture, and technology strategy from Kritvia.',
       images: [getImageUrl(post.image.asset, 1200, 630, 'webp')]
     }
   };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  // Show loading state while fetching data
  const postPromise = sanityFetch({
    query: getPostBySlugQuery,
    params: { slug: params.slug },
    tags: ['post', params.slug]
  });
     
  // For simplicity in this example, we'll await directly
  // In a real app, you might use React Suspense or a more sophisticated loading approach
  const post = await postPromise;

  if (!post) {
    notFound();
  }

  // Fetch related posts (by category or tags, excluding current post)
  const relatedPosts = await getRelatedPosts(
    params.slug, 
    post.category?.slug?.current || '', 
    post.tags?.map((tag: any) => tag.slug?.current) || [], 
    3
  );

  return (
    <article className="prose prose-lg:prose-xl mx-auto py-16">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4 text-sm">
          <span className="px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 font-medium">
            {post.category.title}
          </span>
          <time dateTime={post.publishedAt} className="text-neutral-500">
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </time>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
          {post.title}
        </h1>
         {post.image && (
          <div className="mb-8">
            <img
              src={getImageUrl(post.image.asset, 1200, 675, 'webp')}
              alt={post.image.alt}
              className="rounded-xl w-full h-96 object-cover"
            />
          </div>
        )}
      </header>

      <div className="text-neutral-300">
        <PortableTextRenderer value={post.content} />
      </div>

      {/* Related Posts Section */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8">
            You might also like
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {relatedPosts.map((relatedPost: any) => (
              <Link
                key={relatedPost._id}
                href={`/blog/${relatedPost.slug.current}`}
                className="group flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-800/50 hover:border-neutral-700 transition-all"
              >
                {relatedPost.category && (
                  <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-500 mb-3 self-start">
                    {relatedPost.category.title}
                  </span>
                )}
                {relatedPost.featuredImage && (
                  <div className="mb-4">
                    <img
                      src={getImageUrl(relatedPost.featuredImage.asset, 800, 450, 'webp')}
                      alt={relatedPost.featuredImage.alt}
                      className="rounded-xl w-full h-48 object-cover"
                    />
                  </div>
                )}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors leading-snug flex-1">
                  {relatedPost.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-4 line-clamp-3">{relatedPost.excerpt}</p>
                <div className="mt-auto flex items-center gap-3 text-xs text-neutral-600">
                  {relatedPost.author && (
                    <>
                      {relatedPost.author.image ? (
                        <img
                          src={getImageUrl(relatedPost.author.image.asset, 32, 32, 'webp')}
                          alt={relatedPost.author.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : null}
                      <span>{relatedPost.author.name}</span>
                    </>
                  )}
                  <span>{new Date(relatedPost.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer className="mt-12 pt-8 border-t border-neutral-800">
        <div className="flex items-center gap-4">
           <div className="flex-shrink-0">
             {post.author.image ? (
               <img
                 src={getImageUrl(post.author.image.asset, 80, 80, 'webp')}
                 alt={post.author.image.alt}
                 className="w-16 h-16 rounded-full object-cover border-2 border-primary-500"
               />
             ) : null}
           </div>
          <div>
            <h3 className="font-semibold text-white mb-1">
              {post.author.name}
            </h3>
            <p className="text-neutral-400 text-sm">
              {post.author.bio && post.author.bio.length > 0 ? (
                <span>Author bio would be rendered here</span>
              ) : (
                <span>No bio available</span>
              )}
            </p>
          </div>
        </div>
      </footer>
    </article>
  );
}