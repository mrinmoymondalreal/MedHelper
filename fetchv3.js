const puppeteer = require("puppeteer");

module.exports = async function getDetails(q) {
  // Launch a headless browser
  const browser = await puppeteer.launch();

  // Open a new page
  const page = await browser.newPage();

  // Navigate to the website
  await page.goto(
    `https://www.apollopharmacy.in/medicine/${q}?doNotTrack=true`
  ); // Replace 'https://example.com' with the URL of the website you want to scrape

  // Wait for the element to be available
  await page.waitForSelector("div > .Grid_Item__KaQ4v");

  // Extract data from the element
  const tData = await page.$$eval("div > .Grid_Item__KaQ4v", (elements) => {
    // Extract relevant information from each element
    return elements
      .map((element) => {
        if (
          ["Return Policy", "Expires on or after"].includes(
            element.querySelector("h2").textContent.trim()
          )
        )
          return;
        return {
          key: element.querySelector("h2").textContent.trim().toLowerCase(),
          value: element.querySelector(".r").textContent.trim(),
        };
      })
      .filter((e) => e);
  });

  await page.waitForSelector("div > .Zt");

  const desp = await page.$$eval("div > .Zt", (elements) => {
    return elements.map((e) => e.textContent);
  });

  await page.waitForSelector("div > .it");
  const pre =
    (await page.$$eval("div > .it", (elements) => {
      return elements.map((e) => e.textContent).join("");
    })) || "Prescription Not Nessecary";

  // Close the browser
  await browser.close();

  return [pre, tData, desp];
};
