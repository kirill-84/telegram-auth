import { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

// Получаем токен из переменных окружения
const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
    throw new Error('BOT_TOKEN is not defined in environment variables');
}

function checkTelegramAuth(data: any): boolean {
    const { hash, ...rest } = data;

    const checkString = Object.keys(rest)
        .sort()
        .map((key) => `${key}=${rest[key]}`)
        .join('\n');

    // Используем BOT_TOKEN, который гарантированно является строкой
    const secretKey = crypto.createHash('sha256').update(BOT_TOKEN).digest();
    const hmac = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');

    return hmac === hash;
}

export default (req: VercelRequest, res: VercelResponse) => {
    const authData = req.query;

    if (checkTelegramAuth(authData)) {
        return res.json({ status: 'success', user: authData });
    } else {
        return res.status(403).json({ status: 'error', message: 'Invalid authentication' });
    }
};
