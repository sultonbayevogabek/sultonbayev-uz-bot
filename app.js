import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import TelegramBot from "node-telegram-bot-api";
// dotenv ni ishga tushirish
dotenv.config();

// Telegram bot yaratish
const token = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;
const bot = new TelegramBot(token, { polling: false });

// Express server yaratish
const app = express();
const PORT = process.env.PORT || 4949;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS ni yoqish (agar saytingiz boshqa domenda bo'lsa)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get('/api/test', async (req, res) => {
  return res
    .status(200)
    .json({
      success: true,
      message: 'Server ishlayapti'
    });
})

// Forma ma'lumotlarini qabul qiluvchi endpoint
app.post('/api/contact', async (req, res) => {
  try {
    if (!['http://localhost:3000', 'https://sultonbayev.uz'].includes(req.headers.origin)) {
      return res.status(400).json({success: false, message: `Ruxsat berilmagan manzildan kelgan so'rov`});
    }

    const {name, email, tgOrPhone, message} = req.body;

    // Ma'lumotlarni tekshirish
    if (!name || !tgOrPhone) {
      return res.status(400).json({success: false, message: 'Ism yoki telefon/telegram kiritilmagan!'});
    }

    // Telegram xabarini tayyorlash
    const messageText = `🔔 Yangi xabar! \n\n👤 Ism: ${name}\n📱 Telegram/Telefon: ${tgOrPhone || 'Ko\'rsatilmagan'}\n📧 Elektron pochta: ${email || 'Ko\'rsatilmagan'}\n\n💬 Xabar: ${message || 'Ko\'rsatilmagan'}`;

    // Telegram orqali xabar yuborish
    await bot.sendMessage(chatId, messageText);

    res.status(200).json({success: true, message: 'Xabar muvaffaqiyatli yuborildi!'});
  } catch (error) {
    console.error('Xatolik yuz berdi:', error);
    res.status(500).json({success: false, message: 'Server xatosi'});
  }
});

// Serverni ishga tushirish
app.listen(PORT, () => {
  console.log(`Server ${PORT} portda ishga tushdi`);
});
