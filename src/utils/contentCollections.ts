
import {  getCollection } from "astro:content";
import type {CollectionEntry} from "astro:content";

export const getSortedBlogPosts = async (lang?: "en" | "es"): Promise<CollectionEntry<"blog">[]> => {

    if (lang === "en") {
        return getSortedEnglishBlogPosts()
    } else if (lang === "es") {
    return getSortedSpanishBlogPosts()
    } else {
        return getAllSortedBlogPosts()
    }
}

const getAllSortedBlogPosts = async (): Promise<CollectionEntry<"blog">[]> => {
    return (await getCollection("blog")).sort((a, b) =>
        new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf())
}

const getSortedSpanishBlogPosts = async (): Promise<CollectionEntry<"blog">[]> => {
    return (await getCollection("blog", ({id}) => {
        return id.startsWith(`es/`)
    })).sort((a, b) =>
        new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf())
}

const getSortedEnglishBlogPosts = async (): Promise<CollectionEntry<"blog">[]> => {
    return (await getCollection("blog", ({id}) => {
        return id.startsWith(`en/`)
    })).sort((a, b) =>
        new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf())
}