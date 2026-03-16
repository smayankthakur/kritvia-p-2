import { defineType, defineField } from 'sanity'
import { seoFields, contentBlocks, ctaBlock, mediaBlock } from '../fieldGroups'

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
    ...seoFields.map(field => ({ ...field, group: 'seo' })),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug',
      status: 'status',
      publishedAt: 'publishedAt',
      seoTitle: 'seo.seoTitle',
    },
    prepare(selection) {
      const { title, slug, status, publishedAt, seoTitle } = selection
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Not published'
      const slugText = slug?.current ?? 'no-slug'
      const seoText = seoTitle ? ` • SEO: ${seoTitle}` : ''
      return {
        title: title,
        subtitle: `${slugText} • ${status.toUpperCase()} • ${date}${seoText}`,
      }
    },
  },
})