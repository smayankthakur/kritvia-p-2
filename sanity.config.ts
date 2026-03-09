/**
 * Root-level Sanity Studio configuration.
 * Used by `sanity dev` and `sanity build` for the standalone studio on port 3333.
 */
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemaTypes';

export default defineConfig({
  name: 'kritvia',
  title: 'Kritvia CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem().title('Services').id('service').child(S.documentTypeList('service')),
            S.listItem().title('Solutions').id('solution').child(S.documentTypeList('solution')),
            S.listItem().title('Case Studies').id('caseStudy').child(S.documentTypeList('caseStudy')),
            S.listItem().title('Blog Posts').id('blog').child(S.documentTypeList('blog')),
            S.listItem().title('Products').id('product').child(S.documentTypeList('product')),
            S.divider(),
            S.listItem().title('Technologies').id('technology').child(S.documentTypeList('technology')),
            S.listItem().title('Industries').id('industry').child(S.documentTypeList('industry')),
            S.listItem().title('Team').id('team').child(S.documentTypeList('team')),
            S.listItem().title('Testimonials').id('testimonial').child(S.documentTypeList('testimonial')),
            S.divider(),
            S.listItem().title('Authors').id('author').child(S.documentTypeList('author')),
            S.listItem().title('Categories').id('category').child(S.documentTypeList('category')),
            S.listItem().title('Pages').id('page').child(S.documentTypeList('page')),
            S.divider(),
            S.listItem().title('Site Settings').id('siteSettings').child(S.documentTypeList('siteSettings')),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
