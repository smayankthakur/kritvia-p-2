import Script from 'next/script';
import { Container } from '@/components/ui';
import { FooterBrand } from './FooterBrand';
import { FooterColumn } from './FooterColumn';
import { FooterNewsletter } from './FooterNewsletter';
import { FooterTrust } from './FooterTrust';
import { FooterSocial } from './FooterSocial';
import { footerColumns, organizationSchema } from '@/lib/navigation/footerLinks';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Organization Schema */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <footer className="bg-neutral-950 border-t border-neutral-800">
        <Container>
          {/* Main Footer Content */}
          <div className="py-16">
            {/* Top Section: Brand + Navigation Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-12 mb-12">
              {/* Brand Column */}
              <div className="lg:col-span-2">
                <FooterBrand />
              </div>

              {/* Navigation Columns */}
              <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {footerColumns.map((column) => (
                  <FooterColumn
                    key={column.title}
                    title={column.title}
                    links={column.links}
                  />
                ))}
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="mb-12">
              <div className="max-w-md">
                <FooterNewsletter />
              </div>
            </div>

            {/* Trust Section */}
            <div className="border-t border-b border-neutral-800/50 py-6 mb-6">
              <FooterTrust />
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="py-6 border-t border-neutral-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Copyright */}
              <p className="text-sm text-neutral-500">
                © {currentYear} Kritvia Technologies. All rights reserved.
              </p>

              {/* Address */}
              <p className="text-sm text-neutral-500 hidden md:block">
                100 Enterprise Way, Suite 500, San Francisco, CA 94105
              </p>

              {/* Social Icons */}
              <FooterSocial />
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
}
