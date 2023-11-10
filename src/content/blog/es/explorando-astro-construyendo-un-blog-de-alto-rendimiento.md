---
fileName: "explorando-astro-construyendo-un-blog-de-alto-rendimiento"
otherLanguageFilename: "exploring-astro-building-a-high-performance-blog-website"
title: 'Explorando Astro: Construyendo un Blog de Alto Rendimiento'
description: 'En este artículo, compartiré mi experiencia personal construyendo un blog con Astro y explicaré por qué es un framework increíble.'
pubDate: 2023-10-16
author: Dario Nalerio
authorLink: https://www.linkedin.com/in/darionalerio/
image:
    url: 'https://res.cloudinary.com/dhkyj5k4o/image/upload/v1697256371/astro-blog-page/Astro_rf1qwa.webp'
    alt: 'El logo de Astro.'
tags: ["astro", "javascript"]
---

El desarrollo front-end siempre ha sido un terreno en constante movimiento, con nuevos frameworks y arquitecturas que surgen constantemente. En este artículo, compartiré mi experiencia personal construyendo un blog con Astro y explicaré por qué es un framework increíble.


## El Poder de Astro

Astro es un generador de sitios estáticos moderno que te permite crear sitios web de alto rendimiento utilizando las últimas tecnologías web. Con Astro, podés aprovechar los beneficios de un generador de sitios estáticos o una solución renderizada en el lado del servidor.

### Desarrollo Simplificado

Una de sus características destacadas es el enfoque en el contenido. Con Astro, podés obtener datos de tu CMS o trabajar localmente con Markdown y MDX. Esto permite un flujo de trabajo perfecto, ya que podés crear y administrar fácilmente el contenido sin preocuparte por el código subyacente.

Astro también elimina automáticamente el JavaScript no utilizado y renderiza tu contenido a HTML, lo que resulta en mejores métricas de rendimiento web, tasas de conversión y SEO.

Estas características llevan a sitios web de mayor calidad, optimizados tanto en contenido como en rendimiento técnico.

### Astro Islands

La técnica de optimización de Astro Islands es una estrategia de optimización de rendimiento que implica dividir un sitio web en piezas más pequeñas de contenido, cada una con su propio paquete de JavaScript.

Según la documentación oficial, "piensa en ellos como islas en un mar de HTML estático y no interactivo".

Podés elegir entre varios frameworks de UI como React, Vue y Svelte, entre otros, para renderizarlos. Incluso podés mezclarlos.

Lo bueno de las islas es que, por defecto, no generan JavaScript. Astro las convertirá a HTML a menos que sea necesario JavaScript del lado del cliente para la interactividad.

## Mi Experiencia con Astro

### Internacionalización

Para las funciones de internacionalización, seguí la documentación oficial. Lo que hice es crear un archivo de configuración para los idiomas admitidos, el idioma predeterminado y todos los strings traducibles.

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

Luego creé dos funciones auxiliares: una para obtener el idioma actual de la URL y otra para mostrar el string correspondiente al idioma actual.

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

Que luego se pueden usar así:

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

### Colecciones de Contenido

Una colección de contenido es un conjunto de elementos relacionados, como entradas de blog o productos. Cada elemento de contenido está representado por un archivo en un directorio, y el directorio lleva el nombre de la colección.

Astro proporciona una forma de consultar y filtrar colecciones de contenido. Esto te permite generar dinámicamente páginas basadas en el contenido de tus colecciones. En mi caso, lo tengo configurado con una colección de blogs que tiene una ruta para artículos en inglés y español.

![Colección de Contenido](https://res.cloudinary.com/dhkyj5k4o/image/upload/v1697247614/astro-blog-page/making-a-blog/content-collections_nykqfv.webp)

También podés agregar un archivo de configuración, lo cual habilita soporte completo de TypeScript en la aplicación al consultar el contenido.

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

### Documentación Integral

Astro se destaca por su documentación, que abarca una amplia gama de información, desde conceptos fundamentales hasta temas más avanzados. En momentos en los que me encontré con dificultades o dudas, la documentación brindó todas las soluciones necesarias.

## Conclusión

En esta breve exploración de las capacidades de Astro, vale la pena destacar que existen varias características, como las transition views y paginación, que contribuyen a Astro como framework de desarrollo front-end. Para profundizar más en ello, podés visitar su [sitio web oficial](https://astro.build).

En resumen, Astro ha demostrado ser una elección excepcional para la construcción de un sitio web de blog de alto rendimiento, ofreciendo un desarrollo simplificado con su enfoque en el contenido, la eliminación automática de JavaScript y técnicas potentes de optimización de rendimiento. Sus características de internacionalización, colecciones de contenido y documentación mejoran aún más sus capacidades, convirtiéndolo en un recurso valioso para cualquier desarrollador front-end que desee crear sitios web eficientes y ricos en contenido.