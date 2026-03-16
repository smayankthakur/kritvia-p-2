import { defineType, defineField } from 'sanity'
import { seoFields, contentBlocks, ctaBlock, mediaBlock } from '../fieldGroups'

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
      group: 'content',
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
      group: 'content',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      initialValue: 'draft',
      group: 'settings',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'settings',
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      group: 'settings',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'content',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: contentBlocks,
      group: 'content',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
      group: 'media',
      fields: [
        {
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'taxonomies',
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
      group: 'content',
    }),
    ...seoFields.map(field => ({ ...field, group: 'seo' })),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug',
      category: 'category.title',
      status: 'status',
      publishedAt: 'publishedAt',
      seoTitle: 'seo.seoTitle',
    },
    prepare(selection) {
      const { title, slug, category, status, publishedAt, seoTitle } = selection
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Not published'
      const slugText = slug?.current ?? 'no-slug'
      const seoText = seoTitle ? ` • SEO: ${seoTitle}` : ''
      return {
        title: title,
        subtitle: `${category || 'Docs'} / ${slugText} • ${status.toUpperCase()} • ${date}${seoText}`,
      }
    },
  },
})