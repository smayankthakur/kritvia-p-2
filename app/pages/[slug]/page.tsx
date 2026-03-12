import { notFound } from 'next/navigation';
import { getPageBySlug, getAllPageSlugs } from '@/lib/sanity/queries';
import PageLoading from './loading';

interface Page {
  _id: string;
  title: string;
  slug: { current: string };
  subtitle: string;
  description: string;
  heroImage: {
    alt: string;
    asset: {
      _id: string;
      url: string;
    };
  };
  sections: any[];
  seo: {
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];
  };
}

export const revalidate = 60; // ISR: revalidate every 60 seconds

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs.map((slug: { slug: { current: string } }) => ({
    slug: slug.slug.current,
  }));
}

export default async function PagePage({
  params,
}: {
  params: { slug: string };
}) {
  // Show loading state while fetching data
  const pagePromise = getPageBySlug(params.slug);
  
  // For simplicity in this example, we'll await directly
  // In a real app, you might use React Suspense or a more sophisticated loading approach
  const page = await pagePromise;

  if (!page) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-16">
      <div className="mb-8">
        {page.heroImage && (
          <div className="mb-6">
            <img
              src={page.heroImage.asset.url}
              alt={page.heroImage.alt}
              className="rounded-xl w-full h-64 object-cover"
            />
          </div>
        )}
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-xl text-neutral-400 mb-6">
            {page.subtitle}
          </p>
        )}
        {page.description && (
          <p className="text-neutral-300 leading-relaxed mb-6">
            {page.description}
          </p>
        )}
      </div>

      {/* Render sections */}
      {page.sections.map((section: any, index: number) => (
        <section key={index} className="mb-12">
          {/* This is a simplified rendering. In a real app, you would have a more complex structure for sections. */}
          <div className="bg-neutral-800/50 p-4 rounded-lg">
            <pre className="text-sm">{JSON.stringify(section, null, 2)}</pre>
          </div>
        </section>
      ))}

      {/* SEO meta tags (in a real app, you would use next/head or similar) */}
      {/* For demonstration, we'll just show them in a comment or at the bottom */}
      <div className="mt-8 text-neutral-500 text-sm">
        <p>SEO Title: {page.seo.seoTitle}</p>
        <p>SEO Description: {page.seo.seoDescription}</p>
        <p>SEO Keywords: {page.seo.seoKeywords.join(', ')}</p>
      </div>
    </div>
  );
}