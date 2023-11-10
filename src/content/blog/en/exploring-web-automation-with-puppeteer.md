---
fileName: "exploring-web-automation-with-puppeteer"
otherLanguageFilename: "explorando-automatizacion-web-con-puppeteer"
title: "Exploring Web Automation with Puppeteer"
description: 'Puppeteer is a Node.js library which provides a high-level API to control Chrome/Chromium over the DevTools Protocol. In this article, we will explore how to use Puppeteer to automate tasks in the browser.'
pubDate: 2023-11-11
author: Dario Nalerio
authorLink: https://www.linkedin.com/in/darionalerio/
image:
    url: 'https://res.cloudinary.com/dhkyj5k4o/image/upload/v1697258363/astro-blog-page/JavaScript_prnull.webp'
    alt: 'JavaScript Logo.'
tags: ["javascript"]

---

Puppeteer, a powerful Node library, offers a high-level API to control both headless and full browsers through the DevTools Protocol. Its versatility makes it a popular choice for a range of tasks, including web scraping, automated testing, and generating screenshots or PDFs. In this article, we will explore the basics of Puppeteer and delve into a specific use case: automating Discord actions using a script.

## Installation

Before diving into Puppeteer, the first step is to install it. Puppeteer is available as an npm package, so you can install it with the following command:

```bash

  npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth


```

In addition to Puppeteer, we have incorporated two supplementary packages - `puppeteer-extra` and `puppeteer-extra-plugin-stealth`. While not mandatory, these packages are highly recommended for most use cases. `puppeteer-extra` enables the use of plugins while `puppeteer-extra-plugin-stealth` is a plugin that allows Puppeteer to evade headless detection.

## Basic Usage

The fundamental usage of Puppeteer involves launching a browser, opening a new page, and navigating to a URL. This simple example sets the stage for more complex automation tasks.

````javascript

  import puppeteer from "puppeteer";

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://example.com");
    // Perform other actions...
    await browser.close();
  })();
 

````

### Enhancing Puppeteer with Stealth Plugin

To avoid detection during web automation, Puppeteer can be enhanced with the Stealth Plugin. This plugin adds stealth measures to Puppeteer, making it less prone to being flagged by websites. This is usually not enough when dealing with secure websites since you will usually come across other obstacles, such as captchas, and might need to use a proxy.

 ````javascript

  import puppeteer from "puppeteer-extra";
  import StealthPlugin from "puppeteer-extra-plugin-stealth";

  puppeteer.use(StealthPlugin());


````

## Automating Discord Actions

### Script Overview

The provided script focuses on automating the process of sending a claim command in a Discord channel. Let's break down the key components and understand how Puppeteer facilitates this automation.

### Sending Commands

The `sendClaimCommand` function is the core of the script, responsible for each step of sending the claim command in the Discord channel.

````javascript

  const sendClaimCommand = async (page) => {
    log("Typing and sending message...");
    await page.keyboard.type("/claim", { delay: 150 });
    await page.keyboard.press("Enter");
  };


````

### Main Automation

The main function orchestrates the entire automation process, leveraging the puppeteer library, parsing command line arguments, and handling interruptions.

````javascript

  // Ctrl-C (SIGINT) handler
  process.on("SIGINT", handleCtrlC);

  try {
    console.log("-----------------------------------------------------");
    log("Welcome to the claiming bot!");

    // Parse the command line arguments
    // If --login is passed, the user will need to scan the QR code to login
    // If --headless is passed, the browser will be hidden
    const headlessOption = parseArgs();
    let headless;
    if (headlessOption === "headless") {
      headless = "new";
    } else if (headlessOption === "login") {
      headless = false;
    }

    const browser = await puppeteer.launch({
      headless: headless, // "new" for headless, "false" for gui
      userDataDir: "./user_data", // directory to store cookies, allows for persistent login
    });

    const page = await browser.newPage(); // open a new tab

    // If --login is passed, the user will need to scan the QR code to login
    if (headlessOption === "login") {
      await page.goto("LOGIN_URL_HERE");
      log("Login page opened...");
      log("Waiting 60 seconds for QR scan...");
      await setTimeout(60000);
      log("60 seconds passed, continuing...");
    }

    // Navigate to the channel
    log("Navigating to channel...");
    await page.goto(
      "DISCORD_CHANNEL_URL_HERE"
    );

    // Wait for the page to load, in my case the text input is automatically focused
    log("Waiting for the page to load...");
    await page.waitForSelector(
      'SELECTOR_HERE'
    );
  }


````

### Claim Loop Initialization

After navigating to the desired page, the script enters a loop that sends the claim command and waits for the next claim. The loop is infinite, so the script will continue to run until interrupted.

````javascript

  // Start the claim loop
  log("Starting claim loop...");
  while (true) {
    // Send the claim command
    await sendClaimCommand(page);

    // Random time between 1 hour 5 seconds and 1 hour 5 minutes 5 seconds
    const time = 3605000 + Math.floor(Math.random() * 300000) + 1;

    // Log the time when next claim will take place
    log(
      `Next claim will be at ${new Date(
        Date.now() + time
      ).toLocaleTimeString()}`
    );

    // Wait for the next claim
    await setTimeout(time);
  }


````

### Error Handling and Cleanup

Finally we have the error handling and cleanup code. This code is executed when the script is interrupted, either by the user or by an error. The error handling code logs the error and exits the script. The cleanup code removes the Ctrl-C handler and closes the browser.

````javascript

  catch (e) {
    log(e);
  } finally {
    process.off("SIGINT", handleCtrlC); // Remove the Ctrl-C handler and exit
    await browser.close(); // This is never reached but left here for reference
  }


````

## Script in Action

To visualize the script in action, here's a snapshot of a terminal running the script:

![Terminal Running Script](https://res.cloudinary.com/dhkyj5k4o/image/upload/v1699634039/astro-blog-page/01-puppeteer-scripting/Evui1onYDv_q2bi8i.webp)

## Conclusion

In conclusion, Puppeteer stands out as a versatile and powerful tool for automating various web actions. The provided script, while basic, serves as a practical demonstration of Puppeteer's application in automating Discord commands. Whether you're a seasoned developer, a meticulous tester, or an enthusiastic hobbyist, Puppeteer provides a robust and flexible solution for browser automation. Its capabilities extend beyond the presented script, making it a valuable asset in your toolkit for diverse automation tasks.

**Educational Disclaimer:**

The provided script and information are intended for educational purposes only. It's crucial to use such knowledge responsibly, respecting the terms of service and guidelines of the platforms involved. Unauthorized or inappropriate use of automation scripts, especially on platforms like Discord, is discouraged and may result in negative consequences.
