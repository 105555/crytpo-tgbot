import puppeteer from "puppeteer";
import puppeteerExtra from "puppeteer-extra";
import pluginStealth from "puppeteer-extra-plugin-stealth";
import cheerio from "cheerio";
import { priceModule } from "../lib/temeplate.js";
import bot from "./bot.js";
puppeteerExtra.use(pluginStealth());

//市值排名
async function cryptoPriceTop() {
  const browser = await puppeteer.launch({ headless:false });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1080 });
  await page.goto("https://www.coinglass.com/zh-TW");

  let body = await page.content();
  let $ = cheerio.load(body);

  const dataItem = [];
  $(".ant-table-cell").each((index, element) => {
    const text = $(element).text().trim();
    dataItem.push(text);
  });

  const selectedData = [];
  for (let i = 0; i < dataItem.length; i++) {
    if (!isNaN(dataItem[i])) {
      const ranking = dataItem[i];
      const crypto = dataItem[i + 1];
      const price = dataItem[i + 2];
      selectedData.push({ ranking: ranking, crypto: crypto, price: price });
    }
  }

  let filterData = selectedData.filter((item) => item["排名"] !== "");
  let newArr = filterData.slice(0, 20);
  await browser.close();
  return newArr;
}

//總市值
async function cryptoToalPrice() {
  const browser = await puppeteer.launch({ headless:false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1080 });
  await page.goto("https://www.coingecko.com/zh-tw/global-charts");

  let body = await page.content();
  let $ = cheerio.load(body);
  const dataItem = [];
  $(
    "body > header > div.tailwind-reset > div > div.container.tw-order-2.\\32 lg\\:tw-order-none.tw-overflow-x-auto.\\32 lg\\:tw-py-2\\.5 > div > div.tw-flex-1.tw-flex.tw-gap-x-4.tw-whitespace-nowrap.tw-pr-\\[15px\\].\\32 lg\\:tw-pr-0 > div:nth-child(3) > a > span"
  ).each((index, element) => {
    const text = $(element).text().trim();
    dataItem.push(text);
  });
  await browser.close();
  return dataItem;
}

//price top
export async function handlepriceTop(msg) {
  const chatId = msg.chat.id;
  let message = '';
  const cancelLoadingMsg = await bot.sendLoadingMsg(chatId);
  const newArr = await cryptoPriceTop();
  const filteredArr = newArr.filter((item) => item.ranking);

  if (filteredArr.length === 0) {
    message = "error";
  } else {
    for (let item of filteredArr) {
      message += `${priceModule(item)}\n`;
    }
  }

  cancelLoadingMsg();
  await bot.sendChatAction(chatId, 'typing');
  // sendMessage 傳送消息
  bot.sendMessage(chatId, message, {
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
}

// price
export async function handleprice(msg) {
  const chatId = msg.chat.id;
  const cancelLoadingMsg = await bot.sendLoadingMsg(chatId);
  const dataItem = await cryptoToalPrice();
  const messageText = `目前加密货币总市值为：${dataItem.join("\n")}`;
  cancelLoadingMsg();
  await bot.sendChatAction(chatId, 'typing');
  bot.sendMessage(chatId, messageText, {
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
}
