import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import 'dotenv/config';

const app = express();

// ⚡ CORS — временно разрешаем все для теста
app.use(cors({ origin: '*' }));

// ⚡ JSON парсер
app.use(express.json());

// ⚡ Проверка сервера
app.get("/", (req, res) => {
  res.send("Бэкенд живой!");
});

// ⚡ Эндпоинт для формы
app.post("/send", async (req, res) => {
  console.log("POST /send body:", req.body);
  const { name, email, message } = req.body;

  if(!name || !email || !message) {
    return res.status(400).json({ ok: false, error: "Все поля обязательны" });
  }

  // Отвечаем клиенту сразу
  res.json({ ok: true });

  // ⚡ Асинхронная отправка письма, чтобы прокси не резал соединение
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.MAIL_TO,
      subject: "Новая заявка с сайта",
      text: `Имя: ${name}\nEmail: ${email}\nСообщение: ${message}`
    });

    console.log("Mail sent");
  } catch (err) {
    console.error("Mail error:", err);
  }
});

// ⚡ Порт Railway
app.listen(process.env.PORT || 8080, () => {
  console.log("Server is running");
});
