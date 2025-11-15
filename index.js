import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import "dotenv/config";

const app = express();

// временно * чтобы не мешал CORS
app.use(cors({ origin: "*" }));

app.use(express.json());

app.post("/send", async (req, res) => {
  console.log("POST /send body:", req.body);

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
        user: process.env.SMTP_USER, // всегда "apikey"
        pass: process.env.SMTP_PASS  // API ключ
      }
    });

    await transporter.sendMail({
      from: "no-reply@multiservice.de", // можно любой домен
      to: process.env.MAIL_TO,
      subject: "Новая заявка с сайта",
      text: `Имя: ${name}\nEmail: ${email}\nСообщение: ${message}`
    });

    console.log("Mail sent OK");
    return res.json({ ok: true });

  } catch (err) {
    console.error("Mail error:", err);
    return res.status(500).json({ ok: false, error: "Ошибка отправки письма" });
  }
});

app.get("/", (req, res) => {
  res.send("Бэкенд живой!");
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Server is running");
});
