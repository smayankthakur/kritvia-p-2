import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'landingPage',
  title: 'Landing Page',
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
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'string' },
        { name: 'backgroundImage', title: 'Background Image', type: 'image' },
        { name: 'ctaText', title: 'CTA Text', type: 'string' },
        { name: 'ctaLink', title: 'CTA Link', type: 'url' },
      ],
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
        { name: 'icon', title: 'Icon', type: 'image' },
      ]}],
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
        { name: 'icon', title: 'Icon', type: 'image' },
      ]}],
    }),
    defineField({
      name: 'pricing',
      title: 'Pricing',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'price', title: 'Price', type: 'number' },
        { name: 'description', title: 'Description', type: 'text' },
        { name: 'features', title: 'Features', type: 'array', of: [{ type: 'string' }] },
      ]}],
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'question', title: 'Question', type: 'string' },
        { name: 'answer', title: 'Answer', type: 'text' },
      ]}],
    }),
    defineField({
      name: 'cta',
      title: 'Call to Action',
      type: 'object',
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text' },
        { name: 'buttonText', title: 'Button Text', type: 'string' },
        { name: 'buttonLink', title: 'Button Link', type: 'url' },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'seoTitle', title: 'SEO Title', type: 'string' },
        { name: 'seoDescription', title: 'SEO Description', type: 'text' },
        { name: 'ogImage', title: 'OG Image', type: 'image' },
        { name: 'canonicalUrl', title: 'Canonical URL', type: 'url' },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug',
    },
    prepare(selection) {
      const { title, slug } = selection
      return {
        title: title,
        subtitle: slug.current || 'No slug',
      }
    },
  },
})