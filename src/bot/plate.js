import puppeteer from "puppeteer";
import puppeteerExtra from "puppeteer-extra";
import pluginStealth from "puppeteer-extra-plugin-stealth";
import bot from "./bot.js";
import cheerio from "cheerio";
import { getCryptoPlate } from "../lib/data.js";
puppeteerExtra.use(pluginStealth());

// 板塊分類
async function cryptoPlate() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1080 });
  await page.goto("https://www.coincarp.com/zh-tw/categories/");
  let body = await page.content();
  let $ = cheerio.load(body);

  const plateData = [];
  $("#category-datatable > tbody > tr[data-symbol] > :nth-child(2) > a ").each(
    (index, element) => {
      const text = $(element).text().trim();
      plateData.push(text);
    }
  );
  let newArr = plateData.slice(0, 10);
  await browser.close();
  return newArr;
}

//plate
export async function handleplate(msg) {
  const chatId = msg.chat.id;
  const cancelLoadingMsg = await bot.sendLoadingMsg(chatId);
  const newArr = await cryptoPlate();

  cancelLoadingMsg(); //清除消息

  let inlineKeyboard = [];
  newArr.forEach((item, index) => {
    // 如果是新的一行，則創建一個空的按鈕行
    if (index % 2 === 0) {
      inlineKeyboard.push([]);
    }
    inlineKeyboard[inlineKeyboard.length - 1].push({
      text: `${index + 1}. ${item}`,
      callback_data: `plate_${index}`,
    });
  });

  // 發送消息包按鈕
  bot.sendMessage(chatId, "選擇要查看的板塊幣種：", {
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  });

  bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const btnData = query.data;
    const data = getCryptoPlate();
    await bot.sendChatAction(chatId, "typing"); //  loading 效果

    let chose = "";
    switch (btnData) {
      case "plate_0":
        chose = data.metaverse.join(", "); //bot 只接收字串  
        break;
      case "plate_1":
        chose = data.Web3.join(", ");
        break;
      case "plate_2":
        chose = data.Polygon;
        bot.sendMessage(chatId, chose);
        break;
      case "plate_3":
        chose = data.Stablize.join(", ");
        break;
      case "plate_4":
        chose = data.Insurance.join(", ");
        break;
      case "plate_5":
        chose = data.Energy.join(", ");
        break;
      case "plate_6":
        chose = data.Platform.join(", ");
        break;
      case "plate_7":
        chose = data.loan.join(", ");
        break;
      case "plate_8":
        chose = data.Heco.join(", ");
        break;
      case "plate_9":
        chose = data.Bsc.join(", ");
        break;
      default:
        break;
    }
    await bot.editMessageText("您選擇的板塊幣種有以下參考 ( 只列出六項 ) :", {
      chat_id: chatId,
      message_id: messageId,
    }); // 更新 loading 狀態
    await bot.sendMessage(chatId, chose);
  });
}
