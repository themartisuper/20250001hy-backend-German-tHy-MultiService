import express from "express";
import cors from "cors";
import 'dotenv/config';

const app = express();

// Временно разрешаем все домены, чтобы протестировать
app.use(cors());

// JSON для формы
app.use(express.json());

// Проверка health check
app.get("/", (req, res) => res.status(200).send("Бэкенд живой!"));

// Эндпоинт для формы
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: "Все поля обязательны" });
  }

  // Пока просто логируем, письма не шлём
  console.log("Новая заявка:", { name, email, message });
  res.json({ ok: true });
});

// Порт Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
