import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'technology',
  title: 'Technology',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'logoUrl', title: 'Logo URL', type: 'url' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: ['AI/ML', 'Cloud', 'Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Other'],
      },
    }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
  ],
});
