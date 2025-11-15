import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import 'dotenv/config';

const app = express();

// CORS — разрешаем только фронту на Vercel
app.use(cors({
  origin: 'https://20250001hy-german-t-hy-multi-servic.vercel.app/' // <- замени на свой фронт
}));

app.use(express.json());

// Health check для Railway
app.get("/", (req, res) => res.status(200).send("Бэкенд живой!"));

// Эндпоинт формы
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
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
      to: process.env.MAIL_TO,
      subject: "Новая заявка с сайта",
      text: `Имя: ${name}\nEmail: ${email}\nСообщение: ${message}`
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("Ошибка отправки письма:", err);
    res.status(500).json({ ok: false, error: "Ошибка отправки письма" });
  }
});

// Порт Railway
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
