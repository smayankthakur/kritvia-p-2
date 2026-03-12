import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'documentation',
  title: 'Documentation',
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
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', fields: [
          { name: 'alt', title: 'Alt text', type: 'string' }
        ]},
        { type: 'code', name: 'codeBlock', title: 'Code Block' }
      ],
    }),
    defineField({
      name: 'codeExamples',
      title: 'Code Examples',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'language', title: 'Language', type: 'string' },
        { name: 'code', title: 'Code', type: 'text' },
        { name: 'description', title: 'Description', type: 'text' },
      ]}],
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
      category: 'category.title',
    },
    prepare(selection) {
      const { title, slug, category } = selection
      return {
        title: title,
        subtitle: `${category || 'Docs'} / ${slug.current || 'No slug'}`,
      }
    },
  },
})