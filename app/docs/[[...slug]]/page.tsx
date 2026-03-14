import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { sanityFetch } from '@/lib/sanity/fetch';
import { getAllDocumentationSlugs, getDocumentationBySlugQuery, getRelatedDocumentation } from '@/lib/sanity/queries';
import { DocLayout } from '@/components/docs/DocLayout';
import Link from 'next/link';

interface DocPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

// Generate static params for all docs
export async function generateStaticParams() {
  // Include the root docs path
  const paths: { slug?: string[] }[] = [{ slug: undefined }];
  
  const slugs = await getAllDocumentationSlugs();
  paths.push(...slugs.map((slug: { slug: string }) => ({ slug: slug.slug })));
  
  return paths;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Redirect /docs to /docs/introduction
  if (!slug || slug.length === 0) {
    return {
      title: 'Kritvia Docs',
      description: 'Official developer documentation for Kritvia'
    };
  }
  
  const doc = await sanityFetch({
    query: getDocumentationBySlugQuery,
    params: { slug: slug.join('/') },
    tags: ['documentation', slug.join('/')]
  });

  if (!doc) {
    return {
      title: 'Page Not Found | Kritvia Docs',
    };
  }

  return {
    title: `${doc.seo?.seoTitle || doc.title} | Kritvia Docs`,
    description: doc.seo?.seoDescription || doc.description || `Official documentation for ${doc.title}`,
    openGraph: {
      title: `${doc.seo?.seoTitle || doc.title} | Kritvia Docs`,
      description: doc.seo?.seoDescription || doc.description || `Official documentation for ${doc.title}`,
      type: 'article',
      images: [
        {
          url: doc.seo?.ogImage?.asset?.url || '',
          width: 1200,
          height: 630,
          alt: doc.seo?.ogImage?.alt || doc.title
        }
      ]
    },
  };
}

// The doc page component
export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
   
  // Redirect /docs to /docs/introduction
  if (!slug || slug.length === 0) {
    redirect('/docs/introduction');
  }
   
  const doc = await sanityFetch({
    query: getDocumentationBySlugQuery,
    params: { slug: slug.join('/') },
    tags: ['documentation', slug.join('/')]
  });

  if (!doc) {
    notFound();
  }

  // Fetch related documentation (by category, excluding current documentation)
  const relatedDocs = await getRelatedDocumentation(
    slug.join('/'), 
    doc.category?.slug?.current || '', 
    3
  );

  // Build navigation from Sanity
  const documentation = await sanityFetch({
    query: `*[_type == "documentation" && defined(slug.current)]{
      _id,
      title,
      slug,
      category->{
        _id,
        title,
        description
      }
    } | order(category._id asc, title asc)`,
    tags: ['documentation']
  });

  // Build navigation structure compatible with NavCategory[]
  const navigation: { title: string; order: number; items: { title: string; slug: string; order: number }[] }[] = [];
  
  // Group by category
  const categoryMap: Record<string, { title: string; items: { title: string; slug: string }[] }> = {};
  
  documentation?.forEach((doc: any, index: number) => {
    const categoryTitle = doc.category?.title || 'General';
    if (!categoryMap[categoryTitle]) {
      categoryMap[categoryTitle] = {
        title: categoryTitle,
        items: []
      };
    }
    
    categoryMap[categoryTitle].items.push({
      title: doc.title,
      slug: doc.slug.current
    });
  });
  
  // Convert to array with order properties
  const navigationArray = Object.entries(categoryMap).map(([categoryTitle, categoryData], index) => ({
    title: categoryTitle,
    order: index + 1, // Simple ordering
    items: categoryData.items.map((item, itemIndex) => ({
      title: item.title,
      slug: item.slug,
      order: itemIndex + 1 // Simple ordering within category
    })).sort((a, b) => a.title.localeCompare(b.title)) // Sort items alphabetically
  }));
  
  // Sort categories alphabetically by title
  navigation.sort((a, b) => a.title.localeCompare(b.title));

  // Extract headings from content (simplified for now)
  const headings: { id: string; text: string; level: number }[] = []; // In a real implementation, you'd parse the content for headings

  return (
    <DocLayout
      navigation={navigation || []}
      headings={headings}
      version="v1"
      versions={['v1']}
      title={doc.title}
      description={doc.description}
    >
      <div dangerouslySetInnerHTML={{ __html: doc.content }} />
      
      {/* Related Documentation Section */}
      {relatedDocs && relatedDocs.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8">
            Related Documentation
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {relatedDocs.map((relatedDoc: any) => (
              <Link
                key={relatedDoc._id}
                href={`/docs/${relatedDoc.slug.current}`}
                className="group flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-800/50 hover:border-neutral-700 transition-all"
              >
                {relatedDoc.category && (
                  <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-500 mb-3 self-start">
                    {relatedDoc.category.title}
                  </span>
                )}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors leading-snug flex-1">
                  {relatedDoc.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-4 line-clamp-3">{relatedDoc.description}</p>
                <div className="mt-auto flex items-center gap-3 text-xs text-neutral-600">
                  <span className="text-neutral-400">Documentation</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </DocLayout>
  );
}
