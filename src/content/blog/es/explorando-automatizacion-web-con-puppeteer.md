---
fileName: "explorando-automatizacion-web-con-puppeteer"
otherLanguageFilename: "exploring-web-automation-with-puppeteer"
title: "Explorando la Automatización Web con Puppeteer
"
description: 'Puppeteer es una biblioteca de Node.js que proporciona una API de alto nivel para controlar Chrome/Chromium a través del Protocolo DevTools. En este artículo, exploraremos cómo usar Puppeteer para automatizar tareas en el navegador.'
pubDate: 2023-11-11
author: Dario Nalerio
authorLink: https://www.linkedin.com/in/darionalerio/
image:
    url: 'https://res.cloudinary.com/dhkyj5k4o/image/upload/v1697258363/astro-blog-page/JavaScript_prnull.webp'
    alt: 'JavaScript Logo.'
tags: ["javascript"]

---

Puppeteer es una poderosa biblioteca de Node que ofrece una API de alto nivel para controlar tanto navegadores headless como completos a través del Protocolo DevTools. Su versatilidad lo convierte en una opción popular para una variedad de tareas, incluyendo el web scraping, las pruebas automatizadas y la generación de capturas de pantalla o PDF. En este artículo, exploraremos los conceptos básicos de Puppeteer y profundizaremos en un caso de uso específico: automatizar acciones de Discord usando un script.

## Instalación

Antes de sumergirnos en Puppeteer, el primer paso es instalarlo. Puppeteer está disponible como paquete npm, por lo que puedes instalarlo con el siguiente comando:

```bash

  npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth


```


Además de Puppeteer, hemos incorporado dos paquetes complementarios - `puppeteer-extra` y `puppeteer-extra-plugin-stealth`. Aunque no son obligatorios, estos paquetes son muy recomendables para la mayoría de los casos de uso. `puppeteer-extra` permite el uso de plugins mientras que `puppeteer-extra-plugin-stealth` es un plugin que permite a Puppeteer evadir la detección headless.

## Uso básico

El uso fundamental de Puppeteer implica lanzar un navegador, abrir una nueva página y navegar a una URL. Este sencillo ejemplo prepara el escenario para tareas de automatización más complejas.

````javascript

  import puppeteer from "puppeteer";

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://example.com");
    // Realizar otras acciones...
    await browser.close();
  })();
 

````

### Mejorando Puppeteer con el Stealth Plugin

Para evitar la detección durante la automatización web, Puppeteer puede ser mejorado con el Stealth Plugin. Este plugin añade medidas de sigilo a Puppeteer, haciéndolo menos propenso a ser detectado por los sitios web. Esto no suele ser suficiente cuando se trata de sitios web seguros ya que normalmente te encontrarás con otros obstáculos, como los captchas, y es posible que necesites usar un proxy.

````javascript

  import puppeteer from "puppeteer-extra";
  import StealthPlugin from "puppeteer-extra-plugin-stealth";

  puppeteer.use(StealthPlugin());


````

## Automatizando Acciones de Discord

### Descripción general del script

El script proporcionado se centra en automatizar el proceso de enviar un comando de reclamo en un canal de Discord. Analicemos los componentes clave y comprendamos cómo Puppeteer facilita esta automatización.

### Enviar Comandos

La función `sendClaimCommand` es el núcleo del script, responsable de cada paso para enviar el comando de reclamo en el canal de Discord.

````javascript

  const sendClaimCommand = async (page) => {
    log("Escribiendo y enviando mensaje...");
    await page.keyboard.type("/claim", { delay: 150 });
    await page.keyboard.press("Enter");
  };


````

### Automatización Principal

La función principal orquesta todo el proceso de automatización, aprovechando la biblioteca de Puppeteer, analizando argumentos de la línea de comandos y manejando interrupciones.

