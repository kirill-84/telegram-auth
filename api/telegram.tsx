import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import { sql } from "@vercel/postgres";
import jwt from 'jsonwebtoken';

const BOT_TOKEN = process.env.BOT_TOKEN as string; // Удаляем возможные лишние символы
if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not defined in environment variables");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    const keys = Object.keys(authData).sort();

    const dataCheckStrings: string[] = [];
    keys.forEach((key) => {
      let value = authData[key];
    
      if (typeof value === 'object') {
        value = JSON.stringify(value); // Преобразуем объект в строку
      }
    
      dataCheckStrings.push(`${key}=${value}`);
    });
    
    const dataCheckString = dataCheckStrings.join('\n');

    //console.log("Data Check String:", dataCheckString);

    // Генерация HMAC-SHA-256
    const secretKey = crypto
      .createHash("sha256")
      .update(BOT_TOKEN)
      .digest();
    
    const hmac = crypto
      .createHmac("sha256", secretKey) // Используем токен как есть
      .update(dataCheckString)
      .digest("hex");

    //console.log("Computed HMAC:", hmac);
    //console.log("Provided Hash:", hash);

    // Сравниваем HMAC с переданным хешем
    if (hmac === hash) {
      const userId = parseInt(authData.id, 10);
      const authDate = parseInt(authData.auth_date, 10);

      if(isNaN(userId) || isNaN(authDate)) {
        res.status(400).json({ success: false, message: "Invalid user data"});
        return;
      }

      const { rowCount } = await sql`SELECT id FROM users WHERE id = ${userId}`;
      if (rowCount === 0) {
        await sql`
          INSERT INTO users (
            id, 
            first_name, 
            last_name, 
            username, 
            photo_url, 
            auth_date, 
            hash
          ) VALUES (
            ${userId},
            ${authData.first_name},
            ${authData.last_name || null},
            ${authData.username || null},
            ${authData.photo_url || null},
            ${authDate},
            ${hash}
          )
        `;
      }

      // Generate JWT
      const token = jwt.sign({userId}, process.env.JWT_SECRET!, {expiresIn: '1d'});

      // Set cookie
      res.setHeader('Set-Cookie', [
        `session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${24 * 3600}`
      ]);
      
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
