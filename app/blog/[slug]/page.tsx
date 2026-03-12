import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPostSlugs } from '@/lib/sanity/queries';
import BlogPostLoading from './loading';
import PortableTextRenderer from '@/components/PortableTextRenderer';

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

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  // Show loading state while fetching data
  const postPromise = getPostBySlug(params.slug);
  
  // For simplicity in this example, we'll await directly
  // In a real app, you might use React Suspense or a more sophisticated loading approach
  const post = await postPromise;

  if (!post) {
    notFound();
  }

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
              src={post.image.asset.url}
              alt={post.image.alt}
              className="rounded-xl w-full h-96 object-cover"
            />
          </div>
        )}
      </header>

      <div className="text-neutral-300">
        <PortableTextRenderer value={post.content} />
      </div>

      <footer className="mt-12 pt-8 border-t border-neutral-800">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {post.author.image ? (
              <img
                src={post.author.image.asset.url}
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