export function handleStart(msg){
    const chatId = msg.chat.id;
    // 連結ｂｏｔ發送消息
    this.sendMessage(
        chatId,
        `Hello,  I’m a crypto bot 🤖\n\n🎯 I can collect some cryptocurrency data for you to help you quickly understand today’s capital inflows.

<b>目前暫支援以下功能：</b> 

<b>市值排名</b> 
<code>/price </code> - 查詢 Crypto 總市值
<code>/price top</code> - 查詢市值前十排名

<b>Crypto 板塊</b>
<code>/plate</code> - 查詢板塊分類 (顯示十項)

<b>k線圖</b>
<code>/k xxx</code> - 查詢指定Ｋ線圖表

資料來源 : <a href="https://www.coinglass.com/zh-TW">Coinglass</a>, <a href="https://www.coingecko.com/zh-tw/global-charts">CoinGecko</a>, <a href="https://www.coincarp.com/zh-tw/">CoinCarp</a>`,
        {
            parse_mode:'HTML', //指定為HTML格式
            disable_web_page_preview:true 
        }
    ),
    this.sendMessage(chatId,'工具推薦 : ',{
        reply_markup: {
            one_time_keyboard: true,
            inline_keyboard: [
                [{ text: 'Pionex', url:'https://www.pionex.com/zh-TW/signUp?r=zR29KTrC'}],
                [{ text: 'Network Data', url:'https://dappradar.com/rankings/nft/collections'}],
            ]
        }
    })
}
