import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'heroSection',
          title: 'Hero Section',
          fields: [
            { name: 'heading', type: 'string', title: 'Heading' },
            { name: 'subheading', type: 'text', title: 'Subheading' },
            { name: 'ctaText', type: 'string', title: 'CTA Text' },
            { name: 'ctaLink', type: 'string', title: 'CTA Link' },
            { name: 'image', type: 'image', title: 'Image', options: { hotspot: true } },
          ],
        },
        {
          type: 'object',
          name: 'contentSection',
          title: 'Content Section',
          fields: [
            { name: 'heading', type: 'string', title: 'Heading' },
            { name: 'content', type: 'array', of: [{ type: 'block' }], title: 'Content' },
            { name: 'image', type: 'image', title: 'Image', options: { hotspot: true } },
            { name: 'imagePosition', type: 'string', title: 'Image Position', options: { list: ['left', 'right'] } },
          ],
        },
        {
          type: 'object',
          name: 'ctaSection',
          title: 'CTA Section',
          fields: [
            { name: 'heading', type: 'string', title: 'Heading' },
            { name: 'description', type: 'text', title: 'Description' },
            { name: 'ctaText', type: 'string', title: 'CTA Text' },
            { name: 'ctaLink', type: 'string', title: 'CTA Link' },
          ],
        },
        {
          type: 'object',
          name: 'featuresSection',
          title: 'Features Section',
          fields: [
            { name: 'heading', type: 'string', title: 'Heading' },
            { name: 'subheading', type: 'text', title: 'Subheading' },
            { name: 'features', type: 'array', of: [{ type: 'string' }], title: 'Features' },
          ],
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'seoTitle',
          title: 'SEO Title',
          type: 'string',
        },
        {
          name: 'seoDescription',
          title: 'SEO Description',
          type: 'text',
          rows: 3,
        },
        {
          name: 'seoKeywords',
          title: 'SEO Keywords',
          type: 'array',
          of: [{ type: 'string' }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
});
