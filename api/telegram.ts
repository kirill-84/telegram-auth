// api/telegram.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import CryptoJS from "crypto-js";

const BOT_TOKEN = "";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const { hash, ...authData } = req.query;

  // 1. Генерация строки проверки данных
  const dataCheckString = Object.keys(authData)
    .sort()
    .map((key) => `${key}=${authData[key]}`)
    .join("\n");

  // 2. Генерация HMAC-SHA-256 подписи
  const secretKey = CryptoJS.SHA256(BOT_TOKEN).toString(CryptoJS.enc.Hex);
  const hmac = CryptoJS.HmacSHA256(dataCheckString, secretKey).toString(CryptoJS.enc.Hex);

  // 3. Сравнение подписи с переданным хешем
  if (hmac === hash) {
    res.status(200).json({ success: true, authData });
  } else {
    res.status(401).json({ success: false, message: "Authentication failed" });
  }
}
