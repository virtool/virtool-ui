import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const manual = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/manual" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().optional(),
  }),
});

export const collections = { manual };
