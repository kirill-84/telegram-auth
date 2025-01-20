import { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

// Токен бота (не забудьте заменить на ваш токен)
const BOT_TOKEN = process.env.BOT_TOKEN as string;

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not defined in environment variables");
}

// Функция для проверки авторизации
function checkTelegramAuthorization(authData: Record<string, string>) {
  const checkHash = authData.hash;
  delete authData.hash;

  // Составляем строку для проверки
  const dataCheckArr: string[] = [];
  for (const [key, value] of Object.entries(authData)) {
    dataCheckArr.push(`${key}=${value}`);
  }

  // Сортируем и соединяем в строку
  dataCheckArr.sort();
  const dataCheckString = dataCheckArr.join("\n");

  // Генерация секретного ключа
  const secretKey = crypto.createHash('sha256').update(BOT_TOKEN, 'utf-8').digest();

  // Генерация HMAC
  const hash = crypto.createHmac('sha256', secretKey)
                     .update(dataCheckString, 'utf-8')
                     .digest('hex');

  // Сравниваем хеши
  if (hash !== checkHash) {
    throw new Error('Data is NOT from Telegram');
  }

  // Проверка на актуальность данных
  const authDate = parseInt(authData.auth_date, 10);
  if (Date.now() / 1000 - authDate > 86400) {
    throw new Error('Data is outdated');
  }

  return authData;
}

// Функция для сохранения данных пользователя Telegram (например, в cookies)
function saveTelegramUserData(authData: Record<string, string>, res: VercelResponse) {
  const authDataJson = JSON.stringify(authData);
  res.setHeader('Set-Cookie', `tg_user=${authDataJson}; Path=/; HttpOnly;`);
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const authData: Record<string, string> = req.query as Record<string, string>;

    // Проверка авторизации
    const validatedData = checkTelegramAuthorization(authData);

    // Сохранение данных пользователя
    saveTelegramUserData(validatedData, res);

    // Ответ
    res.status(200).json({ success: true, message: "Authorization successful", authData: validatedData });
  } catch (err) {
    console.error("Error during authentication:", err);
    const error = err instanceof Error ? err : new Error("Unknown error occurred");
    res.status(500).json({ success: false, message: error.message });
  }
}
