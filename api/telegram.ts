// api/telegram.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto'; // Изменено для совместимости с ES-модулями

const BOT_TOKEN = import.meta.env.VITE_TOKEN;

function checkTelegramAuth(data: any): boolean {
    const { hash, ...rest } = data;
    const checkString = Object.keys(rest)
        .sort()
        .map((key) => `${key}=${rest[key]}`)
        .join('\n');
    const secretKey = crypto.createHash('sha256').update(BOT_TOKEN).digest();
    const hmac = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');
    return hmac === hash;
}

const handler = (req: VercelRequest, res: VercelResponse) => {
    const authData = req.query;

    if (checkTelegramAuth(authData)) {
        return res.json({ status: 'success', user: authData });
    } else {
        return res.status(403).json({ status: 'error', message: 'Invalid authentication' });
    }
};

export default handler; // Используем export default вместо module.exports
