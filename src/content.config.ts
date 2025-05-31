import { defineCollection, z } from "astro:content";
import { typstLoader } from "./typstLoader";

const typstBlogs = defineCollection({
    loader: typstLoader(),
    schema: z.object({
        title: z.string(),
        html: z.string(),
        abstract: z.string().nullable(),
        created: z.string().nullable(),
        updated: z.string().nullable(),
    }),
});

export const collections = { blog: typstBlogs };
