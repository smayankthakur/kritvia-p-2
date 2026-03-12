import { defineConfig } from 'sanity';
import { schemaTypes } from './schemaTypes';

export const config = defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: process.env.NODE_ENV === 'production', // Enable CDN cache in production
  schema: {
    types: schemaTypes,
  },
});