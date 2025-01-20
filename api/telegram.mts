import type { VercelRequest, VercelResponse } from "@vercel/node";
import CryptoJS from "crypto-js";

// Получение токена бота из переменных окружения
const BOT_TOKEN = process.env.BOT_TOKEN as string; // Явное утверждение, что BOT_TOKEN — строка
if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not defined in environment variables");
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
    return;
  }

  try {
    // Проверка наличия query параметров
    if (!req.query || Object.keys(req.query).length === 0) {
      res.status(400).json({ success: false, message: "No query parameters provided" });
      return;
    }

    const hash = Array.isArray(req.query.hash) ? req.query.hash[0] : req.query.hash;
    if (!hash) {
      res.status(400).json({ success: false, message: "Missing 'hash' parameter" });
      return;
    }

    const authData = Object.keys(req.query).reduce((acc, key) => {
      if (key !== "hash") {
        acc[key] = Array.isArray(req.query[key]) ? req.query[key][0] : req.query[key];
      }
      return acc;
    }, {} as Record<string, string>);

    // Генерация строки проверки данных
    const dataCheckString = Object.keys(authData)
      .sort()
      .map((key) => `${key}=${authData[key]}`)
      .join("\n");

    // Генерация HMAC-SHA-256 подписи
    const secretKey = CryptoJS.SHA256(BOT_TOKEN).toString(CryptoJS.enc.Hex);
    const hmac = CryptoJS.HmacSHA256(dataCheckString, secretKey).toString(CryptoJS.enc.Hex);

    // Сравнение подписи с переданным хешем
    if (hmac === hash) {
      res.status(200).json({ success: true, authData });
    } else {
      res.status(401).json({ success: false, message: "Authentication failed" });
    }
  } catch (err) {
    // Приведение err к типу Error
    const error = err instanceof Error ? err : new Error("Unknown error occurred");
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}
