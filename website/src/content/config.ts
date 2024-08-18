import { defineCollection, z } from "astro:content";

const postSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  draft: z.boolean().optional(),
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
  type: "content",
  schema: postSchema,
});

const til = defineCollection({
  type: "content",
  schema: postSchema,
});

export const collections = { blog, til };
