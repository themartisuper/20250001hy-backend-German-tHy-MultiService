import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import 'dotenv/config';


import express from "express";
const app = express();

const PORT = process.env.PORT;
console.log("PORT =", PORT);

app.get("/", (req, res) => res.status(200).send("Бэкенд живой!"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