````javascript

  // Controlador de Ctrl-C (SIGINT)
  process.on("SIGINT", handleCtrlC);

  try {
    console.log("-----------------------------------------------------");
    log("¡Bienvenido al bot de reclamos!");

    // Analiza los argumentos de la línea de comandos
    // Si se pasa --login, el usuario deberá escanear el código QR para iniciar sesión
    // Si se pasa --headless, el navegador estará oculto
    const headlessOption = parseArgs();
    let headless;
    if (headlessOption === "headless") {
      headless = "new";
    } else if (headlessOption === "login") {
      headless = false;
    }

    const browser = await puppeteer.launch({
      headless: headless, // "new" para headless, "false" para GUI
      userDataDir: "./user_data", // directorio para almacenar cookies, permite iniciar sesión persistente
    });

    const page = await browser.newPage(); // abrir una nueva pestaña

    // Si se pasa --login, el usuario deberá escanear el código QR para iniciar sesión
    if (headlessOption === "login") {
      await page.goto("URL_DE_INICIO_DE_SESIÓN_AQUÍ");
      log("Página de inicio de sesión abierta...");
      log("Esperando 60 segundos para el escaneo del código QR...");
      await setTimeout(60000);
      log("Pasaron 60 segundos, continuando...");
    }

    // Navegar al canal
    log("Navegando al canal...");
    await page.goto(
      "URL_DEL_CANAL_DISCORD_AQUÍ"
    );

    // Esperar a que la página se cargue, en mi caso, el foco se coloca automáticamente en el input de texto
    log("Esperando a que la página se cargue...");
    await page.waitForSelector(
      'SELECTOR_AQUÍ'
    );
  }


````

### Inicialización del Bucle de Reclamos

Después de navegar a la página deseada, el script entra en un bucle que envía el comando de reclamo y espera el próximo reclamo. El bucle es infinito, por lo que el script seguirá ejecutándose hasta que se interrumpa.

````javascript

  log("Iniciando bucle de reclamos...");
  while (true) {
    // Enviar el comando de reclamo
    await sendClaimCommand(page);

    // Tiempo aleatorio entre 1 hora 5 segundos y 1 hora 5 minutos 5 segundos
    const time = 3605000 + Math.floor(Math.random() * 300000) + 1;

    // Registrar la hora en que tendrá lugar el próximo reclamo
    log(
      `El próximo reclamo será a las ${new Date(
        Date.now() + time
      ).toLocaleTimeString()}`
    );

    // Esperar al próximo reclamo
    await setTimeout(time);
  }


````

### Manejo de Errores y Limpieza

Finalmente, tenemos el código de manejo de errores y limpieza. Este código se ejecuta cuando se interrumpe el script, ya sea por el usuario o por un error. El código de manejo de errores registra el error y sale del script. El código de limpieza elimina el controlador de Ctrl-C y cierra el navegador.

````javascript

  catch (e) {
    log(e);
  } finally {
    process.off("SIGINT", handleCtrlC); // Eliminar el controlador de Ctrl-C y salir
    await browser.close(); // Esto nunca se alcanza pero se deja aquí como referencia
  }


````

## Script en Acción

Para visualizar el script en acción, aquí tienes una captura de pantalla de un terminal ejecutando el script:

![Terminal Corriendo el Script](https://res.cloudinary.com/dhkyj5k4o/image/upload/v1699634039/astro-blog-page/01-puppeteer-scripting/Evui1onYDv_q2bi8i.webp)

## Conclusión

En conclusión, Puppeteer destaca como una herramienta versátil y potente para automatizar diversas acciones web. Aunque el script proporcionado es básico, sirve como una demostración práctica de la aplicación de Puppeteer para automatizar comandos en Discord. Ya seas un desarrollador experimentado, un tester meticuloso o un entusiasta aficionado, Puppeteer ofrece una solución sólida y flexible para la automatización del navegador. Sus capacidades se extienden más allá del script presentado, convirtiéndolo valiosa herramienta para diversas tareas de automatización.