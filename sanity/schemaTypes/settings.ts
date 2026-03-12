import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'footerLinks',
      title: 'Footer Links',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'url', title: 'URL', type: 'url' },
      ]}],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'platform', title: 'Platform', type: 'string' },
        { name: 'url', title: 'URL', type: 'url' },
        { name: 'icon', title: 'Icon', type: 'image' },
      ]}],
    }),
    defineField({
      name: 'announcementBar',
      title: 'Announcement Bar',
      type: 'object',
      fields: [
        { name: 'enabled', title: 'Enabled', type: 'boolean' },
        { name: 'message', title: 'Message', type: 'string' },
        { name: 'backgroundColor', title: 'Background Color', type: 'string' },
        { name: 'textColor', title: 'Text Color', type: 'string' },
        { name: 'url', title: 'URL (optional)', type: 'url' },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'siteTitle',
    },
    prepare(selection) {
      const { title } = selection
      return {
        title: title ? `${title} (Settings)` : 'Settings',
      }
    },
  },
})