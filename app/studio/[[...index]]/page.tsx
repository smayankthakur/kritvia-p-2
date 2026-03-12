import { sanityClient } from '@/lib/sanity/client';
import { StudioLogo } from '@sanity/base';
import { defaultDocumentNode, resolveProductionUrl } from './config';
import { VisionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from '@/sanity/schemaTypes';
import { NextjsDocumentTitle } from 'next-sanity/desk-tool';

// Configure the Sanity client
export const config = defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'nl1z2yzp',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false, // Set to false if you want to bypass the CDN (e.g., for preview)
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({
      defaultDocumentNode,
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Blog Posts')
              .icon(() => <StudioLogo />)
              .child(S.documentTypeList('post').title('Blog Posts')),
            S.listItem()
              .title('Products')
              .icon(() => <StudioLogo />)
              .child(S.documentTypeList('product').title('Products')),
            S.listItem()
              .title('Pages')
              .icon(() => <StudioLogo />)
              .child(S.documentTypeList('page').title('Pages')),
            S.listItem()
              .title('Authors')
              .icon(() => <StudioLogo />)
              .child(S.documentTypeList('author').title('Authors')),
            S.listItem()
              .title('Categories')
              .icon(() => <StudioLogo />)
              .child(S.documentTypeList('category').title('Categories')),
            S.divider(),
            S.listItem()
              .title('Site Settings')
              .icon(() => <StudioLogo />)
              .child(S.documentTypeList('siteSettings').title('Site Settings')),
          ]),
    }),
    // VisionTool enables the Vision plugin in the studio, allowing you to query your content with GROQ
    // Remove if you don't want to use Vision in the studio
    VisionTool(),
  ],
});

// Define how documents are displayed in the structure tool
function defaultDocumentNode(S: any, { schemaType }: { schemaType: string }) {
  // You can customize the document node based on the schema type
  // For example, you can add a preview pane for certain types
  return S.document().views([
    S.view.form(),
    // If you have a preview component for a specific type, you can add it here
    // For now, we just use the default form view
  ]);
}

// Resolve production URL for image assets
export const getImageUrl = (source: any) => {
  // Implement your own image URL builder if needed
  // For simplicity, we'll return the URL from the asset
  return source?.asset?._ref ? `https://cdn.sanity.io/images/nl1z2yzp/production/${source.asset._ref}.jpg` : undefined;
};

// This is the page that will render the Sanity Studio
export default async function StudioPage() {
  return null; // The studio is rendered by the next-sanity middleware
}

// Export the config for use in other files (e.g., in the client)
export { config };