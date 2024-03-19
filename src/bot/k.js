import puppeteer from "puppeteer";
import puppeteerExtra from "puppeteer-extra";
import pluginStealth from "puppeteer-extra-plugin-stealth";
import bot from "./bot.js";
puppeteerExtra.use(pluginStealth());

async function k(item) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  try {
    // 前往幣種走勢圖網站
    await page.goto(`https://www.coinglass.com/tv/zh-TW/Binance_${item}USDT`);

    // 等待圖表載入完成
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // 截取圖表的螢幕截圖
    const screenshot = await page.screenshot({ path: "example.png" });
    return screenshot;
  } catch (error) {
    console.error("發生錯誤:", error);
  } finally {
    // 關閉瀏覽器
    await browser.close();
  }
}

// k {{xxxx}}
export async function handlek(msg) {
  const chatId = msg.chat.id;
  const messageTokens = msg.text.split(" "); // 分割訊息

  if (messageTokens.length < 2) {
    // 如果訊息格式不正確，則發送錯誤訊息給用戶
    bot.sendMessage(chatId, "請提供正確的幣種代碼。範例：/k BTC");
    return;
  }
  const item = messageTokens[1]; // 第二個單詞為幣種代碼
  const cancelLoadingMsg = await bot.sendLoadingMsg(chatId);
  await bot.sendChatAction(chatId, 'typing');
  try {
    // 呼叫 k 函數處理截圖和發送訊息
    const screenshot = await k(item, chatId);
    await bot.sendPhoto(chatId, screenshot, {
      caption: `這是 目前 ${item} 一小時k線的走勢圖`,
    });
  } catch (error) {
    console.error("發生錯誤:", error);
    bot.sendMessage(chatId, "抱歉，處理請求時出現了一些問題。");
  } finally {
    cancelLoadingMsg();
  }
}
