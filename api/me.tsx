import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "@vercel/postgres";
import jwt from "jsonwebtoken";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 1. Получаем токен из куки
    const token = req.cookies.session;
    if (!token) return res.status(401).json({ success: false });

    // 2. Верифицируем старый токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

    // 3. Обновляем токен только при успешной верификации
    const newToken = jwt.sign(
      { userId: decoded.userId }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '1d' }
    );

    // 4. Обновляем куку
    res.setHeader('Set-Cookie', [
      `session=${newToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${24 * 3600}`
    ]);
    
    const { rows } = await sql`SELECT * FROM users WHERE id = ${decoded.userId}`;
    
    if (rows.length === 0) return res.status(401).json({ success: false });
    
    const user = rows[0];
    return res.json({ 
      success: true, 
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        photo_url: user.photo_url
      }
    });
  } catch (error) {
    // 6. Инвалидация куки при ошибке
    res.setHeader('Set-Cookie', 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    return res.status(401).json({ success: false });
  }
}
