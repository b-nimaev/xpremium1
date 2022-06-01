import {  Scenes, Telegraf } from "telegraf"
import { MyContext } from './types'

// Прокси
import * as localtunnel from "localtunnel";
import * as express from "express";

// Handler factories
const { enter, leave } = Scenes.Stage
// Переменные окружения
import * as dotenv from "dotenv";
dotenv.config();

const token = "5319118085:AAGFG3SYe4WPnzE_m5PiZwltEMP5r7TlTE8"
if (token === undefined) {
    throw new Error("Токен не действителен");
}
const bot = new Telegraf<MyContext>(token);
const secretPath = `/tg/${bot.secretPathComponent()}`;

bot.start(ctx => ctx.reply("hi"))
const app = express();
app.get("/", (req: any, res: any) => {
    res.send("hello")
})
if (process.env.mode === "development") {
    localtunnel({ port: 3000 }).then(result => {
        bot.telegram.setWebhook(`${result.url}${secretPath}`)
        // bot.telegram.deleteWebhook();
    })
}
app.use(bot.webhookCallback(secretPath));
app.listen(3000, () => {
    console.log("Telegram bot launched");
});

console.log("hi")