import bot from './src/bot/bot.js'
import { handleStart } from "./src/bot/start.js";
import { handleprice,handlepriceTop } from "./src/bot/price.js";
import { handlek } from "./src/bot/k.js";
import { handleplate } from "./src/bot/plate.js";
const routeConfig = {
  "^/start$": handleStart,
  "^/price$": handleprice,
  "^/price top$": handlepriceTop,
  "^/plate$": handleplate,
  "^/k\\s+\\w+$": handlek,
};

bot.route(routeConfig);
