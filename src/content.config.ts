import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';
import sourceImageData from './content/source-images.json';

const httpsUrl = z
  .string()
  .url()
  .refine((value) => value.startsWith('https://'), 'HTTPS URL required');
const episodes = defineCollection({
  loader: file('src/content/episodes.json'),
  schema: z.object({
    id: z.string().regex(/^EP-\d{4}$/),
    legacyId: z.string(),
    title: z.string().min(1),
    summary: z.string().min(1),
    classification: z.string(),
    sourceUrl: httpsUrl,
    portalUrl: httpsUrl,
    poster: httpsUrl.optional(),
    priority: z.number().int(),
    links: z.array(z.object({ label: z.string(), href: httpsUrl, kind: z.string() })),
  }),
});

const works = defineCollection({
  loader: file('src/content/works.json'),
  schema: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    collection: z.enum(['article-derived', 'original']),
    episodeId: z
      .string()
      .regex(/^EP-\d{4}$/)
      .optional(),
    originalGroup: z.enum(['opal-remotion', 'cooking', 'experiments']).optional(),
    format: z.enum(['comic', 'motion-comic', 'short', 'lecture', 'video']),
    tools: z.array(z.string()).default([]),
    parentWorkIds: z.array(z.string()).default([]),
    sourceImageIds: z.array(z.string()).default([]),
    relationshipVerified: z.boolean(),
    evidenceUrl: httpsUrl.optional(),
    poster: httpsUrl,
    media: z.discriminatedUnion('type', [
      z.object({ type: z.literal('image'), images: z.array(httpsUrl).min(1) }),
      z.object({ type: z.literal('youtube'), youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/) }),
    ]),
    externalUrl: httpsUrl,
    aspectRatio: z.enum(['9:16', '16:9']).optional(),
    priority: z.number().int(),
    published: z.boolean(),
  }),
});

const sourceImages = defineCollection({
  loader: async () => sourceImageData,
  schema: z.object({
    id: z.string(),
    title: z.string(),
    src: httpsUrl,
    alt: z.string().min(1),
    creatorCredit: z.string().min(1),
    displayAllowed: z.boolean(),
  }),
});

export const collections = { episodes, works, sourceImages };
