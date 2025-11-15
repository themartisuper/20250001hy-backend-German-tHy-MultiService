const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Проверка переменных окружения
const { SMTP_USER, SMTP_PASS, SMTP_HOST, SMTP_PORT, PORT } = process.env;
if (!SMTP_USER || !SMTP_PASS || !SMTP_HOST || !SMTP_PORT || !PORT) {
  console.error('Ошибка: Не все переменные окружения заданы!');
  process.exit(1);
}

// Настройка почтового транспорта
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false, // true если SSL/TLS (обычно 465)
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

// Тестовый маршрут для проверки сервера
app.get('/', (req, res) => {
  res.send('Backend is alive!');
});

// Маршрут для отправки письма
app.post('/send', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: SMTP_USER,
      subject: `Сообщение с сайта от ${name}`,
      text: message
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Ошибка при отправке письма:', err);
    res.status(500).json({ error: 'Ошибка при отправке письма' });
  }
});

// Старт сервера
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});