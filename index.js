import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

// Позволяет фронту стучаться на бэк
app.use(cors());
// Позволяет принимать JSON с формы
app.use(express.json());

// Твой маршрут, куда будет отправляться форма
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Транспорт SMTP (здесь поставишь свои данные)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_TO,
      subject: "Новая заявка с сайта",
      text: `Имя: ${name}\nEmail: ${email}\nСообщение: ${message}`
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

// Railway автоматически подставит порт
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});


app.get("/", (req, res) => {
  res.send("Бэкенд живой! Включи эту страницу в браузере через твой URL Railway");
});
