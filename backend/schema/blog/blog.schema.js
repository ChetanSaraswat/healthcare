const { z } = require('zod');

const translationItemSchema = z.object({
  locale: z.enum(['en', 'hi']),
  title: z.string().min(1, 'Translated title is required'),
  summary: z.string().nullable().optional(),
  body: z.string().min(1, 'Translated body content is required'),
});

exports.listBlogPostsSchema = z.object({
  query: z.object({
    locale: z.enum(['en', 'hi']).optional().default('en'),
    status: z.enum(['all', 'published', 'draft']).optional().default('published'),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
    search: z.string().optional(),
  }),
});

exports.getBlogPostBySlugSchema = z.object({
  params: z.object({
    slug: z.string({ required_error: 'Slug is required' }).min(1),
  }),
  query: z.object({
    locale: z.enum(['en', 'hi']).optional().default('en'),
  }),
});

exports.createBlogPostSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }).min(3),
    slug: z.string().min(3).optional(),
    summary: z.string().nullable().optional(),
    body: z.string({ required_error: 'Body is required' }).min(10),
    cover_image: z.string().nullable().optional(),
    author_name: z.string().optional().default('Omkar Healthcare Editorial Team'),
    status: z.enum(['draft', 'published']).optional().default('published'),
    translations: z.array(translationItemSchema).optional().default([]),
  }),
});

exports.updateBlogPostSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive({ message: 'Valid blog post ID required' }),
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    slug: z.string().min(3).optional(),
    summary: z.string().nullable().optional(),
    body: z.string().min(10).optional(),
    cover_image: z.string().nullable().optional(),
    author_name: z.string().optional(),
    status: z.enum(['draft', 'published']).optional(),
    translations: z.array(translationItemSchema).optional(),
  }),
});

exports.toggleBlogPostStatusSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive({ message: 'Valid blog post ID required' }),
  }),
  body: z.object({
    status: z.enum(['draft', 'published'], { required_error: 'Status must be draft or published' }),
  }),
});
