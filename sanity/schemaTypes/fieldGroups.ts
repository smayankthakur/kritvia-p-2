// Reusable field groups for Sanity schemas
import { Rule } from 'sanity'

export const seoFields = [
  {
    name: 'seo',
    title: 'SEO',
    type: 'object',
    fields: [
      {
        name: 'seoTitle',
        title: 'SEO Title',
        type: 'string',
        validation: (Rule: Rule) => Rule.max(60),
      },
      {
        name: 'seoDescription',
        title: 'SEO Description',
        type: 'text',
        rows: 3,
        validation: (Rule: Rule) => Rule.max(160),
      },
      {
        name: 'seoKeywords',
        title: 'SEO Keywords',
        type: 'array',
        of: [{ type: 'string' }],
      },
      {
        name: 'ogImage',
        title: 'OG Image',
        type: 'image',
        options: { hotspot: true },
      },
      {
        name: 'canonicalUrl',
        title: 'Canonical URL',
        type: 'url',
      },
    ],
  },
]

export const contentBlocks = [
  {
    type: 'block',
  },
  {
    type: 'image',
    fields: [
      {
        name: 'alt',
        title: 'Alt text',
        type: 'string',
      },
    ],
    options: { hotspot: true },
  },
  {
    type: 'code',
    name: 'codeBlock',
    title: 'Code Block',
  },
]

export const ctaBlock = [
  {
    name: 'heading',
    title: 'Heading',
    type: 'string',
  },
  {
    name: 'subheading',
    title: 'Subheading',
    type: 'string',
  },
  {
    name: 'buttonText',
    title: 'Button Text',
    type: 'string',
  },
  {
    name: 'buttonLink',
    title: 'Button Link',
    type: 'url',
  },
]

export const mediaBlock = [
  {
    name: 'image',
    title: 'Image',
    type: 'image',
    options: { hotspot: true },
    fields: [
      {
        name: 'alt',
        title: 'Alternative Text',
        type: 'string',
      },
    ],
  },
  {
    name: 'caption',
    title: 'Caption',
    type: 'string',
  },
]