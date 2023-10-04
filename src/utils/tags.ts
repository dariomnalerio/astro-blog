import {astroImageURL, javaScriptImageURL, reactImageURL } from "../config/index.ts"


export function GetTags(tagList: string[]) {
   const tagsObj = tagList.map((url: string) => {
        if (url === "astro") {
          return {
            tag: "astro",
            name: "Astro",
            image: {
              url: astroImageURL,
              alt: "Astro Logo",
            },
          };
        } else if (url === "javascript"){
            return {
                tag: "javascript",
                name: "JavaScript",
                image: {
                url: javaScriptImageURL,
                alt: "JavaScript Logo",
                },
            };
        } else if (url === "react"){
            return {
                tag: "react",
                name: "React",
                image: {
                url: reactImageURL,
                alt: "React Logo",
                },
            };
        } else {
            return {
              tag: url,
              name: url,
              image: {
                url: "",
                alt: "",
              },
            };
          }
      });


    return tagsObj;
}