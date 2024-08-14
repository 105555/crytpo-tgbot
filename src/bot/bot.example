import TelegramBot from "node-telegram-bot-api";

const token = ""; // API Token
const bot = new TelegramBot(token, { polling: true });

bot.route = (routeConfig) => {
    Object.entries(routeConfig).forEach(([regex, handler]) => {
        bot.onText(new RegExp(regex), handler.bind(bot));
    });
};

bot.sendLoadingMsg = async (chatId) => {
    const { message_id } = await bot.sendMessage(chatId, "⏳ 請稍等... ⏳", {
        disable_notification: true, //無聲發送消息
    });
    return () => {
        return bot.deleteMessage(chatId, message_id); //傳送之後清除
    };
};

export default bot;

