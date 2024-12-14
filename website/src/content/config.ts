import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const postSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  meta: z
    // NOTE: properties not added here will be ignored!
    .object({
      ogImage: z.string().optional(),
    })
    .optional(),
  discussion: z.record(z.string(), z.string()).optional(),
});

const blog = defineCollection({
  loader: glob({ pattern: "*.md", base: "src/content/blog" }),
  schema: postSchema,
});

const til = defineCollection({
  loader: glob({ pattern: "*.md", base: "src/content/til" }),
  schema: postSchema,
});

export const collections = { blog, til };
