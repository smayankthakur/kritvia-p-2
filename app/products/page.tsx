import { Metadata } from 'next';
import { Container, Section, Grid, Card, CardContent, Button } from '@/components/ui';
import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity/fetch';
import { getProductsQuery } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/image';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Products - Kritvia',
  description: 'Discover our suite of AI-powered products designed to transform your business operations.',
};

interface Product {
  _id: string;
  title: string;
  slug: { current: string };
  tagline: string;
  description: string;
  price: number;
  priceUnit: string;
  featured: boolean;
  featuredImage?: {
    alt: string;
    asset: {
      _id: string;
      url: string;
    };
  };
  features: string[];
  category?: {
    _id: string;
    title: string;
    slug: { current: string };
  };
}

export default async function ProductsPage() {
  const products = await sanityFetch({
    query: getProductsQuery,
    tags: ['products']
  });

  if (!products || products.length === 0) {
    return (
      <>
        <Section className="min-h-[50vh] flex items-center pt-20">
          <Container>
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold text-white mb-6">
                Products
              </h1>
              <p className="text-xl text-slate-400">
                No products available yet
              </p>
            </div>
          </Container>
        </Section>
      </>
    );
  }

  return (
    <>
      <Section className="min-h-[50vh] flex items-center pt-20">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-white mb-6">
              Products
            </h1>
            <p className="text-xl text-slate-400">
              Ready-to-deploy AI platforms built for enterprise scale. Transform your business with our proven solutions.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Grid cols={1} gap="xl">
            {products.map((product: Product) => (
              <Card key={product._id} id={product.slug.current}>
                <CardContent className="p-12">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                     <div>
                        {product.featuredImage && (
                          <div className="mb-6">
                            <img
                              src={urlFor(product.featuredImage.asset, { width: 96, height: 96, format: 'webp' })}
                              alt={product.featuredImage.alt}
                              className="w-24 h-24 object-contain"
                            />
                          </div>
                        )}
                       <h2 className="text-3xl font-bold text-white mb-2">
                         {product.title}
                       </h2>
                       {product.tagline && (
                         <p className="text-primary-400 font-medium mb-4">
                           {product.tagline}
                         </p>
                       )}
                       <p className="text-slate-400 mb-6">
                         {product.description}
                       </p>
                       {product.features.length > 0 && (
                         <ul className="space-y-3 mb-8">
                           {product.features.map((feature: string) => (
                             <li key={feature} className="flex items-center gap-3 text-slate-300">
                               <svg className="w-5 h-5 text-primary-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                               </svg>
                               {feature}
                             </li>
                           ))}
                         </ul>
                       )}
                       <Link href={`/products/${product.slug.current}`}>
                         <Button>View Details</Button>
                       </Link>
                     </div>
                     <div className={`aspect-square bg-gradient-to-br ${product.gradient || 'from-purple-500 to-pink-500'} rounded-2xl flex items-center justify-center opacity-80`}>
                       <span className="text-9xl opacity-50">{product.icon || '🧠'}</span>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             ))}
           </Grid>
         </Container>
       </Section>

       <Section variant="muted">
         <Container>
           <div className="text-center">
             <h2 className="text-3xl font-bold text-white mb-4">Need a custom solution?</h2>
             <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
               We also offer custom product development tailored to your specific business requirements.
             </p>
             <Link href="/contact">
               <Button>Contact Sales</Button>
             </Link>
           </div>
         </Container>
       </Section>
     </>
  );
}
