import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import TelegramBot from "node-telegram-bot-api";

const token = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;
const bot = new TelegramBot(token, { polling: false });

const app = express();
const PORT = process.env.PORT || 4949;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/api/contact", async (req, res) => {
  try {
    console.log("req", req.headers.origin);
    if (
      !["http://localhost:3000", "https://sultonbayev.uz"].includes(
        req.headers.origin
      )
    ) {
      return res.status(400).json({ success: false, message: "not allowed" });
    }

    console.log(req.body);
    const { name, email, tgOrPhone, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Barcha maydonlarni to'ldiring" });
    }

    const messageText = `🔔 Yangi xabar!\n\n👤 Ism: ${name}\n📧 Email: ${email}\n📱 Telegram/Telefon: ${
      tgOrPhone || "Ko'rsatilmagan"
    }\n\n💬 Xabar:\n${message}`;

    await bot.sendMessage(chatId, messageText);
    res
      .status(200)
      .json({ success: true, message: "Xabar muvaffaqiyatli yuborildi!" });
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
    res.status(500).json({ success: false, message: "Server xatosi" });
  }
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portda ishga tushdi`);
});
