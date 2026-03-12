import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProductSlugs } from '@/lib/sanity/queries';
import ProductLoading from '../loading';
import PortableTextRenderer from '@/components/PortableTextRenderer';

interface Product {
  _id: string;
  title: string;
  slug: { current: string };
  tagline: string;
  description: string;
  price: number;
  priceUnit: string;
  featured: boolean;
  image: {
    alt: string;
    asset: {
      _id: string;
      url: string;
    };
  };
  features: string[];
  gallery: Array<{
    alt: string;
    asset: {
      _id: string;
      url: string;
    };
  }>;
  body: any[];
  category: {
    _id: string;
    title: string;
    slug: { current: string };
  };
}

export const revalidate = 60; // ISR: revalidate every 60 seconds

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug: { slug: { current: string } }) => ({
    slug: slug.slug.current,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  // Show loading state while fetching data
  const productPromise = getProductBySlug(params.slug);
  
  // For simplicity in this example, we'll await directly
  // In a real app, you might use React Suspense or a more sophisticated loading approach
  const product = await productPromise;

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-16">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4 text-sm">
          <span className="px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 font-medium">
            {product.category.title}
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
          {product.title}
        </h1>
        {product.tagline && (
          <p className="text-xl text-neutral-400 mb-6">
            {product.tagline}
          </p>
        )}
        {product.image && (
          <div className="mb-8">
            <img
              src={product.image.asset.url}
              alt={product.image.alt}
              className="rounded-xl w-full h-96 object-cover"
            />
          </div>
        )}
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
          <p className="text-neutral-300 leading-relaxed">
            {product.description}
          </p>
        </section>

        {product.features.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
            <ul className="list-disc list-space pl-5 space-y-2 text-neutral-300">
              {product.features.map((feature: string, index: number) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </section>
        )}

        {product.gallery.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.gallery.map((image: { alt: string; asset: { _id: string; url: string } }, index: number) => (
                <div key={index} className="rounded-xl overflow-hidden">
                  <img
                    src={image.asset.url}
                    alt={image.alt}
                    className="w-full h-48 object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Portable Text content */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Content</h2>
          <PortableTextRenderer value={product.body} />
        </section>
      </div>
    </div>
  );
}
