import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { workCategorySlugs } from './data/categories';

const imageMedia = z.object({
  type: z.literal('image'),
  images: z.array(z.string()).min(1),
});

const videoMedia = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('youtube'),
    youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
  }),
  z.object({
    type: z.literal('mp4'),
    src: z.string(),
    webmSrc: z.string().optional(),
    captionsSrc: z.string().optional(),
  }),
]);

const works = defineCollection({
  loader: glob({ base: './src/content/works', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1).max(60),
      shortDescription: z.string().min(1).max(120),
      category: z.enum(workCategorySlugs),
      categories: z.array(z.enum(workCategorySlugs)).min(1).optional(),
      episodeId: z.string().regex(/^EP-\d{4}$/).optional(),
      classification: z.string().optional(),
      tags: z.array(z.string()).default([]),
      tools: z.array(z.string()).min(1),
      year: z.number().int().min(2020),
      durationSec: z.number().positive().optional(),
      aspectRatio: z.enum(['16:9', '9:16', '1:1', '4:5', 'comic']),
      poster: image(),
      posterAlt: z.string().min(1).max(140),
      media: z.union([videoMedia, imageMedia]),
      role: z.array(z.string()).default([]),
      deliverables: z.array(z.string()).default([]),
      client: z.string().optional(),
      featured: z.boolean().default(false),
      priority: z.number().int().default(100),
      published: z.boolean().default(false),
      seed: z.boolean().default(false),
      externalUrl: z.string().url().optional(),
      portalUrl: z.string().url().optional(),
      links: z
        .array(
          z.object({
            label: z.string().min(1).max(40),
            href: z.string().url(),
            kind: z.enum(['source', 'comic', 'short', 'lecture', 'portal']).optional(),
          }),
        )
        .default([]),
      rightsNote: z.string().optional(),
    }),
});

export const collections = { works };
