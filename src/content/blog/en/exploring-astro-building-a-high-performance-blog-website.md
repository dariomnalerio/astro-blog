---
fileName: "exploring-astro-building-a-high-performance-blog-website"
otherLanguageFilename: "explorando-astro-construyendo-un-blog-de-alto-rendimiento"
title: 'Exploring Astro: Building A High-Performance Blog Website'
description: 'In this article, I will share my personal experience building a blog website with Astro and explain why it is an awesome framework.'
pubDate: 2023-10-14
author: Dario Nalerio
authorLink: https://www.linkedin.com/in/darionalerio/
image:
    url: 'https://docs.astro.build/assets/arc.webp'
    alt: 'Astro logo.'
tags: ["astro"]
---

Front-end development has always been a dynamic field, with new frameworks and architectures constantly emerging. In this article, I will share my personal experience building a blog website with Astro and explain why it is an awesome framework.

## The Power of the Astro Framework

Astro is a modern static site builder that enables you to create high-performance websites using the latest web technologies. With Astro, you can harness the benefits of a static site generator or a server-side rendered solution.

### Streamlined Development

One of its standout features is content-first approach. With Astro, you can fetch data from your CMS or work locally with type-safe Markdown and MDX APIs. This allows for a seamless workflow, as you can easily create and manage content without worrying about the underlying code.

Astro also automatically removes unused JavaScript and renders your content to HTML, resulting in improved core web vitals, conversion rates, and SEO.

These features lead to superior websites that are optimized for both content and technical performance.

### Astro Islands

Astro's Island Optimization technique is a performance optimization strategy that involves breaking up a website into smaller pieces of content, each with its own JavaScript bundle.

As per the official documentation, "think of them as islands in a sea of static, non-interactive HTML."

You can choose from several UI frameworks such as React, Vue and Svelte, among others to render them. What's more, you can even mix them.

The great thing about islands is that, by default, they generate zero JavaScript. Astro will convert them to HTML unless client-side JavaScript is necessary for interactivity.

## My Journey with Astro

### Internationalization

For internationalization features I followed the official documentation. What I did is create a configuration file for supported languages, the default language and all translatable strings.

````typescript

  export const languages = {
      en: "English",
      es: "Español",
  }

  export const defaultLang = "en"

  export const ui = {
      en: {
          "nav.home": "Home",
          "nav.about": "About",
          "footer.contact": "Contact",
          "LatestPosts.h3": "Latest Articles",
          "TagList.h3": "Tags",
          "PreviousIcon": "Newer Articles",
          "NextIcon": "Older Articles",
          "PostList.h3": "related articles"
      },
      es: {
          "nav.home": "Inicio",
          "nav.about": "Sobre Mi",
          "footer.contact": "Contacto",
          "LatestPosts.h3": "Últimos Artículos",
          "TagList.h3": "Tags",
          "PreviousIcon": "Artículos Recientes",
          "NextIcon": "Artículos Anteriores",
          "PostList.h3": "Artículos sobre"
      },
  } as const;


````

I then created two helper functions: one for getting the current language from the URL, and another one for displaying the current language corresponding string.

````typescript

  import {ui, defaultLang} from "./ui"

  export function getLangFromUrl(url: URL) {
      const [, lang] = url.pathname.split("/")
      if (lang in ui) {
          return lang as keyof typeof ui;
      }
      return defaultLang
  }

  export function useTranslations(lang: keyof typeof ui) {
      return function t(key: keyof typeof ui[typeof defaultLang]){
          return ui[lang][key] || ui[defaultLang][key]
      }
  }


````

Which can then be used like this:

````astro
---
  const lang = getLangFromUrl(Astro.url);
  const t = useTranslations(lang);
---
  <nav>
      <a href=`/${lang}/` >
        {t("nav.home")}
      </a>
      
      <a href=`/${lang}/about` >
        {t("nav.about")}
      </a>
  </nav>


````

### Content Collections

A content collection is a group of related content items, such as blog posts or products. Each content item is represented by a file in a directory, and the directory is named after the collection

Astro provides a way to query and filter content collections. This allows you to dynamically generate pages based on the content in your collections.
In my case I have it set up with a blog collection, which has a route for English and Spanish articles.

![Content Collections](https://res.cloudinary.com/dhkyj5k4o/image/upload/v1697247614/astro-blog-page/making-a-blog/content-collections_nykqfv.webp)

You can also add a configuration file, which will give you full TypeScript support in the application when you query the content.

````typescript

  import {z, defineCollection} from "astro:content";

  const blogCollection = defineCollection({
      type: "content",
      schema: z.object({
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
  
````

### Comprehensive Documentation

Astro truly stands out in its thorough documentation, encompassing a wide range of information, from fundamental concepts to more advanced subjects. In times when I encountered difficulties or had doubts, the documentation consistently offered the necessary solutions.

## Conclusion

In this brief exploration of Astro's capabilities, it's worth noting that there are several other powerful features, such as view transitions, that contribute to its prowess as a front-end development framework. To dive deeper into it, you can visit their their [official website](https://astro.build).

All in all, Astro has proven to be an exceptional choice for building a high-performance blog website, offering streamlined development with its content-first approach, automatic JavaScript removal, and powerful performance optimization techniques. Its internationalization features, content collections, and comprehensive documentation further enhance its capabilities, making it a valuable asset for any front-end developer seeking to create efficient, content-rich websites.