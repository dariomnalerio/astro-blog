import {z, defineCollection} from "astro:content";

const blogCollection = defineCollection({
    type: "content",
    schema: z.object({
        fileName: z.string(),
        otherLanguageFilename: z.string(),
        title: z.string(),
        description: z.string(),
        pubDate: z.date(),
        author: z.string(),
        authorLink: z.string(),
        image: z.object({
          url: z.string(),
          alt: z.string(),
        }),
        tags: z.array(z.string()),
    })
})

export const collections = {
    "blog": blogCollection,
}