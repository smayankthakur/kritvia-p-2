import { notFound } from 'next/navigation';
import { sanityFetch } from '@/lib/sanity/fetch';
import { getProductBySlug, getProductBySlugQuery, getAllProductSlugs, getRelatedProducts } from '@/lib/sanity/queries';
import ProductLoading from './loading';
import PortableTextRenderer from '@/components/PortableTextRenderer';
import { getImageUrl } from '@/lib/sanity/image';
import Link from 'next/link';

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

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await sanityFetch({
    query: getProductBySlugQuery,
    params: { slug: params.slug },
    tags: ['product', params.slug]
  });

  if (!product) {
    return {
      title: 'Product not found — Kritvia',
      description: 'The requested product could not be found.',
    };
  }

   return {
     title: `${product.title} — Kritvia`,
     description: product.tagline || product.description || 'Discover our AI-powered products.',
     openGraph: {
       title: `${product.title} — Kritvia`,
       description: product.tagline || product.description || 'Discover our AI-powered products.',
       images: [
         {
           url: getImageUrl(product.image.asset, 1200, 630, 'webp'),
           width: 1200,
           height: 630,
           alt: product.image.alt
         }
       ]
     },
     twitter: {
       card: 'summary_large_image',
       title: `${product.title} — Kritvia`,
       description: product.tagline || product.description || 'Discover our AI-powered products.',
       images: [getImageUrl(product.image.asset, 1200, 630, 'webp')]
     }
   };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  // Show loading state while fetching data
  const productPromise = sanityFetch({
    query: getProductBySlugQuery,
    params: { slug: params.slug },
    tags: ['product', params.slug]
  });
    
  // For simplicity in this example, we'll await directly
  // In a real app, you might use React Suspense or a more sophisticated loading approach
  const product = await productPromise;

  if (!product) {
    notFound();
  }

  // Fetch related products (by category, excluding current product)
  const relatedProducts = await getRelatedProducts(
    params.slug, 
    product.category?.slug?.current || '', 
    3
  );

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
               src={getImageUrl(product.image.asset, 1200, 675, 'webp')}
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
                      src={getImageUrl(image.asset, 400, 300, 'webp')}
                      alt={image.alt}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Products Section */}
          {relatedProducts && relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-bold text-white mb-8">
                You might also like
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {relatedProducts.map((relatedProduct: any) => (
                  <Link
                    key={relatedProduct._id}
                    href={`/products/${relatedProduct.slug.current}`}
                    className="group flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-800/50 hover:border-neutral-700 transition-all"
                  >
                    {relatedProduct.category && (
                      <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-500 mb-3 self-start">
                        {relatedProduct.category.title}
                      </span>
                    )}
                    {relatedProduct.image && (
                      <div className="mb-4">
                        <img
                          src={getImageUrl(relatedProduct.image.asset, 800, 450, 'webp')}
                          alt={relatedProduct.image.alt}
                          className="rounded-xl w-full h-48 object-cover"
                        />
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-300 transition-colors leading-snug flex-1">
                      {relatedProduct.title}
                    </h3>
                    {relatedProduct.tagline && (
                      <p className="text-neutral-500 text-sm leading-relaxed mb-4 line-clamp-2">{relatedProduct.tagline}</p>
                    )}
                    <div className="mt-auto flex items-center gap-3 text-xs text-neutral-600">
                      <span>${relatedProduct.price} {relatedProduct.priceUnit}</span>
                    </div>
                  </Link>
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
