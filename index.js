import express from "express";
import puppeteer from "puppeteer";
const app = express();
const port = 8083;
import cors from "cors";
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/ip-data", async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: false,
      userDataDir: "./tmp",
    });
    const page = await browser.newPage();
    await page.goto("https://api.myip.com/");
    const jsonData = await page.evaluate(() => {
      const bodyContent = document.querySelector("body").innerText;
      try {
        return JSON.parse(bodyContent);
      } catch (error) {
        console.error("Error parsing JSON data:", error);
        return null;
      }
    });
    const result = {
      ip_address: jsonData.ip,
      country_name: jsonData.country,
      country_code: jsonData.cc,
    };
    res.send(result);
  } catch (error) {
    console.log(error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});
