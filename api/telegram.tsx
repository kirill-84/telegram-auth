import * as crypto from 'crypto';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Вставьте токен вашего Telegram-бота
const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
    throw new Error('BOT_TOKEN не задан. Проверьте переменные окружения на Vercel.');
}

// Функция для проверки хэша Telegram
function checkTelegramAuth(data: any): boolean {
    const { hash, ...rest } = data;
    const checkString = Object.keys(rest)
        .sort()
        .map(key => `${key}=${rest[key]}`)
        .join('\n');
    const secretKey = crypto.createHash('sha256').update(BOT_TOKEN).digest();
    const hmac = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');
    return hmac === hash;
}

// Основной обработчик запросов
export default function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
    }

    const authData = req.query;

    console.log('AuthData:', authData);
}
