import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import 'dotenv/config';

const app = express();

// Разрешаем только фронту с Vercel стучаться
app.use(cors({
  origin: '*' // временно для теста
}));


app.use(express.json());

// Эндпоинт для формы
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  if(!name || !email || !message) {
    return res.status(400).json({ ok: false, error: "Все поля обязательны" });
  }

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
      to: process.env.MAIL_TO, // куда будут приходить письма
      subject: "Новая заявка с сайта",
      text: `Имя: ${name}\nEmail: ${email}\nСообщение: ${message}`
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Ошибка отправки письма" });
  }
});

// Проверка сервера
app.get("/", (req, res) => {
  res.send("Бэкенд живой!");
});

// Порт Railway
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
