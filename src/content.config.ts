import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    order: z.number(),
    lang: z.enum(['pt-br', 'en']),
    caseId: z.string(),
    metric: z.string(),
    metricLabel: z.string(),
    stack: z.array(z.string()),
  }),
});

export const collections = { cases };
