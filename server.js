import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./router/router.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", router);

async function start() {
  try {
    const PORT = process.env.PORT || 5000;
    const db_URL = process.env.db_URL;

    await mongoose.connect(db_URL);
    console.log("MongoDB подключён");

    app.listen(PORT, () => {
      console.log(`Сервер запущен: http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error("Ошибка запуска:", e.message);
    process.exit(1);
  }
}

start();
