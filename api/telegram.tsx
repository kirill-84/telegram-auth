import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

const BOT_TOKEN = process.env.BOT_TOKEN as string; // Удаляем возможные лишние символы
if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not defined in environment variables");
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
    return;
  }

  try {
    console.log("Received query:", req.query);

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

    console.log("Auth Data:", authData);

    /*const dataCheckString = Object.keys(authData)
      .sort() // Сортируем ключи по алфавиту
      .map((key) => `${key}=${authData[key]}`) // Формат key=value
      .join("\n");*/

    const processAuthData = (authData: Map<string, any>): string => {
  // Получение ключей и их сортировка
  const keys = Array.from(authData.keys()).sort();

  // Формирование массива строк "key=value"
  const dataCheckStrings: string[] = keys.map((key) => {
    let value = authData.get(key);

    if (typeof value === 'object') {
      value = JSON.stringify(value); // Преобразуем объекты в строку
    }

    return ${key}=${value};
  });

  // Объединяем строки с разделителем '\n'
  return dataCheckStrings.join('\n');
};
    const dataCheckString = dataCheckStrings;

    console.log("Data Check String:", dataCheckString);

    // Генерация HMAC-SHA-256
    const hmac = crypto
      .createHmac("sha256", BOT_TOKEN) // Используем токен как есть
      .update(dataCheckString, "utf8") // Кодировка UTF-8
      .digest("hex");

    console.log("Computed HMAC:", hmac);
    console.log("Provided Hash:", hash);

    // Сравниваем HMAC с переданным хешем
    if (hmac === hash) {
      res.status(200).json({ success: true, authData });
    } else {
      res.status(401).json({ success: false, message: "Authentication failed. HMAC does not match hash." });
    }
  } catch (err) {
    console.error("Error during authentication:", err);
    const error = err instanceof Error ? err : new Error("Unknown error occurred");
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}
