import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getDocBySlug, getAllDocPaths, buildNavigation, getDocVersions, extractHeadings, buildSearchIndex } from '@/lib/docs';
import { DocLayout } from '@/components/docs/DocLayout';

interface DocPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

// Generate static params for all docs
export async function generateStaticParams() {
  // Include the root docs path
  const paths: { slug?: string[] }[] = [{ slug: undefined }];
  
  const versions = getDocVersions();
  
  for (const version of versions) {
    const docs = getAllDocPaths(version);
    paths.push(...docs.map(doc => ({ slug: doc.slug })));
  }
  
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
  
  const doc = await getDocBySlug(slug);
  
  if (!doc) {
    return {
      title: 'Page Not Found | Kritvia Docs',
    };
  }
  
  return {
    title: `${doc.meta.title} | Kritvia Docs`,
    description: doc.meta.description || `Official documentation for ${doc.meta.title}`,
    openGraph: {
      title: `${doc.meta.title} | Kritvia Docs`,
      description: doc.meta.description || `Official documentation for ${doc.meta.title}`,
      type: 'article',
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
  
  const version = 'v1'; // Default version
  const doc = await getDocBySlug(slug, version);
  
  if (!doc) {
    notFound();
  }
  
  const navigation = buildNavigation(version);
  const headings = extractHeadings(doc.html);
  const versions = getDocVersions();
  
  return (
    <DocLayout
      navigation={navigation}
      headings={headings}
      version={version}
      versions={versions}
      title={doc.meta.title}
      description={doc.meta.description}
    >
      <div dangerouslySetInnerHTML={{ __html: doc.html }} />
    </DocLayout>
  );
}
